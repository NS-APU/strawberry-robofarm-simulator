// アプリケーションの初期化
document.addEventListener("DOMContentLoaded", () => {
  Tilt3DControl.init();
  RobotControl.init();
  AnalysisService.init();
  setDefaultValues();
  initResizer();
  console.log("✅ ロボットシミュレーターが起動しました");
});

function setDefaultValues() {
  // 現在時刻をデフォルトに設定
  const now = new Date();
  const startTime = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2時間前

  document.getElementById("startTime").value = formatDateTimeLocal(startTime);
  document.getElementById("stopTime").value = formatDateTimeLocal(now);

  // サンプル値を設定（農業用ロボットの典型的な値）
  document.getElementById("speed").value = "3.5";

  // 3Dコントロールの初期値を設定
  Tilt3DControl.setPitch(2.3);
  Tilt3DControl.setRoll(1.8);

  // スライダーの初期値も設定
  document.getElementById("pitchSlider").value = "2.3";
  document.getElementById("rollSlider").value = "1.8";

  // より詳細なサンプル経路（圃場を想定）
  const sampleRoute = [
    {
      latitude: 35.6812,
      longitude: 139.7671,
      timestamp: startTime.toISOString(),
    },
    {
      latitude: 35.6815,
      longitude: 139.7673,
      timestamp: new Date(startTime.getTime() + 20 * 60 * 1000).toISOString(),
    },
    {
      latitude: 35.6818,
      longitude: 139.7675,
      timestamp: new Date(startTime.getTime() + 40 * 60 * 1000).toISOString(),
    },
    {
      latitude: 35.6821,
      longitude: 139.7678,
      timestamp: new Date(startTime.getTime() + 60 * 60 * 1000).toISOString(),
    },
    {
      latitude: 35.6823,
      longitude: 139.768,
      timestamp: new Date(startTime.getTime() + 90 * 60 * 1000).toISOString(),
    },
    {
      latitude: 35.6825,
      longitude: 139.7682,
      timestamp: now.toISOString(),
    },
  ];
  document.getElementById("route").value = JSON.stringify(sampleRoute, null, 2);

  // 異常コードはデフォルトで「正常」
  document.getElementById("anomalyCode").value = "";
  document.getElementById("anomalyDetails").value = "";
}

function formatDateTimeLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function initResizer() {
  const resizer = document.getElementById("resizer");
  const leftPanel = document.getElementById("leftPanel");
  const rightPanel = document.getElementById("rightPanel");
  const container = document.getElementById("mainContainer");

  let isResizing = false;
  let startX = 0;
  let startLeftWidth = 0;

  resizer.addEventListener("mousedown", (e) => {
    isResizing = true;
    startX = e.clientX;
    startLeftWidth = leftPanel.getBoundingClientRect().width;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;

    const containerWidth = container.getBoundingClientRect().width;
    const resizerWidth = 8;
    const deltaX = e.clientX - startX;
    const newLeftWidth = startLeftWidth + deltaX;
    const newRightWidth = containerWidth - newLeftWidth - resizerWidth;

    // 最小幅を300pxに制限
    if (newLeftWidth >= 300 && newRightWidth >= 300) {
      const leftPercent = (newLeftWidth / containerWidth) * 100;
      const rightPercent = (newRightWidth / containerWidth) * 100;

      leftPanel.style.flex = `0 0 ${leftPercent}%`;
      rightPanel.style.flex = `0 0 ${rightPercent}%`;
    }
  });

  document.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  });
}
