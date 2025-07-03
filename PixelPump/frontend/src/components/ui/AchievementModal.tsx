import React, { useState, useEffect } from 'react';

interface Achievement {
  id?: string;
  title: string;
  description: string;
  category: string;
  requirements: any;
}

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (achievement: Achievement) => void;
  achievement?: Achievement | null;
  mode: 'create' | 'edit';
}

const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  onClose,
  onSave,
  achievement,
  mode
}) => {
  const [formData, setFormData] = useState<Achievement>({
    title: '',
    description: '',
    category: 'progress',
    requirements: { type: 'level', value: 5 }
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [requirementType, setRequirementType] = useState('level');
  const [requirementValue, setRequirementValue] = useState('5');

  useEffect(() => {
    if (achievement && mode === 'edit') {
      setFormData(achievement);
      if (achievement.requirements) {
        setRequirementType(achievement.requirements.type || 'level');
        setRequirementValue(achievement.requirements.value?.toString() || '5');
      }
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'progress',
        requirements: { type: 'level', value: 5 }
      });
      setRequirementType('level');
      setRequirementValue('5');
    }
    setErrors({});
  }, [achievement, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRequirementChange = (type: string, value: string) => {
    setRequirementType(type);
    setRequirementValue(value);

    let requirements;
    switch (type) {
      case 'level':
        requirements = { type: 'level', value: parseInt(value) || 1 };
        break;
      case 'xp':
        requirements = { type: 'xp', value: parseInt(value) || 100 };
        break;
      case 'quests':
        requirements = { type: 'quests_completed', value: parseInt(value) || 1 };
        break;
      case 'streak':
        requirements = { type: 'streak', value: parseInt(value) || 7 };
        break;
      case 'custom':
        requirements = { type: 'custom', description: value };
        break;
      default:
        requirements = { type: 'level', value: 1 };
    }

    setFormData(prev => ({
      ...prev,
      requirements
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (requirementType !== 'custom' && (!requirementValue || parseInt(requirementValue) <= 0)) {
      newErrors.requirements = 'La valeur du prérequis doit être positive';
    }

    if (requirementType === 'custom' && !requirementValue.trim()) {
      newErrors.requirements = 'La description du prérequis personnalisé est requise';
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
        border: '2px solid gold',
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
          color: 'gold',
          margin: '0 0 20px 0',
          fontSize: '1.3rem'
        }}>
          {mode === 'create' ? '🏆 Créer un nouveau trophée' : '✏️ Modifier le trophée'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'gold', fontWeight: 'bold' }}>
              Titre du trophée *
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
                border: errors.title ? '2px solid #ff1744' : '2px solid gold',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem'
              }}
              placeholder="Ex: Premier pas dans l'univers PixelPump"
            />
            {errors.title && (
              <div style={{ color: '#ff1744', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.title}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'gold', fontWeight: 'bold' }}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(26, 0, 51, 0.8)',
                border: errors.description ? '2px solid #ff1744' : '2px solid gold',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              placeholder="Décrivez ce qui est nécessaire pour débloquer ce trophée..."
            />
            {errors.description && (
              <div style={{ color: '#ff1744', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.description}
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'gold', fontWeight: 'bold' }}>
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
                border: '2px solid gold',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem'
              }}
            >
              <option value="progress">Progression</option>
              <option value="social">Social</option>
              <option value="skills">Compétences</option>
              <option value="milestones">Étapes importantes</option>
              <option value="special">Spécial</option>
              <option value="seasonal">Saisonnier</option>
            </select>
          </div>

          {/* Requirements */}
          <div>
            <label style={{ display: 'block', marginBottom: '10px', color: 'gold', fontWeight: 'bold' }}>
              Prérequis pour débloquer
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <select
                value={requirementType}
                onChange={(e) => handleRequirementChange(e.target.value, requirementValue)}
                style={{
                  padding: '10px',
                  background: 'rgba(26, 0, 51, 0.8)',
                  border: '2px solid gold',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              >
                <option value="level">Niveau atteint</option>
                <option value="xp">Points d'expérience</option>
                <option value="quests">Quêtes complétées</option>
                <option value="streak">Série de jours</option>
                <option value="custom">Prérequis personnalisé</option>
              </select>

              {requirementType === 'custom' ? (
                <input
                  type="text"
                  value={requirementValue}
                  onChange={(e) => handleRequirementChange(requirementType, e.target.value)}
                  placeholder="Description du prérequis"
                  style={{
                    padding: '10px',
                    background: 'rgba(26, 0, 51, 0.8)',
                    border: errors.requirements ? '2px solid #ff1744' : '2px solid gold',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              ) : (
                <input
                  type="number"
                  value={requirementValue}
                  onChange={(e) => handleRequirementChange(requirementType, e.target.value)}
                  min="1"
                  style={{
                    padding: '10px',
                    background: 'rgba(26, 0, 51, 0.8)',
                    border: errors.requirements ? '2px solid #ff1744' : '2px solid gold',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              )}
            </div>

            {/* Requirement preview */}
            <div style={{
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid gold',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '0.9rem',
              color: '#b8b8b8'
            }}>
              <strong>Aperçu :</strong> {
                requirementType === 'level' ? `Atteindre le niveau ${requirementValue}` :
                requirementType === 'xp' ? `Accumuler ${requirementValue} points d'expérience` :
                requirementType === 'quests' ? `Compléter ${requirementValue} quête(s)` :
                requirementType === 'streak' ? `Maintenir une série de ${requirementValue} jour(s)` :
                requirementValue || 'Prérequis personnalisé'
              }
            </div>

            {errors.requirements && (
              <div style={{ color: '#ff1744', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.requirements}
              </div>
            )}
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
                background: 'linear-gradient(45deg, gold, #ff8500)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              {mode === 'create' ? '✨ Créer le trophée' : '💾 Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AchievementModal;
