import { useState, useEffect } from 'react';
import { Plus, Filter, Search, Calendar, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/api';
import ProfileSetupModal from '../components/auth/ProfileSetupModal';
import StreakCard from '../components/dashboard/StreakCard';
import StackCard from '../components/dashboard/StackCard';
import CreateStackModal from '../components/dashboard/CreateStackModal';
import Button from '../components/layout/Button';

const Dashboard = () => {
  const { user, checkAuth } = useAuth();
  const [stacks, setStacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingStack, setEditingStack] = useState(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filter, setFilter] = useState('all'); // 'all', 'archived', 'active'

  useEffect(() => {
    if (user) {
      fetchStacks();
      // Check if profile needs setup (no username)
      if (!user.username) {
        setShowProfileSetup(true);
      }
    }
  }, [user]);

  const fetchStacks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stacks');
      setStacks(response.data.stacks || []);
    } catch (error) {
      console.error('Failed to fetch stacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStack = async (stackData, stackId) => {
    try {
      if (stackId) {
        // Update existing stack
        await api.patch(`/stacks/${stackId}`, stackData);
      } else {
        // Create new stack
        await api.post('/stacks', stackData);
      }

      setShowCreateModal(false);
      setEditingStack(null);
      fetchStacks();
    } catch (error) {
      console.error('Failed to save stack:', error);
    }
  };

  const handleEditStack = (stack) => {
    setEditingStack(stack);
    setShowCreateModal(true);
  };

  const handleDeleteStack = async (stack) => {
    if (window.confirm(`Delete "${stack.name}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/stacks/${stack._id}`);
        fetchStacks();
      } catch (error) {
        console.error('Failed to delete stack:', error);
      }
    }
  };

  const handleArchiveStack = async (stack) => {
    try {
      await api.patch(`/stacks/${stack._id}`, {
        isArchived: !stack.isArchived
      });
      fetchStacks();
    } catch (error) {
      console.error('Failed to archive stack:', error);
    }
  };

  const filteredStacks = stacks.filter(stack => {
    // Apply search filter
    const matchesSearch = stack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stack.note?.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply archive filter
    const matchesFilter = filter === 'all' ? true :
      filter === 'archived' ? stack.isArchived :
        filter === 'active' ? !stack.isArchived : true;

    return matchesSearch && matchesFilter;
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Setup Modal */}
      <ProfileSetupModal
        isOpen={showProfileSetup}
        onClose={() => setShowProfileSetup(false)}
        onSuccess={() => {
          setShowProfileSetup(false);
          checkAuth();
        }}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome{user.username ? `, ${user.username}` : ''}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your stacks and track your progress
          </p>
        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          variant="primary"
          size="large"
          className="flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Stack</span>
        </Button>
      </div>

      {/* Stats & Streak */}
      <StreakCard
        streak={user.streak || 0}
        totalSessions={user.stats?.totalSessions || 0}
        totalTime={user.stats?.totalTime || 0}
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
        {/* Search */}
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search stacks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500 dark:text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400"
            >
              <option value="all">All Stacks</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-gray-800 shadow-sm' : ''}`}
            >
              <Grid size={18} className={viewMode === 'grid' ? 'text-green-500' : 'text-gray-500'} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 shadow-sm' : ''}`}
            >
              <List size={18} className={viewMode === 'list' ? 'text-green-500' : 'text-gray-500'} />
            </button>
          </div>
        </div>
      </div>

      {/* Stacks Grid/List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : filteredStacks.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} className="text-green-500 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No stacks found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm ? 'Try a different search term' : 'Create your first stack to get started'}
          </p>
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            size="large"
            className="mx-auto"
          >
            <Plus size={20} className="mr-2" />
            Create Your First Stack
          </Button>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            layout
            className={`${viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
              }`}
          >
            {filteredStacks.map(stack => (
              <motion.div
                key={stack._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <StackCard
                  stack={stack}
                  viewMode={viewMode}
                  onEdit={handleEditStack}
                  onDelete={handleDeleteStack}
                  onArchive={handleArchiveStack}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Create/Edit Modal */}
      <CreateStackModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingStack(null);
        }}
        onSubmit={handleCreateStack}
        editingStack={editingStack}
      />
    </div>
  );
};

export default Dashboard;