<script lang="ts">
	import { goto } from '$app/navigation';

	import SezioneCorso from '$lib/components/dashboard/SezioneCorso.svelte';
	import { db } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';
	import { doc, getDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';

	onMount(async () => {
		if ($authStore.isLoggedIn) {
			if (!$authStore.isAdmin) goto('/');
		} else {
			goto('/');
		}
	});
</script>

<SezioneCorso />

<style>
</style>
