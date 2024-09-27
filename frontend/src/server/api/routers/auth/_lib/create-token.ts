import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '~/env';

const secretKey = env.NEXTAUTH_SECRET;

const algorithm = 'aes-256-cbc';
const iv = crypto.randomBytes(16); // Инициализационный вектор

function encrypt(text: string) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'base64'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; // Сохраняем IV вместе с зашифрованными данными
}

export function decrypt(text: string) {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'base64'), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  console.log(decrypted)

  return JSON.parse(decrypted);
}

const createToken = (email: string, password: string) => {
  const encryptedPayload = encrypt(JSON.stringify({ email, password }));

  const token = encodeURIComponent(jwt.sign({data: encryptedPayload}, secretKey, { expiresIn: '12h' }));

  return token;
}

export default createToken;
