import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Layout/Button';
import ShortcutBar from './ShortcutBar';
import StackItemCard from './StackItemCard';
import { api } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';

const StackPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stack, setStack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [addingItem, setAddingItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [shortcuts, setShortcuts] = useState([]);

  // Fetch stack and shortcuts
  useEffect(() => {
    fetchStack();
    fetchShortcuts();
  }, [id]);

  const fetchStack = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/stacks/${id}`);
      setStack(response.data.stack);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load stack');
      console.error('Error fetching stack:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchShortcuts = async () => {
    try {
      const response = await api.get('/user/shortcuts');
      setShortcuts(response.data.shortcuts);
    } catch (err) {
      console.error('Error fetching shortcuts:', err);
    }
  };

  const handleAddItem = async () => {
    if (!newItemText.trim()) return;

    try {
      const updatedStack = { ...stack };
      const newItem = {
        order: updatedStack.items.length,
        text: newItemText.trim()
      };

      updatedStack.items.push(newItem);
      setStack(updatedStack);
      setNewItemText('');
      setAddingItem(false);

      // Save to backend
      await api.patch(`/stacks/${id}`, {
        items: updatedStack.items
      });
    } catch (err) {
      console.error('Error adding item:', err);
      // Revert on error
      fetchStack();
    }
  };

  const handleEditItem = async (itemId, newText) => {
    try {
      const updatedStack = { ...stack };
      const itemIndex = updatedStack.items.findIndex(item => item._id === itemId);

      if (itemIndex !== -1) {
        updatedStack.items[itemIndex].text = newText;
        setStack(updatedStack);

        await api.patch(`/stacks/${id}`, {
          items: updatedStack.items
        });
      }
    } catch (err) {
      console.error('Error editing item:', err);
      fetchStack();
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this item?')) return;

    try {
      const updatedStack = { ...stack };
      updatedStack.items = updatedStack.items.filter(item => item._id !== itemId);

      // Reorder items
      updatedStack.items = updatedStack.items.map((item, index) => ({
        ...item,
        order: index
      }));

      setStack(updatedStack);

      await api.patch(`/stacks/${id}`, {
        items: updatedStack.items
      });
    } catch (err) {
      console.error('Error deleting item:', err);
      fetchStack();
    }
  };

  const handleSelectItem = useCallback((index) => {
    if (selectedItem === null) {
      setSelectedItem(index);
    } else {
      // Swap items
      handleSwapItems(selectedItem, index);
      setSelectedItem(null);
    }
  }, [selectedItem, stack]);

  const handleSwapItems = async (index1, index2) => {
    try {
      const response = await api.patch(`/stacks/${id}/items/order`, {
        item1Index: index1,
        item2Index: index2
      });

      setStack(prev => ({
        ...prev,
        items: response.data.items
      }));
    } catch (err) {
      console.error('Error swapping items:', err);
      fetchStack();
    }
  };

  const handleShortcutSelect = (text) => {
    if (addingItem) {
      setNewItemText(prev => prev + (prev ? '\n' : '') + text);
    } else {
      setNewItemText(text);
      setAddingItem(true);
    }
  };

  const handleAddShortcut = (shortcut) => {
    setShortcuts(prev => [...prev, shortcut]);
  };

  const handleDeleteShortcut = async (key) => {
    try {
      await api.delete(`/user/shortcuts/${key}`);
      setShortcuts(prev => prev.filter(s => s.key !== key));
    } catch (err) {
      console.error('Error deleting shortcut:', err);
    }
  };

  const handlePlayStack = () => {
    navigate(`/player/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading stack...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-2"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {stack.name}
          </h1>
          {stack.note && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {stack.note}
            </p>
          )}
        </div>

        <Button
          onClick={handlePlayStack}
          size="large"
          className="flex items-center space-x-2"
        >
          <Play size={20} />
          <span>Play Stack</span>
        </Button>
      </div>

      {/* Shortcut Bar */}
      <div className="mb-8">
        <ShortcutBar
          shortcuts={shortcuts}
          onAddShortcut={handleAddShortcut}
          onSelectShortcut={handleShortcutSelect}
          onDeleteShortcut={handleDeleteShortcut}
        />
      </div>

      {/* Add Item Button */}
      <div className="mb-8">
        {!addingItem ? (
          <button
            onClick={() => setAddingItem(true)}
            className="w-full p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
          >
            <Plus size={32} className="mb-2" />
            <span className="text-lg font-medium">Add Item</span>
            <p className="text-sm mt-1">Or click a shortcut above</p>
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-blue-200 dark:border-blue-800"
          >
            <textarea
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
              placeholder="Type your point or focus item here..."
              rows={3}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleAddItem();
                } else if (e.key === 'Escape') {
                  setAddingItem(false);
                  setNewItemText('');
                }
              }}
            />
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setAddingItem(false);
                  setNewItemText('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddItem}
                disabled={!newItemText.trim()}
              >
                Add Item
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Items List */}
      <AnimatePresence>
        <div className="space-y-4">
          {stack.items.map((item, index) => (
            <StackItemCard
              key={item._id || index}
              item={item}
              index={index}
              isSelected={selectedItem === index}
              onSelect={handleSelectItem}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onSwap={handleSwapItems}
            />
          ))}
        </div>
      </AnimatePresence>

      {/* Empty State */}
      {stack.items.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
            <Plus size={48} className="text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            No items yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add your first item using the button above or shortcuts
          </p>
          <Button onClick={() => setAddingItem(true)}>
            Add First Item
          </Button>
        </div>
      )}

      {/* Swap Instructions */}
      {selectedItem !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg z-50"
        >
          <p className="text-center font-medium">
            Click another item to swap positions
          </p>
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default StackPage;