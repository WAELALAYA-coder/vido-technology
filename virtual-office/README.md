# VIDO Technology – Virtual Office (Phase 1)

A standalone, browser-based 3D office experience integrated into the existing VIDO Technology application.

## Current scope

- Real-time Three.js 3D scene with a modern office layout.
- Reception, open workspace, meeting room and server room.
- Room navigation, orbit camera, keyboard movement and touch movement controls.
- German, English and Arabic interface labels.
- Responsive layout and reduced-motion support.
- Optional authenticated shared-office presence: members appear as anonymous 3D avatars, with a five-second heartbeat and a 30-second expiry.
- Presence is held in server memory only; no user names, email addresses, positions or presence records are written to PostgreSQL.

## Important limitations

This is an early prototype. Shared presence requires an existing signed-in VIDO account and uses the existing HttpOnly session and CSRF protections. Presence is best-effort and limited to a single server process; it is not a durable or multi-instance realtime service. It currently polls every five seconds rather than using WebSockets. Voice/video calls, durable presence, multi-instance synchronization and cloud room editing are not implemented. No database schema or Docker volume is changed.

## Runtime

The page is served by the existing Express application at `/virtual-office/`. Three.js 0.180.0 and its OrbitControls module are loaded from jsDelivr via an import map. An internet connection is required for those modules.

## Controls

- WASD / arrow keys: move around.
- Drag the mouse: orbit the camera.
- Scroll: zoom.
- Room buttons: jump to a room.
- Mobile: use the on-screen directional pad.

## Next phases

1. Verify the 3D scene in desktop and mobile browsers.
2. Replace the prototype's polling presence with a shared WebSocket or managed realtime service for multi-instance deployments.
3. Add proximity voice/video only after consent, permissions and deployment architecture are defined.
4. Add administrator-controlled room configuration and persistent assets.
