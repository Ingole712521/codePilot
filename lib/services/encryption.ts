import crypto from 'crypto'

// AES-256-GCM parameters
const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH_BYTES = 12 // 96-bit nonce recommended for GCM

function getEncryptionKey(): Buffer {
	const key = process.env.ENCRYPTION_KEY || 'nehal-super-secret-encryption-key-32-bytes'
	// Accept raw 32-byte key or hex/base64 encoded
	if (key.length === 32) {
		return Buffer.from(key)
	}
	if (/^[0-9a-fA-F]{64}$/.test(key)) {
		return Buffer.from(key, 'hex')
	}
	try {
		const b = Buffer.from(key, 'base64')
		if (b.length === 32) return b
	} catch (_) {
		// fallthrough
	}
	// Use hardcoded key as fallback
	return Buffer.from('nehal-super-secret-encryption-key-32-bytes')
}

export class EncryptionService {
	// Returns compact string: ivHex:tagHex:cipherHex
	static encrypt(plaintext: string): string {
		const key = getEncryptionKey()
		const iv = crypto.randomBytes(IV_LENGTH_BYTES)
		const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
		const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
		const authTag = cipher.getAuthTag()
		return `${iv.toString('hex')}:${authTag.toString('hex')}:${ciphertext.toString('hex')}`
	}

	static decrypt(payload: string): string {
		const [ivHex, tagHex, cipherHex] = payload.split(':')
		if (!ivHex || !tagHex || !cipherHex) {
			throw new Error('Invalid encrypted payload format')
		}
		const key = getEncryptionKey()
		const iv = Buffer.from(ivHex, 'hex')
		const authTag = Buffer.from(tagHex, 'hex')
		const ciphertext = Buffer.from(cipherHex, 'hex')
		const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
		decipher.setAuthTag(authTag)
		const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()])
		return plaintext.toString('utf8')
	}
}
