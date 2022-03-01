<script context="module">
	export function load({ error, status }) {
		return {
			props: {
				message: error.name,
				status
			}
		};
	}
</script>

<script>
	import GenericError from '$lib/components/errors/GenericError.svelte';
	import NotFound from '$lib/components/errors/NotFound.svelte';

	export let message;
	export let status;
    
</script>

<h1>Qualcosa è andato storto..</h1>
{#if status == 404}
	<NotFound {message}/>
{:else}
	<GenericError {message}/>
{/if}

<style>
	h1 {
		font-size: 3em;
		text-align: center;
	}
</style>
