import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Home, RotateCcw, Volume2, VolumeX, Vibrate } from 'lucide-react';
import Button from '../components/Layout/Button';
import { api } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { vibrate, formatTime } from '../utils/helpers';
import { motion } from 'framer-motion';

const PlayerPage = () => {
  const { stackId } = useParams();
  const navigate = useNavigate();
  const { user, updateUserStats } = useAuth();

  const [stack, setStack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [totalDuration, setTotalDuration] = useState(60);
  const [completedItems, setCompletedItems] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [settings, setSettings] = useState({
    vibrations: 1,
    sound: 'ding',
    volume: 0.5,
    muted: false
  });

  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const startTimeRef = useRef(null);

  // Load stack
  useEffect(() => {
    fetchStack();
  }, [stackId]);

  // Timer logic
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, timeLeft]);

  // Play sound when timer ends
  useEffect(() => {
    if (timeLeft === 0 && isPlaying) {
      playSound();
      if (settings.vibrations > 0) {
        vibrate([100, 50, 100].slice(0, settings.vibrations).flat());
      }
    }
  }, [timeLeft, isPlaying]);

  const fetchStack = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/stacks/${stackId}`);
      setStack(response.data.stack);
      setTotalDuration(response.data.stack.defaultDuration);
      setTimeLeft(response.data.stack.defaultDuration);
      setSettings(prev => ({
        ...prev,
        vibrations: response.data.stack.preferences.vibrations,
        sound: response.data.stack.preferences.sound
      }));
    } catch (err) {
      console.error('Error loading stack:', err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const playSound = () => {
    if (settings.muted || settings.sound === 'none' || !audioRef.current) return;

    try {
      audioRef.current.volume = settings.volume;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    } catch (err) {
      console.error('Sound error:', err);
    }
  };

  const handleTimerEnd = () => {
    if (currentIndex < stack.items.length - 1) {
      // Move to next item
      const currentItem = stack.items[currentIndex];
      const durationSpent = totalDuration - timeLeft;

      setCompletedItems(prev => [
        ...prev,
        {
          text: currentItem.text,
          duration: durationSpent
        }
      ]);

      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setTimeLeft(totalDuration);
        startTimeRef.current = Date.now();
      }, 500);
    } else {
      // Finished all items
      finishSession();
    }
  };

  const handleSkip = () => {
    if (currentIndex < stack.items.length - 1) {
      const durationSpent = totalDuration - timeLeft;
      setCompletedItems(prev => [
        ...prev,
        {
          text: stack.items[currentIndex].text,
          duration: durationSpent
        }
      ]);

      setCurrentIndex(prev => prev + 1);
      setTimeLeft(totalDuration);
      startTimeRef.current = Date.now();
    } else {
      finishSession();
    }
  };

  const adjustTime = (seconds) => {
    const newTime = Math.max(5, timeLeft + seconds);
    setTimeLeft(newTime);
    setTotalDuration(prev => prev + seconds);
  };

  const togglePlay = () => {
    if (!isPlaying) {
      startTimeRef.current = Date.now();
    }
    setIsPlaying(!isPlaying);
  };

  const finishSession = async () => {
    setIsPlaying(false);

    // Add last item
    const finalCompleted = [
      ...completedItems,
      {
        text: stack.items[currentIndex].text,
        duration: totalDuration - timeLeft
      }
    ];

    try {
      // Save session to backend
      await api.post('/stacks/sessions', {
        stackId,
        completedItems: finalCompleted,
        totalDuration: finalCompleted.reduce((sum, item) => sum + item.duration, 0),
        settings: {
          vibrations: settings.vibrations,
          sound: settings.sound,
          duration: totalDuration
        }
      });

      // Update user stats locally
      if (user?.stats) {
        updateUserStats({
          ...user.stats,
          totalSessions: user.stats.totalSessions + 1,
          totalTime: user.stats.totalTime + finalCompleted.reduce((sum, item) => sum + item.duration, 0),
          totalItems: user.stats.totalItems + finalCompleted.length
        });
      }

      setShowCompletion(true);
    } catch (err) {
      console.error('Error saving session:', err);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setTimeLeft(totalDuration);
    setCompletedItems([]);
    setIsPlaying(false);
    setShowCompletion(false);
    startTimeRef.current = null;
  };

  const testVibration = () => {
    vibrate([100, 50, 100].slice(0, settings.vibrations).flat());
  };

  const testSound = () => {
    playSound();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading player...</p>
        </div>
      </div>
    );
  }

  if (!stack) return null;

  const progressPercentage = ((totalDuration - timeLeft) / totalDuration) * 100;
  const isLastItem = currentIndex === stack.items.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
      {/* Audio element */}
      <audio ref={audioRef} preload="auto">
        <source src={`/sounds/${settings.sound}.mp3`} type="audio/mpeg" />
        <source src={`/sounds/${settings.sound}.wav`} type="audio/wav" />
      </audio>

      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4"
        >
          <Home size={20} className="mr-2" />
          Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {stack.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {currentIndex + 1} of {stack.items.length} items
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sound/Vibration Test */}
            <button
              onClick={testSound}
              className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Test sound"
            >
              {settings.muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button
              onClick={testVibration}
              className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Test vibration"
            >
              <Vibrate size={20} />
            </button>
          </div>
        </div>

        {/* Timer Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Timer Display */}
            <div className="text-center mb-8">
              <div className="text-8xl font-bold text-gray-900 dark:text-white mb-4 font-mono">
                {formatTime(timeLeft)}
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Default: {formatTime(stack.defaultDuration)}
              </p>
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

            {/* Time Controls */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center space-x-6 mb-6">
                <button
                  onClick={() => adjustTime(-5)}
                  className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-2xl font-bold hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors shadow-lg"
                >
                  -5s
                </button>

                <button
                  onClick={togglePlay}
                  className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
                >
                  {isPlaying ? <Pause size={40} className="mx-auto" /> : <Play size={40} className="mx-auto ml-1" />}
                </button>

                <button
                  onClick={() => adjustTime(5)}
                  className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-2xl font-bold hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors shadow-lg"
                >
                  +5s
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="secondary"
                  onClick={() => adjustTime(-10)}
                  size="small"
                >
                  -10s
                </Button>
                <span className="text-gray-500 dark:text-gray-400">Adjust time</span>
                <Button
                  variant="secondary"
                  onClick={() => adjustTime(10)}
                  size="small"
                >
                  +10s
                </Button>
              </div>
            </div>

            {/* Skip Button */}
            <div className="text-center">
              <Button
                onClick={handleSkip}
                variant="ghost"
                className="flex items-center space-x-2 mx-auto"
              >
                <SkipForward size={20} />
                <span>{isLastItem ? 'Finish' : 'Skip to Next'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content Display */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Items */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-4">
                Upcoming
              </h3>
              <div className="space-y-3">
                {stack.items.slice(currentIndex + 1, currentIndex + 4).map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                      {item.text}
                    </p>
                  </div>
                ))}
                {currentIndex >= stack.items.length - 1 && (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400 italic">
                    No more items
                  </div>
                )}
              </div>
            </div>

            {/* Current Item */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Current
              </h3>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-lg"
              >
                <div className="text-center mb-4">
                  <span className="inline-block px-4 py-1 bg-blue-500 text-white rounded-full text-sm font-semibold">
                    Item {currentIndex + 1}
                  </span>
                </div>
                <p className="text-2xl text-gray-900 dark:text-white text-center leading-relaxed whitespace-pre-wrap">
                  {stack.items[currentIndex]?.text}
                </p>
              </motion.div>
            </div>

            {/* Previous Items */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-4">
                Previous
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {completedItems.slice(-5).reverse().map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700 opacity-75"
                  >
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                      {item.text}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {formatTime(item.duration)}
                    </div>
                  </div>
                ))}
                {completedItems.length === 0 && (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400 italic">
                    No previous items yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800"
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <span className="text-white text-4xl">✓</span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Session Complete!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You finished {stack.items.length} items
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <span className="text-gray-600 dark:text-gray-400">Total Time</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatTime(completedItems.reduce((sum, item) => sum + item.duration, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <span className="text-gray-600 dark:text-gray-400">Items Completed</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {stack.items.length}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleRestart}
                    variant="secondary"
                    className="flex items-center justify-center space-x-2"
                  >
                    <RotateCcw size={20} />
                    <span>Play Again</span>
                  </Button>
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Home size={20} />
                    <span>Dashboard</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayerPage;