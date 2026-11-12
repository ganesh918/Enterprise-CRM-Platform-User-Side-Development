const OTP_SESSION_KEY = "nexus-crm-otp-pending";
const RESET_TOKEN_KEY = "nexus-crm-reset-token";
function generateOtpCode() {
  return String(Math.floor(1e5 + Math.random() * 9e5));
}
function startOtpSession(email) {
  const code = generateOtpCode();
  const session = {
    email: email.trim().toLowerCase(),
    code,
    expiresAt: new Date(Date.now() + 10 * 60 * 1e3).toISOString()
  };
  sessionStorage.setItem(OTP_SESSION_KEY, JSON.stringify(session));
  return code;
}
function readOtpSession() {
  try {
    const raw = sessionStorage.getItem(OTP_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function clearOtpSession() {
  sessionStorage.removeItem(OTP_SESSION_KEY);
}
function verifyOtp(email, code) {
  const session = readOtpSession();
  if (!session) return false;
  if (session.email !== email.trim().toLowerCase()) return false;
  if (new Date(session.expiresAt).getTime() < Date.now()) return false;
  return session.code === code.trim();
}
function issueResetToken(email) {
  const token = crypto.randomUUID();
  sessionStorage.setItem(
    RESET_TOKEN_KEY,
    JSON.stringify({ email: email.trim().toLowerCase(), token })
  );
  clearOtpSession();
  return token;
}
function validateResetToken(token) {
  try {
    const raw = sessionStorage.getItem(RESET_TOKEN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.token !== token) return null;
    return parsed.email;
  } catch {
    return null;
  }
}
function clearResetToken() {
  sessionStorage.removeItem(RESET_TOKEN_KEY);
}
export {
  clearOtpSession,
  clearResetToken,
  generateOtpCode,
  issueResetToken,
  readOtpSession,
  startOtpSession,
  validateResetToken,
  verifyOtp
};
