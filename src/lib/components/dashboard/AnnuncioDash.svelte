<script lang="ts">
	import ContentCartaCorso from './ContentCartaCorso.svelte';


    export let annuncio;


	let showMore = false;
	let mostrando = false;

	let contenutoTroncato = annuncio.data().contenuto.length >= 200 ? annuncio.data().contenuto.substring(0, 200) : annuncio.data().contenuto;
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
</script>

<div  class="annuncio {mostrando ? 'mostrando' : ''}">
	<div class="cover">
		<img class={annuncio.data().tipo} src="/images/{annuncio.data().tipo}.png" alt="" />
	</div>
	<div class="content">
		<p class="data">{annuncio.data().data.toDate()}</p>
		<p class="titolo">{annuncio.data().titolo}</p>
		<p class="contenuto">
			{contenutoTroncato}{#if showMore && annuncio.data().contenuto.length >= 300 && !mostrando}
				<span class="show-more" on:click={mostraAltro}> Mostra altro..</span>
			{/if}
			{#if mostrando}
				<span class="show-less" on:click={mostraMeno}> Comprimi..</span>
			{/if}
		</p>
	</div>
</div>

<style>
	.titolo {
		font-size: 1.4rem;
		margin: 0.4rem 0;
	}

	.annuncio {
		display: grid;
		grid-template-rows: auto 1fr;
		width: 400px;
        height: 400px;
		box-shadow: var(--neumorphism);
        border-radius: 0.6rem;
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

	.show-more, .show-less {
		color: var(--submit);
		cursor: pointer;
	}

    .mostrando{
        width: 90%;
        height: fit-content;
    }
</style>
