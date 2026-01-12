import { useState, useEffect } from 'react';
import {
  User, Check, X, Zap, Target, Rocket,
  Brain, Flame, Heart, Star, Coffee,
  Laptop, Book, Music
} from 'lucide-react';
import Modal from '../layout/Modal';
import Button from '../layout/Button';
import { useAuth } from '../../hooks/useAuth';
import { getRandomAvatar, avatarIcons } from '../../utils/helpers';

const iconMap = {
  User, Zap, Target, Rocket,
  Brain, Flame, Heart, Star, Coffee,
  Laptop, Book, Music
};

const ProfileSetupModal = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useAuth();

  // Generate avatars 1-12
  const avatars = Array.from({ length: 12 }, (_, i) => `avatar${i + 1}`);

  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setSelectedAvatar(getRandomAvatar());
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (username.length < 2 || username.length > 30) {
      setError('Username must be between 2 and 30 characters');
      return;
    }

    setLoading(true);
    const result = await updateProfile(username.trim(), selectedAvatar);
    setLoading(false);

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Your Profile"
      disableClose={true} // Force user to complete
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Welcome Message */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Timely!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Personalize your profile with a username and avatar
            </p>
          </div>

          {/* Avatar Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Choose an Avatar
            </label>
            <div className="grid grid-cols-6 gap-3">
              {avatars.map(avatar => {
                const Icon = iconMap[avatarIcons[avatar]];
                return (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all ${selectedAvatar === avatar
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 scale-105 text-blue-600 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-400'
                      }`}
                  >
                    <Icon size={24} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Username Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username *
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your display name"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all"
              maxLength={30}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {username.length}/30 characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Preview */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Preview
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                {(() => {
                  const Icon = iconMap[avatarIcons[selectedAvatar]];
                  return <Icon size={24} />;
                })()}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {username || 'Your Name'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  New Member
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              size="large"
              loading={loading}
              fullWidth
            >
              <Check size={20} className="mr-2" />
              Save Profile
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
              fullWidth
            >
              <X size={20} className="mr-2" />
              Skip for Now
            </Button>
          </div>

          {/* Note */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You can update your profile anytime from the menu
            </p>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProfileSetupModal;