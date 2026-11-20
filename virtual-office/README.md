# VIDO Technology – Virtual Office (Phase 2)

A browser-based 3D office experience integrated into the existing VIDO Technology application. The office is served as a separate route and can be previewed independently before any production merge.

## Current scope

- Three.js 3D office with reception, open workspace, meeting room and server room.
- Room navigation, orbit camera, keyboard movement and touch controls.
- German, English and Arabic interface labels, including RTL layout for Arabic.
- Responsive layout and reduced-motion support.
- Optional authenticated shared-office presence using the existing HttpOnly session and CSRF protections.
- Anonymous remote-member avatars with articulated limbs, smooth position interpolation and a lightweight walking cycle.
- Presence heartbeat is single-flight: duplicate join actions are ignored and overlapping heartbeat requests are prevented.
- Deterministic avatar-motion helpers have independent Node.js tests.
- Presence is held in server memory only. User names, email addresses, positions and presence history are not written to PostgreSQL.

## Important limitations

This remains a prototype. Shared presence is limited to one server process and expires after 30 seconds. It polls every five seconds; it is not yet a durable or multi-instance WebSocket service. Voice/video calls, persisted presence, cloud room editing, and administrator-controlled room configuration are not implemented. No database schema or Docker volume is changed.

## Runtime

The page is served by Express at `/virtual-office/`. Three.js 0.180.0 and OrbitControls are loaded from jsDelivr using an import map. The separately served `presence-motion.js` module is included in the service-worker cache. An internet connection is required for Three.js and its OrbitControls module.

## Controls

- WASD / arrow keys: move around.
- Drag the mouse: orbit the camera.
- Scroll: zoom.
- Room buttons: jump to a room.
- Mobile: use the on-screen directional pad.

## Validation

- `node --check` validates the scene, motion module and motion tests.
- `node scripts/virtual-office-motion-test.mjs` tests interpolation, movement detection, gait bounds and invalid-input handling.
- `node scripts/smoke-assets.mjs` checks the public office routes, JavaScript content types and protected API behavior.
- GitHub Actions runs application audits, PostgreSQL authentication tests, smoke tests, dependency audit and a production Docker build.

## Next phases

1. Add browser-level desktop/mobile interaction tests and verify collision/room navigation behavior.
2. Replace in-memory polling with an authenticated multi-instance realtime transport.
3. Add proximity communication only after consent, permissions and deployment architecture are defined.
4. Add administrator-controlled room configuration and persistent assets.

## Presence visibility and privacy

- Shared presence starts only after a signed-in user selects **Join shared office**.
- While sharing, other authenticated users connected to the same application process can see an anonymous member label, the selected room, the avatar's in-world X/Z coordinates, and the last update time. The presence response does not include the account ID or email address.
- The browser sends a heartbeat approximately every five seconds. Presence is held in process memory and expires after 30 seconds without a heartbeat. Leaving the page stops the local heartbeat; other participants may still see the avatar until the expiry window ends.
- Presence is not written to PostgreSQL or another persistent store. Restarting the application process clears the in-memory presence list.
- Because presence is process-local, users connected to different application instances do not see each other in this prototype.
