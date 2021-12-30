<script lang="ts">
	import { goto } from '$app/navigation';
	import { db } from '$lib/firebaseConfig';
	import { fly } from 'svelte/transition';
	import { esamiRecensiti } from '$lib/stores/recensioniStore';
	import {
		collection,
		deleteDoc,
		doc,
		getDocs,
		increment,
		query,
		setDoc,
		Timestamp,
		where
	} from 'firebase/firestore';
	import Segnalazione from './Segnalazione.svelte';

	export let oggettoSegnalazione;
	export let cambiaRecensioniSegnalate;

	let giorniSospensione;
	let segnalazioneMostrata = false;

	const displayReport = () => {
		segnalazioneMostrata = !segnalazioneMostrata;
	};

	const redirectProfilo = (id) => {
		goto(`/profilo/${id}`);
	};

	const tornaDato = (quantita, emoji) => {
		let numeroEmoji = '';
		for (let i = 1; i <= quantita; i++) {
			numeroEmoji += emoji;
		}

		return numeroEmoji;
	};

	const calcolaNuovaMedia = (esame, difficolta, utilita) => {
		let datiMedia = {};
		if (esame.numRecensioni != 1) {
			let totDiffVecchia = esame.mediaDifficolta * esame.numRecensioni;
			let nuovaMediaDifficolta = (totDiffVecchia - difficolta) / (esame.numRecensioni - 1);

			let totUtilVecchia = esame.mediaUtilita * esame.numRecensioni;
			let nuovaMediaUtilita = (totUtilVecchia - utilita) / (esame.numRecensioni - 1);

			let nuovoNumeroRecensioni = esame.numRecensioni - 1;
			datiMedia = {
				numRecensioni: nuovoNumeroRecensioni,
				mediaDifficolta: nuovaMediaDifficolta,
				mediaUtilita: nuovaMediaUtilita
			};
		} else {
			datiMedia = {
				numRecensioni: 0,
				mediaDifficolta: 0,
				mediaUtilita: 0
			};
		}

		return datiMedia;
	};

	const eliminaRecensione = () => {
		// Eliminare tutte le interazioni con la recnesione ( like e dislike)

		const queryInterazioni = query(
			collection(db, 'votiRecensioni'),
			where('idRecensione', '==', oggettoSegnalazione.recensione.id)
		);

		getDocs(queryInterazioni).then((data) => {
			data.docs.forEach((toDelete) => {
				let docRef = toDelete.ref;
				deleteDoc(docRef);
			});
		});

		// Elimino le segnalazioni alla recensione quando eliminata

		const querySegnalazioni = query(
			collection(db, 'segnalazioniRecensioni'),
			where('idRecensione', '==', oggettoSegnalazione.recensione.id)
		);

		// Elimino le segnalazioni 1 alla volta
		getDocs(querySegnalazioni).then((data) => {
			data.docs.forEach((toDelete) => {
				let docRef = toDelete.ref;
				deleteDoc(docRef);
			});
		});
		// Modifica la media dell'esame di cui la recensione fa parte
		const q = query(
			collection(db, 'corsidelcdl'),
			where('codiceCorso', '==', oggettoSegnalazione.recensione.data().idCorso)
		);
		getDocs(q).then((snapshot) => {
			const dati = calcolaNuovaMedia(
				snapshot.docs[0].data(),
				oggettoSegnalazione.recensione.data().votoDifficolta,
				oggettoSegnalazione.recensione.data().votoUtilita
			);
			setDoc(snapshot.docs[0].ref, dati, { merge: true })
				.then(() => {
					deleteDoc(doc(db, 'recensioni', oggettoSegnalazione.recensione.id))
						.then(() => {
							esamiRecensiti.update(
								(oldEsami) =>
									(oldEsami = oldEsami.filter(
										(item) => item != oggettoSegnalazione.recensione.data().idCorso
									))
							);
							alert('Recensione eliminata!');
							cambiaRecensioniSegnalate(oggettoSegnalazione.recensione.id);
							// Decremento il contatore del numero di recensioni
							setDoc(
								doc(db, 'statistiche', 'infoSito'),
								{
									numRecensioni: increment(-1)
								},
								{ merge: true }
							);
						})
						.catch((error) => {
							alert(error);
						});
				})
				.catch((error) => {
					alert(error);
				});
			// Elimina la recensione dalla collection recensioni
		});
	};

	// Mette un banTime nell'account dell'utente della recensione
	const setBanTime = (uid) => {
		// 86400 è il numero di secondi in un giorni
		let giorniInSecondi = giorniSospensione * 86400;
		let tempo = Timestamp.now().seconds + giorniInSecondi;
		setDoc(
			doc(db, 'users', uid),
			{
				banTime: tempo
			},
			{ merge: true }
		).then(() => {
			// Quando un utente viene flaggato con questo, la recensione incriminata viene eliminata
			eliminaRecensione();
			console.log('Utente sospeso per: ', giorniSospensione);
		});
	};
