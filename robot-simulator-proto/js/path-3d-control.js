// 走行経路3Dマップコントロール
const Path3DControl = {
  scene: null,
  camera: null,
  renderer: null,
  robot: null,
  strawberryRows: [],
  pathLine: null,
  currentWaypointIndex: 0,
  isAutoRunning: false,
  waypoints: [],
  greenhouse: null, // 圃場（ビニールハウス）

  init() {
    const canvas = document.getElementById("route3DCanvas");
    const container = document.getElementById("route3DContainer");

    if (!canvas || !container) {
      console.error("Path3DControl: Canvas or container not found");
      return;
    }

    // シーンの設定
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // 空の色

    // カメラの設定
    this.camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(-3, 4, 6);
    this.camera.lookAt(0, 0, 0);

    // レンダラーの設定
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // ライトの追加
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 5);
    this.scene.add(directionalLight);

    // 圃場（ビニールハウス）の作成
    this.createGreenhouse();

    // いちごの苗の列を作成
    this.createStrawberryRows();

    // 走行経路を作成
    this.createPath();

    // ロボットの作成
    this.createRobot();

    // イベントリスナーの設定
    this.setupEventListeners();

    // アニメーションループの開始
    this.animate();

    // ウィンドウリサイズ対応
    window.addEventListener("resize", () => this.onWindowResize());
  },

  createGreenhouse() {
    const group = new THREE.Group();

    // 床（土）の作成
    const floorGeometry = new THREE.PlaneGeometry(4, 10);
    const floorMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b6f47,
      side: THREE.DoubleSide,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.1;
    group.add(floor);

    // 通路（ロボットが走る部分）
    const pathwayGeometry = new THREE.PlaneGeometry(1.5, 9);
    const pathwayMaterial = new THREE.MeshPhongMaterial({
      color: 0xa89968,
      side: THREE.DoubleSide,
    });
    const pathway = new THREE.Mesh(pathwayGeometry, pathwayMaterial);
    pathway.rotation.x = -Math.PI / 2;
    pathway.position.y = -0.08;
    group.add(pathway);

    // ビニールハウスの骨組み（支柱）
    const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
    const poleMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });

    const polePositions = [
      [-2, 1.5, -4],
      [2, 1.5, -4],
      [-2, 1.5, 0],
      [2, 1.5, 0],
      [-2, 1.5, 4],
      [2, 1.5, 4],
    ];

    polePositions.forEach((pos) => {
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.set(pos[0], pos[1], pos[2]);
      group.add(pole);
    });

    // アーチ型の屋根骨組み
    const archGeometry = new THREE.TorusGeometry(2.2, 0.04, 8, 20, Math.PI);
    const archMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });

    [-4, 0, 4].forEach((z) => {
      const arch = new THREE.Mesh(archGeometry, archMaterial);
      arch.position.set(0, 3, z);
      arch.rotation.z = Math.PI / 2;
      group.add(arch);
    });

    // ビニール屋根（半透明）
    const roofGeometry = new THREE.CylinderGeometry(
      2.2,
      2.2,
      10,
      16,
      1,
      true,
      0,
      Math.PI
    );
    const roofMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 3;
    group.add(roof);

    // ビニール側壁
    const wallGeometry = new THREE.PlaneGeometry(10, 3);
    const wallMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });

    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.position.set(-2, 1.5, 0);
    leftWall.rotation.y = Math.PI / 2;
    group.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
    rightWall.position.set(2, 1.5, 0);
    rightWall.rotation.y = -Math.PI / 2;
    group.add(rightWall);

    // 畝（うね）の土台
    const bedGeometry = new THREE.BoxGeometry(0.5, 0.15, 9);
    const bedMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });

    const leftBed = new THREE.Mesh(bedGeometry, bedMaterial);
    leftBed.position.set(-0.6, 0.075, 0);
    group.add(leftBed);

    const rightBed = new THREE.Mesh(bedGeometry, bedMaterial);
    rightBed.position.set(0.6, 0.075, 0);
    group.add(rightBed);

    // マルチシート（黒いビニール）
    const mulchGeometry = new THREE.PlaneGeometry(0.55, 9.2);
    const mulchMaterial = new THREE.MeshPhongMaterial({
      color: 0x1a1a1a,
      side: THREE.DoubleSide,
    });

    const leftMulch = new THREE.Mesh(mulchGeometry, mulchMaterial);
    leftMulch.rotation.x = -Math.PI / 2;
    leftMulch.position.set(-0.6, 0.16, 0);
    group.add(leftMulch);

    const rightMulch = new THREE.Mesh(mulchGeometry, mulchMaterial);
    rightMulch.rotation.x = -Math.PI / 2;
    rightMulch.position.set(0.6, 0.16, 0);
    group.add(rightMulch);

    // 入口のドア枠
    const doorFrameGeometry = new THREE.BoxGeometry(2, 2.5, 0.1);
    const doorFrameMaterial = new THREE.MeshPhongMaterial({ color: 0x8b7355 });
    const doorFrame = new THREE.Mesh(doorFrameGeometry, doorFrameMaterial);
    doorFrame.position.set(0, 1.25, -5);
    group.add(doorFrame);

    this.greenhouse = group;
    this.scene.add(group);
  },

  createStrawberryRows() {
    const rowLength = 8;
    const plantSpacing = 0.5;
    const rowSpacing = 1.2;
    const plantCount = Math.floor(rowLength / plantSpacing);

    // 左側の列（畝の上）
    for (let i = 0; i < plantCount; i++) {
      const plant = this.createStrawberryPlant();
      plant.position.set(
        -rowSpacing / 2,
        0.15,
        -rowLength / 2 + i * plantSpacing
      );
      this.scene.add(plant);
      this.strawberryRows.push(plant);
    }

    // 右側の列（畝の上）
    for (let i = 0; i < plantCount; i++) {
      const plant = this.createStrawberryPlant();
      plant.position.set(
        rowSpacing / 2,
        0.15,
        -rowLength / 2 + i * plantSpacing
      );
      this.scene.add(plant);
      this.strawberryRows.push(plant);
    }
  },

  createStrawberryPlant() {
    const group = new THREE.Group();

    // 葉（緑の球体）複数枚
    const leafGeometry = new THREE.SphereGeometry(0.12, 8, 8);
    const leafMaterial = new THREE.MeshPhongMaterial({
      color: 0x2d5016,
      shininess: 20,
    });

    // 3枚の葉を配置
    for (let i = 0; i < 3; i++) {
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      const angle = (i * Math.PI * 2) / 3;
      leaf.position.set(Math.cos(angle) * 0.08, 0.1, Math.sin(angle) * 0.08);
      leaf.scale.set(1, 0.6, 1);
      group.add(leaf);
    }

    // いちご（赤い球体）複数個
    const berryGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const berryMaterial = new THREE.MeshPhongMaterial({ color: 0xff3333 });

    for (let i = 0; i < 2; i++) {
      const berry = new THREE.Mesh(berryGeometry, berryMaterial);
      berry.position.set(
        (Math.random() - 0.5) * 0.15,
        0.08,
        (Math.random() - 0.5) * 0.15
      );
      group.add(berry);
    }

    // 茎
    const stemGeometry = new THREE.CylinderGeometry(0.01, 0.015, 0.1, 6);
    const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x4a7c2e });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.05;
    group.add(stem);

    return group;
  },

  createPath() {
    const pathLength = 7;
    const waypointCount = 15;
    this.waypoints = [];

    for (let i = 0; i < waypointCount; i++) {
      const z = -pathLength / 2 + (pathLength / (waypointCount - 1)) * i;
      this.waypoints.push(new THREE.Vector3(0, 0, z));
    }

    // 経路ラインの作成
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(
      this.waypoints
    );
    const pathMaterial = new THREE.LineBasicMaterial({
      color: 0xffa726,
      linewidth: 3,
    });
    this.pathLine = new THREE.Line(pathGeometry, pathMaterial);
    this.pathLine.position.y = 0.02;
    this.scene.add(this.pathLine);

    // ウェイポイントマーカーの追加
    this.waypoints.forEach((point, index) => {
      const markerGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color:
          index === 0
            ? 0x00ff00
            : index === this.waypoints.length - 1
            ? 0xff0000
            : 0xffa726,
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(point);
      marker.position.y = 0.02;
      this.scene.add(marker);
    });
  },

  createRobot() {
    const group = new THREE.Group();

    // ロボット本体
    const bodyGeometry = new THREE.BoxGeometry(0.6, 0.3, 0.9);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0x667eea,
      shininess: 30,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.15;
    group.add(body);

    // 前面マーカー
    const markerGeometry = new THREE.BoxGeometry(0.25, 0.35, 0.1);
    const markerMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(0, 0.15, 0.5);
    group.add(marker);

    // 車輪
    const wheelGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 16);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });

    const wheelPositions = [
      [-0.25, 0.1, 0.3],
      [0.25, 0.1, 0.3],
      [-0.25, 0.1, -0.3],
      [0.25, 0.1, -0.3],
    ];

    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.rotation.z = Math.PI / 2;
      group.add(wheel);
    });

    this.robot = group;
    this.robot.position.copy(this.waypoints[0]);
    this.scene.add(group);
  },

  setupEventListeners() {
    const autoRunBtn = document.getElementById("autoRunBtn");
    if (autoRunBtn) {
      autoRunBtn.addEventListener("click", () => {
        this.toggleAutoRun();
      });
    }

    const nextWaypointBtn = document.getElementById("nextWaypointBtn");
    if (nextWaypointBtn) {
      nextWaypointBtn.addEventListener("click", () => {
        this.moveToNextWaypoint();
      });
    }

    const resetPathBtn = document.getElementById("resetPathBtn");
    if (resetPathBtn) {
      resetPathBtn.addEventListener("click", () => {
        this.resetPath();
      });
    }
  },

  toggleAutoRun() {
    this.isAutoRunning = !this.isAutoRunning;
    const btn = document.getElementById("autoRunBtn");
    if (btn) {
      btn.textContent = this.isAutoRunning ? "停止" : "自動走行開始";
      btn.className = this.isAutoRunning ? "stop-btn" : "start-btn";
    }
  },

  moveToNextWaypoint() {
    if (this.currentWaypointIndex < this.waypoints.length - 1) {
      this.currentWaypointIndex++;
      const target = this.waypoints[this.currentWaypointIndex];
      this.robot.position.set(target.x, target.y, target.z);
      this.updateWaypointDisplay();
    }
  },

  resetPath() {
    this.currentWaypointIndex = 0;
    this.isAutoRunning = false;
    const target = this.waypoints[0];
    this.robot.position.copy(target);

    const btn = document.getElementById("autoRunBtn");
    if (btn) {
      btn.textContent = "自動走行開始";
      btn.className = "start-btn";
    }
    this.updateWaypointDisplay();
  },

  updateWaypointDisplay() {
    const display = document.getElementById("waypointDisplay");
    if (display) {
      display.textContent = `ウェイポイント: ${
        this.currentWaypointIndex + 1
      } / ${this.waypoints.length}`;
    }
  },

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.isAutoRunning && this.waypoints.length > 0) {
      const speed = 0.02;
      const target = this.waypoints[this.currentWaypointIndex];
      const current = this.robot.position;

      const dx = target.x - current.x;
      const dz = target.z - current.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < 0.05) {
        this.currentWaypointIndex++;
        if (this.currentWaypointIndex >= this.waypoints.length) {
          this.isAutoRunning = false;
          this.currentWaypointIndex = this.waypoints.length - 1;
          const btn = document.getElementById("autoRunBtn");
          if (btn) {
            btn.textContent = "自動走行開始";
            btn.className = "start-btn";
          }
        }
        this.updateWaypointDisplay();
      } else {
        current.x += (dx / distance) * speed;
        current.z += (dz / distance) * speed;

        // ロボットを進行方向に向ける
        const angle = Math.atan2(dx, dz);
        this.robot.rotation.y = angle;
      }
    }

    this.renderer.render(this.scene, this.camera);
  },

  onWindowResize() {
    const container = document.getElementById("route3DContainer");
    if (!container) return;

    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  },
};
