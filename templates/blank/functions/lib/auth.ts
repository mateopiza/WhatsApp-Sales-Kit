/**
 * Web Crypto API HMAC-SHA256 Auth Token Generator & Validator
 * Cloudflare Edge Compatible
 */

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function generateAuthToken(
  payload: { role: string; expiresAt: number; [key: string]: any },
  secret: string
): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const key = await getHmacKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(dataToSign)
  );

  let binary = '';
  const bytes = new Uint8Array(signatureBuffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const encodedSignature = btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `${dataToSign}.${encodedSignature}`;
}

export async function verifyAuthToken(
  authHeaderOrToken: string | null,
  secret: string
): Promise<{ valid: boolean; payload?: any; error?: string }> {
  if (!authHeaderOrToken) {
    return { valid: false, error: 'Token no proporcionado' };
  }

  const token = authHeaderOrToken.startsWith('Bearer ')
    ? authHeaderOrToken.slice(7).trim()
    : authHeaderOrToken.trim();

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Formato de token inválido' };
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  try {
    const key = await getHmacKey(secret);
    
    // Decode signature
    let base64 = encodedSignature.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const signatureBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      signatureBytes[i] = binary.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      new TextEncoder().encode(dataToSign)
    );

    if (!isValid) {
      return { valid: false, error: 'Firma de token inválida' };
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.expiresAt && Date.now() > payload.expiresAt) {
      return { valid: false, error: 'Token expirado' };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Error al validar token' };
  }
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
