import React, { useState, useEffect } from 'react';

interface Quest {
  id?: string;
  title: string;
  description: string;
  category: string;
  xp_reward: number;
  difficulty: string;
  type: string;
}

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quest: Quest) => void;
  quest?: Quest | null;
  mode: 'create' | 'edit';
}

const QuestModal: React.FC<QuestModalProps> = ({
  isOpen,
  onClose,
  onSave,
  quest,
  mode
}) => {
  const [formData, setFormData] = useState<Quest>({
    title: '',
    description: '',
    category: 'development',
    xp_reward: 50,
    difficulty: 'easy',
    type: 'daily'
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (quest && mode === 'edit') {
      setFormData(quest);
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'development',
        xp_reward: 50,
        difficulty: 'easy',
        type: 'daily'
      });
    }
    setErrors({});
  }, [quest, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'xp_reward' ? parseInt(value) || 0 : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (formData.xp_reward <= 0) {
      newErrors.xp_reward = 'La récompense XP doit être positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'rgba(26, 0, 51, 0.95)',
        border: '2px solid #06ffa5',
        borderRadius: '15px',
        padding: '30px',
        maxWidth: '600px',
        width: '100%',
        color: 'white',
        backdropFilter: 'blur(15px)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h3 style={{
          color: '#06ffa5',
          margin: '0 0 20px 0',
          fontSize: '1.3rem'
        }}>
          {mode === 'create' ? '⚔️ Créer une nouvelle quête' : '✏️ Modifier la quête'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#06ffa5', fontWeight: 'bold' }}>
              Titre de la quête *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(26, 0, 51, 0.8)',
                border: errors.title ? '2px solid #ff1744' : '2px solid #06ffa5',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem'
              }}
              placeholder="Ex: Créer votre premier projet React"
            />
            {errors.title && (
              <div style={{ color: '#ff1744', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.title}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#06ffa5', fontWeight: 'bold' }}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(26, 0, 51, 0.8)',
                border: errors.description ? '2px solid #ff1744' : '2px solid #06ffa5',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              placeholder="Décrivez ce que le pumper doit accomplir..."
            />
            {errors.description && (
              <div style={{ color: '#ff1744', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.description}
              </div>
            )}
          </div>

          {/* Row with Category and Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#06ffa5', fontWeight: 'bold' }}>
                Catégorie
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(26, 0, 51, 0.8)',
                  border: '2px solid #06ffa5',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              >
                <option value="development">Développement</option>
                <option value="design">Design</option>
                <option value="learning">Apprentissage</option>
                <option value="project">Projet</option>
                <option value="collaboration">Collaboration</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#06ffa5', fontWeight: 'bold' }}>
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(26, 0, 51, 0.8)',
                  border: '2px solid #06ffa5',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              >
                <option value="daily">Quotidienne</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuelle</option>
                <option value="milestone">Étape importante</option>
                <option value="special">Spéciale</option>
              </select>
            </div>
          </div>

          {/* Row with Difficulty and XP Reward */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#06ffa5', fontWeight: 'bold' }}>
                Difficulté
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(26, 0, 51, 0.8)',
                  border: '2px solid #06ffa5',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              >
                <option value="easy">Facile</option>
                <option value="medium">Moyen</option>
                <option value="hard">Difficile</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#06ffa5', fontWeight: 'bold' }}>
                Récompense XP *
              </label>
              <input
                type="number"
                name="xp_reward"
                value={formData.xp_reward}
                onChange={handleChange}
                min="1"
                max="1000"
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(26, 0, 51, 0.8)',
                  border: errors.xp_reward ? '2px solid #ff1744' : '2px solid #06ffa5',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem'
                }}
                placeholder="50"
              />
              {errors.xp_reward && (
                <div style={{ color: '#ff1744', fontSize: '0.8rem', marginTop: '5px' }}>
                  {errors.xp_reward}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'flex-end',
            marginTop: '20px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '2px solid #666',
                color: '#b8b8b8',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              Annuler
            </button>

            <button
              type="submit"
              style={{
                background: 'linear-gradient(45deg, #06ffa5, #8338ec)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              {mode === 'create' ? '✨ Créer la quête' : '💾 Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestModal;
