<script>
import { goto } from '$app/navigation';

	import { db } from '$lib/firebaseConfig';

	import { authStore } from '$lib/stores/authStore';
	import { deleteDoc, doc } from '@firebase/firestore';
	import { fly,fade } from "svelte/transition";
	export let risposta;

	export let eliminaRisposta = () => {
		deleteDoc(doc(db, 'risposte', risposta.id))
			.then(() => {
				alert('Risposta eliminata!');
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	const redirectProfilo = (id) => {
		goto(`/profilo/${id}`);
	};
</script>

<div in:fly out:fade class="container-risposta">
	<div class="up-part">
		<div class="avatar">
			<img on:click={() => redirectProfilo(risposta.data().idRispondente)} src={risposta.data().avatarRispondente} alt="" />
		</div>
		<div class="nome">
			<p >{risposta.data().nomeRispondente}</p>
		</div>
	</div>
	{#if $authStore.isLoggedIn}
		{#if $authStore.user.uid == risposta.data().idRispondente}
			<button on:click={eliminaRisposta} class="delete-risposta"><span class="material-icons">
				delete
				</span></button>
		{/if}
	{/if}

	<div class="down-part">
		<div class="contenuto">
			<p>{risposta.data().contenuto}</p>
		</div>
		<div class="box-bottoni" />
	</div>
</div>

<style>
	.container-risposta {
		border-radius: 15px;
		width: 80%;
		padding: 0.5rem;
		align-self: end;
		margin: 1rem 0;
		box-shadow: var(--neumorphism);
	}

	.up-part {
		display: flex;
		gap: 1rem;
		justify-content: left;
		align-items: center;
	}

	.delete-risposta {
		display: flex;
		justify-content: center;
		align-items: center;
		align-self: center;
		border-radius: 100%;
		font-weight: 600;
		font-size: 1.3rem;
		color: var(--alert);
		height: 50px;
		width: 50px;
		cursor: pointer;
		transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
		position: absolute;
		margin-left: -2rem;
		margin-top: -6rem;
	}

	

	.avatar {
		max-width: 50px;
		max-height: 50px;
		border-radius: 100%;
		border: var(--bordo);
		cursor: pointer;
	}

	.avatar > img {
		width: 50px;
		height: 50px;
        border-radius: 100%;
		object-fit: cover;
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
		overflow-wrap: break-word;
		margin: 1rem;
		font-size: 1rem;
	}

	.box-bottoni {
		display: flex;
		justify-content: space-between;
	}
</style>
