<script lang="ts">
  import { robotSettings, analysisResult, isAnalysisPanelOpen } from '../../stores/robotStore';
  import { submitAnalysisData } from '../../logic/analysisService';
  
  import StatusSettingsSection from './StatusSettingsSection.svelte';
  import OperationControlSection from './OperationControlSection.svelte';
  import DrivingControlSection from './DrivingControlSection.svelte';
  import AttitudeControlSection from './AttitudeControlSection.svelte';
  import HarvestControlSection from './HarvestControlSection.svelte';
  import DeviceControlSection from './DeviceControlSection.svelte';

  function handleSend() {
    isAnalysisPanelOpen.set(true);
    analysisResult.update((s) => ({ ...s, waiting: true }));

    setTimeout(() => {
      submitAnalysisData($robotSettings, undefined);
    }, 500);
  }
</script>

<div class="flex h-full flex-col">
  <div class="flex-1 overflow-y-auto p-4">
    <!-- Status Settings Section -->
    <StatusSettingsSection />

    <!-- 手動操作 Section -->
    <OperationControlSection />

    <!-- 走行制御 Section -->
    <DrivingControlSection />

    <!-- 姿勢制御 Section -->
    <AttitudeControlSection />

    <!-- 収穫/移動制御 Section -->
    <HarvestControlSection />

    <!-- デバイス制御 Section -->
    <DeviceControlSection />
  </div>

  <div class="flex-none border-t bg-white/50 p-4 backdrop-blur-sm flex justify-center">
    <button
      type="button"
      class="btn btn-primary w-auto px-8 transform shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
      on:click={handleSend}>📤 データを送信</button
    >
  </div>
</div>
