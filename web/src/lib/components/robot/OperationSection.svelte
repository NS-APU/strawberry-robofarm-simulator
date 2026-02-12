<script lang="ts">
  import { robotSettings } from '../../stores/robotStore';
  
  function handleTotalOpHoursInput(e: Event) {
    const hours = parseInt((e.target as HTMLInputElement).value) || 0;
    const minutes = $robotSettings.totalOperatingDuration % 60;
    $robotSettings.totalOperatingDuration = hours * 60 + minutes;
  }

  function handleTotalOpMinutesInput(e: Event) {
    const minutes = parseInt((e.target as HTMLInputElement).value) || 0;
    const hours = Math.floor($robotSettings.totalOperatingDuration / 60);
    $robotSettings.totalOperatingDuration = hours * 60 + minutes;
  }

  function handleOpHoursInput(e: Event) {
    const hours = parseInt((e.target as HTMLInputElement).value) || 0;
    const minutes = $robotSettings.harvestOperatingDuration % 60;
    $robotSettings.harvestOperatingDuration = hours * 60 + minutes;
  }

  function handleOpMinutesInput(e: Event) {
    const minutes = parseInt((e.target as HTMLInputElement).value) || 0;
    const hours = Math.floor($robotSettings.harvestOperatingDuration / 60);
    $robotSettings.harvestOperatingDuration = hours * 60 + minutes;
  }

  function handleStopHoursInput(e: Event) {
    const hours = parseInt((e.target as HTMLInputElement).value) || 0;
    const minutes = $robotSettings.travelStopDuration % 60;
    $robotSettings.travelStopDuration = hours * 60 + minutes;
  }

  function handleStopMinutesInput(e: Event) {
    const minutes = parseInt((e.target as HTMLInputElement).value) || 0;
    const hours = Math.floor($robotSettings.travelStopDuration / 60);
    $robotSettings.travelStopDuration = hours * 60 + minutes;
  }

  function handleTotalStopHoursInput(e: Event) {
    const hours = parseInt((e.target as HTMLInputElement).value) || 0;
    const minutes = $robotSettings.totalStopDuration % 60;
    $robotSettings.totalStopDuration = hours * 60 + minutes;
  }

  function handleTotalStopMinutesInput(e: Event) {
    const minutes = parseInt((e.target as HTMLInputElement).value) || 0;
    const hours = Math.floor($robotSettings.totalStopDuration / 60);
    $robotSettings.totalStopDuration = hours * 60 + minutes;
  }

  // 制約事項（順守すべき優先順位に注意）
  $: {
    // 1. 収穫稼働時間は稼働時間より長い時間を設定できない
    if ($robotSettings.harvestOperatingDuration > $robotSettings.totalOperatingDuration) {
      $robotSettings.harvestOperatingDuration = $robotSettings.totalOperatingDuration;
    }
    
    // 2. 走行停止時間は停止時間よりも長い時間を設定できない
    if ($robotSettings.travelStopDuration > $robotSettings.totalStopDuration) {
      $robotSettings.travelStopDuration = $robotSettings.totalStopDuration;
    }
    
    // 3. 走行停止時間は収穫稼働時間よりも長い時間を設定できない
    if ($robotSettings.travelStopDuration > $robotSettings.harvestOperatingDuration) {
      $robotSettings.travelStopDuration = $robotSettings.harvestOperatingDuration;
    }
  }
</script>

