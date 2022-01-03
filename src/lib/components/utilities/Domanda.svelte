<script lang="ts">
	import { goto } from '$app/navigation';
	import { db } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';
	import {
		addDoc,
		collection,
		deleteDoc,
		doc,
		getDoc,
		getDocs,
		onSnapshot,
		query,
		serverTimestamp,
		where
	} from 'firebase/firestore';
	import Risposta from './Risposta.svelte';
	import { fade, fly } from 'svelte/transition';
	import SegnalazioneDomanda from './SegnalazioneDomanda.svelte';
	import { domandeSegnalate } from '$lib/stores/domandeStore';

	export let domanda;

	let rispondendo = false;
	let risposta = '';

	let mostraRisposte = false;
	let listaRisposte = [];

	let tipoSort;

	// Per ordinare in real time
	//  da qualche problema
	$: ordinaRisposte = () => {
		if (tipoSort == 'recenti') {
			listaRisposte = listaRisposte.sort((a, b) => a.data().data.seconds - b.data().data.seconds);
		} else {
			listaRisposte = listaRisposte.sort((a, b) => b.data().data.seconds - a.data().data.seconds);
		}
	};

	const redirectProfilo = (id) => {
		goto(`/profilo/${id}`);
	};

	const eliminaDomanda = () => {
		// Prendo tutte le risposte alla domanda e le elimino
		const queryRisposteDaEl = query(
			collection(db, 'risposte'),
			where('idDomanda', '==', domanda.id)
		);
		// Elimino tutte le risposte di quella domanda
		getDocs(queryRisposteDaEl)
			.then((docs) => {
				docs.docs.forEach((element) => {
					deleteDoc(element.ref);
				});
			})
			.then(() => {
				//Elimino tutte le segnalazioni alla domanda
				const querySegnalazioni = query(
					collection(db, 'segnalazioniDomande'),
					where('idDomanda', '==', domanda.id)
				);
				getDocs(querySegnalazioni)
					.then((segnalazioni) => {
						segnalazioni.forEach((segnalazione) => {
							deleteDoc(segnalazione.ref);
						});
					})
					.then(() => {
						// Elimino la domanda stessa
						deleteDoc(doc(db, 'domande', domanda.id))
							.then(() => {
								alert('Domanda eliminata');
							})
							.catch((error) => {
								alert(error.message);
							});
					});
			})
			.catch((error) => {
				alert(error.message);
			});
	};

	const mandaRisposta = () => {
		getDoc(doc(db, 'users', $authStore.user.uid)).then((ref) => {
			let dati = {
				contenuto: risposta,
				idDomanda: domanda.id,
				idRispondente: $authStore.user.uid,
				nomeRispondente: ref.data().nome,
				// Salvo l'avatar per non fare molte query dopo
				avatarRispondente: ref.data().avatar,
				data: serverTimestamp()
			};

			addDoc(collection(db, 'risposte'), dati)
				.then(() => {
					alert('Risposta inviata');
					rispondendo = false;
					risposta = '';
				})
				.catch((error) => {
					alert(error.message);
				});
		});
	};

	const getListaRisposte = () => {
		const queryRisposte = query(collection(db, 'risposte'), where('idDomanda', '==', domanda.id));
		getDocs(queryRisposte)
			.then((res) => {
				listaRisposte = res.docs;
				mostraRisposte = true;
			})
			.then(() => {
				onSnapshot(queryRisposte, (risposte) => {
					listaRisposte = risposte.docs;
				});
			});
	};

	const handleMostraRisposte = () => {
		if (listaRisposte.length == 0) {
			getListaRisposte();
		}
		mostraRisposte = !mostraRisposte;
	};
</script>

