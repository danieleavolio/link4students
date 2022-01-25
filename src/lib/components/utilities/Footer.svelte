<script>
</script>

<footer>
	<div class="first">
		<div class="box">
			<p class="titolo">Link4Students</p>
			<div class="info">
				<p>Creator: Daniele Avolio</p>
				<p>Motivation: Computer Science Thesis Project</p>
			</div>
		</div>
		<div class="box">
			<p class="main-text">Aiuto</p>
			<a href="/info" class="collegamento">Info</a>
			<a href="/contattaci" class="collegamento">Contattaci</a>
		</div>
		<div class="box">
			<p class="main-text">Social</p>
			<a
				target="_blank"
				href="https://www.linkedin.com/in/daniele-avolio-465aba145/"
				class="collegamento">Linkedin</a
			>
			<a target="_blank" href="https://github.com/danieleavolio" class="collegamento">GitHub</a>
			<a target="_blank" href="https://twitter.com/avolio_daniele" class="collegamento">Twitter</a>
		</div>
	</div>

	<div class="down-bar">
		<p>Copyright 2022 Link4Students. All right reserved</p>
	</div>
</footer>

<style>
	footer {
		box-shadow: var(--neumorphism);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 200px;
		overflow-x: hidden;
		line-height: 1em;
	}

    .first{
        display: grid;
		grid-template-columns: 2fr 1fr 1fr;
		gap: 1rem;
		padding: 1rem;
		width: 97%;
    }
	.box {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		box-shadow: var(--neumorphism);
		border-radius: 1rem;
	}

	.down-bar {
		text-align: center;
		box-shadow: var(--neumorphism);
        width: 80%;
        border-radius: 1rem;
        font-weight: 600;
        margin-bottom: 1rem;
	}

	.titolo {
		font-size: 1.6rem;
		font-weight: 700;
		text-decoration: underline;

	}

	.main-text {
		font-size: 1.3rem;
		font-weight: 600;
		text-decoration: underline;
	}

	.collegamento {
		text-decoration: none;
		color: var(--testo);
		transition: var(--velocita);
		width: fit-content;
		padding: 0.2rem 0.5rem;
		border-radius: 0.5rem;
	}

	.collegamento:hover {
		box-shadow: var(--innerNeu);
	}

	@media screen and (max-width:650px){
		.first{
			grid-template-columns: 3fr 1fr 1fr;
		}
	}

	@media screen and (max-width:500px){
		.first{
			grid-template-columns: 1fr;
		}
	}
</style>
