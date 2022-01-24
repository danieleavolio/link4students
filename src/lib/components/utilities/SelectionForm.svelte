<script>
	export let icon;

	export let difficolta;
	export let utilita;

	const cambiaDifficolta = (num) => {
		difficolta = num;
	};

	const cambiaUtilita = (num) => {
		utilita = num;
	};
</script>

{#if icon == '🧠'}
	<div class="elementi">
		<ul class="rating">
			<li>
				<input
					checked={difficolta == 1}
					type="radio"
					id="num1"
					value="1"
					on:change={() => cambiaDifficolta(1)}
				/>
				<label for="num1">1 <span class="material-icons"> psychology </span></label>
			</li>
			<li>
				<input
					checked={difficolta == 2}
					type="radio"
					id="num2"
					value="2"
					on:change={() => cambiaDifficolta(2)}
				/>
				<label for="num2">2 <span class="material-icons"> psychology </span></label>
			</li>
			<li>
				<input
					checked={difficolta == 3}
					type="radio"
					id="num3"
					value="3"
					on:change={() => cambiaDifficolta(3)}
				/>
				<label for="num3">3 <span class="material-icons"> psychology </span></label>
			</li>

			<li>
				<input
					checked={difficolta == 4}
					type="radio"
					id="num4"
					value="4"
					on:change={() => cambiaDifficolta(4)}
				/>
				<label for="num4">4 <span class="material-icons"> psychology </span></label>
			</li>
			<li>
				<input
					checked={difficolta == 5}
					type="radio"
					id="num5"
					value="5"
					on:change={() => cambiaDifficolta(5)}
				/>
				<label for="num5">5 <span class="material-icons"> psychology </span></label>
			</li>
		</ul>
	</div>
{:else if icon == '🎓'}
	<div class="elementi">
		<ul class="rating">
			<li>
				<input
					checked={utilita == 1}
					type="radio"
					id="num6"
					value="1"
					on:change={() => cambiaUtilita(1)}
				/>
				<label for="num6">1 <span class="material-icons"> stars </span></label>
			</li>
			<li>
				<input
					checked={utilita == 2}
					type="radio"
					id="num7"
					value="2"
					on:change={() => cambiaUtilita(2)}
				/>
				<label for="num7">2 <span class="material-icons"> stars </span></label>
			</li>
			<li>
				<input
					checked={utilita == 3}
					type="radio"
					id="num8"
					value="3"
					on:change={() => cambiaUtilita(3)}
				/>
				<label for="num8">3 <span class="material-icons"> stars </span></label>
			</li>

			<li>
				<input
					checked={utilita == 4}
					type="radio"
					id="num9"
					value="4"
					on:change={() => cambiaUtilita(4)}
				/>
				<label for="num9">4 <span class="material-icons"> stars </span></label>
			</li>
			<li>
				<input
					checked={utilita == 5}
					type="radio"
					id="num10"
					value="5"
					on:change={() => cambiaUtilita(5)}
				/>
				<label for="num10">5 <span class="material-icons"> stars </span></label>
			</li>
		</ul>
	</div>
{/if}

<style>
	.rating {
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin: 10px;
		list-style: none;
		gap: 1rem;
		padding: 0;
	}

	li {
		text-decoration: none;
		marker: none;
	}

	li > input[type='radio'] {
		opacity: 0;
		display: none;
	}

	li > label {
		width: 50px;
		height: 50px;
		padding: 0.5rem;
		cursor: pointer;
		box-shadow: var(--neumorphism);
		border-radius: 10px;
		transition: var(--velocita);
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	li > label:hover {
		box-shadow: var(--innerNeu);
		transform: var(--premuto);
	}
	input[type='radio']:checked ~ label {
		background-color: var(--submit);
	}

	input[type='radio']:checked ~ label:hover {
		box-shadow: var(--neumorphism);
	}
</style>
