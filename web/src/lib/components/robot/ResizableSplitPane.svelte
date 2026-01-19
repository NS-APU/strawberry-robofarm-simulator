<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  export let minLeftWidth = 20; // percentage
  export let maxLeftWidth = 80; // percentage
  export let initialLeftWidth = 50; // percentage

  let leftWidth = initialLeftWidth;
  let isDragging = false;
  let container: HTMLDivElement;

  function startDrag(e: MouseEvent | TouchEvent) {
    isDragging = true;
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  }

  function stopDrag() {
    if (isDragging) {
      isDragging = false;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
  }

  function onMove(e: MouseEvent | TouchEvent) {
    if (!isDragging || !container) return;

    let clientX;
    if (e instanceof MouseEvent) {
      clientX = e.clientX;
    } else {
      clientX = e.touches[0].clientX;
    }

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const widthPercentage = (x / rect.width) * 100;

    if (widthPercentage >= minLeftWidth && widthPercentage <= maxLeftWidth) {
      leftWidth = widthPercentage;
    }
  }
</script>

<svelte:window on:mouseup={stopDrag} on:touchend={stopDrag} on:mousemove={onMove} on:touchmove={onMove} />

<div class="flex h-full w-full overflow-hidden" bind:this={container}>
  <!-- Left Panel -->
  <div class="h-full overflow-hidden" style="width: {leftWidth}%;">
    <slot name="left" />
  </div>

  <!-- Resizer Handle -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="relative z-10 flex w-4 cursor-col-resize items-center justify-center bg-transparent hover:bg-blue-500/10 active:bg-blue-500/20"
    on:mousedown={startDrag}
    on:touchstart={startDrag}
  >
    <div class="h-8 w-1 rounded-full bg-gray-300"></div>
  </div>

  <!-- Right Panel -->
  <div class="h-full flex-1 overflow-hidden" style="width: {100 - leftWidth}%;">
    <slot name="right" />
  </div>
</div>

<style>
    /* Ensure the resizer prevents dragging issues */
    div {
        touch-action: none;
    }
</style>
