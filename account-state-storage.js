(function(root){
  'use strict';
  const LEGACY_KEY='vidoV10FinalState';
  const MIGRATION_KEY='vidoV10FinalStateMigratedV1';
  const UUID_PATTERN=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  function selectAccountKey(storage,userId){
    const id=typeof userId==='string'?userId.trim().toLowerCase():'';
    if(!UUID_PATTERN.test(id)||!storage)return null;
    const accountKey=LEGACY_KEY+':'+id;
    try{
      if(storage.getItem(MIGRATION_KEY)!=='1'){
        // Claim the one-time migration before copying so two first-time accounts
        // in separate tabs cannot both inherit the same legacy local state.
        storage.setItem(MIGRATION_KEY,'1');
        const legacyState=storage.getItem(LEGACY_KEY);
        if(legacyState!==null&&storage.getItem(accountKey)===null){
          storage.setItem(accountKey,legacyState);
        }
        storage.removeItem(LEGACY_KEY);
      }
    }catch{
      // Storage may be unavailable in private browsing. The caller still receives
      // an account-specific key; its own guarded reads/writes fall back to memory.
    }
    return accountKey;
  }

  root.VIDO_ACCOUNT_STATE_STORAGE=Object.freeze({selectAccountKey});
})(globalThis);
