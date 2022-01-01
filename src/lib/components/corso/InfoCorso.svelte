<script lang="ts">


	export let corso;
	
	let existLinkScheda;
</script>

<div class="container">
	<p>CFU: {corso.data().cfu}</p>
	<p>Codice del corso: {corso.data().codiceCorso}</p>
	<p>Anno del corso: {corso.data().anno}</p>
	<p>Professore: {corso.data().professore}</p>
	<div class="bottoni-scheda">
		<button class="{existLinkScheda}"></button>
	</div>
</div>

<style>
</style>
