const STORAGE_KEY = "http://localhost:3000/etudiants"

import { formatTaskDate } from "../utils/helpers.js";

function normalizeEtudiant(raw) {
    return {
        id:        raw.id,
        nom:       raw.nom,
        role:      raw.role,
        mail:      raw.mail,
        telephone: raw.telephone,
        date:      raw.date ? raw.date : formatTaskDate(),
    };
}

// Gestion de la persistance des etudiants dans le localStorage

// export function sauvegarderEtudiants(etudiants) {
//     // On sauvegarde les etudiants dans le localStorage en les stringifyant
//     localStorage.setItem('etudiants', JSON.stringify(etudiants));
// }

// export async function getTasks() {
//   const res = await fetch(STORAGE_KEY)
//   const data = await res.json()
//   return Array.isArray(data) ? data.map(normalizeTask) : [];
// }

export async function getEtudiant(){
    const res = await fetch(STORAGE_KEY)
    const data = await res.json()
    return Array.isArray(data) ? data.map(normalizeEtudiant) : [];
}

// export function chargerEtudiants() {
//     // On charge les donnees en les recuperant
//     const donnees = localStorage.getItem('etudiants');
//     // On retourne en fonction de l'existence de donnees
//     return donnees ? JSON.parse(donnees) : [];
// }

// export function ajouterEtudiantAuStockage(etudiant) {
//     // Creation d'une constante ou on recupere les donnees
//     const etudiants = chargerEtudiants();
//     // On push les donnees dans le tableau de l'etudiant
//     etudiants.push(etudiant);
//     // On sauvegarde les donnees avec la fonction
//     sauvegarderEtudiants(etudiants);
// }

export async function addEtudiantToStore(etudiant) {
    const etudiantNormalise = normalizeEtudiant(etudiant);

    const res = await fetch(STORAGE_KEY, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(etudiantNormalise)
    });

    return await res.json();
}

// export async function addTaskToStore(task) {
//   const normalized = normalizeTask(task);

//   const res = await fetch(STORAGE_KEY, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(normalized),
//   });

//   return await res.json();
// }

// export function supprimerEtudiantDuStockage(id) {
//     const etudiants = chargerEtudiants();
//     const idNumber = Number(id); // Convertit la string en nombre
//     const etudiantsFiltres = etudiants.filter(e => e.id !== idNumber);
//     sauvegarderEtudiants(etudiantsFiltres);
// }

export async function deleteEtudiantToStore(id) {
    await fetch(`${STORAGE_KEY}/${id}`, { method: "DELETE" });
}

export async function updateEtudiantToStore(id, etudiant) {
    const etudiantNormalise = normalizeEtudiant(etudiant);
    await fetch(`${STORAGE_KEY}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(etudiantNormalise) // etudiant -> etudiantNormalise
    });
}


// export function modifierEtudiantDansStockage(id, nouvellesDonnees) {
//     // 1. Recuperer la liste
//     const etudiants = chargerEtudiants();

//     // 2. Chercher l'etudiant
//     const index = etudiants.findIndex(e => e.id === Number(id));

//     // 3. Si trouve, on modifie
//     if (index !== -1) {
//         // Mettre a jour chaque champ
//         if (nouvellesDonnees.nom)       etudiants[index].nom       = nouvellesDonnees.nom;
//         if (nouvellesDonnees.role)      etudiants[index].role      = nouvellesDonnees.role;
//         if (nouvellesDonnees.mail)      etudiants[index].mail      = nouvellesDonnees.mail;
//         if (nouvellesDonnees.telephone) etudiants[index].telephone = nouvellesDonnees.telephone;
//         // La date ne change PAS

//         // 4. Sauvegarder
//         sauvegarderEtudiants(etudiants);

//         console.log(`Etudiant ${id} modifie !`);
//         return true;
//     } else {
//         console.log(`Etudiant ${id} non trouve !`);
//         return false;
//     }
// }
