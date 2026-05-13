// Creation et gestion des cartes etudiants dans le DOM

import { deleteEtudiantToStore } from '../Store/studentStore.js';
import { createModal } from './modal.js';

export function creerCarteEtudiant(id, nom, role, mail, telephone, dateAjout, { updateStudentCount, changerFormulaireEnModeModification, setEtudiantEnModification, setDateOriginale, retirerCarte, formulaire }) {
    // Creer la carte principale
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = id;

    // Card Header
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';

    // Avatar
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = nom.split(' ').map(n => n[0]).join(''); // JD

    // Card Title
    const cardTitle = document.createElement('div');
    cardTitle.className = 'card-title';

    const studentName = document.createElement('div');
    studentName.className = 'student-name';
    studentName.textContent = nom;

    const studentRole = document.createElement('div');
    studentRole.className = 'student-role';
    studentRole.textContent = role;

    // Assemblage du titre
    cardTitle.appendChild(studentName);
    cardTitle.appendChild(studentRole);

    // Assemblage du header
    cardHeader.appendChild(avatar);
    cardHeader.appendChild(cardTitle);

    // Divider
    const divider = document.createElement('div');
    divider.className = 'divider';

    // Card Info
    const cardInfo = document.createElement('div');
    cardInfo.className = 'card-info';

    // Fonction helper pour creer une ligne d'info pour eviter de repeter encore et encore et encore et encore
    function creerInfoItem(label, valeur) {
        const infoItem = document.createElement('div');
        infoItem.className = 'info-item';

        const infoLabel = document.createElement('span');
        infoLabel.className = 'info-label';
        infoLabel.textContent = label;

        const infoValue = document.createElement('span');
        infoValue.className = 'info-value';
        infoValue.textContent = valeur;

        infoItem.appendChild(infoLabel);
        infoItem.appendChild(infoValue);

        return infoItem;
    }

    cardInfo.appendChild(creerInfoItem('Email :', mail));
    cardInfo.appendChild(creerInfoItem('Telephone :', telephone));
    cardInfo.appendChild(creerInfoItem('Ajoute le :', dateAjout));

    // Checkbox de selection
    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.className = 'card-checkbox-wrapper';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'card-checkbox';
    checkbox.dataset.id = id;

    checkboxWrapper.appendChild(checkbox);
    card.appendChild(checkboxWrapper);

    // Card Actions
    const cardActions = document.createElement('div');
    cardActions.className = 'card-actions';

    const btnModifier = document.createElement('button');
    btnModifier.className = 'btn-modifier';
    btnModifier.textContent = 'Modifier';

    const btnSupprimer = document.createElement('button');
    btnSupprimer.className = 'btn-supprimer';
    btnSupprimer.textContent = 'Supprimer';

    btnModifier.addEventListener('click', () => {
        setEtudiantEnModification(id);
        setDateOriginale(dateAjout);

        // 2. Remplir le formulaire avec les donnees actuelles
        const nomComplet = nom.split(' ');
        const prenom = nomComplet[0];                    // Premier mot = prenom
        const nomFamille = nomComplet.slice(1).join(' '); // Le reste = nom

        document.getElementById('prenom').value    = prenom;
        document.getElementById('nom').value       = nomFamille;
        document.getElementById('role').value      = role;
        document.getElementById('mail').value      = mail;
        document.getElementById('telephone').value = telephone;

        // 3. Changer l'apparence du formulaire
        changerFormulaireEnModeModification();

        formulaire.scrollIntoView({ behavior: 'smooth' });

        // 5. Mettre en evidence le formulaire
        setTimeout(() => {
            formulaire.style.boxShadow = '';
        }, 2000);
    });

    btnSupprimer.addEventListener('click', () => {
        createModal("Voulez-vous vraiment supprimer cette personne ?", async () => {
            await deleteEtudiantToStore(`${id}`);
            retirerCarte(id);
            updateStudentCount();
        });
    });

    cardActions.appendChild(btnModifier);
    cardActions.appendChild(btnSupprimer);

    // Assemblage final
    card.appendChild(cardHeader);
    card.appendChild(divider);
    card.appendChild(cardInfo);
    card.appendChild(cardActions);

    return card;
}