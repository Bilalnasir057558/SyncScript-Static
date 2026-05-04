import { useNavigate } from 'react-router-dom';
import { Trash2, Edit2, ExternalLink } from 'lucide-react';

export default function VaultCard({ vault, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
      onClick={() => navigate(`/vault/${vault.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/vault/${vault.id}`)}
    >
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
                  onClick={(event) => event.stopPropagation()}
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
          onClick={(event) => {
            event.stopPropagation();
            onEdit(vault);
          }}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
        >
          <Edit2 size={16} />
          Edit
        </button>
        <button
          onClick={(event) => {
            event.stopPropagation();
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
      <p className="mt-4 text-xs text-gray-500">Click anywhere on the card to view vault notes and resources.</p>
    </div>
  );
}