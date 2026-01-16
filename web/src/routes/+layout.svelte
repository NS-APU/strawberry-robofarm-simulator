<script>
  import { onMount } from 'svelte';
  import { configureAmplify } from '$lib/amplify';
  import '../app.css';

  onMount(() => {
    configureAmplify();
  });
</script>

<main>
  <slot />
</main>
