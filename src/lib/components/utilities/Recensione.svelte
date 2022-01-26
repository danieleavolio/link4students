<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, db } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';
	import { fade, fly } from 'svelte/transition';
	import { esamiReagiti, esamiRecensiti, recensioniSegnalate } from '$lib/stores/recensioniStore';
	import {
		collection,
		deleteDoc,
		doc,
		getDoc,
		getDocs,
		increment,
		query,
		setDoc,
		where
	} from 'firebase/firestore';
	import { onMount } from 'svelte';
	import SegnalazioneRecensione from './SegnalazioneRecensione.svelte';

	export let recensione;

	let statoVoto = 0;

	// Stati voto:
	// 2 PENDING
	// 1 MANDATO
	// 0 INATTESA

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
		if (statoVoto == 0) {
			statoVoto = 2;
			// Eliminare tutte le interazioni con la recnesione ( like e dislike)
			const queryInterazioni = query(
				collection(db, 'votiRecensioni'),
				where('idRecensione', '==', recensione.id)
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
				where('idRecensione', '==', recensione.id)
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
				where('codiceCorso', '==', recensione.data().idCorso)
			);
			getDocs(q).then((snapshot) => {
				const dati = calcolaNuovaMedia(
					snapshot.docs[0].data(),
					recensione.data().votoDifficolta,
					recensione.data().votoUtilita
				);
				setDoc(snapshot.docs[0].ref, dati, { merge: true })
					.then(() => {
						deleteDoc(doc(db, 'recensioni', recensione.id))
							.then(() => {
								esamiRecensiti.update(
									(oldEsami) =>
										(oldEsami = oldEsami.filter((item) => item != recensione.data().idCorso))
								);
								statoVoto = 0;
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
		}
	};

	// Variabile locale per gestirmi i cambiamenti di UI per i like senza dover fare troppi giri inutili
	// al ricaricamento, tutto è sincronizzato, ma nel momento del like, viene gestito localmente
	let uiLocaleLike;
	let uiLocaleDislike;

	// TO-DO --> FIX LOCAL UI QUANDO CAMBI PAGINA
	const likeFunction = async () => {
		// Controllo se ho messo qualcosa, come like o dislike
		if (statoVoto == 0 && $authStore.isLoggedIn) {
			statoVoto = 2;
			let idDocumentoCreato = recensione.id + $authStore.user.uid;
			await getDoc(doc(db, 'votiRecensioni', idDocumentoCreato)).then((docRef) => {
				if (docRef.exists()) {
					// Se ho messo like
					if (docRef.data().operazione == 'like') {
						// Elimino il voto della recensione da parte mia
						deleteDoc(doc(db, 'votiRecensioni', idDocumentoCreato)).then(() => {
							// Una volta eliminata il voto recensione, decremento il counter dei likes
							// della recesione
							setDoc(
								doc(db, 'recensioni', recensione.id),
								{
									likes: increment(-1)
								},
								{
									merge: true
								}
							).then(() => {
								statoVoto = 0;
								uiLocaleLike = '';
							});
						});
					}
					// Se ho messo dislike
					else if (docRef.data().operazione == 'dislike') {
						// cambio l'operazione da dislike a like
						setDoc(
							doc(db, 'votiRecensioni', idDocumentoCreato),
							{
								operazione: 'like'
							},
							{ merge: true }
						).then((res) => {
							// decremento i dislike e aumento i likes
							setDoc(
								doc(db, 'recensioni', recensione.id),
								{
									likes: increment(1),
									dislikes: increment(-1)
								},
								{ merge: true }
							).then(() => {
								statoVoto = 0;
								// Cambio la UI locale, rendendo bianco un voto e l'altro colorato
								uiLocaleLike = 'liked';
								uiLocaleDislike = '';
							});
						});
					}
				}
				// Se il voto non è stato mai messo da me
				else {
					setDoc(doc(db, 'votiRecensioni', recensione.id + $authStore.user.uid), {
						idRecensione: recensione.id,
						idUtente: $authStore.user.uid,
						operazione: 'like'
					}).then(() => {
						// Aumento il numero di likes nel post
						setDoc(
							doc(db, 'recensioni', recensione.id),
							{
								likes: increment(1)
							},
							{ merge: true }
						).then(() => {
							statoVoto = 0;
						});
						// Aumento il contatore dei likes
						uiLocaleLike = 'liked';
					});
				}
			});
		}
	};

	const dislikeFunction = async () => {
		// Controllo se ho messo qualcosa, come like o dislike
		if (statoVoto == 0 && $authStore.isLoggedIn) {
			statoVoto = 2;
			let idDocumentoCreato = recensione.id + $authStore.user.uid;
			await getDoc(doc(db, 'votiRecensioni', idDocumentoCreato)).then((docRef) => {
				if (docRef.exists()) {
					// Se ho messo dislike
					if (docRef.data().operazione == 'dislike') {
						// Elimino il voto della recensione da parte mia
						deleteDoc(doc(db, 'votiRecensioni', idDocumentoCreato)).then(() => {
							// Una volta eliminata il voto recensione, decremento il counter dei dislikes
							// della recesione
							setDoc(
								doc(db, 'recensioni', recensione.id),
								{
									dislikes: increment(-1)
								},
								{
									merge: true
								}
							).then(() => {
								statoVoto = 0;
								uiLocaleDislike = '';
							});
						});
					}
					// Se ho messo like
					else if (docRef.data().operazione == 'like') {
						// cambio l'operazione da like a dislike
						setDoc(
							doc(db, 'votiRecensioni', idDocumentoCreato),
							{
								operazione: 'dislike'
							},
							{ merge: true }
						).then(() => {
							// decremento i likes e aumento i dislikes
							setDoc(
								doc(db, 'recensioni', recensione.id),
								{
									likes: increment(-1),
									dislikes: increment(1)
								},
								{ merge: true }
							).then(() => {
								statoVoto = 0;
								// Cambio la UI locale, rendendo bianco un voto e l'altro colorato
								uiLocaleLike = '';
								uiLocaleDislike = 'disliked';
								// Tolgo la reazione dallo store
							});
						});
					}
				}
				// Se il voto non è stato mai messo da me
				else {
					setDoc(doc(db, 'votiRecensioni', recensione.id + $authStore.user.uid), {
						idRecensione: recensione.id,
						idUtente: $authStore.user.uid,
						operazione: 'dislike'
					}).then(() => {
						// Aumento il numero di dislikes nel post
						setDoc(
							doc(db, 'recensioni', recensione.id),
							{
								dislikes: increment(1)
							},
							{ merge: true }
						).then(() => {
							statoVoto = 0;
						});
						// Aumento il contatore dei likes
						uiLocaleDislike = 'disliked';
					});
				}
			});
		}
	};

	onMount(() => {
		// Se sono loggato
		if ($authStore.isLoggedIn) {
			// Faccio il fetch dei dati per sincronizzare UI e Firebase dei tuoi singoli like
			// aggiorno lo store per i likes alle recensioni
			let reazioniRecensioni = [];
			// Prendo le recensioni con il mio id utente
			let queryReazioni = query(
				collection(db, 'votiRecensioni'),
				where('idUtente', '==', auth.currentUser.uid)
			);
			getDocs(queryReazioni).then((res) => {
				res.docs.forEach((doc) => {
					reazioniRecensioni = [...reazioniRecensioni, doc];
				});
				// Aggiorno lo store delle reazioni
				esamiReagiti.update((oldReaction) => reazioniRecensioni);
				messoLike();
				messoDislike();
			});
		}
	});

	// Funzioni per controllare se ho messo like o dislike
	const messoLike = () => {
		if ($authStore.isLoggedIn) {
			if (
				$esamiReagiti.find(
					(element) =>
						element.data().idRecensione == recensione.id && element.data().operazione == 'like'
				)
			) {
				uiLocaleLike = 'liked';
				uiLocaleDislike = '';
			}
		}
	};

	const messoDislike = () => {
		if ($authStore.isLoggedIn) {
			if (
				$esamiReagiti.find(
					(element) =>
						element.data().idRecensione == recensione.id && element.data().operazione == 'dislike'
				)
			) {

				uiLocaleDislike = 'disliked';
				uiLocaleLike = '';
			}
		}
	};
</script>

<div in:fly={{ y: 100, duration: 1000 }} out:fade class="recensione">
	<div class="up-part">
		<!-- Se non sei loggato, allora vedi la recensione -->
		{#if !$authStore.isLoggedIn}
			{#if !recensione.data().anonimo}
				<div class="avatar" on:click={() => redirectProfilo(recensione.data().autore.idAutore)}>
					<img src={recensione.data().autore.avatar} alt="" />
				</div>
				<div class="nome">
					<p>{recensione.data().autore.nome}</p>
				</div>
			{:else}
				<div class="avatar anonimo">
					<img src="/images/anonimo.png" alt="" />
				</div>
				<div class="nome">
					<p>Anonimo</p>
				</div>
			{/if}
		{:else if !recensione.data().anonimo}
			<div class="avatar" on:click={() => redirectProfilo(recensione.data().autore.idAutore)}>
				<img src={recensione.data().autore.avatar} alt="" />
			</div>
			<div class="nome">
				<p>{recensione.data().autore.nome}</p>
			</div>
			{#if recensione.data().autore.idAutore == $authStore.user.uid}
				<button on:click={eliminaRecensione} class="delete-review"
					><span class="material-icons"> delete_forever </span></button
				>
			{/if}
		{:else if recensione.data().autore.idAutore != $authStore.user.uid}
			<div class="avatar anonimo">
				<img src="/images/anonimo.png" alt="" />
			</div>
			<div class="nome">
				<p>Anonimo</p>
			</div>
		{:else}
			<div class="avatar anonimo">
				<img src="/images/anonimo.png" alt="" />
			</div>
			<div class="nome">
				<p>Anonimo (Tu)</p>
			</div>
			<button on:click={eliminaRecensione} class="delete-review"
				><span class="material-icons"> delete_forever </span></button
			>
		{/if}
	</div>

	<div class="down-part">
		<div class="contenuto">
			<p>{recensione.data().contenuto}</p>
			<div class="voti">
				<span class="material-icons"
					>{tornaDato(recensione.data().votoDifficolta, 'psychology')}</span
				>
				<span class="material-icons">{tornaDato(recensione.data().votoUtilita, 'stars')}</span>
			</div>
		</div>
		<div class="box-bottoni">
			<div class="like-dislike">
				<div class="singolo-bottone">
					<p>
						{recensione.data().likes}
					</p>
					<button on:click={likeFunction} class="like bottone-ld {uiLocaleLike}"
						><span class="material-icons"> thumb_up </span></button
					>
				</div>
				<div class="singolo-bottone">
					<p>
						{recensione.data().dislikes}
					</p>
					<button on:click={dislikeFunction} class="dislike bottone-ld {uiLocaleDislike}"
						><span class="material-icons"> thumb_down</span></button
					>
				</div>
			</div>
			<div class="report">
				{#if $recensioniSegnalate.find((elem) => elem.idRecensione == recensione.id)}
					<SegnalazioneRecensione idRecensione={recensione.id} segnalato={true} />
				{:else}
					<SegnalazioneRecensione idRecensione={recensione.id} segnalato={false} />
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.recensione {
		padding: 0.2rem 0;
		border-radius: 20px;
		max-width: 50vw;
		width: 100%;
		padding: 0.5rem;
		box-shadow: var(--neumorphism);
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
		border-radius: 100%;
		font-weight: 600;
		color: var(--alert);
		height: 50px;
		width: 50px;
		cursor: pointer;
		position: absolute;
		margin-left: -2rem;
		margin-top: -6rem;
		box-shadow: var(--innerNeu);
	}

	.delete-review > span {
		font-size: 2em;
	}

	.avatar {
		max-width: 75px;
		max-height: 75px;
		border-radius: 100%;
		cursor: pointer;
		border: var(--bordo);
	}

	.avatar > img {
		width: 75px;
		height: 75px;
		object-fit: cover;
		border-radius: 100%;
	}

	.anonimo {
		cursor: auto;
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
		box-shadow: var(--innerNeu);
		border-radius: 10px;
		padding: 0.5rem;
		margin: 0.2rem;
		overflow-wrap: break-word;
		max-width: 100%;
		text-align: center;
	}

	.voti {
		display: flex;
		justify-content: space-around;
		font-size: 1.3rem;
	}
	.like-dislike {
		display: flex;
		justify-content: left;
		gap: 1rem;
	}

	.bottone-ld {
		border: none;
		outline: none;
		cursor: pointer;
		font-size: 1.2rem;
		width: 2rem;
		height: 2rem;
		display: flex;
		justify-content: center;
		border-radius: 20px;
		align-items: center;
	}

	.singolo-bottone {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}

	.like:hover {
		color: var(--submit);
	}

	.dislike:hover {
		color: var(--alert);
	}

	.liked {
		background-color: var(--submit);
	}

	.liked:hover,
	.dislike:hover {
		background-color: var(--sfondo);
		color: var(--testo);
	}

	.disliked {
		background-color: var(--alert);
	}

	.box-bottoni {
		display: flex;
		justify-content: space-between;
	}

	.report {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Responsive */
	@media screen and (max-width:650px){
		.recensione {
			max-width: 60vw;

		}

		.up-part{
			justify-content: center;
			align-items: center;
			margin-top: 1.5em;
		}

		.delete-review{
			margin-top: -9em;
			margin-left: 0;
		}

		.voti{
			flex-direction: column;
			gap: 1em;
		}
	}


	@media screen and (max-width:650px){
		.box-bottoni{
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	}
</style>
