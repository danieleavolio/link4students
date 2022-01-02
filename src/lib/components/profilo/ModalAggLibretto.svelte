<script>
	import { db } from '$lib/firebaseConfig';

	import { authStore } from '$lib/stores/authStore';
	import { esamiLibretto } from '$lib/stores/esamiLibretto';
	import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
	import { onMount } from 'svelte';

	let isOpen;
	let caricamento = false;
	let messaggio = '';

	let corsoScelto;
	let voto;
	let lode = false;

	export let profilo;
	let listaEsamiPossibili = [];

	
	// Gli esami possibili che posso prendere dal corso di laurea
	onMount(() => {
		const queryEsami = query(
			collection(db, 'corsidelcdl'),
			where('cdl', '==', profilo.corsoDiLaurea)
		);
		getDocs(queryEsami).then((esami) => {
			listaEsamiPossibili = esami.docs;
		});
	});

	const aggiungiAlLibretto = () => {
		let dati = {
			uidUtente: $authStore.user.uid,
			codiceCorso: corsoScelto.data().codiceCorso,
			nomeCorso: corsoScelto.data().nome,
			voto: voto,
			lode: lode,
			uidCorso: corsoScelto.id
		};

		// Aggiungo l'esame al libretto
		addDoc(collection(db, 'esamiLibretto'), dati).then((docum) => {
			messaggio = 'Esame aggiunto al libretto!'
		});
	};

	const open = () => {
		isOpen = true;
		messaggio = '';
		if ($authStore.isLoggedIn) {
			$esamiLibretto.forEach((esame) => {
				listaEsamiPossibili = listaEsamiPossibili.filter(
					(esamePossibile) => esamePossibile.data().codiceCorso != esame.data().codiceCorso
				);
			});
		}
	};

	const close = () => {
		isOpen = false;
		pulisciCampi();
	};

	const pulisciCampi = () => {
		voto = '';
	};
</script>

{#if $authStore.isLoggedIn}
	<slot name="trigger" {open}>
		<button class="domanda-button" on:click={open}>Aggiungi Esame al Libretto</button>
	</slot>
{/if}

{#if isOpen}
	<div class="modal">
		<div class="backdrop" on:click={close} />
		<div class="content-wrapper">
			<button class="close-button" on:click={close}> ❌ </button>
			<slot name="header">
				<div class="titolo">
					<p>Aggiungi un Esame al tuo libretto</p>
				</div>
			</slot>
			{#if caricamento}
				<div class="loading-div" />
			{:else if messaggio == ''}
				<div class="contenuto">
					<slot name="content" />
					<div class="domande">
						{#if listaEsamiPossibili.length != 0}
							<form action="" on:submit|preventDefault={aggiungiAlLibretto}>
								<div class="inputs-container">
									<label for="scegli-esame">Scegli l'esame da aggiungere al libretto</label>
									<select required bind:value={corsoScelto} name="esame" id="scegli-esame">
										{#each listaEsamiPossibili as esame (esame.id)}
											<option selected value={esame}>{esame.data().nome}</option>
										{/each}
									</select>
									<div class="voto">
										<label for="voto">Inserisci voto</label>
										<div class="input-voto">
											<input
												required
												bind:value={voto}
												type="number"
												name="voto"
												id="voto"
												placeholder="18 --- 30"
												min="18"
												max="30"
											/>
										</div>
										<label for="lode">Lode?</label>
										<input
											disabled={voto != 30}
											bind:checked={lode}
											type="checkbox"
											name="lode"
											id="lode"
										/>
									</div>
								</div>

								<div class="submit-box">
									<button type="submit"> Aggiungi CDL </button>
								</div>
							</form>
						{:else}
							<div class="finito">
								<p>Non hai esami da aggiungere!</p>
							</div>
						{/if}
					</div>
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
		display: flex;
		align-self: center;
		padding: 0.4rem;
		background-color: blue;
		border-radius: 6px;
		color: white;
		border: none;
		outline: none;
		cursor: pointer;
		margin: auto;
		font-size: 1.2rem;
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
		background-color: white;
		overflow: hidden;
		padding: 2rem;
		display: flex;
		flex-direction: column;
	}

	.close-button {
		outline: none;
		font-size: 1.2rem;
		border: black solid;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		cursor: pointer;
		position: absolute;
		margin-left: -3rem;
		margin-top: -3rem;
	}
	.titolo {
		font-size: 1.3rem;
		font-weight: 600;
		text-align: center;
	}

	.inputs-container {
		display: flex;
		flex-direction: column;
		justify-content: left;
		gap: 0.5rem;
	}

	.contenuto {
		overflow: auto;
	}

	form {
		font-size: 1rem;
		text-align: left;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		gap: 1rem;
		font-size: 1.1rem;
		justify-content: center;
		align-items: center;
	}

	input,
	select {
		font-size: 1.1rem;
		width: fit-content;
	}

	.voto {
		display: flex;
		gap: 1rem;
		align-items: center;
	}
	.submit-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin: 0 1rem;
	}

	.submit-box > button {
		background-color: blue;
		font-size: 1rem;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		padding: 5px 5px;
		color: white;
	}

	.loading-div {
		border: white solid 10px;
		border-top: solid black 10px;
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
</style>
