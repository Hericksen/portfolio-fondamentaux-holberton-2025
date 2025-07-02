import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  const getIconAndColors = () => {
    switch (type) {
      case 'danger':
        return {
          icon: '🚨',
          bgColor: 'bg-red-900/90',
          borderColor: 'border-red-500',
          confirmBg: 'bg-red-600 hover:bg-red-700',
          titleColor: 'text-red-300'
        };
      case 'warning':
        return {
          icon: '⚠️',
          bgColor: 'bg-yellow-900/90',
          borderColor: 'border-yellow-500',
          confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
          titleColor: 'text-yellow-300'
        };
      default:
        return {
          icon: 'ℹ️',
          bgColor: 'bg-blue-900/90',
          borderColor: 'border-blue-500',
          confirmBg: 'bg-blue-600 hover:bg-blue-700',
          titleColor: 'text-blue-300'
        };
    }
  };

  const { icon, bgColor, borderColor, confirmBg, titleColor } = getIconAndColors();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className={`${bgColor} ${borderColor} border-2 rounded-lg p-6 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{icon}</span>
          <h3 className={`text-xl font-bold ${titleColor} pixel-font`}>
            {title}
          </h3>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-gray-200 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200 font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 ${confirmBg} text-white rounded-md transition-colors duration-200 font-medium shadow-md`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
