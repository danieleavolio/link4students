<script>

	export let appunto;
	import { fly } from 'svelte/transition';
</script>

<div transition:fly={{y:100}} class="appunto-lista">
	<div class="avatar">
		<p>{appunto.data().titoloAppunti[0]}</p>
	</div>
	<div class="nome">
		<p>{appunto.data().titoloAppunti}</p>
	</div>
	{#if appunto.data().revisionato}
		<a href={appunto.data().urlAppunti} download={appunto.data().titoloAppunti} target="_blank"
			>Download</a
		>
	{:else}
		<button disabled>Non disponibile</button>
	{/if}
</div>

<style>
	.appunto-lista {
		width: 300px;
		height: 100px;
		border-radius: 0.5rem;
		padding: 1rem;
		display: flex;
		gap: 1rem;
		justify-content: left;
		align-items: center;
		box-shadow: var(--neumorphism);
		margin: 1rem;
	}

	.avatar {
		width: 100px;
		height: 100px;
		border-radius: 100%;
		display: grid;
		place-items: center;
		font-size: 2rem;
		font-weight: 600;
        box-shadow: var(--innerNeu);
	}

	a {
		text-decoration: none;
		padding: 0.3rem;
		font-size: 1.2rem;
		border-radius: 0.5rem;
		transition: all 0.5s ease;
        color: var(--testo);
        box-shadow: var(--neumorphism);
        transition: var(--velocita)
	}

    a:hover{
        box-shadow: var(--innerNeu);
        transform: var(--premuto);
    
    }

	
</style>
