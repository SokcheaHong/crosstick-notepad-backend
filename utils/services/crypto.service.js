const crypto = require('crypto');

/**
 * @param {string} key
 * @param {string} iv
 * @param {string}  [algorithm] ?: 'aes-256-cbc'
 * @return {string}
 */
module.exports = class CryptoService {
	constructor(key, iv, algorithm = 'aes-256-cbc') {
		this.secretKey = crypto
			.createHash('sha512')
			.update(key, 'utf-8')
			.digest('hex')
			.substring(0, 32);
		this.iv = crypto
			.createHash('sha512')
			.update(iv, 'utf-8')
			.digest('hex')
			.substring(0, 16);
		this.algorithm = algorithm;
	}

	/**
	 * @param {string} text
	 * @returns {string}
	 */
	encrypt(text) {
		const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, this.iv);
		let encrypted = cipher.update(text, 'utf-8', 'hex');
		encrypted += cipher.final('hex');
		return encrypted;
	}

	/**
	 * @param {string} encryptText
	 * @returns {string}
	 */
	decrypt(encryptText) {
		const decipher = crypto.createDecipheriv(
			this.algorithm,
			this.secretKey,
			this.iv
		);
		let decrypted = decipher.update(encryptText, 'hex', 'utf-8');
		decrypted += decipher.final('utf-8');
		return decrypted;
	}
};
