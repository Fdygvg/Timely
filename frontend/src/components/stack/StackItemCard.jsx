import { useState, useEffect, useRef } from 'react';
import { Edit2, Trash2, GripVertical, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const StackItemCard = ({
  item,
  index,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onSwap,
  isDragging = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef(null);

  const handleEdit = () => {
    if (editText.trim() && editText !== item.text) {
      onEdit(item._id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(item.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleClick = () => {
    if (isEditing) return;

    if (isSelected) {
      onSelect(null); // Deselect
    } else {
      onSelect(index);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isDragging ? 1.02 : 1
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.01 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative p-6 rounded-2xl border-2 transition-all duration-200
          ${isSelected
            ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 shadow-lg'
            : 'border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 hover:border-green-300 dark:hover:border-green-700'
          }
          ${isDragging ? 'shadow-xl z-10' : 'shadow-sm'}
        `}
        onClick={handleClick}
      >
        {/* Item number */}
        <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-yellow-600 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">
            {index + 1}
          </span>
        </div>

        {/* Drag handle (visible on hover) */}
        <div className={`absolute -top-2 -right-2 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-move">
            <GripVertical size={16} className="text-gray-400" />
          </div>
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              ref={inputRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-green-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
              <button
                onClick={handleEdit}
                className="p-2 text-green-500 hover:text-green-600"
                disabled={!editText.trim()}
              >
                <Check size={20} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
              {item.text}
            </p>

            {/* Action buttons (visible on hover) */}
            <div className={`flex justify-end space-x-2 mt-4 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-2 text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                aria-label="Edit item"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item._id);
                }}
                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                aria-label="Delete item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default StackItemCard;