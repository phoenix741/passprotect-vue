import { CipherGCMTypes } from 'crypto';
import * as localForage from 'localforage';
import { encrypt, decrypt, EncryptionContent } from '@/utils/crypto';

interface EncryptionOption {
  algorithm: CipherGCMTypes;
  digest: string;
  iterations: number;
  ivSize: number;
  saltSize: number;
  keySize: number;
}

export interface LocalForageEncryptionOptions extends LocalForageOptions, EncryptionOption {
  masterKey: string;
  serializer: LocalForageSerializer;
}

class EncryptedStorage {
  _storage!: LocalForage;
  _masterKey!: string;
  _encryption!: EncryptionOption;
  _driver = 'encryptedStorage';
  _serializer!: LocalForageSerializer;

  _initStorage(options: LocalForageEncryptionOptions) {
    // Init encryption
    this._encryption = options;
    this._masterKey = options.masterKey;
    if (!this._encryption.algorithm || !this._encryption.ivSize || !this._encryption.saltSize) {
      return Promise.reject();
    }

    // Init driver
    this._storage = localForage.createInstance({
      name: options.name + 'encrypted',
    });
    this._serializer = options.serializer;
  }

  clear(cb?: (err: any) => void): Promise<void> {
    return this._storage.clear(cb);
  }

  getItem<T>(key: string, cb?: (err: any, value: T) => void): Promise<T> {
    const promise = this._storage
      .getItem<EncryptionContent>(key)
      .then(value => decrypt(value, this._masterKey, this._encryption))
      .then(value => this._serializer.deserialize<T>(value.toString()) as T);

    executeCallback(promise, cb);
    return promise;
  }

  setItem<T>(key: string, value: T, cb?: (err: any, value: T) => void): Promise<T> {
    const serialize = (value: T) =>
      new Promise<string>((resolve, reject) =>
        this._serializer.serialize(value, function(value, error) {
          if (error) {
            reject(error);
          } else {
            resolve(value);
          }
        }),
      );

    const promise = serialize(value)
      .then(value => encrypt(Buffer.from(value), this._masterKey, this._encryption))
      .then(value => this._storage.setItem(key, value))
      .then(() => value);

    executeCallback(promise, cb);
    return promise;
  }

  removeItem(key: string, cb: (err: any) => void): Promise<void> {
    return this._storage.removeItem(key, cb);
  }

  length(cb?: (err: any, numberOfKeys: number) => void): Promise<number> {
    return this._storage.length(cb);
  }

  key(keyIndex: number, cb?: (err: any, key: string) => void): Promise<string> {
    return this._storage.key(keyIndex, cb);
  }

  keys(cb?: (err: any, keys: string[]) => void): Promise<string[]> {
    return this._storage.keys(cb);
  }

  iterate<T, U>(it: (value: T, key: string, iterationNumber: number) => U, cb?: (err: any, result: U) => void): Promise<U> {
    const promise = Promise.resolve().then(async () => {
      let iterationNumber = 0;
      for (const key of await this.keys()) {
        const value: T = await this.getItem<T>(key);
        const iterateValue = it(value, key, iterationNumber++);

        if (iterateValue !== void 0) {
          return iterateValue;
        }
      }
    }) as Promise<U>; // Force to be compatible with localForage

    executeCallback<U>(promise, cb);
    return promise;
  }
}

const storage = new EncryptedStorage();
localForage.defineDriver(storage).catch(console.log);
export default storage;

export function executeCallback<T>(promise: Promise<T>, cb?: (err: any, value: T) => void) {
  if (cb) {
    promise.then(result => cb(null, result)).catch(err => cb(err, (undefined as any) as T)); // Force to be compatible with localForage typings ....
  }
}
