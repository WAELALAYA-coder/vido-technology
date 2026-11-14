(() => {
  'use strict';
  const VALID_KINDS = new Set(['flow','network','uml-class','erd','sequence','bpmn','c4','dfd']);
  const list = value => Array.isArray(value) ? value : [];
  const text = value => String(value ?? '').trim();
  function validateModel(model) {
    const errors = [], warnings = [];
    const add = (target, code, detail = '') => target.push({ code, detail });
    if (!model || typeof model !== 'object' || Array.isArray(model)) {
      return { errors:[{code:'MODEL_OBJECT'}], warnings:[], score:0, valid:false };
    }
    if (!VALID_KINDS.has(model.kind)) add(errors,'KIND_UNSUPPORTED',text(model.kind));
    const meta = model.meta && typeof model.meta === 'object' ? model.meta : {};
    if (!text(meta.title)) add(errors,'META_TITLE');
    if (!text(meta.purpose)) add(errors,'META_PURPOSE');
    if (!text(meta.audience)) add(warnings,'META_AUDIENCE');
    if (!text(meta.scope)) add(warnings,'META_SCOPE');
    if (!text(meta.author)) add(warnings,'META_AUTHOR');
    if (!text(meta.updated)) add(warnings,'META_UPDATED');
    if (!text(meta.legend)) add(warnings,'META_LEGEND');
    const nodes = list(model.nodes), links = list(model.links);
    if (nodes.length < 2) add(errors,'NODES_TOO_FEW');
    if (nodes.length > 100) add(errors,'NODES_TOO_MANY');
    if (links.length > 200) add(errors,'LINKS_TOO_MANY');
    const byId = new Map();
    nodes.forEach((node,index) => {
      if (!node || typeof node !== 'object') { add(errors,'NODE_INVALID',String(index+1)); return; }
      const id = text(node.id);
      if (!id) add(errors,'NODE_ID_MISSING',String(index+1));
      else if (byId.has(id)) add(errors,'NODE_ID_DUPLICATE',id);
      else byId.set(id,node);
      if (!text(node.label)) add(errors,'NODE_LABEL_MISSING',id || String(index+1));
      if (!text(node.kind)) add(errors,'NODE_KIND_MISSING',id || String(index+1));
      if (node.x !== undefined && (!Number.isFinite(node.x) || node.x < 0 || node.x > 1000)) add(errors,'NODE_X_RANGE',id);
      if (node.y !== undefined && (!Number.isFinite(node.y) || node.y < 0 || node.y > 520)) add(errors,'NODE_Y_RANGE',id);
      if (node.details !== undefined && (!Array.isArray(node.details) || node.details.some(x=>typeof x!=='string'))) add(errors,'NODE_DETAILS_INVALID',id);
    });
    const edgeKeys = new Set(), outgoing = new Map(), incoming = new Map(), adjacency = new Map(nodes.map(n=>[text(n?.id),new Set()]));
    links.forEach((link,index) => {
      if (!link || typeof link !== 'object') { add(errors,'LINK_INVALID',String(index+1)); return; }
      const from=text(link.from), to=text(link.to);
      if (!byId.has(from)) add(errors,'LINK_FROM_UNKNOWN',from);
      if (!byId.has(to)) add(errors,'LINK_TO_UNKNOWN',to);
      if (from && to) {
        const key=from+'>'+to;
        if (edgeKeys.has(key)) add(warnings,'LINK_DUPLICATE',key);
        edgeKeys.add(key);
        outgoing.set(from,(outgoing.get(from)||0)+1);
        incoming.set(to,(incoming.get(to)||0)+1);
        if (adjacency.has(from)&&adjacency.has(to)) { adjacency.get(from).add(to); adjacency.get(to).add(from); }
      }
      if (model.kind!=='flow' && !text(link.label)) add(warnings,'LINK_LABEL_MISSING',from+' → '+to);
    });
    if (nodes.length) {
      const start=text(nodes.find(n=>text(n?.id))?.id);
      const seen=new Set([start]), stack=[start];
      while(stack.length){const id=stack.pop();for(const next of adjacency.get(id)||[]){if(!seen.has(next)){seen.add(next);stack.push(next);}}}
      if (seen.size<nodes.length) add(warnings,'GRAPH_DISCONNECTED',String(nodes.length-seen.size));
    }
    const count = kind => nodes.filter(n=>n?.kind===kind).length;
    if (model.kind==='flow') {
      if (!count('start')) add(errors,'FLOW_START');
      if (!count('end')) add(errors,'FLOW_END');
      if (!count('process')) add(errors,'FLOW_PROCESS');
      nodes.filter(n=>n?.kind==='decision').forEach(n=>{
        const outs=links.filter(e=>e.from===n.id);
        if(outs.length<2)add(errors,'DECISION_BRANCHES',n.label);
        if(outs.some(e=>!text(e.label)))add(errors,'DECISION_LABELS',n.label);
      });
      nodes.filter(n=>n?.kind==='start'||n?.kind==='end').forEach(n=>{
        if(n.kind==='start'&&(incoming.get(n.id)||0)>0)add(warnings,'START_HAS_INCOMING',n.label);
        if(n.kind==='end'&&(outgoing.get(n.id)||0)>0)add(warnings,'END_HAS_OUTGOING',n.label);
      });
    } else if (model.kind==='network') {
      if (!count('switch')) add(errors,'NETWORK_SWITCH');
      if (!count('router')&&!count('firewall')) add(errors,'NETWORK_LAYER3');
      if (!count('client')&&!count('server')&&!count('ap')) add(errors,'NETWORK_ENDPOINT');
      links.forEach(e=>{if(!text(e.label))add(errors,'NETWORK_LINK_LABEL',e.from+' → '+e.to);});
    } else if (model.kind==='uml-class') {
      if (count('class')<2) add(errors,'UML_CLASSES');
      if (!links.length) add(errors,'UML_RELATIONSHIP');
      nodes.filter(n=>n?.kind==='class').forEach(n=>{if(!list(n.details).length)add(warnings,'UML_CLASS_DETAILS',n.label);});
      links.forEach(e=>{if(!['association','inheritance','composition','aggregation','dependency'].includes(e.kind||'association'))add(errors,'UML_RELATION_KIND',String(e.kind));});
    } else if (model.kind==='erd') {
      if (count('entity')<2) add(errors,'ERD_ENTITIES');
      if (!links.length) add(errors,'ERD_RELATIONSHIP');
      nodes.filter(n=>n?.kind==='entity').forEach(n=>{
        const details=list(n.details).join(' ');
        if(!/\bPK\b/i.test(details))add(errors,'ERD_PRIMARY_KEY',n.label);
        if(!list(n.details).length)add(errors,'ERD_ATTRIBUTES',n.label);
      });
      links.forEach(e=>{
        const label=text(e.label).toUpperCase();
        if(!/(1\s*:\s*1|1\s*:\s*N|N\s*:\s*1|0\.\.\*|1\.\.\*)/.test(label))add(errors,'ERD_CARDINALITY',e.from+' → '+e.to);
        if(/\bN\s*:\s*M\b/.test(label))add(errors,'ERD_RESOLVE_MN',e.from+' → '+e.to);
      });
    } else if (model.kind==='sequence') {
      if (count('participant')<2) add(errors,'SEQ_PARTICIPANTS');
      if (links.length<2) add(errors,'SEQ_MESSAGES');
      const orders=links.map(e=>e.order).filter(x=>x!==undefined);
      if(orders.length!==links.length||orders.some(x=>!Number.isInteger(x)||x<1))add(errors,'SEQ_ORDER');
      if(new Set(orders).size!==orders.length)add(errors,'SEQ_ORDER_DUPLICATE');
      links.forEach(e=>{if(!text(e.label))add(errors,'SEQ_MESSAGE_LABEL',e.from+' → '+e.to);});
    } else if (model.kind==='bpmn') {
      if (!count('startEvent')) add(errors,'BPMN_START');
      if (!count('endEvent')) add(errors,'BPMN_END');
      if (!count('task')) add(errors,'BPMN_TASK');
      if (!links.length) add(errors,'BPMN_FLOW');
      nodes.filter(n=>n?.kind==='gateway').forEach(n=>{
        const outs=links.filter(e=>e.from===n.id);
        if(outs.length<2)add(errors,'BPMN_GATEWAY_BRANCHES',n.label);
        if(outs.some(e=>!text(e.label)))add(warnings,'BPMN_GATEWAY_LABELS',n.label);
      });
    } else if (model.kind==='dfd') {
      if (!count('external')) add(errors,'DFD_EXTERNAL');
      if (!count('process')) add(errors,'DFD_PROCESS');
      if (!count('dataStore')) add(errors,'DFD_DATASTORE');
      if (!links.length) add(errors,'DFD_FLOW');
      links.forEach(e=>{if(!text(e.label))add(errors,'DFD_LABEL',e.from+' → '+e.to);});
    } else if (model.kind==='c4') {
      if (!count('person')) add(errors,'C4_PERSON');
      if (!count('container')) add(errors,'C4_CONTAINER');
      if (!count('database')) add(errors,'C4_DATABASE');
      if (!links.length) add(errors,'C4_RELATIONSHIP');
      links.forEach(e=>{if(!text(e.label))add(warnings,'C4_RELATION_LABEL',e.from+' → '+e.to);});
    }
    const score=Math.max(0,100-errors.length*15-warnings.length*4);
    return {errors,warnings,score,valid:errors.length===0};
  }
  window.VIDO_DIAGRAM_ENGINE={validateModel,validKinds:[...VALID_KINDS]};
})();