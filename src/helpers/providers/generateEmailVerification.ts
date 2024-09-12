export function generateEmailVerificationLink(
  backendUrl: string,
  userId: string,
  password: string,
) {
  const encodedHashedPassword = encodeURIComponent(password);
  const link = `${backendUrl}/api/auth/verify-email?id=${userId}&hash=${encodedHashedPassword}`;
  return link;
}
