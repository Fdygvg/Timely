import { Home, RotateCcw, Trophy, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../Layout/Modal';
import Button from '../Layout/Button';
import { formatTime } from '../../utils/helpers';

const CompletionModal = ({
  isOpen,
  onClose,
  onRestart,
  onDashboard,
  stats = {},
  stackName = ''
}) => {
  const confettiCount = 50;
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      size="medium"
    >
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: confettiCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              background: `hsl(${Math.random() * 360}, 100%, 60%)`
            }}
            initial={{ y: -100, opacity: 0, rotate: 0 }}
            animate={{
              y: ['0%', '100%'],
              x: [`${Math.random() * 100 - 50}%`, `${Math.random() * 100 - 50}%`],
              opacity: [0, 1, 0],
              rotate: 360
            }}
            transition={{
              duration: 1.5 + Math.random() * 1,
              delay: Math.random() * 0.5,
              repeat: 0
            }}
          />
        ))}
      </div>

      <div className="relative p-8 text-center">
        {/* Celebration Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center"
        >
          <CheckCircle size={48} className="text-white" />
        </motion.div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Session Complete! 🎉
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {stackName && `You finished "${stackName}"`}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4"
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock size={20} className="text-blue-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Total Time
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatTime(stats.totalDuration || 0)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4"
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy size={20} className="text-purple-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Items Completed
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.itemsCompleted || 0}
            </div>
          </motion.div>
        </div>

        {/* Streak Update */}
        {stats.streakIncreased && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800"
          >
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-white font-bold">🔥</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                Streak increased to {stats.currentStreak} days!
              </span>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onRestart}
            variant="secondary"
            className="flex items-center justify-center space-x-2"
          >
            <RotateCcw size={20} />
            <span>Play Again</span>
          </Button>
          <Button
            onClick={onDashboard}
            className="flex items-center justify-center space-x-2"
          >
            <Home size={20} />
            <span>Dashboard</span>
          </Button>
        </div>

        {/* Quick Tip */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          Tip: Try adjusting timer duration for each item next time!
        </p>
      </div>
    </Modal>
  );
};

export default CompletionModal;