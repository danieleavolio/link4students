<script>

</script>


<h2>Benvenuto amministratore</h2>
<div class="scegli-sezione">
    <button on:click={() => ((sezione = 'segnalazioni'), (azione = ''))} class="bottone"
        >Segnalazioni</button
    >
    <button on:click={() => ((sezione = 'gestione-corsi'), (azione = ''))} class="bottone"
        >Gestione Corsi</button
    >
</div>
<div class="prima-sezione">
    <div class="prima-sinistra">
        <div class="lista-schermate">
            <p>Lista schermate</p>
            <button on:click={clickUtenti} class="bottone">Utenti</button>
            <button on:click={clickRecensioni} class="bottone">Recensioni</button>
            <button on:click={clickDomande} class="bottone">Domande</button>
            <button on:click={clickAppunti} class="bottone">Appunti</button>
        </div>
    </div>
    <div class="prima-destra">
        <div class="schermata-selezionata">
            {#if schermata == 'utenti'}
                <p class="selezionato">Segnalazioni {schermata}</p>
                {#if listaUtenti.length == 0}
                    <VuotoDash oggetti="utenti" />
                {:else}
                    <div class="lista-generica">
                        {#each listaUtenti as oggettoSegnalazione (oggettoSegnalazione.segnalazione.id)}
                            <UtenteDash
                                {oggettoSegnalazione}
                                {cambiaUtentiSegnalati}
                                {risolviSegnalazioneUtente}
                            />
                        {/each}
                    </div>
                {/if}
            {:else if schermata == 'recensioni'}
                <p class="selezionato">Segnalazioni {schermata}</p>
                {#if listaRecensioni.length == 0}
                    <VuotoDash oggetti="recensioni" />
                {:else}
                    <div class="lista-generica">
                        {#each listaRecensioni as oggettoSegnalazione (oggettoSegnalazione.segnalazione.id)}
                            <RecensioneDash
                                {oggettoSegnalazione}
                                {cambiaRecensioniSegnalate}
                                {risolviRecensione}
                            />{/each}
                    </div>
                {/if}
            {:else if schermata == 'domande'}
                <p class="selezionato">{schermata} da visionare</p>
                {#if listaDomande.length == 0}
                    <VuotoDash oggetti="domande" />
                {:else}
                    <div class="lista-generica">
                        {#each listaDomande as oggettoSegnalazione (oggettoSegnalazione.domanda.id)}
                            <DomandaDash
                                {oggettoSegnalazione}
                                {risolviSegnalazioneDomanda}
                                {cambiaDomandeSegnalate}
                            />
                        {/each}
                    </div>
                {/if}
            {:else if schermata == 'appunti'}
                <p class="selezionato">{schermata} da visionare</p>
                {#if listaAppunti.length == 0}
                    <VuotoDash oggetti="appunti" />
                {:else}
                    <div class="lista-generica">
                        {#each listaAppunti as appunto (appunto.id)}
                            <AppuntoDash {appunto} />
                        {/each}
                    </div>
                {/if}
            {/if}
        </div>
    </div>
</div>
<div class="gestione-corsi">
    <h1>Gestione dei corsi</h1>
    <div class="pagina-azioni">
        <BoxSelezioneAzione emoji={'🎓'} azione="Gestisci Corsi di Laurea" />
        <BoxSelezioneAzione emoji={'📜'} azione="Gestisci Singoli Corsi" />
    </div>
</div>
<style>

</style>