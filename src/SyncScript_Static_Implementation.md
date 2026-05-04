# SyncScript Static Version - Core Code Files

## File 1: src/hooks/useAuth.js

```javascript
import { useState, useEffect } from 'react';
import { getFromStorage, setToStorage, removeFromStorage } from '../utils/storage';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const user = getFromStorage('currentUser');
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const signup = (username, email, password) => {
    const users = getFromStorage('users') || [];
    
    // Check if user already exists
    if (users.find(u => u.email === email || u.username === username)) {
      throw new Error('User already exists');
    }

    // In production, never store passwords on client!
    const newUser = {
      id: `user-${Date.now()}`,
      username,
      email,
      password, // ⚠️ DEMO ONLY - Hash in production!
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    setToStorage('users', users);

    // Auto-login
    const session = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      token: `token-${Date.now()}`, // Fake JWT
      isLoggedIn: true
    };
    setToStorage('currentUser', session);
    setCurrentUser(session);

    return newUser;
  };

  const login = (email, password) => {
    const users = getFromStorage('users') || [];
    const user = users.find(u => u.email === email || u.username === email);

    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }

    const session = {
      id: user.id,
      username: user.username,
      email: user.email,
      token: `token-${Date.now()}`,
      isLoggedIn: true
    };
    setToStorage('currentUser', session);
    setCurrentUser(session);

    return session;
  };

  const logout = () => {
    removeFromStorage('currentUser');
    setCurrentUser(null);
  };

  return {
    currentUser,
    loading,
    signup,
    login,
    logout,
    isLoggedIn: !!currentUser
  };
};
```

---

## File 2: src/hooks/useVaults.js

```javascript
import { useState, useEffect } from 'react';
import { getFromStorage, setToStorage } from '../utils/storage';

export const useVaults = (userId) => {
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load vaults from localStorage
  useEffect(() => {
    const allVaults = getFromStorage('vaults') || [];
    const userVaults = allVaults.filter(v => v.createdBy === userId);
    setVaults(userVaults);
  }, [userId]);

  const createVault = (vaultData) => {
    if (!vaultData.name?.trim()) {
      throw new Error('Vault name is required');
    }

    const allVaults = getFromStorage('vaults') || [];
    
    const newVault = {
      id: `vault-${Date.now()}`,
      createdBy: userId,
      name: vaultData.name.trim(),
      description: vaultData.description?.trim() || '',
      resources: vaultData.resources || [],
      richNotes: vaultData.richNotes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    allVaults.push(newVault);
    setToStorage('vaults', allVaults);
    setVaults(prev => [newVault, ...prev]);

    return newVault;
  };

  const updateVault = (vaultId, vaultData) => {
    const allVaults = getFromStorage('vaults') || [];
    const index = allVaults.findIndex(v => v.id === vaultId);

    if (index === -1) throw new Error('Vault not found');

    const updatedVault = {
      ...allVaults[index],
      ...vaultData,
      updatedAt: new Date().toISOString()
    };

    allVaults[index] = updatedVault;
    setToStorage('vaults', allVaults);
    setVaults(prev => prev.map(v => v.id === vaultId ? updatedVault : v));

    return updatedVault;
  };

  const deleteVault = (vaultId) => {
    const allVaults = getFromStorage('vaults') || [];
    const filtered = allVaults.filter(v => v.id !== vaultId);
    
    setToStorage('vaults', filtered);
    setVaults(prev => prev.filter(v => v.id !== vaultId));
  };

  const addResource = (vaultId, resource) => {
    if (!resource.title?.trim() || !resource.url?.trim()) {
      throw new Error('Title and URL are required');
    }

    const allVaults = getFromStorage('vaults') || [];
    const vault = allVaults.find(v => v.id === vaultId);

    if (!vault) throw new Error('Vault not found');

    const newResource = {
      id: `resource-${Date.now()}`,
      title: resource.title.trim(),
      url: resource.url.trim(),
      createdAt: new Date().toISOString(),
      notes: []
    };

    vault.resources.push(newResource);
    vault.updatedAt = new Date().toISOString();
    
    setToStorage('vaults', allVaults);
    setVaults(prev => prev.map(v => v.id === vaultId ? vault : v));

    return newResource;
  };

  const deleteResource = (vaultId, resourceId) => {
    const allVaults = getFromStorage('vaults') || [];
    const vault = allVaults.find(v => v.id === vaultId);

    if (!vault) throw new Error('Vault not found');

    vault.resources = vault.resources.filter(r => r.id !== resourceId);
    vault.updatedAt = new Date().toISOString();

    setToStorage('vaults', allVaults);
    setVaults(prev => prev.map(v => v.id === vaultId ? vault : v));
  };

  const addNote = (vaultId, resourceId, noteContent) => {
    if (!noteContent?.trim()) {
      throw new Error('Note cannot be empty');
    }

    const allVaults = getFromStorage('vaults') || [];
    const vault = allVaults.find(v => v.id === vaultId);
    const resource = vault?.resources.find(r => r.id === resourceId);

    if (!resource) throw new Error('Resource not found');

    const newNote = {
      id: `note-${Date.now()}`,
      content: noteContent.trim(),
      createdAt: new Date().toISOString()
    };

    resource.notes.push(newNote);
    vault.updatedAt = new Date().toISOString();

    setToStorage('vaults', allVaults);
    setVaults(prev => prev.map(v => v.id === vaultId ? vault : v));

    return newNote;
  };

  const deleteNote = (vaultId, resourceId, noteId) => {
    const allVaults = getFromStorage('vaults') || [];
    const vault = allVaults.find(v => v.id === vaultId);
    const resource = vault?.resources.find(r => r.id === resourceId);

    if (!resource) throw new Error('Resource not found');

    resource.notes = resource.notes.filter(n => n.id !== noteId);
    vault.updatedAt = new Date().toISOString();

    setToStorage('vaults', allVaults);
    setVaults(prev => prev.map(v => v.id === vaultId ? vault : v));
  };

  return {
    vaults,
    loading,
    createVault,
    updateVault,
    deleteVault,
    addResource,
    deleteResource,
    addNote,
    deleteNote
  };
};
```

