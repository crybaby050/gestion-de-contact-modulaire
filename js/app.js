// Point d'entree principal - orchestre tous les modules

import { formulaire, countStudent, search, toutSupp, cardContainer } from './DOM/elements.js';
import { getAllEtudiants, addEtudiant, deleteEtudiant, updateEtudiant } from './Service/studentService.js';
import { validerFormulaire, nettoyerErreurs } from './validation/validationService.js';
import { creerCarteEtudiant } from './UI/card.js';
import { createModal } from './UI/modal.js';
import { afficherMessageGlobal } from './UI/notification.js';
import { renderPagination } from './UI/pagination.js';

let etudiantEnModification = null;
let dateOriginale = null;

// --- PAGINATION ---
const CARDS_PAR_PAGE = 8;
let pageActuelle = 1;
let toutesLesCartes = []; // tableau de noeuds DOM de toutes les cartes

function getCardContext() {
    return {
        updateStudentCount,
        changerFormulaireEnModeModification,
        setEtudiantEnModification: (id) => { etudiantEnModification = id; },
        setDateOriginale: (date) => { dateOriginale = date; },
        retirerCarte: (id) => {
            toutesLesCartes = toutesLesCartes.filter(c => c.dataset.id !== String(id));
            afficherPage(pageActuelle);
        },
        formulaire
    };
}

// Affiche uniquement les cartes de la page courante et rien du tout d'autre
function afficherPage(page) {
    const terme = search.value.toLowerCase().trim();

    const cartesFiltrees = toutesLesCartes.filter(carte =>
        carte.textContent.toLowerCase().includes(terme)
    );

    const totalPages = Math.max(1, Math.ceil(cartesFiltrees.length / CARDS_PAR_PAGE));
    pageActuelle = Math.min(page, totalPages);

    const debut = (pageActuelle - 1) * CARDS_PAR_PAGE;
    const fin   = debut + CARDS_PAR_PAGE;

    cardContainer.innerHTML = '';
    cartesFiltrees.slice(debut, fin).forEach(carte => cardContainer.appendChild(carte));

    updateDeleteBtnState();
    renderPagination(totalPages, pageActuelle, cardContainer, afficherPage);
}

// Mettre a jour l'etat du bouton supprimer selon les cases cochees
function updateDeleteBtnState() {
    const checkboxesCochees = cardContainer.querySelectorAll('.card-checkbox:checked');
    const assezCoches = checkboxesCochees.length >= 3;
    toutSupp.disabled = !assezCoches;
    toutSupp.style.opacity = assezCoches ? '1' : '0.5';
    toutSupp.style.cursor = assezCoches ? 'pointer' : 'not-allowed';
}

// Ecouter les changements de checkbox sur le container
cardContainer.addEventListener('change', (e) => {
    if (e.target.classList.contains('card-checkbox')) {
        updateDeleteBtnState();
    }
});

document.addEventListener('DOMContentLoaded', async function () {
    updateDeleteBtnState();

    const etudiants = await getAllEtudiants();
    etudiants.forEach(etudiant => {
        const carte = creerCarteEtudiant(
            etudiant.id,
            etudiant.nom,
            etudiant.role,
            etudiant.mail,
            etudiant.telephone,
            etudiant.date,
            getCardContext()
        );
        toutesLesCartes.push(carte);
    });

    afficherPage(1);
    updateStudentCount();
});

async function updateStudentCount() {
    const etudiants = await getAllEtudiants();
    countStudent.textContent = etudiants.length;
}

