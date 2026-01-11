import { Flame, TrendingUp, Calendar, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const StreakCard = ({ streak = 0, totalSessions = 0, totalTime = 0 }) => {
  const totalHours = Math.floor(totalTime / 3600);
  const totalMinutes = Math.floor((totalTime % 3600) / 60);

  // Calculate next milestone
  const milestones = [3, 7, 14, 30, 60, 90, 100];
  const nextMilestone = milestones.find(m => m > streak) || 100;
  const progress = streak > 0 ? Math.min((streak / nextMilestone) * 100, 100) : 0;

  // Get motivational message
  const getMotivation = () => {
    if (streak === 0) return "Start your journey today!";
    if (streak < 3) return "Keep going! Consistency is key.";
    if (streak < 7) return "Building momentum!";
    if (streak < 14) return "You're on a roll!";
    if (streak < 30) return "Incredible dedication!";
    return "You're unstoppable!";
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Flame className="text-amber-600 dark:text-amber-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Current Streak</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{getMotivation()}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-4xl font-bold text-amber-600 dark:text-amber-400">{streak}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">days</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
          <span>Progress to {nextMilestone} days</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="h-3 bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-amber-100 dark:border-amber-800/30">
          <div className="flex items-center space-x-2 mb-2">
            <Target size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sessions</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalSessions}</div>
        </div>

        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-amber-100 dark:border-amber-800/30">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar size={16} className="text-green-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalHours > 0 ? `${totalHours}h ` : ''}{totalMinutes}m
          </div>
        </div>

        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-amber-100 dark:border-amber-800/30">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp size={16} className="text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Next Goal</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{nextMilestone}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">days</div>
        </div>

        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-amber-100 dark:border-amber-800/30">
          <div className="flex items-center space-x-2 mb-2">
            <Flame size={16} className="text-red-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Today</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {streak > 0 ? '🔥' : '💡'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {streak > 0 ? 'On fire!' : 'Start now'}
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className="mt-6 pt-4 border-t border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-700 dark:text-amber-300">
          <span className="font-semibold">Tip:</span> Maintain your streak by completing at least one session every day.
        </p>
      </div>
    </motion.div>
  );
};

export default StreakCard;