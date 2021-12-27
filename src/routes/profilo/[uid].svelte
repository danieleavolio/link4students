<script context="module">
	import { auth, db, storage } from '$lib/firebaseConfig';
	import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
	export async function load({ page }) {
		// Prendere da Firebase le informazioni dell'utente come singolo documento
		// per utilizzarlo all'interno della pagina per scegliere cosa mostrare.

		const uid = page.params.uid;
		const collectionRef = collection(db, 'users');
		const queryToDo = query(collectionRef, where('uid', '==', uid));
		let profilo = {};
		await getDocs(queryToDo).then((document) => {
			let docs = document.docs;
			profilo = docs[0].data();
		});
		return {
			props: { profilo }
		};
	}
</script>

<script lang="ts">
	export let profilo;
	import { authStore } from '$lib/stores/authStore';
	import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
	import { fade } from 'svelte/transition';
	let profilePicture;
	let file;
	const onChange = () => {
		// Quando scelgo l'immagine viene assegnato a questo file
		file = profilePicture.files[0];
	};

	let modificaBio = false;
	let contenutoBio = profilo.bio != undefined ? profilo.bio : 'Bio vuota..';

	const cambiaFoto = () => {
		if (file) {
			let picturesRef = ref(storage, `profilePictures/${file.name}`);
			// Carico l'immagine del profilo nel database
			uploadBytes(picturesRef, file).then(() => {
				// Prendo l'url dell'immagine appena caricata
				getDownloadURL(picturesRef).then((url) => {
					// Aggiorno l'immagine del profilo dell'utente con il link di quello caricato
					setDoc(
						doc(db, 'users', $authStore.user.uid),
						{
							avatar: url
						},
						{ merge: true }
					).then(() => {
						// Ricarica la pagina per le modifiche
						location.reload();
					});
				});
			});
		} else {
			alert('Errore caricamento immagine');
		}
	};

	const cambiaBio = () => {
		// Controllo
		if ($authStore.isLoggedIn) {
			// Controllo
			if ($authStore.user.uid == profilo.uid)
				// Modifico il documento dell'utente con la nuova bio
				setDoc(
					doc(db, 'users', $authStore.user.uid),
					{
						bio: contenutoBio
					},
					{ merge: true }
				).then(() => {
					// Dopo aver cambiato bio
					profilo.bio = contenutoBio;
					modificaBio = false;
				});
		}
	};
</script>

<svelte:head>
	<title>Profilo</title>
</svelte:head>
<h1>Profilo</h1>
<div class="container-profilo">
	<div class="avatar">
		<div class="image-div">
			<img src={profilo.avatar} alt="" />
		</div>
		{#if $authStore.isLoggedIn}
			{#if profilo.uid == $authStore.user.uid}
				<div transition:fade class="cambia-immagine">
					<form on:submit|preventDefault={cambiaFoto} action="">
						<label class="bottone-file" for="file">Cambia immagine del profilo</label>
						<input
							class="da-nascondere"
							type="file"
							bind:this={profilePicture}
							on:change={onChange}
							accept="images/*"
							id="file"
						/>
						{#if file}
							<button transition:fade class="conferma">Conferma</button>
						{/if}
					</form>
				</div>
			{/if}
		{/if}
	</div>
	<div class="info">
		<p class="nomecognome">{profilo.nome} {profilo.cognome}</p>
		<p>Matricola: {profilo.matricola}</p>
		<p>Corso di Laurea: {profilo.nomeCorsoLaurea}</p>
		<p>Anno di corso: {profilo.annoDiCorso}</p>
	</div>
	<div class="bio">
		<p>Bio</p>
		<div class="container-bio">
			{#if !modificaBio}
				{#if profilo.bio}
					<p>{profilo.bio}</p>
				{:else}
					<p class="bio-vuota">{contenutoBio}</p>
				{/if}
			{:else}
				<div class="modifica-bio">
					<textarea
						bind:value={contenutoBio}
						name="modificaBio"
						id="modificabio"
						cols="30"
						rows="3"
						placeholder="Inserisci ciò che vuoi!"
						class="textarea-bio"
						required
						minlength="10"
					/>
					<button class="button-salva" on:click={cambiaBio}>Salva</button>
				</div>
			{/if}
		</div>

		{#if $authStore.isLoggedIn}
			{#if profilo.uid == $authStore.user.uid && !modificaBio}
				<button class="button-modifica" on:click={() => (modificaBio = true)}>Modifica</button>
			{/if}
		{/if}
	</div>
</div>

<style>
	.container-profilo {
		display: flex;
		flex-wrap: wrap;
		width: 80%;
		box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);
		border-radius: 20px;
		padding: 1rem;
		justify-content: space-around;
		align-items: center;
	}

	.image-div {
		width: 200px;
		height: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.image-div > img {
		width: 100%;
		height: 100%;
		border-radius: 100%;
		border: black solid;
		object-fit: cover;
	}
	.avatar {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.button-modifica {
		border: none;
		outline: none;
		padding: 0.4rem 0;
		border-radius: 6px;
		background-color: skyblue;
		text-transform: uppercase;
		cursor: pointer;
		width: 50%;
		align-self: center;
	}

	.button-salva {
		width: 60%;
		border: none;
		outline: none;
		padding: 0.4rem 0;
		border-radius: 6px;
		background-color: rgb(173, 135, 235);
		text-transform: uppercase;
		cursor: pointer;
	}
	.modifica-bio {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
	}

	.textarea-bio {
		border: none;
		border-radius: 6px;
		outline: none;
		box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5), -5px -5px 5px rgba(176, 191, 255, 0.5);
		resize: none;
		padding: 0.3rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		justify-content: center;
		align-items: center;
	}

	.bottone-file {
		background-color: antiquewhite;
		border-radius: 5px;
		border: none;
		padding: 5px 10px;
		box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}

	.conferma {
		cursor: pointer;
		background-color: rgba(55, 255, 131, 0.753);
		border-radius: 8px;
		border: none;
		outline: none;
		padding: 5px 10px;
		width: 50%;
	}
	.da-nascondere {
		opacity: 0;
		display: none;
	}

	.nomecognome {
		font-size: 1.5rem;
	}

	.bio {
		display: flex;
		flex-direction: column;
		align-items: left;
		justify-content: space-around;
		width: 400px;
		overflow-wrap: break-word;
	}

	.bio > p {
		text-align: center;
	}

	.container-bio {
		width: 80%;
		font-style: italic;
		box-shadow: 0 5px 5px rgba(176, 191, 255, 0.5);
		border-radius: 10px;
		align-self: center;
		margin: 0.5rem;
	}
</style>
