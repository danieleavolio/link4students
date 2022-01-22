<script>
	import { goto } from '$app/navigation';

	export let appunto;
	import { fly } from 'svelte/transition';


	let showName = false;



</script>

<div transition:fly={{ y: 100 }} class="appunto-lista">
	<div class="avatar">
		<p>{appunto.data().titoloAppunti[0].toUpperCase()}</p>
	</div>
	<div class="nome">
		<p class="titolo">{appunto.data().titoloAppunti}</p>
		<div class="info">
			<p class="autore" on:click={() => goto(`profilo/${appunto.data().idUtente}`)}>
				{appunto.data().nome}
			</p>
			<!-- svelte-ignore a11y-mouse-events-have-key-events -->
			{#if showName}
				<p transition:fly={{y:-100}} class="comparsa">{appunto.data().idCorso}</p>
			{/if}
			<p on:click={() => goto(`/corsodilaurea/corso/${appunto.data().corsoUid}`)} class="corso" on:mouseleave={() => showName = false} on:mouseenter={() => showName = true}>Corso</p>
		</div>
	</div>
	{#if appunto.data().revisionato}
		<a  class="download" href={appunto.data().urlAppunti.url} download={appunto.data().titoloAppunti} target="_blank"
			>Download ⬇️ </a
		>
	{:else}
		<button class="download" disabled>Non disponibile</button>
	{/if}
</div>

<style>
	.appunto-lista {
		width: 650px;
		height: 150px;
		border-radius: 0.5rem;
		padding: 1rem;
		display: grid;
		font-size: 1.4em;
		grid-template-columns: 1fr 2fr 1fr;
		place-items: center;
		box-shadow: var(--neumorphism);
		margin: 1rem;
	}

	.avatar {
		width: 100px;
		height: 100px;
		border-radius: 100%;
		display: grid;
		place-items: center;
		font-size: 1.4em;
		font-weight: 600;
		box-shadow: var(--innerNeu);
	}

	.autore {
		cursor: pointer;
		transition: var(--velocita);
		width: fit-content;
		padding: 0.1rem;
		border-radius: 0.2rem;
	}

	.autore:hover {
		background-color: var(--testo);
		color: var(--sfondo);
	}

	.titolo {
		font-size: 1.2em;
		font-weight: 900;
		text-transform: uppercase;
	}

	.info{
		display: flex;
		gap: 1rem;
		align-items: center;
	}
	a {
		text-decoration: none;
		padding: 0.3rem;
		font-size: 1rem;
		border-radius: 0.5rem;
		transition: all 0.5s ease;
		color: var(--testo);
		box-shadow: var(--neumorphism);
		transition: var(--velocita);
	}

	a:hover {
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
	}

	button {
		border-radius: 1rem;
	}

	button:disabled {
		opacity: 50%;
	}

	button:disabled:hover {
		transform: none;
		box-shadow: var(--neumorphism);
	}

	.comparsa{
		position: fixed;
		box-shadow: var(--innerNeu);
		padding: 0.3rem;
		border-radius: 0.5rem;
		margin-bottom: 5rem;
		margin-left: 3.5rem;
		cursor: pointer;
	}

	.corso{
		cursor: pointer;
		transition: var(--velocita);
		width: fit-content;
		padding: 0.1rem;
		border-radius: 0.2rem;
	}
	.corso:hover {
		background-color: var(--testo);
		color: var(--sfondo);
	}

	.download{
		font-size: 1em;

	}


</style>
