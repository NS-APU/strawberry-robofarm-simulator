<script lang="ts">
  import { robotSettings } from '../../stores/robotStore';

  function handleOpHoursInput(e: Event) {
    const hours = parseInt((e.target as HTMLInputElement).value) || 0;
    const minutes = $robotSettings.operationTime % 60;
    $robotSettings.operationTime = hours * 60 + minutes;
  }

  function handleOpMinutesInput(e: Event) {
    const minutes = parseInt((e.target as HTMLInputElement).value) || 0;
    const hours = Math.floor($robotSettings.operationTime / 60);
    $robotSettings.operationTime = hours * 60 + minutes;
  }

  // Ensure errors do not exceed steps
  $: if ($robotSettings.operationErrors > $robotSettings.operationSteps) {
    $robotSettings.operationErrors = $robotSettings.operationSteps;
  }
</script>

<div class="control-section">
  <h3 class="control-section-header">操作情報</h3>
  <div class="space-y-3">
    <div>
      <label class="form-label" for="operationTimeRange">操作時間（平均）</label>
      <div class="flex items-center gap-4">
        <input 
          type="range" 
          id="operationTimeRange"
          class="form-range form-range-colored flex-grow rounded-full"
          min="0" 
          max="360" 
          step="1"
          bind:value={$robotSettings.operationTime}
          style="--range-color: {$robotSettings.operationTime >= 30 ? '#ef4444' : '#3b82f6'}; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$robotSettings.operationTime * 100 / 360}%, #e5e7eb {$robotSettings.operationTime * 100 / 360}%, #e5e7eb 100%); background-size: 100% 100%;"
        />
        <div class="flex items-center gap-1 flex-shrink-0">
          <input 
            type="number" 
            class="form-control w-20 text-right" 
            id="operationTimeHours"
            min="0"
            value={Math.floor($robotSettings.operationTime / 60)}
            on:input={handleOpHoursInput}
          />
          <span class="text-sm text-gray-500 whitespace-nowrap">時間</span>
          <input 
            type="number" 
            class="form-control w-20 text-right" 
            id="operationTimeMinutes"
            min="0" 
            max="59"
            value={$robotSettings.operationTime % 60}
            on:input={handleOpMinutesInput}
          />
          <span class="text-sm text-gray-500 whitespace-nowrap">分</span>
        </div>
      </div>
    </div>

    <div>
      <label class="form-label" for="operationSteps">操作ステップ数（平均）</label>
      <div class="flex items-center gap-2">
        <input type="range" class="form-range form-range-colored flex-1 rounded-full" id="operationStepsRange" min="0" max="100" step="1" bind:value={$robotSettings.operationSteps} style="--range-color: {$robotSettings.operationSteps >= 5 ? '#ef4444' : '#3b82f6'}; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$robotSettings.operationSteps}%, #e5e7eb {$robotSettings.operationSteps}%, #e5e7eb 100%); background-size: 100% 100%;" />
        <input type="number" class="form-control w-28 text-right" id="operationSteps" min="0" max="100" bind:value={$robotSettings.operationSteps} />
        <span class="text-sm text-gray-500 w-8">回</span>
      </div>
    </div>
    <div>
      <label class="form-label" for="operationErrors">操作エラー数（平均）</label>
      <div class="flex items-center gap-2">
        <input 
          type="range" 
          class="form-range form-range-colored flex-1 rounded-full" 
          id="operationErrorsRange" 
          min="0" 
          max={$robotSettings.operationSteps} 
          step="1" 
          bind:value={$robotSettings.operationErrors} 
          style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {$robotSettings.operationSteps > 0 ? ($robotSettings.operationErrors * 100 / $robotSettings.operationSteps) : 0}%, #e5e7eb {$robotSettings.operationSteps > 0 ? ($robotSettings.operationErrors * 100 / $robotSettings.operationSteps) : 0}%, #e5e7eb 100%); background-size: 100% 100%;" 
        />
        <input 
          type="number" 
          class="form-control w-28 text-right" 
          id="operationErrors" 
          min="0" 
          max={$robotSettings.operationSteps} 
          bind:value={$robotSettings.operationErrors} 
        />
        <span class="text-sm text-gray-500 w-8">回</span>
      </div>
    </div>
  </div>
</div>
