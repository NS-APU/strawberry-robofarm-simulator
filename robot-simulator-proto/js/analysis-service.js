// 分析サービスの機能
const AnalysisService = {
  init() {
    const sendBtn = document.getElementById("sendToAgriBtn");
    sendBtn.addEventListener("click", () => {
      this.sendToAgri();
    });
  },

  receiveData(robotData) {
    // 待機メッセージを非表示
    document.getElementById("waitingMessage").style.display = "none";
    document.getElementById("analysisContainer").style.display = "block";

    // 受信データを表示
    document.getElementById("receivedData").textContent = JSON.stringify(
      robotData,
      null,
      2
    );

    // 分析実行
    this.analyzeData(robotData);
  },

  analyzeData(data) {
    const statusDiv = document.getElementById("analysisStatus");
    const insightsDiv = document.getElementById("analysisInsights");
    const recommendationsDiv = document.getElementById(
      "analysisRecommendations"
    );

    // 分析結果の生成
    const result = {
      status: data.anomaly ? "warning" : "normal",
      efficiency: this.calculateEfficiency(data),
      insights: this.generateInsights(data),
      recommendations: this.generateRecommendations(data),
    };

    // 結果を表示
    statusDiv.innerHTML = `<strong>ステータス:</strong> ${
      result.status === "warning" ? "⚠️ 警告" : "✅ 正常"
    }`;
    insightsDiv.innerHTML = `<strong>分析結果:</strong><ul>${result.insights
      .map((i) => `<li>${i}</li>`)
      .join("")}</ul>`;
    recommendationsDiv.innerHTML = `<strong>推奨事項:</strong><ul>${result.recommendations
      .map((r) => `<li>${r}</li>`)
      .join("")}</ul>`;

    // データストアに保存
    DataStore.setAnalysisResult(result);

    // 農業情報基盤への送信ボタンを有効化
    document.getElementById("sendToAgriBtn").disabled = false;
  },

  calculateEfficiency(data) {
    return Math.floor(Math.random() * 20) + 80; // 80-100%
  },

  generateInsights(data) {
    const insights = [];
    insights.push(`平均速度: ${data.speed} km/h`);
    insights.push(`走行効率: ${this.calculateEfficiency(data)}%`);
    if (data.anomaly) {
      insights.push(`異常検知: ${data.anomaly.code}`);
    }
    return insights;
  },

  generateRecommendations(data) {
    const recommendations = [];
    if (data.speed > 5) {
      recommendations.push("速度が高めです。安全性を考慮してください。");
    }
    if (Math.abs(data.pitch) > 10 || Math.abs(data.roll) > 10) {
      recommendations.push("傾きが大きいため、地形を確認してください。");
    }
    if (!data.anomaly) {
      recommendations.push("正常に動作しています。");
    }
    return recommendations;
  },

  sendToAgri() {
    const robotData = DataStore.getRobotData();
    const analysisResult = DataStore.getAnalysisResult();

    const agriData = {
      timestamp: new Date().toISOString(),
      robotData: robotData,
      analysis: analysisResult,
    };

    // ログに追加
    this.addLog(agriData);

    alert("✅ 農業情報基盤へデータを送信しました！");
  },

  addLog(data) {
    const log = document.getElementById("agriLog");
    const entry = document.createElement("div");
    entry.className = "log-entry";
    entry.innerHTML = `
            <div class="timestamp">${new Date(data.timestamp).toLocaleString(
              "ja-JP"
            )}</div>
            <div>ステータス: ${data.analysis.status} | 効率: ${
      data.analysis.efficiency
    }%</div>
        `;
    log.insertBefore(entry, log.firstChild);
  },
};
