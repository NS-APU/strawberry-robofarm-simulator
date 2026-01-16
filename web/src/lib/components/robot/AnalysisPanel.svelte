<script lang="ts">
  import { analysisResult, robotLogs } from '../../stores/robotStore';
  import type { LogEntry, AnalysisResult } from '../../stores/robotStore';
  
  function handleSendToAgri() {
     // Mock sending to Agri Platform
     const logEntry: LogEntry = {
         timestamp: new Date().toISOString(),
         data: $analysisResult.data,
         analysis: {
             status: $analysisResult.status,
             insights: $analysisResult.insights
         }
     };
     
     robotLogs.update(logs => [logEntry, ...logs]);
     alert('農業情報基盤へデータを送信しました');
  }
</script>

  {#if $analysisResult.waiting}
    <div class="alert alert-info" id="waitingMessage">
        ロボットからのデータを待機中...
    </div>
  {:else}
    <div id="analysisContainer">
        <h5>受信データ</h5>
        <div class="card mb-3">
            <div class="card-body">
                <pre id="receivedData" class="mb-0">{JSON.stringify($analysisResult.data, null, 2)}</pre>
            </div>
        </div>

        <h5>分析結果</h5>
        <div class="card mb-3">
            <div class="card-body">
                <div id="analysisStatus" class="mb-2">
                    <strong>ステータス:</strong> 
                    <span class:text-success={$analysisResult.status === 'normal'}
                          class:text-danger={$analysisResult.status !== 'normal'}>
                        {($analysisResult.status || '').toUpperCase()}
                    </span>
                </div>
                <div id="analysisInsights">
                    <strong>インサイト:</strong>
                    <ul>
                        {#each $analysisResult.insights as insight}
                            <li class="insight-item">{insight}</li>
                        {/each}
                    </ul>
                </div>
                <div id="analysisRecommendations">
                     <strong>推奨アクション:</strong>
                     <ul>
                        {#each $analysisResult.recommendations as rec}
                            <li class="recommendation-item">{rec}</li>
                        {/each}
                     </ul>
                </div>
            </div>
        </div>

        <button id="sendToAgriBtn" class="btn btn-success w-100" on:click={handleSendToAgri}>
            🌾 農業情報基盤へ送信
        </button>

        <div class="mt-3">
            <h5>送信履歴</h5>
            <div id="agriLog" class="log-container">
                {#each $robotLogs as log}
                    <div class="log-entry {log.analysis.status === 'normal' ? 'success' : 'warning'}">
                        <small class="timestamp">{log.timestamp}</small>
                        <div>Status: {log.analysis.status}</div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
  {/if}

<style>
  /* Global styles from styles.css are used */
</style>
