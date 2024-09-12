export function generateVerificationCodeAndExpiry() {
  let code: string;
  if (process.env.NODE_ENV === 'development') {
    code = '123456';
    return { code };
  }
  return { code };
}
