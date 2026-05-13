// Service de validation du formulaire

// Regex pour email valide
export function estEmailValide(email) {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexEmail.test(email);
}

// Regex pour telephone senegalais
export function estTelephoneValide(telephone) {
    const regexTel = /^(\+221[\s-]?)?(7[0-8]|70)[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
    const telNettoye = telephone.replace(/[\s.-]/g, '');
    return regexTel.test(telNettoye) || /^(7[0-8]|70)[0-9]{7}$/.test(telNettoye);
}

// Fonction pour valider le formulaire
export function validerFormulaire(prenom, nomFamille, role, mail, telephone) {
    let estValide = true;

    nettoyerErreurs();

    if (!prenom || prenom.trim() === '') {
        afficherErreurChamp('prenom', 'Le prenom est obligatoire');
        estValide = false;
    } else if (prenom.trim().length < 2) {
        afficherErreurChamp('prenom', 'Le prenom doit contenir au moins 2 caracteres');
        estValide = false;
    }

    if (!nomFamille || nomFamille.trim() === '') {
        afficherErreurChamp('nom', 'Le nom est obligatoire');
        estValide = false;
    } else if (nomFamille.trim().length < 2) {
        afficherErreurChamp('nom', 'Le nom doit contenir au moins 2 caracteres');
        estValide = false;
    }

    if (!role || role === '') {
        afficherErreurChamp('role', 'Veuillez selectionner un role');
        estValide = false;
    }

    if (!telephone || telephone.trim() === '') {
        afficherErreurChamp('telephone', 'Le telephone est obligatoire');
        estValide = false;
    } else if (!estTelephoneValide(telephone)) {
        afficherErreurChamp('telephone', 'Format invalide. Ex: 77 123 45 67');
        estValide = false;
    }

    if (!mail || mail.trim() === '') {
        afficherErreurChamp('mail', "L'email est obligatoire");
        estValide = false;
    } else if (!estEmailValide(mail)) {
        afficherErreurChamp('mail', 'Format email invalide. Ex: exemple@email.com');
        estValide = false;
    }

    return estValide;
}

// Fonction pour afficher une erreur sur un champ
export function afficherErreurChamp(idChamp, message) {
    const champ   = document.getElementById(idChamp);
    const errorEl = document.getElementById('error-' + idChamp);

    if (champ) champ.classList.add('error');
    if (errorEl) {
        setMessage(errorEl, message, true);
        errorEl.classList.add('visible');
    }
}

// Fonction pour nettoyer toutes les erreurs
export function nettoyerErreurs() {
    const champs = ['prenom', 'nom', 'role', 'telephone', 'mail'];
    champs.forEach(id => {
        const champ   = document.getElementById(id);
        const errorEl = document.getElementById('error-' + id);

        if (champ) champ.classList.remove('error');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('visible');
        }
    });

    const globalMsg = document.getElementById('globalMessage');
    if (globalMsg) globalMsg.classList.remove('visible');
}

// Modifie le contenu et la classe d'un element de message
export function setMessage(message, text, isError = false) {
    message.textContent = text;
    if (isError) {
        message.classList.add("error");
    } else {
        message.classList.remove("error");
    }
}