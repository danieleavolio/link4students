<script lang="ts">
	import { onMount } from 'svelte';

	export let social;
	export let url: string;
	export let user;
	export let username;

	let tempUrl = url;

	onMount(() => {
		if (user.data().socials != null)
			username =
				user.data().socials[user.data().socials.findIndex((elem) => elem.social == social)]
					.username;
	});

	$: url = `${tempUrl}${username}`;
</script>

<div class="social">
	<div class="left">
		<img src="/images/logos/{social}.svg" class="social" alt="" />
		<p>{social.toUpperCase()}</p>
	</div>
	<div class="right">
		<input bind:value={username} type="text" class="url" />
	</div>
</div>

<style>
	.social {
		height: 100%;
		width: 80%;
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 1em;
	}

    .right{
        display: flex;
        align-items: center;
    }
	.left {
		display: flex;
		gap: 1em;
		align-items: center;
	}
	.left > img {
		width: 50px;
		height: 50px;
		border-radius: 100%;
	}
	.url {
		width: 100%;
	}

	@media screen and (max-width: 800px) {
		.left > p {
			display: none;
		}
	}
</style>
