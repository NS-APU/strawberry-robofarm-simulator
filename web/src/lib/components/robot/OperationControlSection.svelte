<script lang="ts">
  import { robotSettings } from '../../stores/robotStore';

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
