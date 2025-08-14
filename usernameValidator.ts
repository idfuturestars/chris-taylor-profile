// Username validation utility
export class UsernameValidator {
  private static readonly PROHIBITED_WORDS = [
    // Profanity and inappropriate content
    'admin', 'administrator', 'moderator', 'support', 'help', 'staff', 'official',
    'verified', 'check', 'checkmark', 'blue', 'gold', 'premium', 'pro', 'vip',
    'system', 'bot', 'api', 'null', 'undefined', 'root', 'test', 'guest',
    // Reserved platform terms
    'eiq', 'sikatlabs', 'idfs', 'pathway', 'replit', 'google', 'facebook', 'apple',
    // Misleading identity claims
    'celebrity', 'famous', 'star', 'influencer', 'leader', 'ceo', 'founder',
    'president', 'director', 'manager', 'teacher', 'professor', 'doctor',
    // Add common profanity (abbreviated to avoid explicit content)
    'f*ck', 'sh*t', 'damn', 'hell', 'ass', 'b*tch', 'bastard', 'crap'
  ];

  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 20;
  private static readonly VALID_PATTERN = /^[a-zA-Z0-9_-]+$/;

  static validate(username: string): { isValid: boolean; error?: string } {
    if (!username || typeof username !== 'string') {
      return { isValid: false, error: 'Username is required' };
    }

    // Length check
    if (username.length < this.MIN_LENGTH) {
      return { isValid: false, error: `Username must be at least ${this.MIN_LENGTH} characters long` };
    }

    if (username.length > this.MAX_LENGTH) {
      return { isValid: false, error: `Username must be no more than ${this.MAX_LENGTH} characters long` };
    }

    // Pattern check (alphanumeric, underscore, hyphen only)
    if (!this.VALID_PATTERN.test(username)) {
      return { isValid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
    }

    // Check for prohibited words
    const lowerUsername = username.toLowerCase();
    for (const word of this.PROHIBITED_WORDS) {
      if (lowerUsername.includes(word.toLowerCase())) {
        return { isValid: false, error: 'Username contains prohibited content' };
      }
    }

    // Check for consecutive special characters
    if (/__+|--+/.test(username)) {
      return { isValid: false, error: 'Username cannot contain consecutive underscores or hyphens' };
    }

    // Check for starting/ending with special characters
    if (/^[_-]|[_-]$/.test(username)) {
      return { isValid: false, error: 'Username cannot start or end with underscores or hyphens' };
    }

    return { isValid: true };
  }

  static generateSuggestions(firstName: string, lastName: string): string[] {
    const suggestions: string[] = [];
    const first = firstName?.toLowerCase().replace(/[^a-z]/g, '') || '';
    const last = lastName?.toLowerCase().replace(/[^a-z]/g, '') || '';

    if (first && last) {
      // First name + last initial
      suggestions.push(first + last.charAt(0));
      // First initial + last name
      suggestions.push(first.charAt(0) + last);
      // First name + underscore + last name (if not too long)
      if ((first + last).length <= 18) {
        suggestions.push(first + '_' + last);
      }
      // First name + last name (if not too long)
      if ((first + last).length <= this.MAX_LENGTH) {
        suggestions.push(first + last);
      }
    } else if (first) {
      // Just first name with numbers
      suggestions.push(first + '123');
      suggestions.push(first + '2025');
    }

    // Add random numbers to make unique
    const baseNames = suggestions.slice();
    baseNames.forEach(name => {
      if (name.length <= 17) {
        suggestions.push(name + Math.floor(Math.random() * 100));
      }
    });

    return suggestions.slice(0, 5); // Return top 5 suggestions
  }
}