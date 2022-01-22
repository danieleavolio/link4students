<script>
	import { authStore } from '$lib/stores/authStore';
	import { richiesteUtente } from '$lib/stores/richiesteStore';
	import RichiestaCollegamento from './RichiestaCollegamento.svelte';

	let isOpen = false;
	let caricamento = false;
	let messaggio = '';

	const open = () => {
		isOpen = true;
		messaggio = '';
	};

	const close = () => {
		isOpen = false;
	};
</script>

{#if $authStore.isLoggedIn}
	<slot name="trigger" {open}>
		<button class="domanda-button" on:click={open}
			><span class="material-icons"> notifications </span><span>{$richiesteUtente.length}</span
			></button
		>
	</slot>
{/if}

{#if isOpen}
	<div class="modal">
		<div class="backdrop" on:click={close} />
		<div class="content-wrapper">
			<button class="close-button" on:click={close}> ❌ </button>
			<slot name="header">
				<div class="titolo">
					<p>Lista richieste di collegamento</p>
				</div>
			</slot>
			{#if caricamento}
				<div class="loading-div" />
			{:else if messaggio == ''}
				<div class="contenuto">
					<slot name="content" />
					{#if $richiesteUtente.length > 0}
						<div class="scelte">
							{#each $richiesteUtente as richiesta (richiesta.id)}
								<RichiestaCollegamento {richiesta} />
							{/each}
						</div>
					{:else}
						<div class="vuoto">
							<p>Non ci sono richieste 💭</p>
						</div>
					{/if}
				</div>
			{:else}
				<div class="message-div">
					<p>{messaggio}</p>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.domanda-button {
		margin: auto;
		padding: 0.4rem;
		background-color: var(--sfondo);
		color: var(--testo);
		border-radius: 6px;
		border: none;
		font-size: 1rem;
		outline: none;
		cursor: pointer;
		font-weight: 600;
		box-shadow: var(--neumorphism);
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.domanda-button:hover {
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;

		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
	}

	.backdrop {
		position: absolute;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
	}

	.content-wrapper {
		z-index: 10;
		max-width: 70vw;
		width: 50%;
		border-radius: 0.3rem;
		overflow: hidden;
		padding: 2rem;
		display: flex;
		flex-direction: column;
	}

	.close-button {
		outline: none;
		font-size: 1.2rem;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		cursor: pointer;
		position: absolute;
		margin-left: -3rem;
		margin-top: -3rem;
		box-shadow: var(--innerNeu);
	}
	.titolo {
		font-size: 1.3rem;
		font-weight: 600;
		text-align: center;
	}

	.scelte {
		display: flex;
		gap: 1rem;
		width: 100%;
		justify-content: center;
		align-items: center;
	}

	.contenuto {
		overflow: auto;
	}

	.loading-div {
		border: var(--sfondo) solid 10px;
		border-top: solid var(--testo) 10px;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		animation: loading 1s linear infinite;
		align-self: center;
	}

	@keyframes loading {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.message-div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.message-div > p {
		font-family: 'Roboto', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
		text-align: center;
		background-color: black;
		padding: 0;
		border-radius: 4px;
		font-weight: 700;
		font-size: 2rem;
		color: white;
	}

	.vuoto {
		font-size: 2rem;
		text-align: center;
		box-shadow: var(--innerNeu);
		padding: 1rem;
		border-radius: 1rem;
		font-weight: 600;
	}
</style>
