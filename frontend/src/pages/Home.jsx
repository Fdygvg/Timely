import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import LoginModal from "../components/auth/LoginModal";
import RegisterModal from "../components/auth/RegisterModal";
import Footer from "../components/layout/Footer";
import { motion } from 'framer-motion';
import { useAuth } from "../hooks/useAuth";
import { Shield, Smartphone, BarChart3, Zap, Palette, RefreshCw } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const isAuthenticated = Boolean(user);



  // Check if user is already logged in


  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      setShowRegister(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 dark:from-gray-900 dark:to-slate-800">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-16 pb-20">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo & Title */}
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <div className="flex justify-center items-center mb-6">
              <motion.img
                src="/logo.png"
                alt="Timely Logo"
                className="w-24 h-24 rounded-2xl shadow-2xl border-4 border-white/10"
                variants={pulseVariants}
                animate="pulse"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-yellow-600 dark:from-green-400 dark:to-yellow-400 mb-4">
              Timely
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light">
              Focus. Flow. Finish.
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.div
            className="text-center mb-12 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
              Your Personal Interval Progression Tool
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Create lists, set timers, and progress through items with
              vibration/sound alerts. Perfect for meditation,
              study sessions, or any focused activity.
            </p>
          </motion.div>

          {/* Animated Demo */}
          <motion.div
            className="relative max-w-4xl mx-auto mb-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-200 dark:border-gray-700"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-green-600 dark:text-green-300">
                    1
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  Create Lists
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Add your points or focus items
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-yellow-600 dark:text-yellow-300">
                    2
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  Set Timer
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Choose duration, vibrations & sound
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-300">
                    3
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  Progress
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Auto-advance through items with alerts
                </p>
              </div>
            </div>

            {/* Animated Timer Bar */}
            <div className="mt-8">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-yellow-500"
                  animate={{
                    width: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Start</span>
                <span>Progress</span>
                <span>Complete</span>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-yellow-600 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-yellow-600 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                >
                  Get Started Free
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogin(true)}
                  className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-green-500 text-green-600 dark:text-green-400 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                >
                  Login
                </button>
              </>
            )}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20"
            variants={containerVariants}
          >
            {[
              {
                icon: <Shield className="text-green-500" />,
                title: "Secure & Private",
                desc: "No emails, no passwords. Your data stays yours.",
              },
              {
                icon: <Smartphone className="text-yellow-500" />,
                title: "Mobile First",
                desc: "Designed for phone use with vibration alerts.",
              },
              {
                icon: <BarChart3 className="text-emerald-500" />,
                title: "Track Progress",
                desc: "Streaks, history, and stats to keep you motivated.",
              },
              {
                icon: <Zap className="text-yellow-600" />,
                title: "Shortcuts",
                desc: "Quick-add buttons for frequently used items.",
              },
              {
                icon: <Palette className="text-green-600" />,
                title: "Clean UI",
                desc: "Beautiful, distraction-free interface.",
              },
              {
                icon: <RefreshCw className="text-emerald-600" />,
                title: "Flexible",
                desc: "Use for meditation, study, workouts, etc.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-500 transition-colors"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center shadow-sm">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />


      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
};

export default Home;
