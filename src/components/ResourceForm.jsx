import { useState } from 'react';

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