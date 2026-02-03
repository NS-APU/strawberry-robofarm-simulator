<script lang="ts">
  import { robotSettings } from '../../stores/robotStore';
</script>

<div class="control-section">
  <h3 class="control-section-header">デバイス制御</h3>
  
  <div class="mb-3">
    <label class="form-label" for="cameraClarity">カメラ鮮明度 (%)</label>
    <div class="flex items-center gap-2">
      <input 
        type="range" 
        class="form-range form-range-colored flex-1 rounded-full" 
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
          class="form-range form-range-colored flex-1 rounded-full" 
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


