import { getEtudiant,
    addEtudiantToStore,
    deleteEtudiantToStore,
    updateEtudiantToStore
} from "../Store/studentStore.js";

import { formatTaskDate,genererId } from "../utils/helpers.js";

export function createEtudiantObject(prenom, nomFamille, role, mail, telephone) {
    return {
        id:        genererId(),
        nom:       `${prenom} ${nomFamille}`,
        role:      role,
        mail:      mail,
        telephone: telephone,
        date:      formatTaskDate(),
    };
}

export async function addEtudiant(prenom, nomFamille, role, mail, telephone) {
    const etudiant = createEtudiantObject(prenom, nomFamille, role, mail, telephone);
    await addEtudiantToStore(etudiant);
    return etudiant;
}

export async function deleteEtudiant(id) {
    await deleteEtudiantToStore(id);
}

export async function updateEtudiant(id, donnees) {
    await updateEtudiantToStore(id, donnees);
}

export async function getAllEtudiants() {
    return await getEtudiant();
}

// export async function getEtudiantStats() {
//     const etudiants = await getEtudiant();

//     return {
//         total:           etudiants.length,
//         etudiants:       etudiants.filter(e => e.role === 'Etudiant').length,
//         professeurs:     etudiants.filter(e => e.role === 'Professeur').length,
//         administrateurs: etudiants.filter(e => e.role === 'Administrateur').length,
//     };
// }