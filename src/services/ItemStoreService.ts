import config from '../config.yml';
import { omit } from '@/utils/lodash';
import { WalletLine, ClearWalletLine, LineTypeEnum, EncryptedBlockInput } from '@/generated/graphql';
import { encrypt, decrypt, getEncryptedContent, getEncryptedBlockInput } from '@/utils/crypto';

export const DEFAULT_LINE_CARD: Partial<WalletLine> = {
  type: LineTypeEnum.Card,
  group: '',
  logo: '',
  label: '',
};

export const DEFAULT_LINE_PASSWORD: Partial<WalletLine> = {
  type: LineTypeEnum.Password,
  group: '',
  logo: '',
  label: '',
};

export const DEFAULT_LINE_TEXT: Partial<WalletLine> = {
  type: LineTypeEnum.Text,
  group: '',
  logo: '',
  label: '',
};

export const DEFAULT_CONTENT = {
  __typename: 'ClearWalletLine',

  username: '',
  password: '',
  siteUrl: '',
  text: '',
  cardType: '',
  nameOnCard: '',
  cardNumber: '',
  cvv: '',
  expiry: '',
  code: '',
  notes: '',
};

export interface LineUi {
  label: string;
  icon: string;
  color: string;
  fields: Partial<WalletLine>;
}

export interface LineUiMapping {
  [key: string]: LineUi;
}

export const cardTypeMapping: LineUiMapping = {
  card: {
    label: 'list.type.card',
    icon: 'credit_card',
    color: 'red',
    fields: DEFAULT_LINE_CARD,
  },
  password: {
    label: 'list.type.password',
    icon: 'fingerprint',
    color: 'blue',
    fields: DEFAULT_LINE_PASSWORD,
  },
  text: {
    label: 'list.type.text',
    icon: 'text_fields',
    color: 'green',
    fields: DEFAULT_LINE_TEXT,
  },
};

export async function decryptLineContent(line: WalletLine, masterKey: string | Buffer): Promise<ClearWalletLine> {
  const decodeContent = getEncryptedContent(line.encryption);
  const data = await decrypt(decodeContent, masterKey, config.crypto);
  const object = JSON.parse(data.toString());
  return Object.assign({}, DEFAULT_CONTENT, object);
}

export interface WalletLineToEncrypt {
  __typename?: string;
  content: ClearWalletLine;
  typeLabel?: string;
  typeColor?: string;
  typeIcon?: string;
}

export async function encryptLineContent<T extends WalletLineToEncrypt>(
  input: T,
  masterKey: string | Buffer,
): Promise<Omit<T, 'content' | 'typeLabel' | 'typeColor' | 'typeIcon' | '__typename'> & { encryption: EncryptedBlockInput }> {
  const data = JSON.stringify(input.content);
  return Object.assign(omit(input, ['content', 'typeLabel', 'typeColor', 'typeIcon', '__typename']), {
    encryption: getEncryptedBlockInput(await encrypt(data, masterKey, config.crypto)),
  });
}
