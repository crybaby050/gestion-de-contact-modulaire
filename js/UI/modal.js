// Creation et gestion des modals de confirmation

export function createModal(message, onConfirm) {

    // 1. CREER LE FOND SOMBRE (overlay)
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    // 2. CREER LA BOITE BLANCHE (modal)
    const modal = document.createElement('div');
    modal.className = 'modal';

    // 3. CREER LE TITRE
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    modalHeader.innerHTML = '<h3>Confirmation</h3>';

    // 4. CREER LE MESSAGE
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalBody.innerHTML = '<p>' + message + '</p>';

    // 5. CREER LA ZONE DES BOUTONS
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';

    // 6. CREER LE BOUTON "CONFIRMER" (rouge)
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'modal-btn-confirm';
    confirmBtn.textContent = 'Confirmer';

    // 7. CREER LE BOUTON "ANNULER" (gris)
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'modal-btn-cancel';
    cancelBtn.textContent = 'Annuler';

    // 8. AJOUTER LES BOUTONS DANS LE PIED DU MODAL
    modalFooter.appendChild(confirmBtn);
    modalFooter.appendChild(cancelBtn);

    // 9. ASSEMBLER TOUTES LES PARTIES DU MODAL
    modal.appendChild(modalHeader);
    modal.appendChild(modalBody);
    modal.appendChild(modalFooter);
    overlay.appendChild(modal);

    // 10. AJOUTER LE MODAL A LA PAGE
    document.body.appendChild(overlay);

    // 11. FONCTION POUR FERMER LE MODAL
    function closeModal() {
        overlay.classList.remove('active');
        setTimeout(function () {
            overlay.remove();
        }, 300);
    }

    // 12. QUAND ON CLIQUE SUR "CONFIRMER"
    confirmBtn.addEventListener('click', function () {
        onConfirm();
        closeModal();
    });

    // 13. QUAND ON CLIQUE SUR "ANNULER"
    cancelBtn.addEventListener('click', function () {
        closeModal();
    });

    // 14. QUAND ON CLIQUE SUR LE FOND SOMBRE (a cote du modal)
    overlay.addEventListener('click', function (event) {
        if (event.target === overlay) {
            closeModal();
        }
    });

    // 15. AFFICHER LE MODAL AVEC UNE PETITE ANIMATION
    setTimeout(function () {
        overlay.classList.add('active');
    }, 10);
}
