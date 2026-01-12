import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Music,
  Vibrate,
  X,
  Plus,
  Check,
  Volume2,
  Bell,
  AlertCircle
} from 'lucide-react';
import Modal from '../layout/Modal';
import Button from '../layout/Button';
import { getCurrentDate, vibrate } from '../../utils/helpers';

const CreateStackModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingStack = null,
  isLoading = false
}) => {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [duration, setDuration] = useState(60);
  const [vibrations, setVibrations] = useState(1);
  const [sound, setSound] = useState('ding');
  const [items, setItems] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with editingStack data
  useEffect(() => {
    if (editingStack) {
      setName(editingStack.name || '');
      setNote(editingStack.note || '');
      setDuration(editingStack.defaultDuration || 60);
      setVibrations(editingStack.preferences?.vibrations || 1);
      setSound(editingStack.preferences?.sound || 'ding');
      setItems(editingStack.items?.map(item => ({ text: item.text })) || []);
    } else {
      resetForm();
    }
  }, [editingStack, isOpen]);

  const resetForm = () => {
    setName('');
    setNote('');
    setDuration(60);
    setVibrations(1);
    setSound('ding');
    setItems([]);
    setErrors({});
  };

  const handleUseTodayDate = () => {
    setName(getCurrentDate());
  };

  const handleTestVibration = () => {
    if (vibrations === 0) return;
    const pattern = [];
    for (let i = 0; i < vibrations; i++) {
      pattern.push(200);
      if (i < vibrations - 1) pattern.push(100);
    }
    vibrate(pattern);
  };

  const handleTestSound = () => {
    if (sound === 'none') return;

    const audio = new Audio(`/sounds/${sound}.mp3`);
    audio.play().catch(e => console.error('Error playing sound:', e));
  };

  const handleAddItem = () => {
    setItems([...items, { text: '' }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index, value) => {
    const newItems = [...items];
    newItems[index].text = value;
    setItems(newItems);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Stack name is required';
    } else if (name.length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters';
    }

    if (note.length > 500) {
      newErrors.note = 'Note cannot exceed 500 characters';
    }

    if (duration < 5 || duration > 3600) {
      newErrors.duration = 'Duration must be between 5 and 3600 seconds';
    }

    items.forEach((item, index) => {
      if (!item.text.trim()) {
        newErrors[`item-${index}`] = 'Item text is required';
      } else if (item.text.length > 500) {
        newErrors[`item-${index}`] = 'Item cannot exceed 500 characters';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const stackData = {
      name: name.trim(),
      note: note.trim(),
      defaultDuration: duration,
      preferences: {
        vibrations,
        sound
      },
      items: items.map(item => ({ text: item.text.trim() }))
    };

    onSubmit(stackData, editingStack?._id);
  };

  const soundOptions = [
    { value: 'none', label: 'No Sound', icon: <Volume2 size={16} /> },
    { value: 'ding', label: 'Ding', icon: <Bell size={16} /> },
    { value: 'bell', label: 'Bell', icon: <Bell size={16} /> },
    { value: 'chime', label: 'Chime', icon: <Music size={16} /> }
  ];

  const vibrationOptions = [0, 1, 2, 3, 4, 5];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingStack ? 'Edit Stack' : 'Create New Stack'}
      size="large"
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Basic Information
            </h3>

            {/* Name */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stack Name *
                </label>
                <button
                  type="button"
                  onClick={handleUseTodayDate}
                  className="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                >
                  <Calendar size={14} />
                  <span>Use Today's Date</span>
                </button>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Morning Focus, Study Session"
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 transition-all`}
                maxLength={100}
              />
              {errors.name && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {name.length}/100 characters
              </p>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a description or notes about this stack..."
                rows={3}
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border ${errors.note ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 transition-all resize-none`}
                maxLength={500}
              />
              {errors.note && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.note}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {note.length}/500 characters
              </p>
            </div>
          </div>

          {/* Timer Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Timer Settings
            </h3>

            {/* Duration */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Duration per Item (seconds)
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="range"
                    min="5"
                    max="300"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>5s</span>
                    <span>1m</span>
                    <span>2m</span>
                    <span>3m</span>
                    <span>5m</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Clock size={20} className="text-green-600 dark:text-green-400" />
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {duration}s
                  </span>
                </div>
              </div>
              {errors.duration && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.duration}</p>
              )}
            </div>

            {/* Vibrations */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Vibrations per Transition
                </label>
                <button
                  type="button"
                  onClick={handleTestVibration}
                  className="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                >
                  <Vibrate size={14} />
                  <span>Test</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {vibrationOptions.map(count => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setVibrations(count)}
                    className={`px-4 py-2 rounded-lg transition-all ${vibrations === count
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                  >
                    {count === 0 ? 'None' : `${count} ${count === 1 ? 'vibe' : 'vibes'}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sound Alert
                </label>
                <button
                  type="button"
                  onClick={handleTestSound}
                  disabled={sound === 'none'}
                  className={`flex items-center space-x-1 text-sm ${sound === 'none'
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300'
                    }`}
                >
                  <Volume2 size={14} />
                  <span>Test</span>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {soundOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSound(option.value)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${sound === option.value
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                  >
                    <div className="mb-2">{option.icon}</div>
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Items ({items.length})
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
              >
                <Plus size={16} />
                <span>Add Item</span>
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <AlertCircle size={32} className="mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  No items added yet. Add your first item to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold rounded-full mt-3">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <textarea
                        value={item.text}
                        onChange={(e) => handleItemChange(index, e.target.value)}
                        placeholder={`Item ${index + 1}...`}
                        rows={2}
                        className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border ${errors[`item-${index}`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 transition-all resize-none`}
                        maxLength={500}
                      />
                      {errors[`item-${index}`] && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {errors[`item-${index}`]}
                        </p>
                      )}
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors mt-3"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>💡 Items will be displayed in order during the timer session.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={isLoading}
            fullWidth
          >
            {isLoading ? (
              <>Saving...</>
            ) : editingStack ? (
              <>
                <Check size={20} className="mr-2" />
                Update Stack
              </>
            ) : (
              'Create Stack'
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            fullWidth
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateStackModal;