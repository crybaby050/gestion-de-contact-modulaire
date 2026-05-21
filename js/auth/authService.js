// Service d'authentification - gestion de la session utilisateur

const USERS_URL = 'http://localhost:3000/users';
const SESSION_KEY = 'ecole221_session';

// Connexion : vérifie les identifiants dans la "table" users du JSON
export async function login(email, password) {
    try {
        const res = await fetch(USERS_URL);
        if (!res.ok) throw new Error('Serveur inaccessible');
        const users = await res.json();

        const user = users.find(u => u.mail === email && u.password === password);

        if (!user) {
            return { success: false, message: 'Email ou mot de passe incorrect.' };
        }

        // Sauvegarder la session (sans le mot de passe)
        const session = { id: user.id, mail: user.mail, nom: user.nom };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

        return { success: true, user: session };
    } catch (err) {
        return { success: false, message: 'Erreur de connexion au serveur.' };
    }
}

// Déconnexion
export function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
}

// Vérifie si l'utilisateur est connecté
export function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) !== null;
}

// Retourne les infos de l'utilisateur connecté
export function getSession() {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
}

// Garde de route : redirige vers login si pas connecté
export function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}