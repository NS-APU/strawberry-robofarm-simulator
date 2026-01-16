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
    updatePlatformRotation($robotSettings.pitch, $robotSettings.roll);
  }

  function updatePlatformRotation(pitch: number, roll: number) {
    const pitchRad = (pitch * Math.PI) / 180;
    const rollRad = (roll * Math.PI) / 180;
    platform.rotation.x = pitchRad;
    platform.rotation.z = rollRad;
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
    updatePlatformRotation($robotSettings.pitch, $robotSettings.roll);
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

      let newRoll = $robotSettings.roll + deltaX * 0.5;
      let newPitch = $robotSettings.pitch - deltaY * 0.5;

      // Clamp
      newRoll = Math.max(-90, Math.min(90, newRoll));
      newPitch = Math.max(-90, Math.min(90, newPitch));

      robotSettings.update(s => ({ ...s, roll: parseFloat(newRoll.toFixed(1)), pitch: parseFloat(newPitch.toFixed(1)) }));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });
  }

  function resetTilt() {
    robotSettings.update(s => ({ ...s, pitch: 0, roll: 0 }));
  }
</script>

<div class="tilt-3d-container" id="tilt3DContainer" bind:this={container}>
  <canvas id="tilt3DCanvas" bind:this={canvas}></canvas>
  <div class="tilt-values">
    <div class="tilt-value-item">
        <span class="tilt-label">Pitch:</span>
        <span class="tilt-value">{$robotSettings.pitch}°</span>
    </div>
    <div class="tilt-value-item">
        <span class="tilt-label">Roll:</span>
        <span class="tilt-value">{$robotSettings.roll}°</span>
    </div>
  </div>
  <button type="button" class="btn btn-sm btn-outline-secondary reset-tilt-btn" on:click={resetTilt}>
    リセット
  </button>
</div>

<style>
  /* Global styles from styles.css are used */
</style>
