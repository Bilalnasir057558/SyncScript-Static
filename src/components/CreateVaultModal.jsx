import { useState } from 'react';
import { X } from 'lucide-react';
import ResourceForm from './ResourceForm';
import NotesEditor from './NotesEditor';

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
    setResources(prev => [...prev, { ...resource, id: `resource-${Date.now()}`, notes: resource.notes || [] }]);
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

          {/* Rich Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vault Notes
            </label>
            <NotesEditor
              value={formData.richNotes}
              onChange={(content) => setFormData({ ...formData, richNotes: content })}
              placeholder="Add additional notes about this vault..."
            />
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