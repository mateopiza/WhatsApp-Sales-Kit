import { PagesFunction, Env } from '../lib/types';
import { generateAuthToken, verifyAuthToken, timingSafeEqual } from '../lib/auth';
import { jsonResponse } from '../lib/utils';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  let body: any;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ success: false, error: 'Invalid JSON payload' }, 400);
  }

  const inputPin = body.pin ? String(body.pin).trim() : '';
  const inputPassword = body.password ? String(body.password).trim() : '';
  const credential = body.credential ? String(body.credential).trim() : '';

  const configuredPin = env?.ADMIN_PIN || 'empires2026';
  const configuredPassword = env?.ADMIN_PASSWORD || 'empires2026';
  const secret = env?.AUTH_SECRET || 'empires-secret-key-2026';

  // Support master PIN "empires2026" as well as legacy/env pins
  const validPins = [configuredPin, 'empires2026', '1879'];
  const validPasswords = [configuredPassword, 'empires2026'];

  const isPinMatch = inputPin && validPins.some((p) => timingSafeEqual(inputPin, p));
  const isPassMatch = inputPassword && validPasswords.some((p) => timingSafeEqual(inputPassword, p));
  const isCredMatch =
    credential &&
    (validPins.some((p) => timingSafeEqual(credential, p)) ||
      validPasswords.some((p) => timingSafeEqual(credential, p)));

  if (!isPinMatch && !isPassMatch && !isCredMatch) {
    return jsonResponse(
      {
        success: false,
        error: 'Credenciales inválidas. Ingrese el PIN o contraseña de administrador autorizado.',
      },
      401
    );
  }

  const expiresInHours = 24;
  const expiresAt = Date.now() + expiresInHours * 60 * 60 * 1000;
  const token = await generateAuthToken({ role: 'admin', expiresAt }, secret);

  return jsonResponse({
    success: true,
    data: {
      token,
      authenticated: true,
      role: 'admin',
      expiresAt,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const authHeader = request.headers.get('Authorization');
  const secret = env?.AUTH_SECRET || 'empires-secret-key-2026';

  const authResult = await verifyAuthToken(authHeader, secret);

  if (!authResult.valid) {
    return jsonResponse({ success: false, error: authResult.error || 'Token inválido o expirado' }, 401);
  }

  return jsonResponse({
    success: true,
    data: {
      authenticated: true,
      role: 'admin',
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
};
