<script lang="ts">
  import { isAnalysisPanelOpen } from '../stores/robotStore';
  import { fly, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  function closePanel() {
    isAnalysisPanelOpen.set(false);
  }

  function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') closePanel();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<nav class="sticky top-0 z-50 bg-slate-900 p-4 text-white shadow-lg">
  <div class="flex items-center justify-between px-0">
    <span class="flex items-center gap-2 text-xl font-bold tracking-wide">
      <span class="text-2xl">🤖</span>
      <span>ロボットシミュレーター - 農業情報基盤連携</span>
    </span>
    
    <button
      class="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-white/20 hover:shadow-md active:scale-95 border border-white/20"
      on:click={() => isAnalysisPanelOpen.update(v => !v)}
    >
      <span>🔬</span>
      <span>分析サービス</span>
    </button>
  </div>
</nav>

<!-- Main Container -->
<div class="relative mt-4 h-[calc(100vh-80px)] w-full overflow-hidden px-4 pb-4">
    <!-- Main Content Area (Layout agnostic) -->
    <div class="h-full w-full">
         <slot name="main"></slot>
    </div>

    <!-- Backdrop -->
    {#if $isAnalysisPanelOpen}
    <div
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
      transition:fade={{ duration: 200 }}
      on:click={closePanel}
      role="button"
      tabindex="0"
      on:keydown={(e) => e.key === 'Enter' && closePanel()}
    ></div>
    {/if}

    <!-- Analysis Panel (Side Menu) -->
    {#if $isAnalysisPanelOpen}
    <div
      class="fixed right-0 top-0 z-50 h-full w-[500px] shadow-2xl"
      transition:fly={{ x: 500, duration: 300, easing: cubicOut }}
    >
      <div class="h-full border-l border-white/20 bg-white/95 backdrop-blur-md">
        <div class="flex h-full flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-gray-200 p-4 bg-slate-50">
                 <h3 class="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <span>🔬</span> 分析サービス
                </h3>
                <button
                    class="rounded-full p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none"
                    on:click={closePanel}
                    aria-label="Close analysis panel"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-4">
                <slot name="right"></slot>
            </div>
        </div>
      </div>
    </div>
    {/if}
</div>

<style>
    /* Custom scrollbar if needed, but Tailwind usually handles it well */
</style>
