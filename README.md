# Bokubooks

Bokubooks est une application full-stack permettant aux utilisateurs de gérer leur collection de livres.

**L'application est séparée en deux repositories différents, vous consultez actuellement la partie Backend de l'application.**

[Cliquez pour accéder au repository du Frontend](https://github.com/NzlThomas/tracker-frontend)

## Fonctionnalités

- Ajouter un livre à sa collection
- Consulter sa collection (barre de recherche et filtres)
- Noter les livres lus et possédés
- Présence d'étiquettes sur chaque livre (Lu, En cours, A lire)
- Ajouter une note à un livre
- Liste d'envies
- Statistiques de sa collection
- Changement du nom d'utilisateur et du mot de passe

## Stack utilisée

### Frontend

- React
- React Router DOM
- Axios
- CSS Modules
- React Toastify
- Recharts (Pour le graphique des statistiques)

### Backend

- Node.js
- Express.js
- Prisma ORM
- Base de donnée PostgreSQL

### Authentification

- JWT

## Installation

### Cloner les repositories

```bash
git clone git@github.com:NzlThomas/tracker-frontend.git

git clone git@github.com:NzlThomas/tracker-backend.git
```

### Installer les dépendances

A la racine de chaque projet :

```bash
npm i
```

### Configurer les variables d'environnement

Créer un fichier `.env` à la racine du dossier **Backend** comme noté dans `.env.example`.

### Initialiser Prisma ORM

```bash
npx prisma migrate dev
```

### Lancer le serveur Express

```bash
node app.js
```

### Lancer le frontend

```bash
npm run dev
```
