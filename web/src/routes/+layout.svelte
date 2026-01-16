<script>
	import { onMount } from 'svelte';
	import { configureAmplify } from '$lib/amplify';

	onMount(() => {
		configureAmplify();
	});
</script>

<main>
	<slot />
</main>
