// ロボット制御パネルの機能
const RobotControl = {
  init() {
    const form = document.getElementById("robotForm");
    const anomalyCode = document.getElementById("anomalyCode");
    const anomalyDetailsGroup = document.getElementById("anomalyDetailsGroup");

    // 異常コード選択時の処理
    anomalyCode.addEventListener("change", (e) => {
      anomalyDetailsGroup.style.display = e.target.value ? "block" : "none";
    });

    // フォーム送信処理
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.sendData();
    });
  },

  sendData() {
    try {
      const route = JSON.parse(document.getElementById("route").value);
      const anomalyCode = document.getElementById("anomalyCode").value;

      const data = {
        robotId: "ROBOT-001",
        timestamp: new Date().toISOString(),
        speed: parseFloat(document.getElementById("speed").value),
        pitch: parseFloat(document.getElementById("pitch").value),
        roll: parseFloat(document.getElementById("roll").value),
        startTime: document.getElementById("startTime").value,
        stopTime: document.getElementById("stopTime").value,
        route: route,
        anomaly: anomalyCode
          ? {
              code: anomalyCode,
              details: document.getElementById("anomalyDetails").value,
            }
          : null,
      };

      // データストアに保存
      DataStore.setRobotData(data);

      // ログに追加
      this.addLog(data);

      // 分析サービスに通知
      AnalysisService.receiveData(data);

      alert("✅ 分析サービスへデータを送信しました！");
    } catch (error) {
      alert("❌ エラー: " + error.message);
    }
  },

  addLog(data) {
    const log = document.getElementById("robotLog");
    const entry = document.createElement("div");
    entry.className = "log-entry";
    entry.innerHTML = `
            <div class="timestamp">${new Date(data.timestamp).toLocaleString(
              "ja-JP"
            )}</div>
            <div>速度: ${data.speed} km/h | 異常: ${
      data.anomaly ? data.anomaly.code : "正常"
    }</div>
        `;
    log.insertBefore(entry, log.firstChild);
  },
};
