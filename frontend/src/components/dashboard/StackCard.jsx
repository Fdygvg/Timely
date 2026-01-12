import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  MoreVertical,
  Edit2,
  Trash2,
  Archive,
  ChevronDown,
  Clock,
  List,
  Calendar,
  Music,
  Vibrate
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

const StackCard = ({
  stack,
  viewMode = 'grid',
  onEdit,
  onDelete,
  onPlay,
  onArchive
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const navigate = useNavigate();

  const isList = viewMode === 'list';

  const handlePlay = () => {
    if (onPlay) {
      onPlay(stack);
    } else {
      navigate(`/player/${stack._id}`);
    }
  };

  const handleEdit = () => {
    setMenuOpen(false);
    onEdit(stack);
  };

  const handleDelete = () => {
    setMenuOpen(false);
    onDelete(stack);
  };

  const handleArchive = () => {
    setMenuOpen(false);
    onArchive(stack);
  };

  const handleViewStack = () => {
    navigate(`/stack/${stack._id}`);
  };

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${isList ? 'flex flex-col sm:flex-row items-stretch' : ''
        }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      layout
    >
      {/* Main Content Info */}
      <div className={`p-6 ${isList ? 'flex-1' : ''}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {stack.name}
              </h3>
              {stack.isArchived && (
                <span className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">
                  Archived
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{formatDate(stack.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <List size={14} />
                <span>{stack.items?.length || 0} items</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{stack.defaultDuration}s each</span>
              </div>
            </div>
          </div>

          {!isList && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <MoreVertical size={20} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
                  <button
                    onClick={handleEdit}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <Edit2 size={16} />
                    <span>Edit Settings</span>
                  </button>
                  <button
                    onClick={handleViewStack}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <List size={16} />
                    <span>View items</span>
                  </button>
                  <button
                    onClick={handleArchive}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <Archive size={16} />
                    <span>{stack.isArchived ? 'Unarchive' : 'Archive'}</span>
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Preferences Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {stack.preferences?.vibrations > 0 && (
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium flex items-center space-x-1">
              <Vibrate size={12} />
              <span>{stack.preferences.vibrations} vibes</span>
            </span>
          )}
          {stack.preferences?.sound && stack.preferences.sound !== 'none' && (
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium flex items-center space-x-1">
              <Music size={12} />
              <span className="capitalize">{stack.preferences.sound}</span>
            </span>
          )}
        </div>

        {/* Note Section */}
        {stack.note && (
          <div className="mb-4">
            <button
              onClick={() => setShowNote(!showNote)}
              className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <ChevronDown size={16} className={`transition-transform ${showNote ? 'rotate-180' : ''}`} />
              <span>Note</span>
            </button>
            {showNote && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-gray-700 dark:text-gray-300 text-sm"
              >
                {stack.note}
              </motion.div>
            )}
          </div>
        )}

        {/* Quick Preview of Items (Only in Grid Mode) */}
        {!isList && stack.items && stack.items.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First 3 items:
            </p>
            <div className="space-y-2">
              {stack.items.slice(0, 3).map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-gray-50/50 dark:bg-gray-900/30 rounded-lg"
                >
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold rounded-full">
                    {index + 1}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {item.text}
                  </p>
                </div>
              ))}
              {stack.items.length > 3 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  + {stack.items.length - 3} more items
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className={`${isList
        ? 'sm:w-64 flex flex-col justify-center gap-2 p-4 bg-gray-50/50 dark:bg-gray-900/20 border-l border-gray-100 dark:border-gray-700'
        : 'px-6 pb-6 pt-4 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700 flex gap-3'
        }`}>
        <button
          onClick={handlePlay}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-yellow-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-yellow-700 transition-all duration-300 group/play shadow-md hover:shadow-lg"
        >
          <Play size={20} className="group-hover/play:animate-pulse" />
          <span>Play</span>
        </button>

        <button
          onClick={handleViewStack}
          className="px-4 py-3 bg-white dark:bg-gray-800 border-2 border-green-500 text-green-600 dark:text-green-400 font-semibold rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
        >
          Edit Items
        </button>

        {isList && (
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="flex-1 p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex justify-center items-center"
              title="Edit Settings"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={handleArchive}
              className="flex-1 p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex justify-center items-center"
              title={stack.isArchived ? 'Unarchive' : 'Archive'}
            >
              <Archive size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 p-2 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex justify-center items-center"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StackCard;