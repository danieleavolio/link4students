<script>
	import { goto } from '$app/navigation';
	import { db } from '$lib/firebaseConfig';
	import { appuntiReagiti } from '$lib/stores/appuntiStore';
	import { authStore } from '$lib/stores/authStore';
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
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import ModalRecensione from '../utilities/ModalRecensione.svelte';
	import ModalRevisione from '../utilities/ModalRevisione.svelte';

	export let appunto;

	// Stato del voto per non spammare
	let statoVoto = 0;

	const redirectProfilo = (id) => {
		goto(`/profilo/${id}`);
	};

	const eliminaAppunto = () => {
		// Elimino tute le interazioni con l'appunto
		const queryAppunti = query(collection(db, 'votiAppunti'), where('idAppunto', '==', appunto.id));
		getDocs(queryAppunti).then((data) => {
			data.docs.forEach((toDelete) => {
				let docRef = toDelete.ref;
				deleteDoc(docRef);
			});
		});
		// Elimino l'appunto da firebase
		deleteDoc(doc(db, 'appunti', appunto.id)).then(() => {
			appuntiReagiti.update((oldAppunti) =>
				oldAppunti.filter((item) => item != appunto.data().idCorso)
			);
		});
		// Decremento il contatore di appunti caricati
		setDoc(
			doc(db, 'statistiche', 'infoSito'),
			{
				numAppunti: increment(-1)
			},
			{
				merge: true
			}
		).catch((error) => {
			alert(error.message);
		});
	};

	let uiLocaleLike;
	let uiLocaleDislike;

	const likeFunction = async () => {
		// Controllo se ho messo qualcosa, come like o dislike
		if (statoVoto == 0 && $authStore.isLoggedIn && appunto.data().revisionato) {
			statoVoto = 2;
			let idDocumentoCreato = appunto.id + $authStore.user.uid;
			await getDoc(doc(db, 'votiAppunti', idDocumentoCreato)).then((docRef) => {
				if (docRef.exists()) {
					// Se ho messo like
					if (docRef.data().operazione == 'like') {
						// Elimino il voto della recensione da parte mia
						deleteDoc(doc(db, 'votiAppunti', idDocumentoCreato)).then(() => {
							// Una volta eliminata il voto recensione, decremento il counter dei likes
							// della recesione
							setDoc(
								doc(db, 'appunti', appunto.id),
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
							doc(db, 'votiAppunti', idDocumentoCreato),
							{
								operazione: 'like'
							},
							{ merge: true }
						).then((res) => {
							// decremento i dislike e aumento i likes
							setDoc(
								doc(db, 'appunti', appunto.id),
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
					setDoc(doc(db, 'votiAppunti', appunto.id + $authStore.user.uid), {
						idAppunto: appunto.id,
						idUtente: $authStore.user.uid,
						operazione: 'like'
					}).then(() => {
						// Aumento il numero di likes nel post
						setDoc(
							doc(db, 'appunti', appunto.id),
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
		if (statoVoto == 0 && $authStore.isLoggedIn && appunto.data().revisionato) {
			statoVoto = 2;
			let idDocumentoCreato = appunto.id + $authStore.user.uid;
			await getDoc(doc(db, 'votiAppunti', idDocumentoCreato)).then((docRef) => {
				if (docRef.exists()) {
					// Se ho messo dislike
					if (docRef.data().operazione == 'dislike') {
						// Elimino il voto della appunto da parte mia
						deleteDoc(doc(db, 'votiAppunti', idDocumentoCreato)).then(() => {
							// Una volta eliminata il voto appunto, decremento il counter dei dislikes
							// della recesione
							setDoc(
								doc(db, 'appunti', appunto.id),
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
							doc(db, 'votiAppunti', idDocumentoCreato),
							{
								operazione: 'dislike'
							},
							{ merge: true }
						).then(() => {
							// decremento i likes e aumento i dislikes
							setDoc(
								doc(db, 'appunti', appunto.id),
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
					setDoc(doc(db, 'votiAppunti', appunto.id + $authStore.user.uid), {
						idAppunto: appunto.id,
						idUtente: $authStore.user.uid,
						operazione: 'dislike'
					}).then(() => {
						// Aumento il numero di dislikes nel post
						setDoc(
							doc(db, 'appunti', appunto.id),
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
			// Aggiorno lo store per capire se ho reagito a qualcosa
			let reazioniAppunti = [];
			// Prendo gli appunti da me reagiti
			let queryReazioni = query(
				collection(db, 'votiAppunti'),
				where('idUtente', '==', $authStore.user.uid)
			);

			getDocs(queryReazioni).then((res) => {
				res.docs.forEach((doc) => {
					reazioniAppunti = [...reazioniAppunti, doc];
				});

				// Aggiorno lo store delle reazioni
				appuntiReagiti.update((oldReaction) => reazioniAppunti);
				messoLike();
				messoDislike();
			});
		}
	});

	const messoLike = () => {
		if ($authStore.isLoggedIn) {
			if (
				$appuntiReagiti.find(
					(element) => element.data().idAppunto == appunto.id && element.data().operazione == 'like'
				)
			) {
				console.log('entrato 1');
				uiLocaleLike = 'liked';
				uiLocaleDislike = 'dislike';
				console.log($appuntiReagiti[0].data());
			}
		}
	};

	const messoDislike = () => {
		// COntrollo se sono loggato
		if ($authStore.isLoggedIn) {
			if (
				$appuntiReagiti.find(
					(element) =>
						element.data().idAppunto == appunto.id && element.data().operazione == 'dislike'
				)
			) {
				uiLocaleDislike = 'disliked';
				uiLocaleLike = '';
				console.log('entrato 2');
			}
		}
	};
</script>

<div in:fly={{ y: 100, duration: 1000 }} out:fade class="appunto">
	<div class="up-part">
		<div class="nome-immagine">
			<div on:click={() => redirectProfilo(appunto.data().idUtente)} class="avatar">
				<img src={appunto.data().avatar} alt="" />
			</div>
			<p>{appunto.data().nome}</p>
		</div>
		<button on:click={eliminaAppunto} class="delete-appunto">🗑️</button>
	</div>

	<div class="contenuto">
		<p>{appunto.data().contenuto}</p>
	</div>

	<div class="box-bottoni">
		<div class="voti">
			<a
				class="download-button"
				target="_blank"
				href={appunto.data().urlAppunti}
				download={appunto.data().titoloAppunti}>⬇️ SCARICA</a
			>
			<ModalRevisione {appunto} />
		</div>
	</div>
</div>

<style>
	.appunto {
		width: 260px;
		height: 200px;
		background-color: #69188b;
		padding: 0.5rem;
		border-radius: 0.8rem;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}
	.nome-immagine {
		display: flex;
		gap: 1rem;
		justify-content: left;
		align-items: center;
	}
	.avatar {
		width: 75px;
		height: 75px;
		border-radius: 50%;
		cursor: pointer;
	}

	.avatar > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
	}

	.contenuto {
		color: white;
		white-space: normal;
		overflow-wrap: break-word;
	}

	.voti {
		display: flex;
		gap: 1rem;
		justify-content: space-around;
		align-items: center;
	}

	button {
		border-radius: 0.5rem;
		border: none;
		outline: none;
		padding: 0.3rem;
		cursor: pointer;
	}

	.download-button {
		border-radius: 0.5rem;
		border: none;
		outline: none;
		padding: 0.3rem;
		background-color: rgb(0, 76, 121);
		text-decoration: none;
		color: white;
		font-weight: 600;
	}
	.delete-appunto {
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

	.delete-appunto:hover {
		background-color: rgb(41, 41, 41);
	}

	
</style>
