import assert from 'node:assert/strict';
import '../account-state-storage.js';

class MemoryStorage {
  constructor(initial={}) { this.values=new Map(Object.entries(initial)); }
  getItem(key) { return this.values.has(key)?this.values.get(key):null; }
  setItem(key,value) { this.values.set(key,String(value)); }
  removeItem(key) { this.values.delete(key); }
}

const accountA='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const accountB='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const legacy='{"xp":120,"notes":["0001"]}';
const storage=new MemoryStorage({vidoV10FinalState:legacy});
const select=globalThis.VIDO_ACCOUNT_STATE_STORAGE.selectAccountKey;

const keyA=select(storage,accountA);
assert.equal(keyA,'vidoV10FinalState:'+accountA);
assert.equal(storage.getItem(keyA),legacy,'first account should retain the pre-existing local learning state');
assert.equal(storage.getItem('vidoV10FinalState'),null,'legacy shared key must be removed after migration');

const keyB=select(storage,accountB);
assert.equal(keyB,'vidoV10FinalState:'+accountB);
assert.equal(storage.getItem(keyB),null,'a second account must not inherit the first account local state');
assert.equal(storage.getItem(keyA),legacy,'first account state must remain available in its own namespace');

assert.equal(select(storage,accountA.toUpperCase()),keyA,'UUID casing must not create a second local namespace');
storage.setItem(keyB,'{"xp":25}');
assert.equal(storage.getItem(select(storage,accountB)),'{"xp":25}','account state must persist across selection');

const preexisting=new MemoryStorage({
  vidoV10FinalState:'{"xp":999}',
  ['vidoV10FinalState:'+accountA]:'{"xp":50}'
});
assert.equal(select(preexisting,accountA),'vidoV10FinalState:'+accountA);
assert.equal(preexisting.getItem('vidoV10FinalState:'+accountA),'{"xp":50}','migration must not overwrite existing account data');
assert.equal(preexisting.getItem('vidoV10FinalState'),null,'legacy data should not remain available to later accounts');

assert.equal(select(storage,'not-a-uuid'),null,'invalid account identifiers must not select shared storage');
const unavailableStorage={getItem(){throw new Error('storage unavailable')},setItem(){throw new Error('storage unavailable')},removeItem(){throw new Error('storage unavailable')}};
assert.equal(select(unavailableStorage,accountB),'vidoV10FinalState:'+accountB,'unavailable storage must still fail closed to an account-specific key');

console.log('PASS: account-specific local state storage and one-time legacy migration');