<div in:fly={{ y: 100, duration: 1000 }} out:fade class="domanda">
	<div class="up-part">
		<!-- Se non sei loggato, allora vedi la domanda -->
		{#if !$authStore.isLoggedIn}
			{#if !domanda.data().anonimo}
				<div class="avatar" on:click={() => redirectProfilo(domanda.data().idAutore)}>
					<img src={domanda.data().avatar} alt="" />
				</div>
				<div class="titolo-nome">
					<p class="titolo-domanda">{domanda.data().titolo}</p>
					<p>{domanda.data().nome}</p>
				</div>
			{:else}
				<div class="avatar anonimo">
					<img src="/images/anonimo.png" alt="" />
				</div>
				<div class="titolo-nome">
					<p class="titolo-domanda">{domanda.data().titolo}</p>
					<p>Anonimo</p>
				</div>
			{/if}
		{:else if !domanda.data().anonimo}
			<div class="avatar" on:click={() => redirectProfilo(domanda.data().idAutore)}>
				<img src={domanda.data().avatar} alt="" />
			</div>
			<div class="titolo-nome">
				<p class="titolo-domanda">{domanda.data().titolo}</p>
				<p>{domanda.data().nome}</p>
			</div>
			{#if domanda.data().idAutore == $authStore.user.uid}
				<button on:click={eliminaDomanda} class="delete-domanda">🗑️</button>
			{/if}
		{:else if domanda.data().idAutore != $authStore.user.uid}
			<div class="avatar anonimo">
				<img src="/images/anonimo.png" alt="" />
			</div>
			<div class="titolo-nome">
				<p class="titolo-domanda">{domanda.data().titolo}</p>
				<p>Anonimo</p>
			</div>
		{:else}
			<div class="avatar anonimo">
				<img src="/images/anonimo.png" alt="" />
			</div>
			<div class="titolo-nome">
				<p class="titolo-domanda">{domanda.data().titolo}</p>
				<p>Anonimo (Tu)</p>
			</div>
			<button on:click={eliminaDomanda} class="delete-domanda">🗑️</button>
		{/if}
	</div>

	<div class="down-part">
		<div class="contenuto">
			<p>{domanda.data().contenuto}</p>
		</div>
		<div class="box-bottoni">
			<button on:click={handleMostraRisposte}>Risposte</button>
			{#if $authStore.isLoggedIn}
				<button class="rispondi" on:click={() => (rispondendo = !rispondendo)}>Rispondi</button>
				{#if $domandeSegnalate.find((elem) => elem.idDomanda == domanda.id)}
					<SegnalazioneDomanda idDomanda={domanda.id} segnalato={true} />
				{:else}
					<SegnalazioneDomanda idDomanda={domanda.id} segnalato={false} />
				{/if}
			{/if}
		</div>
		{#if rispondendo}
			<div class="area-risposta">
				<form action="" on:submit|preventDefault={mandaRisposta}>
					<textarea
						name="commento"
						id="commentodomanda"
						cols="30"
						rows="4"
						required
						placeholder="Rispondi alla domanda"
						bind:value={risposta}
					/>
					<button type="submit" class="invia-risposta">Invia</button>
				</form>
			</div>
		{/if}
	</div>
	<div class="risposte">
		{#if mostraRisposte && listaRisposte.length != 0}
			<div class="sorting">
				<label for="sorting:">Ordina:</label>
				<select
					on:change={ordinaRisposte}
					bind:value={tipoSort}
					class="sorting"
					name="sorting"
					id="sorting"
				>
					<option value="vecchio">Dalla più vecchia</option>
					<option value="recenti">Dalla più recente</option>
				</select>
			</div>
			{#each listaRisposte as risposta (risposta.id)}
				<Risposta {risposta} />
			{/each}
		{/if}
	</div>
</div>

<style>
	.domanda {
		background-color: rgb(199, 199, 199);
		padding: 0.2rem 0;
		border-radius: 20px;
		width: 100%;
		padding: 0.5rem;
	}

	.titolo-domanda {
		font-weight: 600;
		font-size: 1.4rem;
		margin-bottom: 0;
	}
	.up-part {
		display: flex;
		gap: 1rem;
		justify-content: left;
		align-items: center;
	}

	.delete-domanda {
		display: flex;
		justify-content: center;
		align-items: center;
		align-self: center;
		border: none;
		background-color: rgba(41, 41, 41, 0.5);
		border-radius: 100%;
		font-weight: 600;
		font-size: 1.3rem;
		color: darkred;
		height: 50px;
		width: 50px;
		cursor: pointer;
		transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
		position: absolute;
		margin-left: -2rem;
		margin-top: -6rem;
	}

	.delete-domanda:hover {
		background-color: rgb(41, 41, 41);
	}

	.avatar {
		max-width: 75px;
		max-height: 75px;
		background-color: brown;
		border-radius: 100%;
		border: black solid;
		cursor: pointer;
	}

	.avatar > img {
		width: 75px;
		height: 75px;
		border-radius: 100%;
		object-fit: cover;
	}

	.anonimo {
		cursor: auto;
	}

	.down-part {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: center;
	}

	.sorting {
		align-self: end;
		border: none;
		outline: none;
		font-size: 1rem;
		border-radius: 0.4rem;
	}
	form {
		width: 100%;
		display: flex;
		gap: 1rem;
		align-items: center;
		justify-content: center;
	}

	.rispondi {
		background-color: red;
	}
	textarea {
		resize: none;
		width: 80%;
		border-radius: 0.3rem;
		font-size: 1rem;
	}

	button {
		padding: 0.3rem;
		font-size: 1rem;
		border: none;
		border-radius: 0.3rem;
		cursor: pointer;
		color: white;
		background-color: black;
	}

	form > button {
		background-color: blueviolet;
	}

	.contenuto {
		box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);
		border-radius: 10px;
		padding: 0.5rem;
		overflow-wrap: break-word;
	}

	.box-bottoni {
		display: flex;
		justify-content: space-between;
	}

	.risposte {
		width: 90%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: center;
		align-content: center;
		align-items: flex-start;
		padding: 1rem;
	}
</style>
