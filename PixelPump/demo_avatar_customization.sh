#!/bin/bash

# Script de démonstration pour le système de personnalisation d'avatar PixelPump
# Ce script teste les différentes fonctionnalités du système

echo "🎨 Démonstration du Système de Personnalisation PixelPump"
echo "======================================================="

# Vérification que les serveurs sont démarrés
echo "🔍 Vérification des serveurs..."

# Vérifier le backend
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ Backend démarré sur http://localhost:3000"
else
    echo "❌ Backend non accessible. Démarrage..."
    cd backend && npm run dev &
    sleep 3
fi

# Vérifier le frontend  
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend démarré sur http://localhost:5173"
else
    echo "❌ Frontend non accessible. Démarrage..."
    cd frontend && npm run dev &
    sleep 5
fi

echo ""
echo "🎯 Fonctionnalités testées dans cette démo :"
echo "• Personnalisation complète de l'avatar"
echo "• 8 couleurs différentes"
echo "• 6 styles de coiffure"
echo "• 8 tenues variées"
echo "• 8 accessoires"
echo "• 8 arrière-plans thématiques"
echo "• Aperçu temps réel"
echo "• Génération aléatoire"
echo "• Sauvegarde persistante"

echo ""
echo "🚀 Instructions pour tester :"
echo "1. Ouvrez http://localhost:5173 dans votre navigateur"
echo "2. Connectez-vous avec un compte utilisateur"
echo "3. Allez dans votre Profil"
echo "4. Cliquez sur 'Modifier'"
echo "5. Explorez la section 'Personnalisation Avatar'"
echo "6. Testez les différentes catégories"
echo "7. Essayez les boutons 'Aléatoire' et 'Reset'"
echo "8. Sauvegardez vos modifications"

echo ""
echo "🎨 Exemples de combinaisons à tester :"
echo "• Ninja cyber avec lunettes de soleil (thème dark)"
echo "• Sportif avec casquette dans la nature"
echo "• Magicien avec couronne dans l'espace"
echo "• Pirate avec bandana à la plage"

echo ""
echo "📊 Points à vérifier :"
echo "• L'avatar se met à jour en temps réel"
echo "• Toutes les catégories sont fonctionnelles"
echo "• La sauvegarde persiste après rechargement"
echo "• L'avatar apparaît correctement dans tout l'app"
echo "• L'interface est responsive"

echo ""
echo "✨ Démo prête ! Amusez-vous à créer votre avatar parfait ! 🎮"

# Optionnel : Ouvrir automatiquement le navigateur
if command -v xdg-open > /dev/null; then
    echo "🌐 Ouverture automatique du navigateur..."
    xdg-open http://localhost:5173
elif command -v open > /dev/null; then
    echo "🌐 Ouverture automatique du navigateur..."
    open http://localhost:5173
fi
