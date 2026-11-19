import assert from 'node:assert/strict';
import {
  smoothingAlpha,
  isPositionMoving,
  walkingPose
} from '../virtual-office/presence-motion.js';

assert.equal(smoothingAlpha(0), 0, 'no elapsed time must produce no interpolation');
const alpha = smoothingAlpha(1 / 60);
assert(alpha > 0 && alpha < 1, 'interpolation factor must remain between zero and one');
assert.equal(smoothingAlpha(1), smoothingAlpha(0.1), 'large frame delays must be capped');
assert.throws(() => smoothingAlpha(-0.1), TypeError);
assert.throws(() => smoothingAlpha(0.02, 0), TypeError);

assert.equal(isPositionMoving({ x: 0, z: 0 }, { x: 1, z: 0 }), true);
assert.equal(isPositionMoving({ x: 0, z: 0 }, { x: 0.01, z: 0 }), false);
assert.equal(isPositionMoving({ x: 0, z: 0 }, { x: 0.1, z: 0 }, 0.1), false);
assert.throws(() => isPositionMoving({ x: NaN, z: 0 }, { x: 1, z: 1 }), TypeError);

assert.deepEqual(walkingPose(2, false), { legSwing: 0, armSwing: 0, bodyBob: 0 });
const pose = walkingPose(0.25, true);
assert(Math.abs(pose.legSwing) <= 0.48);
assert(Math.abs(pose.armSwing) <= 0.28);
assert(pose.bodyBob >= 0 && pose.bodyBob <= 0.035);
assert.notEqual(pose.legSwing, pose.armSwing, 'arms and legs must use different gait phases');
assert.throws(() => walkingPose(NaN, true), TypeError);
assert.throws(() => walkingPose(1, 1), TypeError);

console.log('PASS: deterministic avatar interpolation, movement thresholds, walking pose and invalid-input guards.');