<div class="control-section">
  <h3 class="mb-3 border-b border-gray-200 pb-2 font-bold text-gray-700">稼働情報</h3>
  <div class="space-y-4">
    <!-- 稼働時間 -->
    <div>
      <label class="form-label" for="totalOperationDurationRange">稼働時間</label>
      <div class="flex items-center gap-4">
        <input 
          type="range" 
          id="totalOperationDurationRange"
          class="form-range form-range-colored flex-grow rounded-full"
          min="0" 
          max="1440" 
          step="1"
          bind:value={$robotSettings.totalOperatingDuration}
          style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$robotSettings.totalOperatingDuration * 100 / 1440}%, #e5e7eb {$robotSettings.totalOperatingDuration * 100 / 1440}%, #e5e7eb 100%); background-size: 100% 100%;"
        />
        <div class="flex items-center gap-1 flex-shrink-0">
          <input 
            type="number" 
            class="form-control w-20 text-right" 
            min="0"
            value={Math.floor($robotSettings.totalOperatingDuration / 60)}
            on:input={handleTotalOpHoursInput}
          />
          <span class="text-sm text-gray-500 whitespace-nowrap">時間</span>
          <input 
            type="number" 
            class="form-control w-20 text-right" 
            min="0" 
            max="59"
            value={$robotSettings.totalOperatingDuration % 60}
            on:input={handleTotalOpMinutesInput}
          />
          <span class="text-sm text-gray-500 whitespace-nowrap">分</span>
        </div>
      </div>
    </div>

    <!-- 停止時間 -->
    <div>
      <label class="form-label" for="totalStopDurationRange">停止時間</label>
      <div class="flex items-center gap-4">
        <input 
          type="range" 
          id="totalStopDurationRange"
          class="form-range form-range-colored flex-grow rounded-full"
          min="0" 
          max="1440" 
          step="1"
          bind:value={$robotSettings.totalStopDuration}
          style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$robotSettings.totalStopDuration * 100 / 1440}%, #e5e7eb {$robotSettings.totalStopDuration * 100 / 1440}%, #e5e7eb 100%); background-size: 100% 100%;"
        />
        <div class="flex items-center gap-1 flex-shrink-0">
          <input 
            type="number" 
            class="form-control w-20 text-right" 
            min="0"
            value={Math.floor($robotSettings.totalStopDuration / 60)}
            on:input={handleTotalStopHoursInput}
          />
          <span class="text-sm text-gray-500 whitespace-nowrap">時間</span>
          <input 
            type="number" 
            class="form-control w-20 text-right" 
            min="0" 
            max="59"
            value={$robotSettings.totalStopDuration % 60}
            on:input={handleTotalStopMinutesInput}
          />
          <span class="text-sm text-gray-500 whitespace-nowrap">分</span>
        </div>
      </div>
    </div>

    <!-- 収穫稼働時間 -->
    <div>
      <label class="form-label" for="operationDurationRange">収穫稼働時間</label>
      <div class="flex items-center gap-4">
        <input 
          type="range" 
          id="operationDurationRange"
          class="form-range form-range-colored flex-grow rounded-full"
          min="0" 
          max={$robotSettings.totalOperatingDuration} 
          step="1"
          bind:value={$robotSettings.harvestOperatingDuration}
          style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$robotSettings.harvestOperatingDuration * 100 / ($robotSettings.totalOperatingDuration || 1)}%, #e5e7eb {$robotSettings.harvestOperatingDuration * 100 / ($robotSettings.totalOperatingDuration || 1)}%, #e5e7eb 100%); background-size: 100% 100%;"
        />
        <div class="flex items-center gap-1 flex-shrink-0">
          <input 
            type="number" 
            class="form-control w-20 text-right" 
            min="0"
            value={Math.floor($robotSettings.harvestOperatingDuration / 60)}
            on:input={handleOpHoursInput}
          />
          <span class="text-sm text-gray-500 whitespace-nowrap">時間</span>
          <input 
            type="number" 
            class="form-control w-20 text-right" 
            min="0" 
            max="59"
            value={$robotSettings.harvestOperatingDuration % 60}
            on:input={handleOpMinutesInput}
          />
          <span class="text-sm text-gray-500 whitespace-nowrap">分</span>
        </div>
      </div>
    </div>

    <!-- 走行停止時間 -->
    <div>
      <label class="form-label" for="stopDurationRange">走行停止時間</label>
      <div class="flex items-center gap-4">
        <input 
          type="range" 
          id="stopDurationRange"
          class="form-range form-range-colored flex-grow rounded-full"
          min="0" 
          max={Math.min($robotSettings.totalStopDuration, $robotSettings.harvestOperatingDuration)} 
          step="1"
          bind:value={$robotSettings.travelStopDuration}
          style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$robotSettings.travelStopDuration * 100 / (Math.min($robotSettings.totalStopDuration, $robotSettings.harvestOperatingDuration) || 1)}%, #e5e7eb {$robotSettings.travelStopDuration * 100 / (Math.min($robotSettings.totalStopDuration, $robotSettings.harvestOperatingDuration) || 1)}%, #e5e7eb 100%); background-size: 100% 100%;"
        />
        <div class="flex items-center gap-1 flex-shrink-0">
          <input 
            type="number" 
            class="form-control w-20 text-right" 
            min="0"
            value={Math.floor($robotSettings.travelStopDuration / 60)}
            on:input={handleStopHoursInput}
          />
          <span class="text-sm text-gray-500 whitespace-nowrap">時間</span>
          <input 
            type="number" 
            class="form-control w-20 text-right" 
            min="0" 
            max={59}
            value={$robotSettings.travelStopDuration % 60}
            on:input={handleStopMinutesInput}
          />
          <span class="text-sm text-gray-500 whitespace-nowrap">分</span>
        </div>
      </div>
    </div>

  </div>
</div>
