# Assignment 3 — Portfolio full-stack

Etienne ZONON, 301559049. Ce dossier est la remise de l’assignment 3. L’assignment 2 reste dans `MyPortfolio`. L’assignment 4 est dans le dossier `Assignment4`, à remettre plus tard.

## Démarrer

1. MongoDB local sur le port 27017, ou une base Atlas. L’adresse est `MONGO_URI` dans `.env`.
2. Le fichier `.env` est déjà prêt en local. S’il manque, copier `.env.example`. Ne jamais le committer.
3. `npm install`, puis `npm install --prefix client`.
4. `npm run dev`.
5. API : http://localhost:5000 — React : http://localhost:3000.

## Vercel

Le dépôt n’utilise pas Docker. Vercel construit le client React et sert l’API depuis `api/[...all].js`.

Dans les variables d’environnement du projet Vercel, renseigner les mêmes clés que `.env`. `MONGO_URI` doit être une adresse MongoDB Atlas. `localhost` ne fonctionne pas sur Vercel. Laisser `REACT_APP_API_URL` vide : le site appelle `/api` sur le même domaine.

Si le port 3000 ou 5173 est déjà pris, le terminal affiche l’adresse à ouvrir.

Au premier lancement, le serveur crée l’administrateur et, si les collections sont vides, insère les projets et les qualifications.

Connexion administrateur :

- courriel : `admin@portfolio.local`
- mot de passe : la valeur de `ADMIN_PASSWORD` dans `.env`

Un compte créé avec Sign up est un utilisateur normal.

## Jeton et déconnexion

Le serveur ne garde pas de session. À l’inscription ou à la connexion il signe un JWT de 24 heures, le renvoie dans le JSON et pose un cookie `httpOnly` nommé `t`.

Le navigateur enregistre le jeton et le profil public dans `localStorage`, clé `portfolio_auth`. Le mot de passe n’y est jamais écrit. Les requêtes protégées envoient `Authorization: Bearer <jeton>`.

`POST /api/auth/signout` efface le cookie. Le client supprime ensuite `portfolio_auth`. Un jeton déjà copié reste valable jusqu’à son expiration.

## Droits

| Action | Visiteur | Utilisateur | Administrateur |
| --- | --- | --- | --- |
| Lire projets et qualifications | oui | oui | oui |
| Créer, modifier, supprimer projets et qualifications | non | non | oui |
| Envoyer le formulaire Contact | oui | oui | oui |
| Lire, modifier, supprimer les messages | non | non | oui |

Sans jeton, une écriture protégée répond **401**. Avec le jeton d’un utilisateur normal, elle répond **403**.

## Captures pour le document Word

1. Inscription et connexion dans le navigateur.
2. `GET /api/projects` en 200 sans jeton.
3. `POST /api/projects` sans jeton : 401.
4. Même `POST` avec un utilisateur normal : 403.
5. Même `POST` avec l’administrateur : 201, puis le document dans MongoDB.
6. Page Projects : formulaire visible pour l’administrateur, absent pour l’utilisateur normal.
7. Page Messages : « Request contact records » et la réponse 401 ou 403.
8. Formulaire Contact envoyé, réponse de l’API, document dans la collection `contacts`.

Ne montre pas `.env`, `JWT_SECRET`, ni un mot de passe en clair.
