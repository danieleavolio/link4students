<script lang="ts">
	import { goto } from '$app/navigation';

	import SezioneCdl from '$lib/components/dashboard/SezioneCdl.svelte';
	import { db } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';
	import { doc, getDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';

	onMount(async () => {
		let user;
		if ($authStore.isLoggedIn) {
			await getDoc(doc(db, 'users', $authStore.user.uid)).then((doc) => {
				user = doc;
			});
			if (!user.data().superuser) goto('/');
		} else {
			goto('/');
		}
	});
</script>

<SezioneCdl />


