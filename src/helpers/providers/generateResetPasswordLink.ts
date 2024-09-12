export function generateResetPasswordLink(
  backendUrl: string,
  resetPasswordToken: string,
  userId: string,
): string {
  const link = `${backendUrl}/api/auth/reset-password?resetToken=${resetPasswordToken}&userId=${userId}`;

  return link;
}
