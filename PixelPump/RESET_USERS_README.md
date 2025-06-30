# Réinitialisation des Utilisateurs PixelPump

Ce document explique comment réinitialiser tous les utilisateurs (nouveaux et anciens) à 0 dans l'application PixelPump.

## ⚠️ ATTENTION

**Cette opération est IRRÉVERSIBLE !**

La réinitialisation va :
- Remettre l'XP de tous les utilisateurs à 0
- Remettre le niveau à 1
- Réinitialiser le streak à 0
- Supprimer toutes les quêtes complétées
- Supprimer tous les achievements débloqués
- Remettre l'avatar par défaut
- Réinitialiser les objectifs fitness par défaut

## Méthodes de Réinitialisation

### 1. Via l'Interface Web (Recommandé)

1. Connectez-vous en tant qu'administrateur sur `/admin`
2. Générez un token admin si nécessaire
3. Dans la section "ZONE DANGEREUSE", cliquez sur "Réinitialiser TOUS les utilisateurs"
4. Tapez exactement "RESET" pour confirmer
5. Cliquez sur "EXÉCUTER LA RÉINITIALISATION"

### 2. Via Script Node.js

```bash
cd PixelPump/backend
npm run users:reset
```

Le script vous demandera de taper "RESET" pour confirmer l'opération.

### 3. Via Script SQL Direct

```bash
cd PixelPump/database
psql -U votre_utilisateur -d portfolio -f reset_all_users.sql
```

### 4. Via API REST

**Endpoint :** `POST /api/database/reset-users`

**Headers requis :**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Exemple avec curl :**
```bash
curl -X POST http://localhost:3001/api/database/reset-users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

## Vérification Post-Réinitialisation

Après la réinitialisation, vous pouvez vérifier que l'opération s'est bien déroulée :

### Via l'Interface Admin
- Consultez la liste des utilisateurs dans le panel admin
- Tous les utilisateurs devraient avoir XP: 0, Level: 1

### Via SQL
```sql
SELECT username, email, xp, level, streak, total_quests_completed 
FROM users 
ORDER BY created_at DESC;
```

### Via API
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:3001/api/database/users
```

## Structure des Données Réinitialisées

Après réinitialisation, chaque utilisateur aura :

```json
{
  "xp": 0,
  "level": 1,
  "streak": 0,
  "total_quests_completed": 0,
  "last_quest_date": null,
  "avatar": {
    "body": "default",
    "outfit": "casual",
    "accessory": "none",
    "color": "#ff006e"
  },
  "fitness_goals": {
    "daily_quests": 3,
    "weekly_xp": 1000,
    "target_level": 10
  }
}
```

## Sécurité

- Seuls les administrateurs peuvent effectuer cette opération
- L'interface web demande une double confirmation
- Le script en ligne de commande demande une confirmation
- L'opération est loggée dans les logs du serveur

## Récupération en Cas d'Erreur

⚠️ **Il n'y a pas de récupération automatique possible !**

Si vous avez besoin de restaurer les données, vous devrez :
1. Restaurer depuis une sauvegarde de base de données
2. Ou re-seeder la base avec des données de test

## Scripts Disponibles

Dans le `package.json` du backend :
- `npm run users:reset` - Réinitialise tous les utilisateurs (avec confirmation)
- `npm run seed` - Re-seed la base avec des données de test
- `npm run db:reset` - Reset complet de la base de données

## Logs

L'opération de réinitialisation est loggée avec :
- L'email de l'administrateur qui a effectué l'opération
- Le timestamp de l'opération
- Le nombre d'utilisateurs affectés

Consultez les logs du serveur pour plus de détails.
