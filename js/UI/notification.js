// Gestion des messages de notification globaux

import { setMessage } from '../validation/validationService.js';

// Fonction pour afficher un message global
export function afficherMessageGlobal(texte, isError = true) {
    const messageEl = document.getElementById('globalMessage');
    setMessage(messageEl, texte, isError);
    messageEl.classList.add('visible');

    // Cacher apres 4 secondes
    setTimeout(() => {
        messageEl.classList.remove('visible');
    }, 4000);
}
