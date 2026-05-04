import { ArrowRight, Lock, Zap, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-700 text-slate-100">
      {/* Navbar */}
      <nav className="bg-slate-950/95 border-b border-slate-800 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-300">SyncScript</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-slate-200 hover:text-white"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 bg-amber-300 text-slate-950 rounded-lg hover:bg-amber-400 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-200 mb-4">Build smarter study habits</p>
          <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-white">
            Create vaults for your learning journey.
          </h2>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-10">
            Save links and resources in a calm, structured workspace made for students, creators, and lifelong learners.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-amber-300 text-slate-950 rounded-full font-semibold shadow-xl shadow-amber-500/20 hover:bg-amber-400 transition"
          >
            Get Started <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-100 text-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">Designed for confident learning</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200">
              <BookOpen className="w-12 h-12 text-amber-500 mx-auto mb-5" />
              <h4 className="text-xl font-semibold mb-3">Vault organization</h4>
              <p className="text-slate-600">Keep your study materials organized with clear vaults for each topic.</p>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200">
              <Zap className="w-12 h-12 text-slate-900 mx-auto mb-5" />
              <h4 className="text-xl font-semibold mb-3">Fast resource capture</h4>
              <p className="text-slate-600">Save links quickly so you can focus on learning, not managing.</p>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200">
              <Lock className="w-12 h-12 text-blue-600 mx-auto mb-5" />
              <h4 className="text-xl font-semibold mb-3">Private by design</h4>
              <p className="text-slate-600">Store your notes in the browser with a private, offline-friendly layout.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-slate-100 text-center py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Ready for a cleaner study workflow?</h3>
          <p className="text-slate-300 mb-8">Turn scattered links and ideas into a simple, consistent knowledge system.</p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-amber-300 text-slate-950 rounded-full font-semibold hover:bg-amber-400 transition"
          >
            Create Your First Vault
          </button>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-6 grid gap-6 md:grid-cols-3">
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">SyncScript</h4>
            <p className="text-slate-400 leading-relaxed">A focused workspace for learning, research, and note capture. Keep your study flow neat and intentional.</p>
          </div>
          <div>
            <h5 className="text-sm uppercase tracking-[0.24em] text-amber-300 mb-4">Product</h5>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>Vault management</li>
              <li>Resource capture</li>
              <li>Simple notes</li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm uppercase tracking-[0.24em] text-amber-300 mb-4">Get started</h5>
            <p className="text-slate-400 text-sm">Sign up now and start building your learning vault today.</p>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-slate-500 text-sm">
          &copy; 2026 SyncScript. All rights reserved.
        </div>
      </footer>
    </div>
  );
}