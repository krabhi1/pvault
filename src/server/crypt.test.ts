import { describe, it, expect } from 'vitest'
import { decrypt, encrypt } from './crypt';


describe('Encryption and Decryption', () => {
    it("should encrypt and decrypt data correctly", () => {
        const password = 'SuperSecurePassword123!';
        const text = 'Hello, secure TypeScript world!';
        const encrypted = encrypt(text, password);
        const decrypted = decrypt(encrypted, password);
        expect(decrypted).toStrictEqual(text)
    })
    it('should generate different encrypted data each time', () => {
        const password = 'SuperSecurePassword123!';
        const text = 'Hello, Vitest!';

        // Encrypt the same text twice and verify the encrypted results are different
        const encrypted1 = encrypt(text, password);
        const encrypted2 = encrypt(text, password);

        expect(encrypted1).not.toBe(encrypted2); // Encrypted data should be different
    });
    it('should fail to decrypt with a wrong password', () => {
        const password = 'SuperSecurePassword123!';
        const wrongPassword = 'WrongPassword123!';
        const text = 'Hello, Vitest!';

        // Encrypt the text
        const encrypted = encrypt(text, password);

        // Attempt to decrypt with a wrong password
        expect(() => decrypt(encrypted, wrongPassword)).toThrowError(); // It should throw an error
    });
    it('should correctly handle empty strings', () => {
        const password = 'SuperSecurePassword123!';
        const text = '';

        const encrypted = encrypt(text, password);
        const decrypted = decrypt(encrypted, password);

        expect(decrypted).toBe(text);
    });
    it('should correctly handle large data', () => {
        const password = 'SuperSecurePassword123!';
        const text = 'A'.repeat(10 ** 6); // 1MB of 'A's

        const encrypted = encrypt(text, password);
        const decrypted = decrypt(encrypted, password);

        expect(decrypted).toBe(text);
    });
    it('should generate unique IV and salt for the same password', () => {
        const password = 'SuperSecurePassword123!';
        const text = 'Hello, Vitest!';

        const encrypted1 = encrypt(text, password);
        const encrypted2 = encrypt(text, password);

        const [v1, d1, iv1, salt1] = encrypted1.split('|');
        const [v2, d2, iv2, salt2] = encrypted2.split('|');

        expect(iv1).not.toBe(iv2); // IV should be different
        expect(salt1).not.toBe(salt2); // Salt should be different
    });
    it('should fail when authentication tag is tampered with', () => {
        const password = 'SuperSecurePassword123!';
        const text = 'Hello, Vitest!';

        const encrypted = encrypt(text, password);
        const [v, encryptedData, iv, salt, _] = encrypted.split('|');

        // Tamper with the auth tag
        const tamperedEncrypted = `${v}|${encryptedData}|${iv}|${salt}|FakeAuthTag`;

        expect(() => decrypt(tamperedEncrypted, password)).toThrowError();
    });
    it('should handle passwords with special characters', () => {
        const password = 'P@ssw0rd!#123';
        const text = 'Hello, Vitest!';

        const encrypted = encrypt(text, password);
        const decrypted = decrypt(encrypted, password);

        expect(decrypted).toBe(text);
    });
    it('should handle malformed encrypted data gracefully', () => {
        const password = 'SuperSecurePassword123!';

        // Malformed data (missing one part)
        const malformedData = 'v1|EncryptedData|iv|salt';

        expect(() => decrypt(malformedData, password)).toThrowError();
    });

})