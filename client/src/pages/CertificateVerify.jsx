import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/CommonUI';
import { ShieldCheck, XCircle, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../services/api';

export function CertificateVerify() {
  const { certificateId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function verify() {
      if (!certificateId) {
        setError('Missing verification parameter.');
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/certificates/verify/${certificateId}`);
        if (res?.success && res?.data) {
          setResult(res.data);
        } else {
          setError(res?.message || 'Certificate verification failed.');
        }
      } catch (err) {
        setError(err.message || 'Invalid or unverified token.');
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, [certificateId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
            Q
          </div>
          <span className="font-bold text-white text-base">Qstream AI Verification</span>
        </Link>

        {loading ? (
          <LoadingSpinner size="lg" text="Verifying cryptographic signature with Supabase..." />
        ) : error ? (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Verification Failed</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              {error} This certificate identifier could not be verified in our records.
            </p>
          </div>
        ) : (
          <div className="space-y-6 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <ShieldCheck className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block">
                Official Credential Verified
              </span>
              <h2 className="text-2xl font-extrabold text-white">Authentic Certificate</h2>
              <p className="text-xs text-slate-400">
                Issued by Qstream AI Platform on {new Date(result.certificate?.completionDate || Date.now()).toLocaleDateString()}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Recipient:</span>
                <span className="font-bold text-white">{result.certificate?.userName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Specialization:</span>
                <span className="font-bold text-indigo-300">{result.certificate?.pathTitle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Completion:</span>
                <span className="font-bold text-emerald-400">{result.certificate?.completionPercentage}% Completed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Certificate ID:</span>
                <span className="font-mono text-amber-300 font-bold">{result.certificate?.certificateId}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/paths"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
              >
                <span>Explore Specializations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
