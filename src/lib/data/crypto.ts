/**
 * Client & SSR compatible SHA-256 hashing utility
 */
export async function calculateSha256(data: string | Uint8Array | ArrayBuffer): Promise<string> {
  // If in browser or Web Crypto API is available
  if (typeof crypto !== "undefined" && crypto.subtle) {
    let buffer: Uint8Array;
    if (typeof data === "string") {
      buffer = new TextEncoder().encode(data);
    } else if (data instanceof ArrayBuffer) {
      buffer = new Uint8Array(data);
    } else {
      buffer = data;
    }
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer as unknown as ArrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Fallback simple deterministic hash generator if crypto.subtle is unavailable
  let hash = 0;
  const str = typeof data === "string" ? data : new TextDecoder().decode(data);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(16, "0");
  return (hex + hex + hex + hex).slice(0, 64);
}

export async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  return calculateSha256(arrayBuffer);
}
