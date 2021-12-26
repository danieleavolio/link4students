<script lang="ts">
	import { db } from '$lib/firebaseConfig';

	import { doc, onSnapshot } from 'firebase/firestore';

	export let corso;
	
	
</script>

<div class="container">
	<p>CFU: {corso.data().cfu}</p>
	<p>Codice del corso: {corso.data().cds}</p>
	<p>Anno del corso: {corso.data().anno}</p>
</div>

<style>
</style>
