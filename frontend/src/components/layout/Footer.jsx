import { Heart, Coffee, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div>
              <h3 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Timely
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Focus. Flow. Finish.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
            >
              Features
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
            >
              Contact
            </a>
          </div>

          {/* Social & Info */}
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Heart size={14} className="text-red-500" />
              <span>Made with</span>
              <Coffee size={14} className="text-amber-600" />
              <span>for focus</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Timely
            </span>
          </div>
        </div>

        {/* Mobile Love Note */}
        <div className="md:hidden mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Heart size={14} className="text-red-500" />
            <span>Made with love for focused minds</span>
            <Coffee size={14} className="text-amber-600" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;