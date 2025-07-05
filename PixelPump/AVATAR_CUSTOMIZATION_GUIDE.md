# Guide de Personnalisation d'Avatar - PixelPump

## 🎨 Système de Personnalisation Complet

PixelPump dispose maintenant d'un système de personnalisation d'avatar avancé qui permet aux utilisateurs de créer leur personnage unique !

## ✨ Fonctionnalités

### 🎯 Catégories de Personnalisation

1. **Couleurs** 🎨
   - Rose Cyber (`#ff006e`)
   - Violet Royal (`#8338ec`)
   - Bleu Électrique (`#06ffa5`)
   - Vert Matrix (`#06ffa5`)
   - Orange Flame (`#fb8500`)
   - Rouge Passion (`#dc2626`)
   - Jaune Lightning (`#facc15`)
   - Cyan Neon (`#06b6d4`)

2. **Coiffures** ✂️
   - Cheveux Courts
   - Cheveux Longs
   - Punk Rock
   - Afro Style
   - Chauve
   - Queue de Cheval

3. **Tenues** 👕
   - Décontracté
   - Sportif
   - Formel
   - Cyber
   - Ninja
   - Pirate
   - Chevalier
   - Magicien

4. **Accessoires** 🥽
   - Aucun
   - Lunettes
   - Lunettes de Soleil
   - Casque Audio
   - Casquette
   - Couronne
   - Bandana
   - Masque

5. **Arrière-plans** 🏔️
   - Salle de Sport
   - Cyber Space
   - Nature
   - Ville
   - Espace
   - Plage
   - Montagne
   - Rétro

## 🚀 Comment Utiliser

### Accès au Système
1. Connectez-vous à votre compte PixelPump
2. Allez dans votre **Profil Utilisateur**
3. Cliquez sur **"Modifier"** 
4. La section **"Personnalisation Avatar"** apparaîtra

### Interface de Personnalisation
- **Aperçu en temps réel** : Voir votre avatar se transformer instantanément
- **Catégories faciles** : Naviguez entre les différentes options
- **Boutons d'action rapide** :
  - 🎲 **Aléatoire** : Génère un look complètement aléatoire
  - 📸 **Reset** : Revient aux paramètres par défaut

### Sauvegarde
- Toutes les modifications sont automatiquement enregistrées
- Votre avatar personnalisé apparaîtra partout dans l'application
- Les choix sont persistants entre les sessions

## 🎯 Intégration dans l'Application

L'avatar personnalisé est affiché dans :
- **Profil utilisateur** - Vue complète avec toutes les options
- **Dashboard** - Avatar compact sur les cartes de progression
- **Quêtes** - Représentation du joueur dans le contexte sportif
- **Succès** - Avatar visible lors des déblocages d'achievements

## 🛠️ Architecture Technique

### Frontend
- **Composant principal** : `AvatarCustomizer.tsx`
- **Affichage** : `PixelAvatar.tsx` (refactorisé pour la personnalisation)
- **Interface** : Intégré dans `UserProfile.tsx`

### Backend
- **Stockage** : Champ `avatar` dans le modèle User
- **API** : Route PUT `/users/profile/me` pour la sauvegarde
- **Persistence** : Base de données PostgreSQL

### Structure de Données Avatar
```typescript
interface AvatarData {
  body?: string;        // Type de corps
  outfit?: string;      // Tenue vestimentaire  
  accessory?: string;   // Accessoire porté
  color?: string;       // Couleur principale (hex)
  background?: string;  // Arrière-plan de l'avatar
  hair?: string;        // Style de coiffure
  eyes?: string;        // Style des yeux
}
```

## 🎮 Gamification

Le système de personnalisation s'intègre parfaitement dans l'univers gamifié :
- **Récompenses futures** : Débloquer de nouveaux styles via les achievements
- **Progression visuelle** : L'avatar évolue avec le niveau du joueur
- **Identité sportive** : Refléter ses activités préférées via l'apparence

## 🚀 Évolutions Futures

- **Déblocage progressif** : Nouveaux styles selon les niveaux atteints
- **Achievements cosmétiques** : Tenues spéciales pour certains exploits
- **Thèmes saisonniers** : Styles temporaires liés aux événements
- **Partage social** : Galerie des avatars de la communauté

---

*Votre avatar, votre identité sportive ! 💪🎨*
