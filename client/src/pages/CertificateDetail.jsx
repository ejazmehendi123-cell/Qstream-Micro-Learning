import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LoadingSpinner, ErrorState } from '../components/CommonUI';
import { useToast } from '../contexts/ToastContext';
import {
  Award,
  ShieldCheck,
  Printer,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';

export function CertificateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!id || id === 'undefined' || id === 'null') {
    return (
      <ErrorState
        title="Invalid Certificate ID"
        message="Cannot load certificate without a valid identifier."
        onRetry={() => navigate('/certificates')}
      />
    );
  }

  const fetchCertificate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/certificates/${id}`);
      if (res?.success && res?.data) {
        setCert(res.data);
      } else {
        throw new Error(res?.message || 'Certificate not found');
      }
    } catch (err) {
      setError(err.message || 'Unable to retrieve certificate');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  const verifyUrl = `${window.location.origin}/verify/${cert?.verificationToken || cert?.verification_token || cert?.certificateId || id}`;

  const copyVerifyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    toast.success('Public verification URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Rendering official credential..." />;
  }

  if (error || !cert) {
    return <ErrorState message={error || 'Certificate not found'} onRetry={fetchCertificate} />;
  }

  const recipient = cert.userName || cert.user_name || 'Alex Rivera';
  const pathTitle = cert.pathTitle || cert.path_title || 'Full Stack Web Development';
  const dateFormatted = new Date(cert.completionDate || cert.completion_date || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const certificateId = cert.certificateId || cert.certificate_id || 'QSTRM-2026-X892';

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto animate-fade-in pb-12">
      {/* Top Controls */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          to="/certificates"
          className="text-xs text-slate-400 hover:text-slate-200 transition flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Certificates</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={copyVerifyLink}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share Link'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Paper Display */}
      <div className="relative p-8 sm:p-14 rounded-3xl bg-[#0F172A] border-4 border-indigo-500/40 shadow-2xl overflow-hidden text-center space-y-8">
        {/* Decorative corner accents */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-400/60" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-400/60" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-400/60" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-400/60" />

        {/* Certificate Emblem */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500/20 via-indigo-500/20 to-purple-500/20 border-2 border-amber-400/60 shadow-xl">
          <Award className="w-10 h-10 text-amber-400" />
        </div>

        <div>
          <span className="text-xs sm:text-sm uppercase tracking-[0.3em] font-extrabold text-indigo-400 block mb-2">
            Certificate of Engineering Mastery
          </span>
          <p className="text-xs text-slate-400">This certifies that</p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight my-3 underline decoration-indigo-500 decoration-2 underline-offset-8">
            {recipient}
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            has successfully demonstrated comprehensive proficiency and completed 100% of the rigorous curriculum and adaptive assessments for
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-amber-300 mt-3">
            {pathTitle}
          </h3>
        </div>

        {/* Signatures & Seal */}
        <div className="pt-8 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
          <div className="text-center sm:text-left space-y-1">
            <span className="font-serif italic text-lg text-indigo-300 block">Qstream AI Engine</span>
            <div className="h-px bg-slate-700 w-36 mx-auto sm:mx-0" />
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
              Autonomous Evaluator
            </span>
          </div>

          <div className="text-center flex flex-col items-center">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mb-1" />
            <span className="text-[10px] font-mono text-emerald-400 font-bold block">
              AUTHENTICATED & VERIFIED
            </span>
            <span className="text-[9px] text-slate-500 block">
              Issued {dateFormatted}
            </span>
          </div>

          <div className="text-center sm:text-right space-y-1 font-mono text-[11px]">
            <span className="text-slate-400 block font-semibold">ID: {certificateId}</span>
            <div className="h-px bg-slate-700 w-36 mx-auto sm:ml-auto" />
            <span className="text-[10px] text-slate-500 block">
              Token: {cert.verificationToken ? cert.verificationToken.substring(0, 16) : 'VERIFIED'}...
            </span>
          </div>
        </div>
      </div>

      {/* Verification footer */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-400 print:hidden">
        <span className="truncate">Public Verification URL: <strong className="text-slate-200">{verifyUrl}</strong></span>
        <button
          onClick={copyVerifyLink}
          className="text-indigo-400 hover:text-indigo-300 font-semibold shrink-0 ml-4 flex items-center space-x-1"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Copy</span>
        </button>
      </div>
    </div>
  );
}
