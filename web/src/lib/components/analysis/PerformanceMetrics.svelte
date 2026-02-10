<script lang="ts">
  import type { AnalysisMetrics } from '../../stores/robotStore';
  import HarvestAccuracy from './metrics/HarvestAccuracy.svelte';
  import HarvestSpeed from './metrics/HarvestSpeed.svelte';
  import Adaptability from './metrics/Adaptability.svelte';
  import Operability from './metrics/Operability.svelte';
  import Maintainability from './metrics/Maintainability.svelte';
  import CostEfficiency from './metrics/CostEfficiency.svelte';
  import Safety from './metrics/Safety.svelte';
  import DataUtilization from './metrics/DataUtilization.svelte';
  import Durability from './metrics/Durability.svelte';
  import Ethics from './metrics/Ethics.svelte';
  
  export let metrics: AnalysisMetrics | undefined;
</script>

{#if metrics}
  <div class="mb-4">
    <h5 class="mb-2 flex items-center gap-2 font-bold text-gray-700">
      <span>📊</span> 性能評価指標
    </h5>
    <div class="grid grid-cols-2 gap-4">
      <HarvestAccuracy metric={metrics.harvestAccuracy} />
      <HarvestSpeed metric={metrics.harvestSpeed} />
      <Adaptability metric={metrics.adaptability} />
      <Operability metric={metrics.operability} />
      <Maintainability metric={metrics.maintainability} />
      <CostEfficiency metric={metrics.costEfficiency} />
      <Safety metric={metrics.safety} />
      <DataUtilization metric={metrics.dataUtilization} />
      <Durability metric={metrics.durability} />
      <Ethics metric={metrics.ethics} />
    </div>
  </div>
{/if}
