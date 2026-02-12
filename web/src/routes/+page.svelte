<script lang="ts">
  import SimulatorLayout from '$lib/components/SimulatorLayout.svelte';
  import RobotDataPanel from '$lib/components/robot/RobotDataPanel.svelte';
  import AnalysisPanel from '$lib/components/analysis/AnalysisPanel.svelte';
  import HouseDataPanel from '$lib/components/house/HouseDataPanel.svelte';
  import ResizableSplitContainer from '$lib/components/ResizableSplitContainer.svelte';
</script>

<svelte:head>
  <title>ロボットシミュレーター - 農業情報基盤連携</title>
</svelte:head>

<SimulatorLayout>
  <div slot="main" class="h-full">
    <ResizableSplitContainer>
      <div slot="left" class="flex h-full w-full flex-col overflow-hidden rounded-lg border border-white/20 bg-white/80 shadow-sm backdrop-blur-sm">
        <div class="flex-none p-4 pb-0">
          <h3 class="panel-header mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
            <span>🎮</span> ロボットデータ
          </h3>
        </div>
        <div class="flex-1 overflow-hidden">
          <RobotDataPanel />
        </div>
      </div>

      <div slot="right" class="flex h-full w-full flex-col overflow-hidden rounded-lg border border-white/20 bg-white/80 shadow-sm backdrop-blur-sm">
        <div class="flex-none p-4 pb-0">
          <h3 class="panel-header mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
            <span>🏠</span> ハウスデータ
          </h3>
        </div>
        <div class="flex-1 overflow-hidden">
          <HouseDataPanel />
        </div>
      </div>
    </ResizableSplitContainer>
  </div>

  <div slot="right" class="h-full">
    <AnalysisPanel />
  </div>
</SimulatorLayout>
