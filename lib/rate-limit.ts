const requestLog = new Map<string, number[]>();

/** Simple in-memory fixed-window rate limiter. Not distributed-safe, sufficient for a single-instance clinic app. */
export function isRateLimited(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(key) ?? []).filter((t) => now - t < windowMs);

  if (timestamps.length >= limit) {
    requestLog.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return false;
}
