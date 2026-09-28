import React, { useState, useEffect } from 'react';
import { CertificateCard } from '../components/LearningCards';
import { LoadingSpinner, ErrorState } from '../components/CommonUI';
import { Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/certificates');
      if (res?.success && res?.data) {
        setCertificates(res.data);
      } else {
        throw new Error(res?.message || 'Failed to load credentials');
      }
    } catch (err) {
      setError(err.message || 'Unable to load certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <Award className="w-7 h-7 text-purple-400" />
            <span>Verified Specialization Certificates</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tamper-proof verifiable credentials earned upon 100% completion of any learning path.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4" />
          <span>Cryptographically Verifiable</span>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Retrieving verified credentials..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCertificates} />
      ) : certificates.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <Award className="w-12 h-12 text-purple-400 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-slate-200">No Certificates Earned Yet</h3>
            <p className="max-w-md mx-auto mt-1">Complete all modules and assessments in any learning path to automatically unlock your official certificate.</p>
          </div>
          <Link
            to="/paths"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
          >
            <span>Browse Paths</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      )}
    </div>
  );
}
