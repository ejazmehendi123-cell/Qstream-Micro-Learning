import {
  issueCertificate,
  getCertificateByTokenOrId,
  verifyCertificateEligibility
} from '../services/certificateService.js';
import { supabase, isSupabaseConfigured, getLocalCurriculum } from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/responseUtil.js';
import { validateIdentifier } from '../utils/validatorUtil.js';

export async function getUserCertificates(req, res) {
  const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*, learning_paths(title, category, slug)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return sendSuccess(res, data);
      }
    } catch (err) {
      console.warn('[Get Certificates Error]', err.message);
    }
  }

  // Fallback demo certificate
  const curriculum = getLocalCurriculum();
  const samplePath = curriculum.paths[0];

  return sendSuccess(res, [
    {
      id: 'cert-demo-01',
      certificate_id: 'QSTRM-2026-A48F',
      learning_path_id: samplePath?.id,
      completion_percentage: 100,
      completion_date: new Date().toISOString(),
      verification_token: 'tok-verify-9938210382',
      learning_paths: {
        title: samplePath?.title || 'Full Stack Web Development',
        category: samplePath?.category || 'Web Development',
        slug: samplePath?.slug || 'full-stack-web-development'
      }
    }
  ]);
}

export async function getCertificateById(req, res) {
  const { id } = req.params;
  const validation = validateIdentifier(id, 'Certificate ID');
  if (!validation.isValid) {
    return sendError(res, validation.message, 400);
  }

  try {
    const cert = await getCertificateByTokenOrId(id);
    return sendSuccess(res, cert);
  } catch (err) {
    return sendError(res, 'Certificate not found', 404, err);
  }
}

export async function verifyCertificate(req, res) {
  const { token } = req.params;
  const validation = validateIdentifier(token, 'Verification Token');
  if (!validation.isValid) {
    return sendError(res, validation.message, 400);
  }

  try {
    const cert = await getCertificateByTokenOrId(token);
    return sendSuccess(res, {
      isValid: true,
      verifiedAt: new Date().toISOString(),
      certificate: cert
    }, 'Certificate is authentic and officially verified by Qstream AI');
  } catch (err) {
    return sendError(res, 'Certificate verification failed. Token invalid or unverified.', 404, err);
  }
}

export async function generateCertificate(req, res) {
  const { pathId } = req.body;
  const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
  const userName = req.user?.full_name || 'Alex Rivera';

  const validation = validateIdentifier(pathId, 'Learning Path ID');
  if (!validation.isValid) {
    return sendError(res, validation.message, 400);
  }

  try {
    const cert = await issueCertificate({ userId, userName, pathId });
    return sendSuccess(res, cert, 'Certificate successfully awarded!', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
}
