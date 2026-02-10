<script lang="ts">
  import { robotSettings } from '../../stores/robotStore';
</script>

<div class="control-section">
  <h3 class="control-section-header">安全情報</h3>
  <div class="space-y-3">
    <div>
      <label class="form-label" for="riskDetectionCount">安全性リスク検知回数 (回)</label>
      <div class="flex items-center gap-2">
        <input
          type="range"
          class="form-range form-range-colored flex-1 rounded-full"
          id="riskDetectionCountRange"
          min="0"
          max="100"
          step="1"
          bind:value={$robotSettings.riskDetectionCount}
          style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {($robotSettings.riskDetectionCount * 100) / 100}%, #e5e7eb {($robotSettings.riskDetectionCount * 100) / 100}%, #e5e7eb 100%); background-size: 100% 100%;"
        />
        <input type="number" class="form-control w-28 text-right" id="riskDetectionCount" min="0" max="100" bind:value={$robotSettings.riskDetectionCount} />
        <span class="text-sm text-gray-500 w-8">回</span>
      </div>
    </div>
    <div>
      <label class="form-label" for="safetyActivationCount">安全装置作動回数 (回)</label>
      <div class="flex items-center gap-2">
        <input
          type="range"
          class="form-range form-range-colored flex-1 rounded-full"
          id="safetyActivationCountRange"
          min="0"
          max="100"
          step="1"
          bind:value={$robotSettings.safetyActivationCount}
          style="--range-color: #3b82f6; background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) {($robotSettings.safetyActivationCount * 100) / 100}%, #e5e7eb {($robotSettings.safetyActivationCount * 100) / 100}%, #e5e7eb 100%); background-size: 100% 100%;"
        />
        <input type="number" class="form-control w-28 text-right" id="safetyActivationCount" min="0" max="100" bind:value={$robotSettings.safetyActivationCount} />
        <span class="text-sm text-gray-500 w-8">回</span>
      </div>
    </div>
  </div>
</div>
