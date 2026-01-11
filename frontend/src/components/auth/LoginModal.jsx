import { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle, XCircle, Copy } from 'lucide-react';
import Modal from '../Layout/Modal';
import Button from '../Layout/Button';
import { useAuth } from '../../hooks/useAuth';
import { copyToClipboard, isValidToken } from '../../utils/helpers';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const { login, error: authError, setError: setAuthError } = useAuth();

  // Clear errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setToken('');
      setError('');
      setAuthError('');
      // Check for temp token from registration
      const tempToken = localStorage.getItem('temp_token');
      if (tempToken) {
        setToken(tempToken);
      }
    }
  }, [isOpen, setAuthError]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token.trim()) {
      setError('Please enter your token');
      return;
    }

    if (!isValidToken(token)) {
      setError('Token must be exactly 128 hexadecimal characters');
      return;
    }

    const result = await login(token);
    if (result.success) {
      onClose();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (isValidToken(text)) {
        setToken(text);
        setError('');
      } else {
        setError('Invalid token format in clipboard');
      }
    } catch (err) {
      setError('Cannot access clipboard. Paste manually.');
    }
  };

  const handleCopyExample = () => {
    const example = 'a1b2c3d4e5f6'.repeat(10).slice(0, 128); // 128 chars
    setToken(example);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Login to Timely">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>No password needed!</strong> Use the 128-character token you received when you registered. If you lost it, you'll need to create a new account.
            </p>
          </div>

          {/* Token Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Secure Token
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  setError('');
                }}
                placeholder="Enter your 128-character token"
                className="w-full px-4 py-3 pr-24 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all"
                spellCheck="false"
                autoComplete="off"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  title={showToken ? 'Hide token' : 'Show token'}
                >
                  {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                  type="button"
                  onClick={handlePaste}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Paste
                </button>
              </div>
            </div>

            {/* Token Validation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {token.length === 128 ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-red-500" />
                  )}
                  <span className={`text-xs ${token.length === 128 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {token.length}/128 characters
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {/^[0-9a-fA-F]+$/.test(token) || token === '' ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-red-500" />
                  )}
                  <span className={`text-xs ${/^[0-9a-fA-F]+$/.test(token) || token === '' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    Hex format
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  copyToClipboard(token);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                disabled={!token}
                className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Copy size={14} />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Help Text */}
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>💡 <strong>Where to find your token?</strong></p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>You received it when you registered</li>
              <li>Check your password manager or saved notes</li>
              <li>Token looks like: <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">a1b2c3d4e5f6...</code></li>
            </ul>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCopyExample}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                View example token format →
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={false} // You can add loading state to auth context
            >
              Login
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
          </div>

          {/* Switch to Register */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchToRegister();
                }}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Create one now
              </button>
            </p>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default LoginModal;