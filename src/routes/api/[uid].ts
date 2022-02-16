// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

import { db } from "$lib/firebaseConfig"
import { collection, getDocs, query, where } from "firebase/firestore"

const getExams = async (uid) => {
    
    const queryExams = query(collection(db, 'esamiLibretto'), where('uidUtente', '==', uid));
    const exams = [];
    await getDocs(queryExams).then((esami) => {
        if (!esami.empty)
            esami.forEach(element => {
                exams.push(element.data())
            });

    })

    return exams;
}


export async function get({ params }) {
    console.log(params.uid);
    
    return {
        body:await getExams(params.uid),
    }
}