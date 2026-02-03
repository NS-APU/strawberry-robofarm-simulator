<script lang="ts">
  import { houseSettings } from '../../stores/houseStore';
  import { analysisResult, isAnalysisPanelOpen } from '../../stores/robotStore';

  import { submitAnalysisData } from '../../logic/analysisService';
  import EnvironmentControlSection from './EnvironmentControlSection.svelte';

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
    <EnvironmentControlSection />
  </div>

  <div class="flex-none border-t bg-white/50 p-4 backdrop-blur-sm flex justify-center">
    <button
      type="button"
      class="btn btn-primary w-auto px-8 transform shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
      on:click={handleSend}>📤 データを送信</button
    >
  </div>
</div>
