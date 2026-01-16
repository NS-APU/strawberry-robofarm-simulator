// シンプルなデータストア（ブラウザ内でのデータ共有用）
const DataStore = {
  currentRobotData: null,
  currentAnalysisResult: null,

  setRobotData(data) {
    this.currentRobotData = data;
  },

  getRobotData() {
    return this.currentRobotData;
  },

  setAnalysisResult(result) {
    this.currentAnalysisResult = result;
  },

  getAnalysisResult() {
    return this.currentAnalysisResult;
  },
};
