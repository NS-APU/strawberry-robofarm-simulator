<script lang="ts">
  import { houseSettings } from '../../stores/houseStore';
  import { analysisResult, isAnalysisPanelOpen } from '../../stores/robotStore';

  import { submitAnalysisData } from '../../logic/analysisService';

  function handleSend() {
    isAnalysisPanelOpen.set(true);
    analysisResult.update((s) => ({ ...s, waiting: true }));

    setTimeout(() => {
      submitAnalysisData(undefined, $houseSettings);
    }, 500);
  }
</script>

<div class="flex h-full flex-col">
  <div class="flex-1 overflow-y-auto p-4">
    <!-- 環境制御 Section -->
    <div class="mb-6 rounded-lg bg-gray-50 p-4">
      <h3 class="mb-3 border-b border-gray-200 pb-2 font-bold text-gray-700">環境制御</h3>
      <div class="space-y-3">
        <div>
          <label class="form-label" for="temperature">温度 (℃)</label>
          <div class="flex items-center gap-2">
            <input 
              type="range" 
              class="form-range flex-1 rounded-full" 
              id="temperature" 
              min="-10" 
              max="40" 
              step="0.1" 
              bind:value={$houseSettings.temperature}
              style="--range-color: {
                $houseSettings.temperature > 35 || $houseSettings.temperature < 0 ? '#dc2626' : 
                ($houseSettings.temperature > 25 && $houseSettings.temperature <= 35) || ($houseSettings.temperature >= 0 && $houseSettings.temperature < 10) ? '#ca8a04' : '#2563eb'
              }; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {($houseSettings.temperature + 10) * 2}%, #e5e7eb {($houseSettings.temperature + 10) * 2}%, #e5e7eb 100%); background-size: 100% 100%;"
            />
            <input 
              type="number" 
              class={`form-control w-28 text-right ${
                $houseSettings.temperature > 35 || $houseSettings.temperature < 0 ? 'text-red-600 font-bold' : 
                ($houseSettings.temperature > 25 && $houseSettings.temperature <= 35) || ($houseSettings.temperature >= 0 && $houseSettings.temperature < 10) ? 'text-yellow-600 font-bold' : ''
              }`}
              min="-20" 
              max="50" 
              step="0.1" 
              bind:value={$houseSettings.temperature} 
            />
            <span class="text-sm text-gray-500 w-8">℃</span>
          </div>
        </div>
        <div>
          <label class="form-label" for="humidity">湿度 (%)</label>
          <div class="flex items-center gap-2">
            <input 
              type="range" 
              class="form-range flex-1 rounded-full" 
              id="humidity" 
              min="0" 
              max="100" 
              step="0.1" 
              bind:value={$houseSettings.humidity}
              style="--range-color: {
                $houseSettings.humidity > 90 || $houseSettings.humidity < 30 ? '#dc2626' : 
                ($houseSettings.humidity > 80 && $houseSettings.humidity <= 90) || ($houseSettings.humidity >= 30 && $houseSettings.humidity < 40) ? '#ca8a04' : '#2563eb'
              }; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$houseSettings.humidity}%, #e5e7eb {$houseSettings.humidity}%, #e5e7eb 100%); background-size: 100% 100%;"
            />
            <input 
              type="number" 
              class={`form-control w-28 text-right ${
                $houseSettings.humidity > 90 || $houseSettings.humidity < 30 ? 'text-red-600 font-bold' : 
                ($houseSettings.humidity > 80 && $houseSettings.humidity <= 90) || ($houseSettings.humidity >= 30 && $houseSettings.humidity < 40) ? 'text-yellow-600 font-bold' : ''
              }`}
              min="0" 
              max="100" 
              step="0.1" 
              bind:value={$houseSettings.humidity} 
            />
            <span class="text-sm text-gray-500 w-8">%</span>
          </div>
        </div>
        <div>
          <label class="form-label" for="illuminance">照度 (lx)</label>
          <div class="flex items-center gap-2">
            <input 
              type="range" 
              class="form-range flex-1 rounded-full" 
              id="illuminance" 
              min="0" 
              max="75000" 
              step="100" 
              bind:value={$houseSettings.illuminance}
              style="--range-color: {
                $houseSettings.illuminance > 50000 || $houseSettings.illuminance < 10000 ? '#dc2626' : 
                ($houseSettings.illuminance > 40000 && $houseSettings.illuminance <= 50000) || ($houseSettings.illuminance > 10000 && $houseSettings.illuminance < 20000) ? '#ca8a04' : '#2563eb'
              }; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$houseSettings.illuminance / 750}%, #e5e7eb {$houseSettings.illuminance / 750}%, #e5e7eb 100%); background-size: 100% 100%;"
            />
            <input 
              type="number" 
              class={`form-control w-28 text-right ${
                $houseSettings.illuminance > 50000 || $houseSettings.illuminance < 10000 ? 'text-red-600 font-bold' : 
                ($houseSettings.illuminance > 40000 && $houseSettings.illuminance <= 50000) || ($houseSettings.illuminance >= 10000 && $houseSettings.illuminance < 20000) ? 'text-yellow-600 font-bold' : ''
              }`}
              min="0" 
              max="75000" 
              step="100" 
              bind:value={$houseSettings.illuminance} 
            />
            <span class="text-sm text-gray-500 w-10">lx</span>
          </div>
        </div>
        <div>
          <label class="form-label" for="co2">CO2濃度 (ppm)</label>
          <div class="flex items-center gap-2">
            <input 
              type="range" 
              class="form-range flex-1 rounded-full" 
              id="co2" 
              min="0" 
              max="5000" 
              step="1" 
              bind:value={$houseSettings.co2}
              style="--range-color: {
                $houseSettings.co2 > 3000 || $houseSettings.co2 < 200 ? '#dc2626' : 
                ($houseSettings.co2 >= 200 && $houseSettings.co2 < 800) || ($houseSettings.co2 > 1000 && $houseSettings.co2 <= 3000) ? '#ca8a04' : '#2563eb'
              }; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$houseSettings.co2 / 50}%, #e5e7eb {$houseSettings.co2 / 50}%, #e5e7eb 100%); background-size: 100% 100%;"
            />
            <input 
              type="number" 
              class={`form-control w-28 text-right ${
                $houseSettings.co2 > 3000 || $houseSettings.co2 < 200 ? 'text-red-600 font-bold' : 
                ($houseSettings.co2 >= 200 && $houseSettings.co2 < 800) || ($houseSettings.co2 > 1000 && $houseSettings.co2 <= 3000) ? 'text-yellow-600 font-bold' : ''
              }`}
              min="0" 
              max="5000" 
              step="1" 
              bind:value={$houseSettings.co2} 
            />
            <span class="text-sm text-gray-500 w-10">ppm</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex-none border-t bg-white/50 p-4 backdrop-blur-sm flex justify-center">
    <button
      type="button"
      class="btn btn-primary w-auto px-8 transform shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
      on:click={handleSend}>📤 分析サービスへ送信</button
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
