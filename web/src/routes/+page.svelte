<script>
	import { signIn, signOut, getCurrentUser } from 'aws-amplify/auth';
	import { onMount } from 'svelte';

	let user = null;
	let isLoading = true;

	onMount(async () => {
		try {
			user = await getCurrentUser();
		} catch {
			user = null;
		}
		isLoading = false;
	});

	async function handleSignOut() {
		await signOut();
		user = null;
	}
</script>

<h1>Strawberry RoboFarm Simulator</h1>

{#if isLoading}
	<p>Loading...</p>
{:else if user}
	<p>Welcome, {user.username}!</p>
	<button on:click={handleSignOut}>Sign Out</button>
{:else}
	<p>Please sign in to continue.</p>
	<a href="/auth">Go to Sign In</a>
{/if}

<style>
	h1 {
		color: #ff3e00;
		font-size: 2.5rem;
		margin-bottom: 2rem;
	}
</style>
