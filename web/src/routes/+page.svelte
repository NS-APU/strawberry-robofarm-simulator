<script lang="ts">
  import SimulatorLayout from '$lib/components/robot/SimulatorLayout.svelte';
  import RobotControlPanel from '$lib/components/robot/RobotControlPanel.svelte';
  import AnalysisPanel from '$lib/components/robot/AnalysisPanel.svelte';
  import HouseControlPanel from '$lib/components/robot/HouseControlPanel.svelte';
  import ResizableSplitPane from '$lib/components/robot/ResizableSplitPane.svelte';
</script>

<svelte:head>
  <title>ロボットシミュレーター - 農業情報基盤連携</title>
</svelte:head>

<SimulatorLayout>
  <div slot="main" class="h-full">
    <ResizableSplitPane>
      <div slot="left" class="flex h-full w-full flex-col overflow-hidden rounded-lg border border-white/20 bg-white/80 shadow-sm backdrop-blur-sm">
        <div class="flex-none p-4 pb-0">
          <h3 class="panel-header mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
            <span>🎮</span> ロボット制御
          </h3>
        </div>
        <div class="flex-1 overflow-hidden">
          <RobotControlPanel />
        </div>
      </div>

      <div slot="right" class="flex h-full w-full flex-col overflow-hidden rounded-lg border border-white/20 bg-white/80 shadow-sm backdrop-blur-sm">
        <div class="flex-none p-4 pb-0">
          <h3 class="panel-header mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
            <span>🏠</span> ハウス制御
          </h3>
        </div>
        <div class="flex-1 overflow-hidden">
          <HouseControlPanel />
        </div>
      </div>
    </ResizableSplitPane>
  </div>

  <div slot="right" class="h-full">
    <AnalysisPanel />
  </div>
</SimulatorLayout>
