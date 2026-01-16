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
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
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
          document.body.style.cursor = "";
          document.body.style.userSelect = "";
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

<nav class="navbar navbar-dark bg-dark">
    <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">🤖 ロボットシミュレーター - 農業情報基盤連携</span>
    </div>
</nav>

<div class="container-fluid mt-3">
    <div class="row" id="mainContainer" bind:this={container}>
        <!-- ロボット制御パネル -->
        <div class="resizable-panel" id="leftPanel" bind:this={leftPanel}>
            <h3 class="panel-header">🎮 ロボット制御パネル</h3>
            <div class="panel-content">
                <slot name="left"></slot>
            </div>
        </div>

        <!-- リサイザー -->
        <div class="resizer" 
             bind:this={resizer} 
             on:mousedown={startResize}
             on:keydown={handleKeyDown}
             role="separator" 
             tabindex="0"
             aria-label="Resize panels"
             aria-orientation="vertical"
             id="resizer"
        ></div>

        <!-- 分析サービスパネル -->
        <div class="resizable-panel" id="rightPanel" bind:this={rightPanel}>
            <h3 class="panel-header">🔬 分析サービスパネル</h3>
            <div class="panel-content">
                <slot name="right"></slot>
            </div>
        </div>
    </div>
</div>

<style>
  /* Styles are now handled by web/static/css/styles.css and Bootstrap */
  /* Keeping minimal styles if necessary, but most should be imported */
</style>
