/**
 * Sanitizes HTML content to prevent XSS attacks
 * Uses a strict allowlist approach - only safe formatting tags are allowed
 */

// Safe HTML tags that are allowed
const ALLOWED_TAGS = new Set(['strong', 'em', 'code', 'b', 'i', 'u', 'span']);

// Safe attributes that are allowed on specific tags
const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
  'span': new Set(['class']),
  'code': new Set(['class']),
  'strong': new Set(['class']),
  'em': new Set(['class']),
};

// CSS class allowlist patterns for Tailwind classes
const ALLOWED_CLASS_PATTERNS = [
  /^text-\w+$/,
  /^font-\w+$/,
  /^bg-\w+$/,
  /^px-\d+$/,
  /^py-\d+$/,
  /^rounded$/,
  /^rounded-\w+$/,
];

/**
 * Validates if a CSS class is safe to use
 */
function isAllowedClass(className: string): boolean {
  return ALLOWED_CLASS_PATTERNS.some(pattern => pattern.test(className));
}

/**
 * Escapes HTML special characters to prevent injection
 */
export function escapeHtml(text: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  return text.replace(/[&<>"'`=/]/g, char => escapeMap[char] || char);
}

/**
 * Sanitizes an HTML attribute value
 */
function sanitizeAttribute(attrName: string, attrValue: string): string {
  if (attrName === 'class') {
    // Only allow safe Tailwind classes
    const classes = attrValue.split(/\s+/).filter(isAllowedClass);
    return classes.join(' ');
  }
  // Escape any potentially dangerous characters in attribute values
  return escapeHtml(attrValue);
}

/**
 * Sanitizes HTML content by removing dangerous tags and attributes
 * while preserving safe formatting
 */
export function sanitizeHtml(html: string): string {
  // First, escape everything
  let result = escapeHtml(html);
  
  // Then, selectively restore safe HTML tags with safe attributes
  // This is a whitelist approach - only explicitly allowed content is rendered
  
  // Restore <strong> tags
  result = result.replace(
    /&lt;strong(?:\s+class=&quot;([^&]*)&quot;)?&gt;(.*?)&lt;\/strong&gt;/gi,
    (_, className, content) => {
      const safeClass = className ? sanitizeAttribute('class', className) : '';
      return safeClass 
        ? `<strong class="${safeClass}">${content}</strong>`
        : `<strong>${content}</strong>`;
    }
  );
  
  // Restore <em> tags
  result = result.replace(
    /&lt;em&gt;(.*?)&lt;\/em&gt;/gi,
    '<em>$1</em>'
  );
  
  // Restore <code> tags
  result = result.replace(
    /&lt;code(?:\s+class=&quot;([^&]*)&quot;)?&gt;(.*?)&lt;\/code&gt;/gi,
    (_, className, content) => {
      const safeClass = className ? sanitizeAttribute('class', className) : '';
      return safeClass 
        ? `<code class="${safeClass}">${content}</code>`
        : `<code>${content}</code>`;
    }
  );
  
  return result;
}

/**
 * Formats inline markdown to safe HTML
 * Used for rendering blog post content
 */
export function formatInlineMarkdown(text: string): string {
  // First escape any existing HTML
  let result = escapeHtml(text);
  
  // Then apply markdown formatting with safe HTML
  return result
    // Bold: **text** or __text__
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(/__(.+?)__/g, '<strong class="text-foreground font-semibold">$1</strong>')
    // Italic: *text* or _text_
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
    .replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '<em>$1</em>')
    // Inline code: `text`
    .replace(/`(.+?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>');
}

/**
 * Strips all HTML tags from content
 * Useful for generating plain text excerpts
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}
