/**
 * Generate a unique ID with optional prefix to avoid key collisions
 */
export function generateUniqueId(prefix = "id"): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${randomPart}`;
}
