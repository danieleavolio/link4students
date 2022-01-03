<script>
	import { db } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';

	import { addDoc, collection, deleteDoc, doc, getDoc } from 'firebase/firestore';

	export let richiesta;

	const handleAccetta = async () => {
		// Creo il collegamento tra i due
		let dati = {
			idUtente: $authStore.user.uid,
			idCollegato: richiesta.data().uidMittente,
			nomeCognomeCollegato: richiesta.data().nomeCognomeMittente,
			avatarCollegato: richiesta.data().avatarMittente
		};
		// Bisogna creare 2 collegamenti per ogni collegamento, perchè ci dev'essere per entrambi
		getDoc(doc(db, 'users', $authStore.user.uid)).then((utente) => {
			let dati2 = {
				idUtente: richiesta.data().uidMittente,
				idCollegato: $authStore.user.uid,
				nomeCognomeCollegato: utente.data().nome + ' ' + utente.data().cognome,
                avatarCollegato: utente.data().avatar
			};
			addDoc(collection(db, 'collegamenti'), dati)
				.then(() => {
					addDoc(collection(db, 'collegamenti'), dati2);
					// una volta creato il documento, cancello la richiesta
					deleteDoc(doc(db, 'richiesteCollegamento', richiesta.id));
				})
				.catch((error) => {
					alert(error.message);
				});
		});
	};

	const handleRifiuta = () => {
		// cancello la richiesta
		deleteDoc(doc(db, 'richiesteCollegamento', richiesta.id));
	};
</script>

<div class="richiesta">
	<div class="dati">
		<div class="avatar">
			<img src={richiesta.data().avatarMittente} alt="" />
		</div>
		<div class="nome-cognome">
			<p>{richiesta.data().nomeCognomeMittente}</p>
		</div>
	</div>
	<div class="scelte">
		<button on:click={handleAccetta} class="accetta">Accetta</button>
		<button on:click={handleRifiuta} class="rifiuta">Rifiuta</button>
	</div>
</div>

<style>
	.richiesta {
		width: 80%;
		display: flex;
		justify-content: space-around;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		box-shadow: 0 8px 10px rgba(0, 0, 0, 0.3);
		padding: 1rem;
		border-radius: 0.4rem;
		margin: 1rem;
	}

	.dati {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
	}

	.avatar {
		width: 75px;
		height: 75px;
		border-radius: 100%;
	}

	.avatar > img {
		width: 75px;
		height: 75px;
		object-fit: cover;
		border-radius: 100%;
	}

	.scelte {
		display: flex;
		gap: 1rem;
	}

	button {
		font-size: 1.2rem;
		border: none;
		padding: 0.5rem;
		cursor: pointer;
		border-radius: 0.5rem;
	}

	.accetta {
		background-color: rgb(85, 85, 243);
	}

	.rifiuta {
		background-color: rgb(187, 42, 42);
	}
</style>
