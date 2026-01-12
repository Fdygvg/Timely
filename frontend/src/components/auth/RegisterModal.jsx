import { useState, useEffect } from 'react';
import { Check, Copy, AlertCircle, ExternalLink } from 'lucide-react';
import Modal from '../layout/Modal';
import Button from '../layout/Button';
import { useAuth } from '../../hooks/useAuth';
import { copyToClipboard } from '../../utils/helpers';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [step, setStep] = useState(1); // 1: Warning, 2: Generate, 3: Show token
  const [generatedToken, setGeneratedToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedWarning, setSavedWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, error: authError } = useAuth();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setGeneratedToken('');
      setCopied(false);
      setSavedWarning(false);
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleGenerateToken = async () => {
    setLoading(true);
    setError('');

    const result = await register();

    if (result.success) {
      setGeneratedToken(result.token);
      setStep(3);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleCopyToken = async () => {
    const success = await copyToClipboard(generatedToken);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleProceed = () => {
    // Token should already be saved in localStorage from register()
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Warning Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <AlertCircle size={32} className="text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>

            {/* Warning Text */}
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Important Security Notice
              </h3>

              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-left">
                <ul className="space-y-3 text-sm text-yellow-800 dark:text-yellow-300">
                  <li className="flex items-start space-x-2">
                    <span className="font-bold">🔐 No Recovery:</span>
                    <span>There are <strong>no passwords, emails, or recovery options</strong>. If you lose your token, your account is permanently inaccessible.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-bold">💾 Save Immediately:</span>
                    <span>You will see your token <strong>only once</strong>. Save it in a password manager or secure location <strong>before proceeding</strong>.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-bold">📱 Personal Use:</span>
                    <span>This is designed for personal use. Each token = one account. Create multiple accounts for different devices if needed.</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
                <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-800 dark:text-green-300 text-left">
                  <strong>Recommended:</strong> Use a password manager like Bitwarden, 1Password, or your phone's secure notes to save the token.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => setStep(2)}
                variant="primary"
                size="large"
                fullWidth
              >
                I Understand, Generate Token
              </Button>

              <Button
                onClick={onClose}
                variant="ghost"
                fullWidth
              >
                Cancel
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Loading State */}
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-green-500 animate-ping" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Generating Secure Token
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Creating a cryptographically secure 128-character token...
                </p>

                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 animate-[progress_2s_ease-in-out_infinite]" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    This may take a moment
                  </p>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Action */}
            <Button
              onClick={handleGenerateToken}
              variant="primary"
              size="large"
              loading={loading}
              fullWidth
            >
              {loading ? 'Generating...' : 'Generate Token Now'}
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Check size={32} className="text-green-600 dark:text-green-400" />
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Token Generated Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your secure token has been created. <strong className="text-red-600 dark:text-red-400">Save it now!</strong>
              </p>
            </div>

            {/* Token Display */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Secure Token (128 characters)
              </label>
              <div className="relative">
                <div className="bg-gray-900 text-gray-100 font-mono text-sm p-4 rounded-xl overflow-x-auto whitespace-nowrap">
                  {generatedToken}
                </div>
                <button
                  onClick={handleCopyToken}
                  className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Copy token"
                >
                  {copied ? (
                    <Check size={18} className="text-green-400" />
                  ) : (
                    <Copy size={18} className="text-gray-300" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                This is your only chance to copy the token. It won't be shown again.
              </p>
            </div>

            {/* Save Confirmation */}
            <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
              <input
                type="checkbox"
                id="saved"
                checked={savedWarning}
                onChange={(e) => setSavedWarning(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="saved" className="text-sm text-green-800 dark:text-green-300">
                <strong>I have saved my token securely</strong> (required)
                <p className="mt-1 text-xs">I understand that losing this token means permanent account loss with no recovery options.</p>
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={onSwitchToLogin} // Switch to login modal instead of just closing
                variant="primary"
                size="large"
                disabled={!savedWarning}
                fullWidth
              >
                Proceed to Login
              </Button>

              <Button
                onClick={onClose}
                variant="ghost"
                fullWidth
              >
                Cancel
              </Button>
            </div>

            {/* Already have account */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have a token?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToLogin();
                  }}
                  className="text-green-600 dark:text-green-400 font-semibold hover:underline"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 1 ? 'Create Secure Account' : step === 2 ? 'Generating Token' : 'Save Your Token'}
      showCloseButton={step !== 2} // Don't allow closing during generation
    >
      <div className="p-6">
        {renderStep()}
      </div>
    </Modal>
  );
};

export default RegisterModal;