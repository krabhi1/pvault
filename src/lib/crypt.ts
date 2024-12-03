// Helper functions for encoding and decoding base64
function base64Encode(array: Uint8Array): string {
  let base64String = "";
  for (let i = 0; i < array.length; i++) {
    base64String += String.fromCharCode(array[i]);
  }
  return btoa(base64String);
}

function base64Decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Function to derive a key from the password
async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypt data function
export async function encryptData(
  password: string,
  data: string
): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16)); // Generate random salt
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate random IV (12 bytes for AES-GCM)
  const key = await deriveKey(password, salt);

  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  // Encrypt the data using AES-GCM
  const cipherText = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedData
  );

  // Extract the authentication tag (last 16 bytes of the encrypted data)
  const authTag = new Uint8Array(cipherText.slice(cipherText.byteLength - 16));
  const encryptedData = new Uint8Array(
    cipherText.slice(0, cipherText.byteLength - 16)
  );

  // Format the result as "v1|encrypted_data|iv|salt|tag" in base64
  const result = [
    "v1",
    base64Encode(encryptedData),
    base64Encode(iv),
    base64Encode(salt),
    base64Encode(authTag),
  ].join("|");

  return result;
}

// Decrypt data function
export async function decryptData(password: string, encryptedString: string) {
  const parts = encryptedString.split("|");

  if (parts.length !== 5 || parts[0] !== "v1") {
    throw new Error("Invalid encrypted data format");
  }

  const encryptedData = base64Decode(parts[1]);
  const iv = base64Decode(parts[2]);
  const salt = base64Decode(parts[3]);
  const authTag = base64Decode(parts[4]);

  const key = await deriveKey(password, salt);

  // Combine the encrypted data and authentication tag
  const cipherTextWithTag = new Uint8Array(
    encryptedData.length + authTag.length
  );
  cipherTextWithTag.set(encryptedData);
  cipherTextWithTag.set(authTag, encryptedData.length);

  // Decrypt the data using AES-GCM
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    cipherTextWithTag
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}

// Example usage
async function testEncryptionDecryption() {
  const password = "123"; // Example password
  const data = "This is a secret message"; // Data to encrypt

  const encrypted = await encryptData(password, data);
  console.log("Encrypted Data:", encrypted);

  const decrypted = await decryptData(password, encrypted);
  console.log("Decrypted Data:", decrypted);
}

testEncryptionDecryption();
