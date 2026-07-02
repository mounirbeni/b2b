/** Normalizes a Moroccan phone number to E.164 (e.g. "0612345678" -> "+212612345678"). */
export function normalizeMoroccanPhone(phone: string): string {
  const trimmed = phone.trim().replace(/[\s-]/g, "");

  if (trimmed.startsWith("+")) return trimmed;
  if (trimmed.startsWith("00")) return `+${trimmed.slice(2)}`;
  if (trimmed.startsWith("0")) return `+212${trimmed.slice(1)}`;

  return `+212${trimmed}`;
}
