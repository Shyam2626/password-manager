import CryptoJS from 'crypto-js'

// Encrypt password with user's master key
export const encryptPassword = (password, masterKey) => {
  return CryptoJS.AES.encrypt(password, masterKey).toString()
}

// Decrypt password with user's master key
export const decryptPassword = (encryptedPassword, masterKey) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, masterKey)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Decryption failed:', error)
    return ''
  }
}

// Generate a random password
export const generatePassword = (length = 16) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

