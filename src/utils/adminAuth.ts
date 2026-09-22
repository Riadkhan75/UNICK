// SHA-256 hashes of authorized administrator credentials
// Credentials are NEVER stored in plaintext in the HTML or source code.
const TARGET_EMAIL_HASH = '19ff3da1d8b88a54903b3e496150a6fd8b31a0578c1fcaf13668e2aca30bfd87';
const TARGET_PASS_HASH = '98102942faaca43259f3c55df93b838e8ae4cec5ecd1c2cd64958e713834135f';

const SESSION_STORAGE_KEY = 'riad_admin_session_auth_v2';

/**
 * Computes SHA-256 hash using Web Crypto API
 */
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies provided credentials against secure hashes
 */
export async function verifyAdminCredentials(
  emailInput: string,
  passwordInput: string
): Promise<boolean> {
  try {
    const emailHash = await hashString(emailInput.toLowerCase());
    const passHash = await hashString(passwordInput);
    return emailHash === TARGET_EMAIL_HASH && passHash === TARGET_PASS_HASH;
  } catch (err) {
    console.error('Credential verification error:', err);
    return false;
  }
}

/**
 * Checks if current browser tab has a valid active session
 */
export function isSessionAuthenticated(): boolean {
  try {
    const sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionData) return false;
    const parsed = JSON.parse(sessionData);
    return !!parsed && parsed.authenticated === true;
  } catch {
    return false;
  }
}

/**
 * Stores secure session token in sessionStorage
 */
export function setSessionAuthenticated(): void {
  try {
    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        authenticated: true,
        loggedAt: Date.now(),
        token: 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      })
    );
  } catch (e) {
    console.warn('Session storage write error:', e);
  }
}

/**
 * Clears session on logout
 */
export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (e) {
    console.warn('Session storage remove error:', e);
  }
}

/**
 * Checks if current window location points to /adminriad
 */
export function isAdminRiadRoute(): boolean {
  try {
    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      pathname.endsWith('/adminriad') ||
      pathname.includes('adminriad') ||
      hash.includes('adminriad') ||
      search.includes('adminriad')
    );
  } catch {
    return false;
  }
}
