<script lang="ts">
  import SimulatorLayout from '$lib/components/robot/SimulatorLayout.svelte';
  import RobotControlPanel from '$lib/components/robot/RobotControlPanel.svelte';
  import AnalysisPanel from '$lib/components/robot/AnalysisPanel.svelte';
</script>

<svelte:head>
  <title>ロボットシミュレーター - 農業情報基盤連携</title>
</svelte:head>

<SimulatorLayout>
  <div slot="left" class="h-full">
    <RobotControlPanel />
  </div>
  <div slot="right" class="h-full">
    <AnalysisPanel />
  </div>
</SimulatorLayout>
