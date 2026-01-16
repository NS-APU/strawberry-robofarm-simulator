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

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}
</style>
