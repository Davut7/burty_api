export function generateVerificationCodeAndExpiry() {
  let code: string;

  if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test') {
    code = '123456';
  } else {
    code = Math.floor(100000 + Math.random() * 900000).toString();
  }

  return { code };
}
