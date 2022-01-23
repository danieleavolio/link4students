<script context="module">
	export async function load({}) {
		let listaBannati = [];
		const qBannati = query(collection(db, 'banTimes'));
		const idBannati = await getDocs(qBannati);
		for (const bannato of idBannati.docs) {
			await getDoc(doc(db, 'users', bannato.id)).then((user) => {
				listaBannati = [...listaBannati, user];
				console.log('FINE GET DOC');
			});
		}

		console.log('B4 RETURN');

		return {
			props: { idBannati, listaBannati }
		};
	}
</script>

<script>
	import { db } from '$lib/firebaseConfig';

	import { collection, deleteDoc, doc, getDoc, getDocs, query } from 'firebase/firestore';

	export let listaBannati;
    export let idBannati;

	const deleteBan = (uid) => {
        // TODO
	};
</script>

<h1>Gestione degli utenti sospesi</h1>
<div class="container">
	<h3>Lista degli utenti bannati</h3>
	<div class="lista-bannati">
		{#each listaBannati as bannato}
			<div class="utente-bannato">
				<div class="avatar">
					<img src={bannato.data().avatar} alt="" />
				</div>
				<p class="nome-cognome">{bannato.data().nome} {bannato.data().cognome}</p>
				<button on:click={()=> deleteBan(bannato.uid)} class="unban">Unban</button>
			</div>
		{/each}
	</div>
</div>

<style>
	.container {
		width: 90%;
		display: flex;
		justify-content: center;
		align-items: center;
		align-self: center;
		flex-direction: column;
	}

	.lista-bannati {
		gap: 1em;
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.utente-bannato {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		place-items: center;
		box-shadow: var(--neumorphism);
		border-radius: 0.5em;
		padding: 0.5em;
		width: 50%;
		place-self: center;
	}
	.avatar {
		width: 80px;
		height: 80px;
		border-radius: 100%;
		border: var(--bordo);
	}

	img {
		width: 80px;
		height: 80px;
		object-fit: cover;
		border-radius: 100%;
	}
	.unban {
		color: var(--resolve);
		width: fit-content;
		font-size: 1.2em;
		border-radius: 0.3em;
		cursor: pointer;
	}
</style>
