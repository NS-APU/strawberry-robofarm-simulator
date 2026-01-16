<script lang="ts">
  import { robotSettings, analysisResult } from '../../stores/robotStore';
  import Tilt3D from './Tilt3D.svelte';

  function handleSend() {
    // Mock Sending Data
    analysisResult.update(s => ({ ...s, waiting: true, data: null }));

    setTimeout(() => {
      analysisResult.update(s => ({
        waiting: false,
        data: $robotSettings,
        status: $robotSettings.anomalyCode ? 'warning' : 'normal',
        insights: $robotSettings.anomalyCode 
          ? ['異常データ検出: ' + $robotSettings.anomalyCode] 
          : ['正常稼働中', 'バッテリー効率良好'],
        recommendations: $robotSettings.anomalyCode
          ? ['オペレーター確認推奨', 'メンテナンスログ記録']
          : ['特になし']
      }));
    }, 1000);
  }
</script>

  <div class="mb-3">
    <label class="form-label" for="speed">走行速度 (km/h)</label>
    <input type="number" class="form-control" id="speed" step="0.1" bind:value={$robotSettings.speed} required>
  </div>

  <div class="mb-3">
    <label class="form-label" for="tilt3D">傾き調整 (3Dビュー)</label>
    <Tilt3D />
    <small class="form-text text-muted">ドラッグして傾きを調整できます</small>
  </div>

  <div class="row">
    <div class="col-6 mb-3">
      <label class="form-label" for="pitch">Pitch (度)</label>
      <input type="number" class="form-control" id="pitch" step="0.1" min="-90" max="90" bind:value={$robotSettings.pitch} readonly>
    </div>
    <div class="col-6 mb-3">
      <label class="form-label" for="roll">Roll (度)</label>
      <input type="number" class="form-control" id="roll" step="0.1" min="-90" max="90" bind:value={$robotSettings.roll} readonly>
    </div>
  </div>

  <div class="row">
    <div class="col-6 mb-3">
      <label class="form-label" for="startTime">走行開始時刻</label>
      <input type="datetime-local" class="form-control" id="startTime" bind:value={$robotSettings.startTime} required>
    </div>
    <div class="col-6 mb-3">
      <label class="form-label" for="stopTime">走行停止時刻</label>
      <input type="datetime-local" class="form-control" id="stopTime" bind:value={$robotSettings.stopTime} required>
    </div>
  </div>

  <div class="mb-3">
    <label class="form-label" for="route">走行経路 (JSON形式)</label>
    <textarea class="form-control" id="route" rows="6" bind:value={$robotSettings.route} required></textarea>
     <small class="form-text text-muted">JSON配列形式で入力</small>
  </div>

  <div class="mb-3">
    <label class="form-label" for="anomalyCode">異常検知コード (オプション)</label>
    <select class="form-select" id="anomalyCode" bind:value={$robotSettings.anomalyCode}>
      <option value="">正常</option>
      <option value="OBS001">障害物検知</option>
      <option value="HW001">ハードウェア異常</option>
      <option value="DEV001">経路逸脱</option>
    </select>
  </div>

  {#if $robotSettings.anomalyCode}
    <div class="mb-3">
        <label class="form-label" for="anomalyDetails">異常詳細情報</label>
        <textarea class="form-control" id="anomalyDetails" rows="3" bind:value={$robotSettings.anomalyDetails} placeholder={`{"type": "obstacle", "description": "障害物を検知しました"}`}></textarea>
    </div>
  {/if}

  <button type="button" class="btn btn-primary w-100" on:click={handleSend}>📤 分析サービスへ送信</button>

<style>
  /* Global styles from styles.css are used */
</style>
