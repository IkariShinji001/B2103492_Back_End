function generatePassword(length, useUppercase, useNumbers, useSymbols) {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

  let allowedChars = lowercaseChars;

  if (useUppercase) {
    allowedChars += uppercaseChars;
  }

  if (useNumbers) {
    allowedChars += numberChars;
  }

  if (useSymbols) {
    allowedChars += symbolChars;
  }

  let password = '';
  const charCount = allowedChars.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charCount);
    password += allowedChars[randomIndex];
  }

  return password;
}

module.exports = generatePassword;