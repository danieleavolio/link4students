<script lang="ts">
	import { db } from '$lib/firebaseConfig';

	import { authStore } from '$lib/stores/authStore';
	import { esamiLibretto } from '$lib/stores/esamiLibretto';
	import { deleteDoc, doc, getDoc, increment, setDoc } from 'firebase/firestore';

	let isOpen;
	let caricamento = false;
	let messaggio = '';

	export let esame;
	let oldVoto = esame.data().voto;

	let voto = esame.data().voto;
	let lode = esame.data().lode;

	$: if (voto != 30) {
		lode = false;
	}

	let listaEsamiPossibili = [];

	const modificaVotoMedioCorso = () => {
		getDoc(doc(db, 'corsidelcdl', esame.data().uidCorso)).then((corsodelcdl) => {
			let totale = corsodelcdl.data().mediaVoti * corsodelcdl.data().numeroVoti - oldVoto;
			let nuovaMedia = (totale + voto) / corsodelcdl.data().numeroVoti;
			setDoc(
				doc(db, 'corsidelcdl', esame.data().uidCorso),
				{
					mediaVoti: nuovaMedia
				},
				{ merge: true }
			);
		});
	};

	const modificaVotiPreElimina = () => {
		getDoc(doc(db, 'corsidelcdl', esame.data().uidCorso)).then((corsodelcdl) => {
			if (corsodelcdl.data().numeroVoti > 1) {
				let totale = corsodelcdl.data().mediaVoti * corsodelcdl.data().numeroVoti - oldVoto;
				let nuovaMedia = totale / (corsodelcdl.data().numeroVoti - 1);
				setDoc(
					doc(db, 'corsidelcdl', esame.data().uidCorso),
					{
						mediaVoti: nuovaMedia,
						numeroVoti: increment(-1)
					},
					{ merge: true }
				);
			}
			else{
				setDoc(
					doc(db, 'corsidelcdl', esame.data().uidCorso),
					{
						mediaVoti: null,
						numeroVoti: increment(-1)
					},
					{ merge: true }
				);
			}
		});
	};

	const modificaEsame = () => {
		caricamento = true;
		setDoc(
			doc(db, 'esamiLibretto', esame.id),
			{
				voto: voto,
				lode: lode
			},
			{ merge: true }
		).then(() => {
			modificaVotoMedioCorso();
			caricamento = false;
			messaggio = 'Esame modificato!';
		});
	};

	const eliminaDalLibretto = () => {
		modificaVotiPreElimina();
		deleteDoc(doc(db, 'esamiLibretto', esame.id));
		close();
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
		<button class="domanda-button" on:click={open}>✒️</button>
	</slot>
{/if}

{#if isOpen}
	<div class="modal">
		<div class="backdrop" on:click={close} />
		<div class="content-wrapper">
			<button class="close-button" on:click={close}> ❌ </button>
			<slot name="header">
				<div class="titolo">
					<p>Modifica <span>{esame.data().nomeCorso}</span></p>
				</div>
			</slot>
			{#if caricamento}
				<div class="loading-div" />
			{:else if messaggio == ''}
				<div class="contenuto">
					<slot name="content" />
					<div class="domande">
						<form action="" on:submit|preventDefault={modificaEsame}>
							<div class="inputs-container">
								<label for="voto">Votazione esame</label>
								<input bind:value={voto} type="number" id="voto" min="18" max="30" required />
								<label for="lode">Lode</label>
								<input bind:checked={lode} disabled={voto != 30} type="checkbox" id="lode" />
							</div>
							<div class="submit-box">
								<button type="submit">Salva</button>
							</div>
						</form>
						<div class="oppure">
							<p>Oppure</p>
							<button class="elimina" on:click={eliminaDalLibretto}>Elimina dal libretto</button>
						</div>
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
		font-size: 1rem;
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
		justify-content: center;
		align-items: center;
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

	.elimina {
		border: none;
		background-color: darkred;
		color: white;
		padding: 1rem;
		border-radius: 0.4rem;
		cursor: pointer;
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
