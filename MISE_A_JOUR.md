# 🛠️ MISE À JOUR REQUISE

## Commandes à lancer dans le terminal (dans le dossier du projet)

```bash
# 1. Appliquer le schéma Prisma (nouvelles colonnes: phone, invocationsActive, SocialLink)
npx prisma db push

# 2. Regénérer le client Prisma
npx prisma generate

# 3. Relancer le serveur
npm run dev
```

## Ce qui a été mis à jour

### Composants publics
- **PrayerTimes**: Widget Mawaqit plein écran (desktop + mobile spécifique)
- **SideInvocations**: Toujours visibles, français à gauche, arabe à droite
- **Activities**: Conveyor belt animé avec effet Boom Boom par carte
- **Contact**: Champ téléphone ajouté
- **SocialMedia**: Nouvelle section réseaux sociaux (Facebook, WhatsApp, Instagram...)

### Panel Admin (mobile-responsive)
- **AdminShell**: Sidebar partagée avec hamburger menu sur mobile
- **InvocationManager**: Interrupteur ON/OFF global pour toutes les invocations
- **SocialManager**: Gérer Facebook, WhatsApp, Instagram...
- **ContentManager**: Sections ajoutées (À propos cartes, Infos contact, Don, Ramadan)
- **MessagesManager**: Affiche le numéro de téléphone des messages

### APIs
- `/api/contact`: Sauvegarde le téléphone
- `/api/announcements`: Tri par date (plus récent en premier)
- `/api/site-mode`: Gère `invocationsActive`
- `/api/social` + `/api/social/[id]`: Gestion des réseaux sociaux
