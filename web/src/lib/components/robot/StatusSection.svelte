<script lang="ts">
  import { robotSettings, STATUS_CODES } from '../../stores/robotStore';
</script>

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
