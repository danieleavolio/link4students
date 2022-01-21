<script lang="ts">

	export let annuncio;

	let showMore = false;
	let mostrando = false;

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
</script>

<div class="annuncio {mostrando ? 'mostrando' : ''}">
	<div class="cover">
		<img class={annuncio.data().tipo} src="/images/{annuncio.data().tipo}.png" alt="" />
	</div>
	<div class="content">
		<p class="data">{annuncio.data().data.toDate()}</p>
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

	.annuncio {
		display: grid;
		grid-template-rows: auto 1fr;
		width: 400px;
		height: 430px;
		box-shadow: var(--neumorphism);
		border-radius: 0.6rem;
		transition: all 0.5s cubic-bezier(0.39, 0.575, 0.565, 1)
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

	.show-more:hover{
		box-shadow: var(--submitHover);
		background-color: var(--submit);
		color: var(--sfondo);
	}
	


	.show-less {
		color: var(--alert);
	}

	.show-less:hover{
		box-shadow: var(--alertHover);
		background-color: var(--alert);
		color: var(--sfondo);
	}

	.mostrando {
		width: 90%;
		height: fit-content;
	}
</style>
