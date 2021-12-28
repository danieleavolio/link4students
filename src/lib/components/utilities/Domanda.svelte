<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, db } from '$lib/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';
	import {
		addDoc,
		collection,
		deleteDoc,
		doc,
		getDoc,
		getDocs,
		query,
		setDoc,
		where
	} from 'firebase/firestore';

	export let domanda;

	let rispondendo = false;
	let risposta = '';

	let mostraRisposte = false;
	let listaRisposte = [];

	const redirectProfilo = (id) => {
		goto(`/profilo/${id}`);
	};

	const eliminaDomanda = () => {
		deleteDoc(doc(db, 'domande', domanda.id))
			.then(() => {
				alert('Domanda eliminata');
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
				nomeRispondente: ref.data().nome
			};

			addDoc(collection(db, 'risposte'), dati)
				.then(() => {
					alert('Risposta inviata');
					rispondendo = false;
				})
				.catch((error) => {
					alert(error.message);
				});
		});
	};

	const getListaRisposte = () => {
		const queryRisposte = query(collection(db, 'risposte'), where('idDomanda', '==', domanda.id));
		getDocs(queryRisposte).then((res) => {
			listaRisposte = res.docs;
		});
	};
</script>

<div class="domanda">
	<div class="up-part">
		<!-- Se non sei loggato, allora vedi la domanda -->
		{#if !$authStore.isLoggedIn}
			{#if !domanda.data().anonimo}
				<div class="avatar" on:click={() => redirectProfilo(domanda.data().idAutore)}>
					<img src="/images/userPic.png" alt="" />
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
				<img src="/images/userPic.png" alt="" />
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
			<button>Risposte</button>
			{#if $authStore.isLoggedIn}
				<button on:click={() => (rispondendo = !rispondendo)}>Rispondi</button>
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

		{#if mostraRisposte}
			{#each listaRisposte as risposta (risposta.id)}{/each}
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
		width: 100%;
		height: 100%;
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
</style>
