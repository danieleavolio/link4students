<script lang="ts">
	import { goto } from '$app/navigation';
	import SezioneAnnunci from '$lib/components/dashboard/SezioneAnnunci.svelte';


	import { authStore } from '$lib/stores/authStore';

	import { onMount } from 'svelte';

	onMount(async () => {
		if ($authStore.isLoggedIn) {
			if (!$authStore.isAdmin) goto('/');
		} else {
			goto('/');
		}
	});
</script>

<SezioneAnnunci />

<style>
</style>