---

## File 3: src/utils/storage.js

```javascript
export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from storage: ${key}`, error);
    return null;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to storage: ${key}`, error);
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from storage: ${key}`, error);
  }
};

export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing storage', error);
  }
};
```

---

## File 4: src/components/VaultCard.jsx

```javascript
import { Trash2, Edit2, ExternalLink } from 'lucide-react';

export default function VaultCard({ vault, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{vault.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {vault.description || 'No description'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-4 text-sm text-gray-600">
        <span>📚 {vault.resources.length} resources</span>
        <span>📝 Created {new Date(vault.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Resources Preview */}
      {vault.resources.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-xs font-semibold text-gray-700 mb-2">Resources:</p>
          <div className="space-y-1">
            {vault.resources.slice(0, 3).map(resource => (
              <div key={resource.id} className="text-xs text-gray-600 flex items-center gap-1">
                <ExternalLink size={12} />
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  {resource.title}
                </a>
              </div>
            ))}
            {vault.resources.length > 3 && (
              <p className="text-xs text-gray-500">
                +{vault.resources.length - 3} more resources
              </p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(vault)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
        >
          <Edit2 size={16} />
          Edit
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete "${vault.name}"? This cannot be undone.`)) {
              onDelete(vault.id);
            }
          }}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}
```

---

## File 5: src/components/CreateVaultModal.jsx

```javascript
import { useState } from 'react';
import { X } from 'lucide-react';
import ResourceForm from './ResourceForm';

export default function CreateVaultModal({ vault, onSave, onClose }) {
  const [formData, setFormData] = useState(vault || {
    name: '',
    description: '',
    resources: [],
    richNotes: ''
  });

  const [resources, setResources] = useState(formData.resources || []);
  const [showResourceForm, setShowResourceForm] = useState(false);

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Vault name is required');
      return;
    }

    onSave({
      ...formData,
      resources
    });
  };

  const addResource = (resource) => {
    setResources(prev => [...prev, { ...resource, id: `resource-${Date.now()}`, notes: [] }]);
    setShowResourceForm(false);
  };

  const removeResource = (id) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            {vault ? 'Edit Vault' : 'Create New Vault'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Vault Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vault Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., DBMS Notes"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of your vault..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Resources Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
              {!showResourceForm && (
                <button
                  onClick={() => setShowResourceForm(true)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  + Add Resource
                </button>
              )}
            </div>

            {/* Resource Form */}
            {showResourceForm && (
              <ResourceForm
                onAdd={addResource}
                onCancel={() => setShowResourceForm(false)}
              />
            )}

            {/* Resources List */}
            <div className="space-y-2">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{resource.title}</p>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline truncate"
                    >
                      {resource.url}
                    </a>
                    {resource.notes?.length > 0 && (
                      <p className="text-xs text-gray-600 mt-1">
                        📝 {resource.notes.length} note{resource.notes.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeResource(resource.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium ml-4"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Rich Notes - Simple version (can add TinyMCE later) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vault Notes
            </label>
            <textarea
              value={formData.richNotes}
              onChange={(e) => setFormData({ ...formData, richNotes: e.target.value })}
              placeholder="Add additional notes about this vault..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">💡 Tip: Use this for vault-level notes and overview</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {vault ? 'Update Vault' : 'Create Vault'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## File 6: src/components/ResourceForm.jsx

```javascript
export default function ResourceForm({ onAdd, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    url: ''
  });

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.url.trim()) {
      alert('Title and URL are required');
      return;
    }

    // Basic URL validation
    if (!formData.url.startsWith('http')) {
      alert('Please enter a valid URL (starting with http:// or https://)');
      return;
    }

    onAdd(formData);
    setFormData({ title: '', url: '' });
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
      <div className="space-y-3">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Resource title (e.g., SQL Tutorial)"
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="flex-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Add Resource
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## File 7: src/pages/DashboardPage.jsx

```javascript
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
```

---

## File 8: src/pages/LandingPage.jsx

```javascript
import { ArrowRight, Lock, Zap, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">SyncScript</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-white text-center py-20 px-6">
        <h2 className="text-5xl font-bold mb-4">Organize Your Knowledge</h2>
        <p className="text-xl mb-8 opacity-90">
          Create vaults to store links, notes, and resources all in one place
        </p>
        <button
          onClick={() => navigate('/signup')}
          className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2 mx-auto"
        >
          Get Started <ArrowRight size={20} />
        </button>
      </section>

      {/* Features */}
      <section className="bg-white text-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Create Vaults</h4>
              <p className="text-gray-600">
                Organize your knowledge into categorized vaults
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Store Resources</h4>
              <p className="text-gray-600">
                Save links, tutorials, and references easily
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Take Notes</h4>
              <p className="text-gray-600">
                Add personal notes and annotations to resources
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white text-center py-16 px-6">
        <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
        <button
          onClick={() => navigate('/signup')}
          className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100"
        >
          Create Your First Vault
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 text-center py-6">
        <p>&copy; 2026 SyncScript. All rights reserved.</p>
      </footer>
    </div>
  );
}
```

---

Continue with LoginPage and SignupPage in next message...

```

---

## Notes for Implementation

**Dependencies to install:**
```bash
npm install react react-dom react-router-dom lucide-react
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer
```

**Setup steps:**
1. Create Vite project
2. Install all dependencies
3. Copy these files to your src folder
4. Setup routing in App.jsx
5. Test all features
6. Deploy to GitHub Pages

**Key features implemented:**
✅ localStorage-based authentication  
✅ Vault CRUD operations  
✅ Resources (links) within vaults  
✅ Notes on resources  
✅ Responsive UI with TailwindCSS  
✅ Error handling and validation  
✅ Optimistic UI updates  

