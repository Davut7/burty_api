export function generateEmailVerificationLink(
  backendUrl: string,
  userId: string,
  password: string,
) {
  const encodedHashedPassword = encodeURIComponent(password);
  return `${backendUrl}/api/auth/verify-email?id=${userId}&hash=${encodedHashedPassword}`;
}
