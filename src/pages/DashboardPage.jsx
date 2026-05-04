import { useState } from 'react';
import { LogOut } from 'lucide-react';
import VaultCard from '../components/VaultCard';
import CreateVaultModal from '../components/CreateVaultModal';
import { useVaults } from '../hooks/useVaults';

export default function DashboardPage({ currentUser, onLogout }) {
  const { vaults, createVault, updateVault, deleteVault } = useVaults(currentUser.id);
  const [showModal, setShowModal] = useState(false);
  const [editingVault, setEditingVault] = useState(null);

  const handleCreate = (data) => {
    try {
      createVault(data);
      setShowModal(false);
      alert('Vault created successfully!');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUpdate = (data) => {
    try {
      updateVault(editingVault.id, data);
      setEditingVault(null);
      setShowModal(false);
      alert('Vault updated successfully!');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = (vaultId) => {
    try {
      deleteVault(vaultId);
      alert('Vault deleted successfully!');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (vault) => {
    setEditingVault(vault);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">SyncScript</h1>
            <p className="text-sm text-gray-600">Welcome, {currentUser.username}!</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Vaults</h2>
            <p className="text-gray-600 mt-1">{vaults.length} vault{vaults.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => {
              setEditingVault(null);
              setShowModal(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            + Create Vault
          </button>
        </div>

        {/* Vaults Grid */}
        {vaults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaults.map((vault) => (
              <VaultCard
                key={vault.id}
                vault={vault}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">No vaults yet!</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Vault
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <CreateVaultModal
            vault={editingVault}
            onSave={editingVault ? handleUpdate : handleCreate}
            onClose={() => {
              setShowModal(false);
              setEditingVault(null);
            }}
          />
        )}
      </main>
    </div>
  );
}