<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, db } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';
import { esamiRecensiti } from '$lib/stores/recensioniStore';
	import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from '@firebase/firestore';

	export let recensione;

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
			setDoc(snapshot.docs[0].ref, dati, { merge: true }).then(() => {
				deleteDoc(doc(db,'recensioni',recensione.id)).then(()=>{
					esamiRecensiti.update((oldEsami)=> oldEsami = oldEsami.filter(item => item != recensione.data().idCorso));
					alert('Recensione eliminata!')
				}).catch((error)=>{
					alert(error)
				});
			}).catch((error)=>{
				alert(error)
			});
			// Elimina la recensione dalla collection recensioni
		});
	};
</script>

<div class="recensione">
	<div class="up-part">
		<!-- Se non sei loggato, allora vedi la recensione -->
		{#if !$authStore.isLoggedIn}
			{#if !recensione.data().anonimo}
				<div class="avatar" on:click={() => redirectProfilo(recensione.data().idAutore)}>
					<img src="/images/userPic.png" alt="" />
				</div>
				<div class="nome">
					<p>{recensione.data().nome}</p>
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
			<div class="avatar" on:click={() => redirectProfilo(recensione.data().idAutore)}>
				<img src="/images/userPic.png" alt="" />
			</div>
			<div class="nome">
				<p>{recensione.data().nome}</p>
			</div>
			{#if recensione.data().idAutore == $authStore.user.uid}
				<button on:click={eliminaRecensione} class="delete-review">🗑️</button>
			{/if}
		{:else if recensione.data().idAutore != $authStore.user.uid}
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
			<button on:click={eliminaRecensione} class="delete-review">🗑️</button>
		{/if}
	</div>

	<div class="down-part">
		<div class="contenuto">
			<p>{recensione.data().contenuto}</p>
			<div class="voti">
				<p>{tornaDato(recensione.data().votoDifficolta, '🧠')}</p>
				<p>{tornaDato(recensione.data().votoUtilita, '🎓')}</p>
			</div>
		</div>
		<div class="box-bottoni">
			<div class="like-dislike">
				<p># <button class="like bottone-ld">👍</button></p>
				<p># <button class="dislike bottone-ld">👎</button></p>
			</div>
			<div class="report">
				<button>Segnala</button>
			</div>
		</div>
	</div>
</div>

<style>
	.recensione {
		background-color: mediumseagreen;
		padding: 0.2rem 0;
		border-radius: 20px;
		max-width: 400px;
		width: 400px;
		padding: 0.5rem;
	}
	.up-part {
		display: flex;
		gap: 1rem;
		justify-content: space-between;
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
	}

	.delete-review:hover {
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
		width: 100%;
		height: 100%;
		object-fit: cover;
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
		box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);
		border-radius: 10px;
		padding: 0.5rem;
		overflow-wrap: break-word;
		max-width: 380px;
		width: 100%;
	}

	.voti {
		display: flex;
		justify-content: space-around;
		font-size: 1.3rem;
	}
	.like-dislike {
		display: flex;
		justify-content: left;
	}

	.bottone-ld {
		background: none;
		border: none;
		outline: none;
		cursor: pointer;
		font-size: 1.2rem;
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

	.report > button {
		border: none;
		font-size: 1rem;
		background-color: brown;
		padding: 0.3rem;
		border-radius: 10px;
		color: white;
		cursor: pointer;
	}
</style>
