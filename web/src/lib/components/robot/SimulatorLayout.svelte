<script lang="ts">
  let container: HTMLDivElement;
  let leftPanel: HTMLDivElement;
  let resizer: HTMLDivElement;
  let rightPanel: HTMLDivElement;

  let isResizing = false;
  let startX = 0;
  let startLeftWidth = 0;

  function startResize(e: MouseEvent) {
    isResizing = true;
    startX = e.clientX;
    startLeftWidth = leftPanel.getBoundingClientRect().width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }

  function resize(e: MouseEvent) {
    if (!isResizing) return;
    const containerWidth = container.getBoundingClientRect().width;
    const resizerWidth = 8;
    const deltaX = e.clientX - startX;
    let newLeftWidth = startLeftWidth + deltaX;

    // Min width constraints
    if (newLeftWidth < 300) newLeftWidth = 300;
    if (newLeftWidth > containerWidth - 300 - resizerWidth) newLeftWidth = containerWidth - 300 - resizerWidth;

    const leftPercent = (newLeftWidth / containerWidth) * 100;

    leftPanel.style.flex = `0 0 ${leftPercent}%`;
    rightPanel.style.flex = `1 1 0%`; // Right panel takes remaining space
  }

  function stopResize() {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

    e.preventDefault(); // Prevent scrolling if necessary

    const containerWidth = container.getBoundingClientRect().width;
    const currentLeftWidth = leftPanel.getBoundingClientRect().width;
    const resizerWidth = 8;
    const step = 20; // Pixel step for keyboard interaction

    let newLeftWidth = currentLeftWidth;

    if (e.key === 'ArrowLeft') {
      newLeftWidth -= step;
    } else {
      newLeftWidth += step;
    }

    // Min width constraints (same as mouse resize)
    if (newLeftWidth < 300) newLeftWidth = 300;
    if (newLeftWidth > containerWidth - 300 - resizerWidth) newLeftWidth = containerWidth - 300 - resizerWidth;

    const leftPercent = (newLeftWidth / containerWidth) * 100;

    leftPanel.style.flex = `0 0 ${leftPercent}%`;
    rightPanel.style.flex = `1 1 0%`;
  }
</script>

<svelte:window on:mousemove={resize} on:mouseup={stopResize} />

<nav class="sticky top-0 z-50 bg-slate-900 p-4 text-white shadow-lg">
  <div class="flex items-center px-0">
    <span class="flex items-center gap-2 text-xl font-bold tracking-wide">
      <span class="text-2xl">🤖</span>
      <span>ロボットシミュレーター - 農業情報基盤連携</span>
    </span>
  </div>
</nav>

<div class="mt-4 h-[calc(100vh-80px)] w-full overflow-hidden px-4 pb-4">
  <div class="flex h-full flex-row" id="mainContainer" bind:this={container}>
    <!-- ロボット制御パネル -->
    <div class="resizable-panel" id="leftPanel" bind:this={leftPanel} style="flex: 0 0 50%;">
      <h3 class="panel-header flex items-center gap-2">
        <span>🎮</span> ロボット制御パネル
      </h3>
      <div class="panel-content border-white/20 bg-white/80 backdrop-blur-sm">
        <slot name="left"></slot>
      </div>
    </div>

    <!-- リサイザー -->
    <!-- リサイザー -->
    <div
      class="resizer"
      bind:this={resizer}
      on:mousedown={startResize}
      on:keydown={handleKeyDown}
      role="button"
      tabindex="0"
      aria-label="Resize panels (vertical)"
      id="resizer"
    ></div>

    <!-- 分析サービスパネル -->
    <div class="resizable-panel" id="rightPanel" bind:this={rightPanel} style="flex: 1 1 0%;">
      <h3 class="panel-header flex items-center gap-2">
        <span>🔬</span> 分析サービスパネル
      </h3>
      <div class="panel-content border-white/20 bg-white/80 backdrop-blur-sm">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</div>

<style>
  /* Custom resize styles handled in app.css via Tailwind layers */
</style>
