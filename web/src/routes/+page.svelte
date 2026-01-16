<script lang="ts">
  import SimulatorLayout from '$lib/components/robot/SimulatorLayout.svelte';
  import RobotControlPanel from '$lib/components/robot/RobotControlPanel.svelte';
  import AnalysisPanel from '$lib/components/robot/AnalysisPanel.svelte';
</script>

<svelte:head>
  <title>ロボットシミュレーター - 農業情報基盤連携</title>
</svelte:head>

<SimulatorLayout>
  <div slot="left" style="height: 100%;">
      <RobotControlPanel />
  </div>
  <div slot="right" style="height: 100%;">
      <AnalysisPanel />
  </div>
</SimulatorLayout>

<style>
  :global(body) {
      margin: 0;
      padding: 0;
      overflow: hidden; /* Prevent body scroll used by layout resizing */
  }
</style>
