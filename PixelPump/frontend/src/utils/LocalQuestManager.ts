// LocalQuestManager.ts
// Ce module gère localement les quêtes et l'XP, pour garantir une expérience utilisateur fluide
// même en cas de problèmes avec le backend

// Fonction pour ajouter de l'XP à l'utilisateur, garantie de fonctionner
export const addUserXP = (amount: number): boolean => {
  try {
    // Récupérer les données utilisateur actuelles
    const userData = JSON.parse(localStorage.getItem('pixelpump_user') || '{}');
    
    // Enregistrer l'XP avant la modification pour le log
    const oldXP = userData.xp || 0;
    
    // Mise à jour de l'XP
    userData.xp = oldXP + amount;
    
    // Mise à jour des quêtes complétées
    userData.total_quests_completed = (userData.total_quests_completed || 0) + 1;
    
    // Sauvegarder les données mises à jour
    localStorage.setItem('pixelpump_user', JSON.stringify(userData));
    
    console.log(`✅ XP ajouté avec succès! +${amount} XP (${oldXP} → ${userData.xp})`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout d\'XP local:', error);
    return false;
  }
};

// Fonction pour afficher une notification visuelle d'XP gagnée
export const showXPNotification = (amount: number): void => {
  try {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = 'xp-notification';
    notification.textContent = `+${amount} XP!`;
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      background: linear-gradient(45deg, #ff006e, #8338ec);
      color: white;
      font-size: 24px;
      font-weight: bold;
      padding: 15px 30px;
      border-radius: 30px;
      box-shadow: 0 0 30px rgba(255, 0, 110, 0.6);
      z-index: 9999;
      animation: xpNotification 1.5s ease-in-out forwards;
      pointer-events: none;
    `;
    
    // Créer l'animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes xpNotification {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
      }
    `;
    
    // Ajouter au DOM
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Nettoyer après l'animation
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 1500);
    
    console.log('✨ Notification XP affichée');
  } catch (error) {
    console.error('❌ Erreur lors de l\'affichage de la notification XP:', error);
  }
};

// Fonction pour marquer une quête comme complétée (visuellement)
export const markQuestCompleted = (questId: string): boolean => {
  try {
    // Trouver l'élément de la quête
    const questElement = document.getElementById(`quest-card-${questId}`);
    if (!questElement) {
      console.warn(`⚠️ Élément de quête non trouvé: quest-card-${questId}`);
      return false;
    }
    
    // Ajouter une classe pour l'animation de disparition
    questElement.classList.add('quest-completed');
    questElement.style.animation = 'questCompletedAnimation 0.8s forwards';
    
    // Créer l'animation si elle n'existe pas déjà
    if (!document.getElementById('quest-completed-style')) {
      const style = document.createElement('style');
      style.id = 'quest-completed-style';
      style.textContent = `
        @keyframes questCompletedAnimation {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); background: rgba(255, 255, 255, 0.2); }
          100% { opacity: 0; transform: scale(0.9); }
        }
        .quest-completed {
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Supprimer l'élément après l'animation
    setTimeout(() => {
      questElement.remove();
      console.log(`✅ Quête supprimée du DOM: ${questId}`);
    }, 800);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du marquage de la quête comme complétée:', error);
    return false;
  }
};

// Fonction complète pour gérer la complétion d'une quête
export const completeQuestLocally = (questId: string, xpAmount: number): void => {
  console.log(`🎮 Complétion locale de quête démarrée: ${questId} (+${xpAmount} XP)`);
  
  // 1. Ajouter l'XP
  const xpAdded = addUserXP(xpAmount);
  
  // 2. Afficher la notification
  if (xpAdded) {
    showXPNotification(xpAmount);
  }
  
  // 3. Marquer la quête comme complétée visuellement
  markQuestCompleted(questId);
  
  // 4. Tenter de rafraîchir les données globales
  try {
    if (window.pixelPumpApp?.refreshUserData) {
      window.pixelPumpApp.refreshUserData()
        .then(() => console.log('👤 Données utilisateur rafraîchies'))
        .catch(err => console.warn('⚠️ Échec du rafraîchissement des données utilisateur:', err));
    }
    
    if (window.pixelPumpApp?.refreshDashboard) {
      window.pixelPumpApp.refreshDashboard()
        .then(() => console.log('🔄 Dashboard rafraîchi'))
        .catch(err => console.warn('⚠️ Échec du rafraîchissement du dashboard:', err));
    }
  } catch (error) {
    console.warn('⚠️ Erreur lors de la tentative de rafraîchissement global:', error);
  }
  
  console.log('✅ Complétion locale terminée avec succès');
};

export default {
  addUserXP,
  showXPNotification,
  markQuestCompleted,
  completeQuestLocally
};
