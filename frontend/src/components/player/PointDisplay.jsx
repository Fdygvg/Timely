import { AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

const PointDisplay = ({
  currentItem,
  previousItems = [],
  upcomingItems = [],
  currentIndex,
  totalItems
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Upcoming Items */}
      <div className="lg:col-span-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
            Upcoming
          </h3>
          <ChevronDown size={20} className="text-gray-400" />
        </div>
        
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          <AnimatePresence>
            {upcomingItems.slice(0, 5).map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0.7, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {currentIndex + index + 2}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {upcomingItems.length === 0 && (
            <div className="p-4 text-center text-gray-400 dark:text-gray-500 italic text-sm">
              No more items
            </div>
          )}
        </div>
      </div>

      {/* Current Item */}
      <div className="lg:col-span-1">
        <div className="text-center mb-4">
          <span className="inline-block px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-semibold">
            {currentIndex + 1} of {totalItems}
          </span>
        </div>
        
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-lg min-h-[300px] flex flex-col justify-center"
        >
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-blue-500/20"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-purple-500/20"></div>
            
            <p className="text-2xl md:text-3xl text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap text-center">
              {currentItem?.text}
            </p>
            
            {/* Progress indicator */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(totalItems, 10) }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex % 10
                        ? 'bg-blue-500 w-4'
                        : index < currentIndex % 10
                        ? 'bg-blue-300 dark:bg-blue-600'
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Previous Items */}
      <div className="lg:col-span-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
            Previous
          </h3>
          <ChevronUp size={20} className="text-gray-400" />
        </div>
        
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          <AnimatePresence>
            {previousItems.slice(-5).reverse().map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.6, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white/20 dark:bg-gray-800/20 rounded-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        ✓
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                      {item.text}
                    </p>
                    {item.duration && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {previousItems.length === 0 && (
            <div className="p-4 text-center text-gray-400 dark:text-gray-500 italic text-sm">
              No previous items yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointDisplay;