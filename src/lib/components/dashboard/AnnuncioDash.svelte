<script lang="ts">
	import { deleteDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';

	export let annuncio;
	export let modificando;
	import { fade } from 'svelte/transition';

	let showMore = false;
	let mostrando = false;
	let deleteOption = false;

	let contenutoTroncato =
		annuncio.data().contenuto.length >= 200
			? annuncio.data().contenuto.substring(0, 200)
			: annuncio.data().contenuto;
	$: if (annuncio.data().contenuto.length >= 200) {
		showMore = true;
	} else {
		showMore = false;
	}

	const mostraAltro = () => {
		contenutoTroncato = annuncio.data().contenuto;
		mostrando = true;
	};

	const mostraMeno = () => {
		contenutoTroncato = annuncio.data().contenuto.substring(0, 200);
		mostrando = false;
	};

	const showDelete = () => {
		deleteOption = true;
	};

	const hideDelete = () => {
		deleteOption = false;
	};

	const deleteAnnuncio = () => {
		deleteDoc(annuncio.ref);
	};

	let dataPulita;
	$: if (annuncio.data().data != undefined)
		dataPulita =
			annuncio.data().data.toDate().getDate() +
			'/' +
			(annuncio.data().data.toDate().getMonth() + 1) +
			'/' +
			annuncio.data().data.toDate().getFullYear();
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
	class="annuncio {mostrando ? 'mostrando' : ''}"
	on:mouseover={showDelete}
	on:mouseleave={hideDelete}
>
	{#if modificando && deleteOption}
		<div transition:fade={{ duration: 100 }} class="shadow">
			<span on:click={deleteAnnuncio} class="material-icons deleting"> delete </span>
		</div>
	{/if}
	<div class="cover">
		<img class={annuncio.data().tipo} src="/images/{annuncio.data().tipo}.png" alt="" />
	</div>
	<div class="content">
		<p class="data">{dataPulita}</p>
		<p class="titolo">{annuncio.data().titolo}</p>
		<p class="contenuto">
			{contenutoTroncato}
		</p>
	</div>
	{#if showMore && annuncio.data().contenuto.length >= 300 && !mostrando}
		<button class="show-more" on:click={mostraAltro}> Mostra altro..</button>
	{/if}
	{#if mostrando}
		<button class="show-less" on:click={mostraMeno}> Comprimi..</button>
	{/if}
</div>

<style>
	.titolo {
		font-size: 1.4rem;
		margin: 0.4rem 0;
	}

	.shadow {
		position: absolute;
		width: 100%;
		height: 430px;
		background-color: rgba(22, 22, 22, 0.87);
		position: absolute;
		z-index: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.annuncio {
		position: relative;
		display: grid;
		grid-template-rows: auto 1fr;
		width: 400px;
		height: 430px;
		box-shadow: var(--neumorphism);
		border-radius: 0.6rem;
		transition: all 0.5s cubic-bezier(0.39, 0.575, 0.565, 1);
	}

	.cover {
		width: 100%;
		height: fit-content;
		border-radius: 0.6rem 0.6rem 0 0;
	}
	.cover > img {
		object-fit: cover;
		width: 100%;
		border-radius: 0.6rem 0.6rem 0 0;
	}

	.content {
		padding: 0 1rem;
		display: flex;
		flex-direction: column;
		font-size: 1rem;
		overflow-wrap: anywhere;
	}

	.data {
		opacity: 80%;
	}

	.alert {
		background-color: var(--alert);
	}

	.message {
		background-color: var(--submit);
	}

	.show-more,
	.show-less {
		color: var(--submit);
		cursor: pointer;
		border-radius: 0.3rem;
		width: fit-content;
		place-self: center;
		position: relative;
		top: 0.8rem;
		padding: 0.3rem;
	}

	.show-more:hover {
		box-shadow: var(--submitHover);
		background-color: var(--submit);
		color: var(--sfondo);
	}

	.show-less {
		color: var(--alert);
	}

	.show-less:hover {
		box-shadow: var(--alertHover);
		background-color: var(--alert);
		color: var(--sfondo);
	}

	.mostrando {
		width: 90%;
		height: fit-content;
	}

	.elimina {
		background-color: var(--alert);
		box-shadow: var(--alertHover);
		border-radius: 0.4em;
		color: var(--sfondo);
		font-size: 1.2em;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.deleting {
		position: absolute;
		color: var(--alert);
		font-size: 5em;
		align-self: center;
		z-index: 2;
		cursor: pointer;
		user-select: none;
		opacity: 120%;
	}
</style>
