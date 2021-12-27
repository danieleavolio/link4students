import { writable } from "svelte/store";


// Motivazione del file
// Quando uno studente effettua l'accesso, viene richiesto a firebae
// l'insieme degli esami da lui recensiti
// Questo fa in modo che se uno studente si reca nella pagina dell'esame
// non possa lasciarne un'altra, anzi --> non gli si mostri proprio la possibilità di farlo


export const esamiRecensiti = writable([]);


export const esamiReagiti = writable([]);

export const recensioniSegnalate = writable([]);