// 3D傾きコントロール
const Tilt3DControl = {
  scene: null,
  camera: null,
  renderer: null,
  platform: null,
  pitch: 2.3,
  roll: 1.8,
  isDragging: false,
  previousMousePosition: { x: 0, y: 0 },

  init() {
    const canvas = document.getElementById("tilt3DCanvas");
    const container = document.getElementById("tilt3DContainer");

    // シーンの設定
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    // カメラの設定
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 3, 5);
    this.camera.lookAt(0, 0, 0);

    // レンダラーの設定
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // ライトの追加
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    this.scene.add(directionalLight);

    // プラットフォーム（ロボット）の作成
    this.createPlatform();

    // グリッドの追加
    const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0xcccccc);
    gridHelper.position.y = -0.6;
    this.scene.add(gridHelper);

    // イベントリスナーの設定
    this.setupEventListeners();

    // アニメーションループの開始
    this.animate();

    // ウィンドウリサイズ対応
    window.addEventListener("resize", () => this.onWindowResize());
  },

  createPlatform() {
    const group = new THREE.Group();

    // プラットフォーム本体
    const platformGeometry = new THREE.BoxGeometry(2, 0.3, 1.5);
    const platformMaterial = new THREE.MeshPhongMaterial({
      color: 0x667eea,
      shininess: 30,
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    group.add(platform);

    // 前面マーカー（方向を示す）
    const markerGeometry = new THREE.BoxGeometry(0.4, 0.35, 0.1);
    const markerMaterial = new THREE.MeshPhongMaterial({
      color: 0xff6b6b,
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(0, 0, 0.8);
    group.add(marker);

    // 軸線の表示
    const axesHelper = new THREE.AxesHelper(1.5);
    group.add(axesHelper);

    this.platform = group;
    this.scene.add(group);

    this.updatePlatformRotation();
  },

  setupEventListeners() {
    const canvas = document.getElementById("tilt3DCanvas");

    canvas.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;

      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      // Roll: 左右のドラッグ（-90度から90度）
      this.roll = Math.max(-90, Math.min(90, this.roll + deltaX * 0.5));

      // Pitch: 上下のドラッグ（-90度から90度）
      this.pitch = Math.max(-90, Math.min(90, this.pitch - deltaY * 0.5));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };

      this.updatePlatformRotation();
      this.updateValues();
    });

    canvas.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    canvas.addEventListener("mouseleave", () => {
      this.isDragging = false;
    });

    // リセットボタン
    document.getElementById("resetTiltBtn").addEventListener("click", () => {
      this.pitch = 0;
      this.roll = 0;
      this.updatePlatformRotation();
      this.updateValues();
    });
  },

  updatePlatformRotation() {
    if (!this.platform) return;

    const pitchRad = (this.pitch * Math.PI) / 180;
    const rollRad = (this.roll * Math.PI) / 180;

    this.platform.rotation.x = pitchRad;
    this.platform.rotation.z = rollRad;
  },

  updateValues() {
    // 表示の更新
    document.getElementById("pitchValue").textContent =
      this.pitch.toFixed(1) + "°";
    document.getElementById("rollValue").textContent =
      this.roll.toFixed(1) + "°";

    // 入力フォームの更新
    document.getElementById("pitch").value = this.pitch.toFixed(1);
    document.getElementById("roll").value = this.roll.toFixed(1);
  },

  setPitch(value) {
    this.pitch = Math.max(-90, Math.min(90, parseFloat(value)));
    this.updatePlatformRotation();
    this.updateValues();
  },

  setRoll(value) {
    this.roll = Math.max(-90, Math.min(90, parseFloat(value)));
    this.updatePlatformRotation();
    this.updateValues();
  },

  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  },

  onWindowResize() {
    const container = document.getElementById("tilt3DContainer");
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  },
};
