import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useVaults } from '../hooks/useVaults';

export default function VaultDetailPage() {
  const { currentUser } = useAuth();
  const { vaultId } = useParams();
  const navigate = useNavigate();
  const { getVaultById } = useVaults(currentUser.id);
  const vault = getVaultById(vaultId);

  if (!vault) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vault not found</h1>
          <p className="text-gray-600 mb-6">This vault may have been deleted or the link is invalid.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <h1 className="text-3xl font-bold text-slate-900 mt-4">{vault.name}</h1>
            <p className="text-slate-600 mt-2">{vault.description || 'No description added yet.'}</p>
          </div>
          <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm">
            <p className="text-sm text-slate-500">Resources</p>
            <p className="text-2xl font-semibold text-slate-900">{vault.resources.length}</p>
          </div>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] mb-10">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Vault Notes</h2>
              </div>
              {vault.richNotes ? (
                <div className="prose prose-slate max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: vault.richNotes }} />
              ) : (
                <p className="text-sm text-slate-500">No rich notes added yet. Use the vault editor to capture your ideas and summaries.</p>
              )}
            </div>

            <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Resource Notes</h2>
              </div>
              {vault.resources.length > 0 ? (
                <div className="space-y-4">
                  {vault.resources.map((resource) => (
                    <div key={resource.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-semibold hover:underline"
                        >
                          {resource.title}
                        </a>
                        <p className="text-sm text-slate-500 mt-1 truncate">{resource.url}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">This vault has no resources yet. Add one from the dashboard to keep your research tidy.</p>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-blue-600 p-6 text-white shadow-lg">
              <p className="text-sm uppercase tracking-[0.24em] text-blue-200 mb-3">Vault insights</p>
              <p className="text-3xl font-bold">{vault.resources.length ? vault.resources.length : '0'}</p>
              <p className="text-slate-200 mt-2">Saved resources</p>
              <div className="mt-6 rounded-3xl bg-white/10 p-4">
                <p className="text-sm text-slate-200">Updated</p>
                <p className="mt-1 text-white font-medium">{new Date(vault.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm uppercase tracking-[0.22em] text-slate-500 mb-4">Vault details</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><span className="font-semibold text-slate-900">Created:</span> {new Date(vault.createdAt).toLocaleDateString()}</li>
                <li><span className="font-semibold text-slate-900">Updated:</span> {new Date(vault.updatedAt).toLocaleDateString()}</li>
                <li><span className="font-semibold text-slate-900">Resources:</span> {vault.resources.length}</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}