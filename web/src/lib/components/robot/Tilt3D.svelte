<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { robotSettings } from '../../stores/robotStore';

  let canvas: HTMLCanvasElement;
  let container: HTMLDivElement;

  let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, platform: THREE.Group;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let animationId: number;

  // Reactively update 3D model when store changes
  $: if (platform) {
    updatePlatformRotation($robotSettings.pitch, $robotSettings.roll, $robotSettings.yaw);
  }

  function updatePlatformRotation(pitch: number, roll: number, yaw: number) {
    const pitchRad = (pitch * Math.PI) / 180;
    const rollRad = (roll * Math.PI) / 180;
    const yawRad = (yaw * Math.PI) / 180;
    platform.rotation.x = pitchRad;
    platform.rotation.z = rollRad;
    platform.rotation.y = yawRad;
  }

  onMount(() => {
    initThree();
    setupEventListeners();
    animate();

    const resizeObserver = new ResizeObserver(() => onWindowResize());
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      // Cleanup Three.js resources
      if (renderer) renderer.dispose();
      if (scene) scene.clear();
    };
  });

  function initThree() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(0, 3, 5);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    createPlatform();

    const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0xcccccc);
    gridHelper.position.y = -0.6;
    scene.add(gridHelper);
  }

  function createPlatform() {
    const group = new THREE.Group();

    // Body
    const platformGeometry = new THREE.BoxGeometry(2, 0.3, 1.5);
    const platformMaterial = new THREE.MeshPhongMaterial({ color: 0x667eea, shininess: 30 });
    const mesh = new THREE.Mesh(platformGeometry, platformMaterial);
    group.add(mesh);

    // Marker (Front)
    const markerGeometry = new THREE.BoxGeometry(0.4, 0.35, 0.1);
    const markerMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(0, 0, 0.8);
    group.add(marker);

    // Axes
    const axesHelper = new THREE.AxesHelper(1.5);
    group.add(axesHelper);

    platform = group;
    scene.add(group);

    // Initial sync
    updatePlatformRotation($robotSettings.pitch, $robotSettings.roll, $robotSettings.yaw);
  }

  function animate() {
    animationId = requestAnimationFrame(animate);
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function onWindowResize() {
    if (!container || !camera || !renderer) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function setupEventListeners() {
    canvas.addEventListener('mousedown', (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      if (e.shiftKey) {
        // Shift pressed: Control Yaw (X) and Pitch (Y)
        // Or maybe just Yaw? Let's do Yaw interaction.
        let newYaw = $robotSettings.yaw - deltaX * 0.5; // Drag Left -> Rotate Left (Positive Yaw is often Left or Right depending on coord system. Let's assume standard Right Hand Rule usually: Z up, Y forward. Wait, here Y is Up (ThreeJS default). So Yaw is rotation around Y.
        // In screen space, dragging X changes Yaw.
        
        // Clamp Yaw to -180 to 180
        if (newYaw > 180) newYaw -= 360;
        if (newYaw < -180) newYaw += 360;
        
        // Actually the slider is -180 to 180. Let's clamp it to that range or loop?
        // Sliders are usually clamped. Let's clamp.
        newYaw = Math.max(-180, Math.min(180, newYaw));

        robotSettings.update((s) => ({
          ...s,
          yaw: parseFloat(newYaw.toFixed(1)),
        }));
      } else {
        // Normal: Control Roll (X) and Pitch (Y)
        let newRoll = $robotSettings.roll + deltaX * 0.5;
        let newPitch = $robotSettings.pitch - deltaY * 0.5;

        // Clamp
        newRoll = Math.max(-90, Math.min(90, newRoll));
        newPitch = Math.max(-90, Math.min(90, newPitch));

        robotSettings.update((s) => ({
          ...s,
          roll: parseFloat(newRoll.toFixed(1)),
          pitch: parseFloat(newPitch.toFixed(1)),
        }));
      }

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  function resetTilt() {
    robotSettings.update((s) => ({ ...s, pitch: 0, roll: 0, yaw: 0 }));
  }
</script>

<div class="tilt-3d-container" id="tilt3DContainer" bind:this={container}>
  <canvas id="tilt3DCanvas" bind:this={canvas}></canvas>
  <div class="tilt-values">
    <div class="tilt-value-item">
      <span class="tilt-label">Yaw:</span>
      <span class="tilt-value">{$robotSettings.yaw}°</span>
    </div>
    <div class="tilt-value-item">
      <span class="tilt-label">Pitch:</span>
      <span class="tilt-value">{$robotSettings.pitch}°</span>
    </div>
    <div class="tilt-value-item">
      <span class="tilt-label">Roll:</span>
      <span class="tilt-value">{$robotSettings.roll}°</span>
    </div>
  </div>
  <div class="tilt-controls-guide">
    <div class="guide-item"><span class="key">Drag</span> Pitch / Roll</div>
    <div class="guide-item"><span class="key">Shift+Drag</span> Yaw</div>
  </div>
  <button type="button" class="btn btn-sm btn-outline-secondary reset-tilt-btn" on:click={resetTilt}> リセット </button>
</div>

<style>
  /* Global styles from styles.css are used */
  .tilt-controls-guide {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 5px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    color: #4b5563;
    pointer-events: none;
    z-index: 10;
  }
  .guide-item {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 2px;
  }
  .guide-item:last-child {
    margin-bottom: 0;
  }
  .key {
    background-color: #e5e7eb;
    padding: 1px 4px;
    border-radius: 3px;
    font-weight: 600;
    font-family: monospace;
    border: 1px solid #d1d5db;
  }
</style>
