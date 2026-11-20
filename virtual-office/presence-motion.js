export function smoothingAlpha(deltaSeconds, response = 6) {
  if (!Number.isFinite(deltaSeconds) || deltaSeconds < 0) {
    throw new TypeError('deltaSeconds must be a finite non-negative number');
  }
  if (!Number.isFinite(response) || response <= 0) {
    throw new TypeError('response must be a finite positive number');
  }
  const boundedDelta = Math.min(deltaSeconds, 0.1);
  return 1 - Math.exp(-response * boundedDelta);
}

export function isPositionMoving(current, target, threshold = 0.04) {
  if (!current || !target || ![current.x, current.z, target.x, target.z, threshold].every(Number.isFinite) || threshold < 0) {
    throw new TypeError('current, target and a non-negative finite threshold are required');
  }
  const dx = target.x - current.x;
  const dz = target.z - current.z;
  return dx * dx + dz * dz > threshold * threshold;
}

export function walkingPose(elapsedSeconds, moving) {
  if (!Number.isFinite(elapsedSeconds) || typeof moving !== 'boolean') {
    throw new TypeError('elapsedSeconds must be finite and moving must be boolean');
  }
  if (!moving) return { legSwing: 0, armSwing: 0, bodyBob: 0 };
  const phase = elapsedSeconds * 8;
  return {
    legSwing: Math.sin(phase) * 0.48,
    armSwing: Math.sin(phase + Math.PI) * 0.28,
    bodyBob: Math.abs(Math.sin(phase * 2)) * 0.035
  };
}
