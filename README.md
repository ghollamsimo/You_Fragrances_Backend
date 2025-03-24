# You Fragrances
-----------------------------------------------
## Description
You Fragrances est une application mobile innovante permettant aux amateurs de parfumerie de découvrir, évaluer et personnaliser leur expérience olfactive. Grâce à une plateforme intuitive, les utilisateurs peuvent explorer une large gamme de parfums, recevoir des recommandations personnalisées et interagir avec une communauté passionnée.

## Fonctionnalités principales
1. **Authentification** : Sécurisation des comptes utilisateur.
2. **CRUD sur les fragrances** : Création, lecture, mise à jour et suppression de parfums.
3. **Favoris** : Possibilité de marquer des parfums comme favoris.
4. **Commentaires** : Ajouter, modifier ou supprimer des commentaires pour chaque parfum.
5. **Évaluation des parfums** : Notation des parfums par les utilisateurs.
6. **Détails des parfums** : Gestion et mise à jour des informations détaillées des fragrances.
7. **Recherche avancée** : Moteur de recherche performant pour trouver des parfums spécifiques.
8. **Scanner** : Scanner un barcode et voir le résultat d’un parfum.
9. **Profil utilisateur** : Création d’un profil incluant une collection de parfums favoris.
10. **Gestion des marques** : CRUD des marques de parfums.
11. **Historique des fragrances** : Suivi des interactions des utilisateurs avec les parfums.
12. **Assistant chat pour parfums** : Conseils personnalisés via un chatbot intelligent.

## Technologies utilisées
- **Backend** : Node.js avec Nest.js
- **Frontend** : React Native
- **Base de données** : MongoDB

## Installation et exécution
### Prérequis
- Node.js installé
- MongoDB en cours d’exécution
- Expo CLI pour le développement React Native

### Étapes d’installation
1. **Cloner le projet**
   ```bash
   git clone https://github.com/votre-repo/You-Fragrances_Backend.git
   cd you-fragrances
   ```
2. **Installer les dépendances**
   ```bash
   npm install
   ```
3. **Démarrer le backend**
   ```bash
   npm run start:backend
   ```
4. **Démarrer l’application mobile**
   ```bash
   npm run start:frontend
   ```

## Contribution
Les contributions sont les bienvenues ! Veuillez soumettre une pull request ou signaler un problème via GitHub.

## Licence
Ce projet est sous licence MIT.

# Hexagonal Architecture -->

src

├── core

│   ├── entities

│   ├── interfaces

├── infrastructure

│   ├── database

│   ├── repositories

├── application

│   ├── use-cases

├── interface

│   ├── http

└── main.ts

--------------------------

Core (Domain) :

     -- the core layer represents the heart of the application.

     ── entities :

          Define the core business model and define the properties.

     ── interfaces :

          Define the interface with method and this interface will be implemented by adapter.

Infrastructure :

     -- the infrastructure layer the actual implementations of our Core (domain) interfaces

     ── database :

           ── schemas :

                      Define the structure of Document for mongoose.

     ── repository :

           Define the logic of the application.

Application :

     -- The application layer is responsible for coordinating the domain logic.

     ── usecases or (services) :

           Represent actions our application can perform.

Interface :

     -- The interface layer is responsible for exposing the functionality of our application to the outside world (req, res).

     ── http :

           Defines API endpoints and delegates requests to use cases.

App Module (Dependency Injection) :

     -- In NestJS, we use dependency injection to connect these layers and manage dependencies efficiently.