</script>

<div transition:fly class="recensione">
	<div class="up-part">
		<!-- Se non sei loggato, allora vedi la recensione -->
		<div
			class="avatar"
			on:click={() => redirectProfilo(oggettoSegnalazione.recensione.data().idAutore)}
		>
			<img src={oggettoSegnalazione.recensione.data().avatar} alt="" />
		</div>
		<div class="nome">
			<p>{oggettoSegnalazione.recensione.data().nome}</p>
		</div>
		<button on:click={eliminaRecensione} class="delete-review">🗑️</button>
	</div>

	<div class="down-part">
		<div class="contenuto">
			<p>{oggettoSegnalazione.recensione.data().contenuto}</p>
			<div class="voti">
				<p>{tornaDato(oggettoSegnalazione.recensione.data().votoDifficolta, '🧠')}</p>
				<p>{tornaDato(oggettoSegnalazione.recensione.data().votoUtilita, '🎓')}</p>
			</div>
		</div>
		<div class="segnalazione">
			<div class="bottoni">
				<button class="show-report" on:click={displayReport}>Mostra report 🛑</button>
				<div class="div-sospensione">
					<!-- Form per la sospensione -->
					<form
						action=""
						on:submit|preventDefault={() =>
							setBanTime(oggettoSegnalazione.recensione.data().idAutore)}
					>
						<input
							class="input-giorni"
							required
							bind:value={giorniSospensione}
							min="1"
							type="number"
							name="giorni"
							id="giorni-sospensione"
							placeholder="Giorni di sospensione"
						/>
						<button class="sospendi">Sospendi</button>
					</form>
				</div>
			</div>
			{#if segnalazioneMostrata}
				<Segnalazione segnalazione={oggettoSegnalazione.segnalazione} />
			{/if}
		</div>
	</div>
</div>

<style>
	.recensione {
		display: inline-block;
		background-color: rgb(199, 199, 199);
		padding: 0.2rem 0;
		border-radius: 20px;
		max-width: 400px;
		width: 400px;
		padding: 0.5rem;
	}
	.up-part {
		display: flex;
		gap: 1rem;
	}

	.delete-review {
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
		margin-left: -1.6rem;
		margin-top: -3rem;
	}

	.delete-review:hover {
		background-color: rgb(41, 41, 41);
	}

	.avatar {
		max-width: 40px;
		max-height: 40px;
		border-radius: 100%;
		cursor: pointer;
		border: black solid;
	}

	.avatar > img {
		width: 100%;
		height: 40px;
		object-fit: cover;
		border-radius: 100%;
	}

	.nome {
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
	}

	.down-part {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: center;
	}

	.contenuto {
		box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);
		border-radius: 10px;
		padding: 0.5rem;
		overflow-wrap: break-word;
		max-width: 380px;
	}

	.voti {
		display: flex;
		justify-content: space-around;
	}

	.show-report {
		border: black solid;
		outline: none;
		background: white;
		padding: 0.5rem 0.2rem;
		border-radius: 8px;
		cursor: pointer;
	}

	.bottoni {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}
	.div-sospensione {
		margin: 0.5rem 0;
	}

	.input-giorni {
		text-align: end;
		border-radius: 0.3rem;
		outline: none;
		border: none;
	}
	.sospendi {
		border: none;
		background-color: rgb(22, 22, 22);
		color: white;
		padding: 0.2rem;
		border-radius: 0.3rem;
		cursor: pointer;
	}
</style>