formulaire.addEventListener("submit", async (e) => {
    e.preventDefault();

    const prenom     = document.getElementById("prenom").value.trim();
    const nomFamille = document.getElementById("nom").value.trim();
    const nomComplet = `${prenom} ${nomFamille}`;
    const role       = document.getElementById("role").value;
    const mail       = document.getElementById("mail").value.trim();
    const telephone  = document.getElementById("telephone").value.trim();

    // VALIDATION
    if (!validerFormulaire(prenom, nomFamille, role, mail, telephone)) {
        afficherMessageGlobal('Veuillez corriger les erreurs ci-dessous', true);
        return;
    }

    nettoyerErreurs();


    const tousLesEtudiants = await getAllEtudiants();
    const doublon = tousLesEtudiants.find(e => {
        const estLuiMeme = String(e.id) === String(etudiantEnModification);
        return !estLuiMeme && (e.mail === mail || e.telephone === telephone);
    });
    if (doublon) {
        if (doublon.mail === mail) {
            afficherMessageGlobal('Cet email est deja utilise par un autre etudiant.', true);
        } else {
            afficherMessageGlobal('Ce numero de telephone est deja utilise par un autre etudiant.', true);
        }
        return;
    }

    if (etudiantEnModification) {
        // MODIFICATION
        await updateEtudiant(etudiantEnModification, {
            nom:       nomComplet,
            role:      role,
            mail:      mail,
            telephone: telephone
        });

        const index = toutesLesCartes.findIndex(c => c.dataset.id === String(etudiantEnModification));
        if (index !== -1) {
            const nouvelleCarte = creerCarteEtudiant(
                etudiantEnModification,
                nomComplet,
                role,
                mail,
                telephone,
                dateOriginale,
                getCardContext()
            );
            toutesLesCartes[index] = nouvelleCarte;

            nouvelleCarte.style.transform = 'scale(1.05)';
            nouvelleCarte.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                nouvelleCarte.style.transform = 'scale(1)';
            }, 300);
        }

        afficherPage(pageActuelle);
        afficherMessageGlobal('Etudiant modifie avec succes !', false);
        annulerModification();

    } else {
        // AJOUT
        const nouvelEtudiant = await addEtudiant(prenom, nomFamille, role, mail, telephone);

        const carte = creerCarteEtudiant(
            nouvelEtudiant.id,
            nouvelEtudiant.nom,
            nouvelEtudiant.role,
            nouvelEtudiant.mail,
            nouvelEtudiant.telephone,
            nouvelEtudiant.date,
            getCardContext()
        );
        toutesLesCartes.push(carte);

        // Aller a la derniere page pour voir le nouvel etudiant
        const totalPages = Math.ceil(toutesLesCartes.length / CARDS_PAR_PAGE);
        afficherPage(totalPages);

        afficherMessageGlobal('Etudiant ajoute avec succes !', false);
        updateStudentCount();
        formulaire.reset();
    }
});

// Recherche en temps reel
search.addEventListener("input", () => {
    afficherPage(1);
});

// Supprimer les etudiants coches (minimum 3 et pas moins)
toutSupp.addEventListener("click", () => {
    const checkboxesCochees = cardContainer.querySelectorAll('.card-checkbox:checked');

    createModal(`Voulez-vous vraiment supprimer les ${checkboxesCochees.length} contacts cochés ?`, async () => {
        const idsASupprimer = [...checkboxesCochees].map(cb => cb.dataset.id);
        await Promise.all(idsASupprimer.map(id => deleteEtudiant(id)));

        toutesLesCartes = toutesLesCartes.filter(c => !idsASupprimer.includes(c.dataset.id));

        afficherPage(pageActuelle);
        updateStudentCount();
        updateDeleteBtnState();
    });
});

// Passer en mode MODIFICATION
function changerFormulaireEnModeModification() {
    const submitBtn = formulaire.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Enregistrer MODIF';

    if (!document.getElementById('cancelModif')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancelModif';
        cancelBtn.type = 'button';
        cancelBtn.textContent = 'Annuler';
        cancelBtn.style.cssText = `
            background: #b6b6b6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            width: 100%;
        `;
        cancelBtn.addEventListener('click', annulerModification);
        formulaire.appendChild(cancelBtn);
    }

    toutSupp.disabled = true;
    toutSupp.style.opacity = '0.5';
}

// Revenir en mode AJOUT
function annulerModification() {
    etudiantEnModification = null;
    dateOriginale = null;

    formulaire.reset();

    const submitBtn = formulaire.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Ajouter';
    submitBtn.style.background = '';

    const cancelBtn = document.getElementById('cancelModif');
    if (cancelBtn) cancelBtn.remove();

    toutSupp.disabled = false;
    toutSupp.style.opacity = '1';
    updateDeleteBtnState();

    console.log('Modification annulee');
}