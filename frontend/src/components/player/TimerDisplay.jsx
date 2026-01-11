import { useState, useEffect } from 'react';
import { Play, Pause, Plus, Minus, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTime } from '../../utils/helpers';

const TimerDisplay = ({
  timeLeft,
  totalDuration,
  isPlaying,
  onPlayPause,
  onAdjustTime,
  onReset,
  onSkip,
  showControls = true
}) => {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const progressPercentage = ((totalDuration - timeLeft) / totalDuration) * 100;

  // Auto-hide adjustment buttons after 3 seconds
  useEffect(() => {
    if (isAdjusting) {
      const timer = setTimeout(() => setIsAdjusting(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAdjusting]);

  const handleAdjustTime = (seconds) => {
    onAdjustTime(seconds);
    setIsAdjusting(true);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
      {/* Main Timer */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <motion.div
            key={timeLeft}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-white font-mono mb-2"
          >
            {formatTime(timeLeft)}
          </motion.div>
          
          {/* Pulsing ring when playing */}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-blue-500/30"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
        
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          Default: {formatTime(totalDuration)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
          <span>0:00</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <>
          {/* Main Play/Pause Controls */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            <button
              onClick={() => handleAdjustTime(-5)}
              className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors shadow-lg flex items-center justify-center"
              aria-label="Subtract 5 seconds"
            >
              <Minus size={24} />
            </button>
            
            <button
              onClick={onPlayPause}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 flex items-center justify-center"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={32} className="md:size-40" />
              ) : (
                <Play size={32} className="md:size-40 ml-1" />
              )}
            </button>
            
            <button
              onClick={() => handleAdjustTime(5)}
              className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors shadow-lg flex items-center justify-center"
              aria-label="Add 5 seconds"
            >
              <Plus size={24} />
            </button>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center justify-center space-x-4">
            {/* Quick Adjust Buttons */}
            <div className={`flex items-center space-x-2 transition-opacity ${isAdjusting ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={() => handleAdjustTime(-10)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                -10s
              </button>
              <button
                onClick={() => handleAdjustTime(10)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                +10s
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={onReset}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Reset timer"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          {/* Time Adjustment Indicator */}
          {isAdjusting && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4"
            >
              Timer adjusted to {formatTime(totalDuration)}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default TimerDisplay;