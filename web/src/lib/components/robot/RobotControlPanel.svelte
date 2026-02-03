<script lang="ts">
  import { robotSettings, analysisResult, isAnalysisPanelOpen, STATUS_CODES } from '../../stores/robotStore';
  import Tilt3D from './Tilt3D.svelte';


  import { submitAnalysisData } from '../../logic/analysisService';

  function handleSend() {
    isAnalysisPanelOpen.set(true);
    analysisResult.update((s) => ({ ...s, waiting: true }));

    setTimeout(() => {
      submitAnalysisData($robotSettings, undefined);
    }, 500);
  }

  // 時間差分計算 (HH:mm:ss format)
  function calculateDuration(start: string | undefined, end: string | undefined): string {
    if (!start || !end) return '--:--:--';
    const startDate = new Date(start);
    const endDate = new Date(end);
    let diff = endDate.getTime() - startDate.getTime();
    
    if (diff < 0) return '--:--:--';

    const hours = Math.floor(diff / 3600000);
    diff %= 3600000;
    const minutes = Math.floor(diff / 60000);
    diff %= 60000;
    const seconds = Math.floor(diff / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
</script>

<div class="flex h-full flex-col">
  <div class="flex-1 overflow-y-auto p-4">
    <!-- ステータス設定 Section (Moved to Top) -->
    <div class="mb-6 rounded-lg bg-gray-50 p-4">
      <h3 class="mb-3 border-b border-gray-200 pb-2 font-bold text-gray-700">ステータス設定</h3>

      <div class="mb-3">
        <label class="form-label" for="statusCode">ステータスコード</label>
        <select 
          class="form-select" 
          id="statusCode" 
          value={$robotSettings.statusCode}
          on:change={(e) => robotSettings.setStatusCode(e.currentTarget.value)}
        >
          <optgroup label="正常系">
            {#each STATUS_CODES.NORMAL as status}
              <option value={status.code}>{status.code}: {status.label}</option>
            {/each}
          </optgroup>
          <optgroup label="走行系異常">
            {#each STATUS_CODES.RUNNING as status}
              <option value={status.code}>{status.code}: {status.label}</option>
            {/each}
          </optgroup>
           <optgroup label="収穫系異常">
            {#each STATUS_CODES.HARVEST as status}
              <option value={status.code}>{status.code}: {status.label}</option>
            {/each}
          </optgroup>
           <optgroup label="バッテリー系異常">
            {#each STATUS_CODES.BATTERY as status}
              <option value={status.code}>{status.code}: {status.label}</option>
            {/each}
          </optgroup>
        </select>
      </div>
    </div>

    <!-- 稼働制御 Section -->
    <div class="mb-6 rounded-lg bg-gray-50 p-4">
      <h3 class="mb-3 border-b border-gray-200 pb-2 font-bold text-gray-700">稼働制御</h3>
      
      <div class="space-y-4">
        <!-- Operation -->
        <div class="flex flex-col gap-1">
          <label class="font-bold text-gray-700 text-sm">稼働</label>
          <div class="flex items-center gap-1">
            <div class="flex-1 min-w-0">
              <input 
                type="datetime-local" 
                class="form-control w-full px-1 py-1 text-xs" 
                bind:value={$robotSettings.operationStartTime} 
                title="稼働開始日時"
              />
            </div>
            <span class="text-gray-500 font-bold shrink-0">～</span>
            <div class="flex-1 min-w-0">
              <input 
                type="datetime-local" 
                class="form-control w-full px-1 py-1 text-xs" 
                bind:value={$robotSettings.operationEndTime} 
                title="稼働終了日時"
              />
            </div>
            <span class="text-gray-500 font-bold shrink-0">＝</span>
            <div class="flex-1 min-w-0">
              <div class="rounded bg-gray-200 px-1 py-1.5 font-mono text-gray-700 text-xs text-center overflow-hidden text-ellipsis whitespace-nowrap" title="稼働時間">
                {calculateDuration($robotSettings.operationStartTime, $robotSettings.operationEndTime)}
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 my-2"></div>

        <!-- Stop -->
        <div class="flex flex-col gap-1">
          <label class="font-bold text-gray-700 text-sm">停止</label>
          <div class="flex items-center gap-1">
             <div class="flex-1 min-w-0">
              <input 
                type="datetime-local" 
                class="form-control w-full px-1 py-1 text-xs" 
                bind:value={$robotSettings.stopOccurredTime} 
                title="停止発生日時"
              />
            </div>
            <span class="text-gray-500 font-bold shrink-0">～</span>
            <div class="flex-1 min-w-0">
              <input 
                type="datetime-local" 
                class="form-control w-full px-1 py-1 text-xs" 
                bind:value={$robotSettings.stopRecoveryTime} 
                title="停止復旧日時"
              />
            </div>
            <span class="text-gray-500 font-bold shrink-0">＝</span>
             <div class="flex-1 min-w-0">
              <div class="rounded bg-gray-200 px-1 py-1.5 font-mono text-gray-700 text-xs text-center overflow-hidden text-ellipsis whitespace-nowrap" title="停止時間">
                {calculateDuration($robotSettings.stopOccurredTime, $robotSettings.stopRecoveryTime)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 走行制御 Section -->
    <div class="mb-6 rounded-lg bg-gray-50 p-4">
      <h3 class="mb-3 border-b border-gray-200 pb-2 font-bold text-gray-700">走行制御</h3>
      
      <div class="mb-3 space-y-3">
        <div>
          <label class="form-label" for="speed">走行速度 (m/s)</label>
          <div class="flex items-center gap-2">
            <input type="range" class="form-range flex-1 rounded-full" id="speed" min="0" max="1" step="0.1" bind:value={$robotSettings.speed} style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$robotSettings.speed * 100}%, #e5e7eb {$robotSettings.speed * 100}%, #e5e7eb 100%); background-size: 100% 100%;" />
            <input type="number" class="form-control w-28 text-right" min="0" max="1" step="0.1" bind:value={$robotSettings.speed} />
            <span class="text-sm text-gray-500 w-8">m/s</span>
          </div>
        </div>
        <div>
          <label class="form-label" for="tireRotation">タイヤ回転数 (rpm)</label>
          <div class="flex items-center gap-2">
            <input type="range" class="form-range flex-1 rounded-full" id="tireRotation" min="0" max="200" step="1" bind:value={$robotSettings.tireRotation} style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$robotSettings.tireRotation / 2}%, #e5e7eb {$robotSettings.tireRotation / 2}%, #e5e7eb 100%); background-size: 100% 100%;" />
            <input type="number" class="form-control w-28 text-right" min="0" max="200" step="1" bind:value={$robotSettings.tireRotation} />
            <span class="text-sm text-gray-500 w-8">rpm</span>
          </div>
        </div>
      </div>

      <div class="mb-3">
         <label class="form-label" for="obstacleDetected">障害物検知</label>
         <div>
            <label class="relative inline-flex items-center cursor-pointer">
               <input type="checkbox" id="obstacleDetected" bind:checked={$robotSettings.obstacleDetected} class="sr-only peer">
               <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
             </label>
         </div>
      </div>
    </div>

    <!-- 姿勢制御 Section -->
    <div class="mb-6 rounded-lg bg-gray-50 p-4">
      <h3 class="mb-3 border-b border-gray-200 pb-2 font-bold text-gray-700">姿勢制御</h3>

      <div class="mb-3">
        <label class="form-label" for="tilt3D">傾き調整 (3Dビュー)</label>
        <Tilt3D />

      </div>

      <div class="space-y-3">
        <div>
          <label class="form-label" for="yaw">ヨー (°)</label>
          <div class="flex items-center gap-2">
            <input type="range" class="form-range flex-1 rounded-full" id="yaw" min="-180" max="180" step="0.5" bind:value={$robotSettings.yaw} style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {($robotSettings.yaw + 180) / 3.6}%, #e5e7eb {($robotSettings.yaw + 180) / 3.6}%, #e5e7eb 100%); background-size: 100% 100%;" />
            <input type="number" class="form-control w-28 text-right" min="-180" max="180" step="0.5" bind:value={$robotSettings.yaw} />
            <span class="text-sm text-gray-500 w-8">°</span>
          </div>
        </div>
        <div>
          <label class="form-label" for="pitch">ピッチ (°)</label>
          <div class="flex items-center gap-2">
            <input type="range" class="form-range flex-1 rounded-full" id="pitch" min="-90" max="90" step="0.5" bind:value={$robotSettings.pitch} style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {($robotSettings.pitch + 90) / 1.8}%, #e5e7eb {($robotSettings.pitch + 90) / 1.8}%, #e5e7eb 100%); background-size: 100% 100%;" />
            <input type="number" class="form-control w-28 text-right" min="-90" max="90" step="0.5" bind:value={$robotSettings.pitch} />
            <span class="text-sm text-gray-500 w-8">°</span>
          </div>
        </div>
        <div>
          <label class="form-label" for="roll">ロール (°)</label>
          <div class="flex items-center gap-2">
            <input type="range" class="form-range flex-1 rounded-full" id="roll" min="-90" max="90" step="0.5" bind:value={$robotSettings.roll} style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {($robotSettings.roll + 90) / 1.8}%, #e5e7eb {($robotSettings.roll + 90) / 1.8}%, #e5e7eb 100%); background-size: 100% 100%;" />
            <input type="number" class="form-control w-28 text-right" min="-90" max="90" step="0.5" bind:value={$robotSettings.roll} />
            <span class="text-sm text-gray-500 w-8">°</span>
          </div>
        </div>
      </div>
    </div>


    <!-- Harvest Control Section -->
    <!-- 収穫制御 Section -->
    <div class="mb-6 rounded-lg bg-gray-50 p-4">
      <h3 class="mb-3 border-b border-gray-200 pb-2 font-bold text-gray-700">収穫制御</h3>

      <div class="mb-3 space-y-3">
        <!-- Harvest Count -->
        <div>
          <label class="form-label" for="harvestCount">収穫数</label>
          <div class="flex items-center gap-2">
            <input 
              type="range" 
              class="form-range flex-1 rounded-full" 
              id="harvestCount" 
              min="0" 
              max="200" 
              step="1" 
              bind:value={$robotSettings.harvestCount}
              style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$robotSettings.harvestCount / 2}%, #e5e7eb {$robotSettings.harvestCount / 2}%, #e5e7eb 100%); background-size: 100% 100%;" 
            />
            <input type="number" class="form-control w-28 text-right" min="0" max="200" bind:value={$robotSettings.harvestCount} />
            <span class="text-sm text-gray-500 w-8">個</span>
          </div>
        </div>

        <!-- Detection Count -->
        <div>
          <label class="form-label" for="detectionCount">検出数</label>
          <div class="flex items-center gap-2">
            <input 
              type="range" 
              class="form-range flex-1 rounded-full" 
              id="detectionCount" 
              min="0" 
              max="200" 
              step="1" 
              bind:value={$robotSettings.detectionCount} 
              style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$robotSettings.detectionCount / 2}%, #e5e7eb {$robotSettings.detectionCount / 2}%, #e5e7eb 100%); background-size: 100% 100%;"
            />
            <input type="number" class="form-control w-28 text-right" min="0" max="200" bind:value={$robotSettings.detectionCount} />
            <span class="text-sm text-gray-500 w-8">個</span>
          </div>
        </div>
      </div>
    </div>

    <!-- デバイス制御 Section -->
    <div class="mb-6 rounded-lg bg-gray-50 p-4">
      <h3 class="mb-3 border-b border-gray-200 pb-2 font-bold text-gray-700">デバイス制御</h3>
      
      <div class="mb-3">
        <label class="form-label" for="cameraClarity">カメラ鮮明度 (%)</label>
        <div class="flex items-center gap-2">
          <input 
            type="range" 
            class="form-range flex-1 rounded-full" 
            id="cameraClarity" 
            min="0" 
            max="100" 
            bind:value={$robotSettings.cameraClarity}
            style="--range-color: {
              $robotSettings.cameraClarity <= 20 ? '#dc2626' : 
              $robotSettings.cameraClarity <= 40 ? '#ca8a04' : '#2563eb'
            }; background: linear-gradient(to right, {$robotSettings.cameraClarity <= 20 ? '#dc2626' : $robotSettings.cameraClarity <= 40 ? '#ca8a04' : '#2563eb'} 0%, {$robotSettings.cameraClarity <= 20 ? '#dc2626' : $robotSettings.cameraClarity <= 40 ? '#ca8a04' : '#2563eb'} {$robotSettings.cameraClarity}%, #e5e7eb {$robotSettings.cameraClarity}%, #e5e7eb 100%); background-size: 100% 100%; argument: none;"
          />
          <input type="number" class={`form-control w-28 text-right ${$robotSettings.cameraClarity <= 20 ? 'text-red-600 font-bold' : $robotSettings.cameraClarity <= 40 ? 'text-yellow-600 font-bold' : ''}`} min="0" max="100" bind:value={$robotSettings.cameraClarity} />
          <span class="text-sm text-gray-500 w-8">%</span>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label" for="batteryLevel">バッテリー残量 (%)</label>
         <div class="flex items-center gap-2">
            <input 
              type="range" 
              class="form-range flex-1 rounded-full" 
              id="batteryLevel" 
              min="0" 
              max="100" 
              bind:value={$robotSettings.batteryLevel}
              style="--range-color: {
                $robotSettings.batteryLevel === 0 ? '#dc2626' : 
                $robotSettings.batteryLevel <= 20 ? '#ca8a04' : '#2563eb'
              }; background: linear-gradient(to right, {$robotSettings.batteryLevel === 0 ? '#dc2626' : $robotSettings.batteryLevel <= 20 ? '#ca8a04' : '#2563eb'} 0%, {$robotSettings.batteryLevel === 0 ? '#dc2626' : $robotSettings.batteryLevel <= 20 ? '#ca8a04' : '#2563eb'} {$robotSettings.batteryLevel}%, #e5e7eb {$robotSettings.batteryLevel}%, #e5e7eb 100%); background-size: 100% 100%;"
            />
            <input type="number" class={`form-control w-28 text-right ${$robotSettings.batteryLevel === 0 ? 'text-red-600 font-bold' : $robotSettings.batteryLevel <= 20 ? 'text-yellow-600 font-bold' : ''}`} min="0" max="100" bind:value={$robotSettings.batteryLevel} />
            <span class="text-sm text-gray-500 w-8">%</span>
         </div>
      </div>

       <div class="mb-3">
         <label class="form-label" for="trayFull">トレイ満タン</label>
         <div>
            <label class="relative inline-flex items-center cursor-pointer">
               <input type="checkbox" id="trayFull" bind:checked={$robotSettings.trayFull} class="sr-only peer">
               <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
             </label>
         </div>
      </div>
    </div>
  </div>

  <div class="flex-none border-t bg-white/50 p-4 backdrop-blur-sm flex justify-center">
    <button
      type="button"
      class="btn btn-primary w-auto px-8 transform shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
      on:click={handleSend}>📤 データを送信</button
    >
  </div>
</div>

<style>
  /* Custom range slider colors - change thumb and track progress color */
  
  /* For Chrome, Safari, Edge */
  input[type="range"].form-range::-webkit-slider-thumb {
    background-color: var(--range-color, #3b82f6) !important;
  }

  input[type="range"].form-range::-webkit-slider-runnable-track {
    background: transparent !important;
  }

  /* For Firefox - thumb */
  input[type="range"].form-range::-moz-range-thumb {
    background-color: var(--range-color, #3b82f6) !important;
  }

  /* For Firefox - progress track */
  input[type="range"].form-range::-moz-range-progress {
    background-color: var(--range-color, #3b82f6) !important;
  }
</style>
