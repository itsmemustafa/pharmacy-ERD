/**
 * Password Strength Validator
 * Best practices for password validation
 */

export const validatePassword = (password) => {
    const errors = [];
    const warnings = [];
  
    // Minimum length check (OWASP recommends 8+ characters)
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
  
    // Maximum length check (prevent DoS attacks)
    if (password.length > 128) {
      errors.push("Password must not exceed 128 characters");
    }
  
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
  
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
  
    // Check for at least one number
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
  
    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
  
    // Check for common passwords (you can expand this list)
    const commonPasswords = [
      "password",
      "123456",
      "12345678",
      "qwerty",
      "abc123",
      "password123",
      "admin",
      "letmein",
      "welcome",
      "monkey",
    ];
  
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push("Password is too common. Please choose a stronger password");
    }
  
    // Check for sequential characters
    if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)) {
      warnings.push("Avoid using sequential characters for better security");
    }
  
    // Check for repeated characters (e.g., "aaa", "111")
    if (/(.)\1{2,}/.test(password)) {
      warnings.push("Avoid repeating the same character multiple times");
    }
  
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      strength: calculateStrength(password),
    };
  };
  
  /**
   * Calculate password strength score (0-100)
   */
  const calculateStrength = (password) => {
    let score = 0;
  
    // Length score (up to 30 points)
    if (password.length >= 8) score += 10;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
  
    // Complexity score (up to 40 points)
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^a-zA-Z0-9]/.test(password)) score += 10;
  
    // Variety score (up to 30 points)
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= 8) score += 10;
    if (uniqueChars >= 12) score += 10;
    if (uniqueChars >= 16) score += 10;
  
    return {
      score,
      level: getStrengthLevel(score),
    };
  };
  
  const getStrengthLevel = (score) => {
    if (score >= 80) return "strong";
    if (score >= 60) return "good";
    if (score >= 40) return "fair";
    return "weak";
  };
  
  /**
   * Check if password has been leaked in data breaches
   * Uses Have I Been Pwned API (k-Anonymity model - secure)
   */
  export const checkPasswordBreach = async (password) => {
    try {
      const crypto = await import("crypto");
      const hash = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
      const prefix = hash.substring(0, 5);
      const suffix = hash.substring(5);
  
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const data = await response.text();
  
      const hashes = data.split("\n");
      for (let line of hashes) {
        const [hashSuffix, count] = line.split(":");
        if (hashSuffix === suffix) {
          return {
            isBreached: true,
            count: parseInt(count),
            message: `This password has been exposed in ${count} data breaches. Please choose a different password.`,
          };
        }
      }
  
      return { isBreached: false };
    } catch (error) {
      // If API fails, don't block user - just log the error
      console.error("Password breach check failed:", error);
      return { isBreached: false, error: true };
    }
  };
  
  export default validatePassword;