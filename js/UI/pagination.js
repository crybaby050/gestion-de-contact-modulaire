// Gestion de l'affichage de la pagination

export function renderPagination(totalPages, pageActuelle, cardContainer, onPageChange) {
    let paginationEl = document.getElementById('pagination');
    if (!paginationEl) {
        paginationEl = document.createElement('div');
        paginationEl.id = 'pagination';
        paginationEl.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            margin-top: 24px;
            flex-wrap: wrap;
        `;
        cardContainer.parentNode.insertBefore(paginationEl, cardContainer.nextSibling);
    }

    paginationEl.innerHTML = '';

    if (totalPages <= 1) return;

    // Bouton Precedent
    paginationEl.appendChild(
        creerBtnPagination('← Préc.', pageActuelle === 1, () => onPageChange(pageActuelle - 1))
    );

    // Boutons de pages numerotees
    for (let i = 1; i <= totalPages; i++) {
        const btnPage = creerBtnPagination(String(i), false, () => onPageChange(i));
        if (i === pageActuelle) {
            btnPage.style.background = '#4f46e5';
            btnPage.style.color = 'white';
            btnPage.style.fontWeight = 'bold';
        }
        paginationEl.appendChild(btnPage);
    }

    // Bouton Suivant
    paginationEl.appendChild(
        creerBtnPagination('Suiv. →', pageActuelle === totalPages, () => onPageChange(pageActuelle + 1))
    );

    // Indicateur texte
    // const info = document.createElement('span');
    // info.style.cssText = 'font-size: 0.85rem; color: #6b7280; width: 100%; text-align: center; margin-top: 4px;';
    // info.textContent = `Page ${pageActuelle} sur ${totalPages} — ${totalCartes} contact(s)`;
    // paginationEl.appendChild(info);
}

function creerBtnPagination(texte, estDisabled, onClick) {
    const btn = document.createElement('button');
    btn.textContent = texte;
    btn.disabled = estDisabled;
    btn.style.cssText = `
        padding: 6px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        background: white;
        color: #374151;
        cursor: pointer;
        font-size: 0.875rem;
        transition: background 0.2s;
        opacity: ${estDisabled ? '0.4' : '1'};
    `;
    if (!estDisabled) btn.addEventListener('click', onClick);
    return btn;
}