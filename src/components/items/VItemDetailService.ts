import { generatePassword } from '@/utils/crypto';

export async function generate() {
  return generatePassword(128);
}
