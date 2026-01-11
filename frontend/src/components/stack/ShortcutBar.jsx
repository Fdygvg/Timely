import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import Button from '../Layout/Button';
import Modal from '../Layout/Modal';
import { api } from '../../utils/api';

const ShortcutBar = ({ shortcuts = [], onAddShortcut, onSelectShortcut, onDeleteShortcut }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [key, setKey] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddShortcut = async () => {
    if (!key.trim() || !text.trim()) return;
    
    setLoading(true);
    try {
      await api.post('/user/shortcuts', { key: key.toUpperCase(), text });
      onAddShortcut({ key: key.toUpperCase(), text });
      setKey('');
      setText('');
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add shortcut:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex items-center group">
            <button
              onClick={() => onSelectShortcut(shortcut.text)}
              className="px-3 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 text-blue-600 dark:text-blue-400 font-medium rounded-xl border border-blue-200 dark:border-blue-800 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              [{shortcut.key}]
            </button>
            <button
              onClick={() => onDeleteShortcut(shortcut.key)}
              className="ml-1 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              aria-label={`Delete shortcut ${shortcut.key}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 transition-colors flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Shortcut</span>
        </button>
      </div>

      {/* Add Shortcut Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Shortcut"
        size="small"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Shortcut Key (1-3 letters)
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="T"
              maxLength={3}
              autoFocus
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This will appear as [T] in the shortcut bar
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              placeholder="Thank you Jesus for life"
              rows={3}
              maxLength={200}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This text will be inserted when you click the shortcut
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddShortcut}
              loading={loading}
              disabled={!key.trim() || !text.trim()}
            >
              Add Shortcut
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ShortcutBar;