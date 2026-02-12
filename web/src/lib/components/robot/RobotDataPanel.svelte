<script lang="ts">
  import { robotSettings, analysisResult, isAnalysisPanelOpen } from '../../stores/robotStore';
  import { submitAnalysisData } from '../../logic/analysisService';
  
  import StatusSection from './StatusSection.svelte';
  import OperationSection from './OperationSection.svelte';
  import DrivingSection from './DrivingSection.svelte';
  import AttitudeSection from './AttitudeSection.svelte';
  import HarvestSection from './HarvestSection.svelte';
  import HumanInteractionSection from './HumanInteractionSection.svelte';
  import FailureSection from './FailureSection.svelte';
  import SafetySection from './SafetySection.svelte';
  
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
    <!-- 走行情報 Section -->
    <DrivingSection />

    <!-- 姿勢情報 Section -->
    <AttitudeSection />

    <!-- 収穫/移動情報 Section -->
    <HarvestSection />

    <!-- 稼働情報 Section -->
    <OperationSection />
    
    <!-- ヒューマンインタラクション情報 Section -->
    <HumanInteractionSection />

    <!-- 故障情報 Section -->
    <FailureSection />

    <!-- 安全情報 Section -->
    <SafetySection />

    <!-- ステータス Section -->
    <StatusSection />
    
  </div>

  <div class="flex-none border-t bg-white/50 p-4 backdrop-blur-sm flex justify-center">
    <button
      type="button"
      class="btn btn-primary w-auto px-8 transform shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
      on:click={handleSend}>📤 情報を送信</button
    >
  </div>
</div>
