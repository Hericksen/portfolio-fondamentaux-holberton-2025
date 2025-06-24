#!/bin/bash

# Script pour explorer la base de données PixelPump
# Usage: ./db_explorer.sh [command]

DB_NAME="portfolio"
DB_USER="postgres"
DB_PASS="mdp123"
DB_HOST="localhost"

# Fonction pour exécuter une requête SQL
query() {
    PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "$1"
}

echo "🗄️  EXPLORATEUR BASE DE DONNÉES PIXELPUMP"
echo "=========================================="

case "$1" in
    "tables"|"")
        echo "📊 TABLES DISPONIBLES:"
        query "\dt"
        ;;
    "users")
        echo "👥 UTILISATEURS:"
        query "SELECT id, username, email, level, xp, created_at FROM users ORDER BY created_at DESC;"
        ;;
    "quests")
        echo "🎯 QUÊTES:"
        query "SELECT * FROM quests ORDER BY id;"
        ;;
    "achievements")
        echo "🏆 ACHIEVEMENTS:"
        query "SELECT * FROM achievements ORDER BY id;"
        ;;
    "projects")
        echo "📁 PROJETS:"
        query "SELECT * FROM projects ORDER BY id;"
        ;;
    "stats")
        echo "📈 STATISTIQUES:"
        echo ""
        echo "Nombre d'utilisateurs:"
        query "SELECT COUNT(*) as total_users FROM users;"
        echo ""
        echo "Nombre de quêtes:"
        query "SELECT COUNT(*) as total_quests FROM quests;"
        echo ""
        echo "Nombre d'achievements:"
        query "SELECT COUNT(*) as total_achievements FROM achievements;"
        echo ""
        echo "Utilisateurs par niveau:"
        query "SELECT level, COUNT(*) as count FROM users GROUP BY level ORDER BY level;"
        ;;
    "schema")
        echo "🏗️  SCHÉMA DE LA BASE:"
        query "SELECT table_name, column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position;"
        ;;
    "reset")
        echo "⚠️  RESET DE LA BASE (ATTENTION: SUPPRIME TOUTES LES DONNÉES)"
        read -p "Êtes-vous sûr? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            query "TRUNCATE TABLE users, quests, achievements, projects, \"UserQuests\", \"UserAchievements\" RESTART IDENTITY CASCADE;"
            echo "✅ Base de données réinitialisée"
        else
            echo "❌ Opération annulée"
        fi
        ;;
    "help")
        echo "🔧 COMMANDES DISPONIBLES:"
        echo "  tables    - Lister toutes les tables"
        echo "  users     - Voir tous les utilisateurs"
        echo "  quests    - Voir toutes les quêtes"
        echo "  achievements - Voir tous les achievements"
        echo "  projects  - Voir tous les projets"
        echo "  stats     - Statistiques de la base"
        echo "  schema    - Structure de la base"
        echo "  reset     - Réinitialiser la base (DANGER)"
        echo "  help      - Afficher cette aide"
        echo ""
        echo "Exemples:"
        echo "  ./db_explorer.sh users"
        echo "  ./db_explorer.sh stats"
        ;;
    *)
        echo "❌ Commande inconnue: $1"
        echo "Utilisez './db_explorer.sh help' pour voir les commandes disponibles"
        ;;
esac
