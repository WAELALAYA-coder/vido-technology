# VIDO Technology – Virtual Office (Phase 1)

A standalone, browser-based 3D office experience integrated into the existing VIDO Technology application.

## Current scope

- Real-time Three.js 3D scene with a modern office layout.
- Reception, open workspace, meeting room and server room.
- Room navigation, orbit camera, keyboard movement and touch movement controls.
- German, English and Arabic interface labels.
- Responsive layout and reduced-motion support.

## Important limitations

This is the first visual prototype. It does **not** yet implement user accounts inside the 3D scene, multiplayer presence, voice/video calls, persistence, or cloud room editing. Those require a separately designed authenticated realtime service and security review. The existing VIDO authentication and database are not modified by this phase.

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
2. Add authenticated realtime presence using a dedicated WebSocket service.
3. Add proximity voice/video only after consent, permissions and deployment architecture are defined.
4. Add administrator-controlled room configuration and persistent assets.
