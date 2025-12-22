// Runtime service to fetch security details from `public/security_details.json`.
// Caches the data in-memory and provides case-insensitive lookup.
type SecurityDetail = Record<string, any>;

let cache: Record<string, SecurityDetail> | null = null;
let loadingPromise: Promise<void> | null = null;

async function loadIfNeeded() {
  if (cache) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      const res = await fetch('/security_details.json');
      if (!res.ok) throw new Error(`Failed to fetch security_details.json: ${res.status}`);
      const json = await res.json();
      const raw = json?.security_details ?? {};
      // Normalize keys to uppercase for case-insensitive lookup
      const normalized: Record<string, SecurityDetail> = {};
      Object.keys(raw).forEach((k) => {
        normalized[k.toUpperCase()] = raw[k];
      });
      cache = normalized;
    } catch (err) {
      console.error('Error loading security details:', err);
      cache = {};
    } finally {
      loadingPromise = null;
    }
  })();

  return loadingPromise;
}

export async function getSecurityDetail(code: string): Promise<SecurityDetail | null> {
  if (!code) return null;
  await loadIfNeeded();
  const key = code.toUpperCase();
  return (cache && cache[key]) ? cache[key] : null;
}

export async function getAllSecurityDetails(): Promise<Record<string, SecurityDetail>> {
  await loadIfNeeded();
  return cache ?? {};
}

export default {
  getSecurityDetail,
  getAllSecurityDetails,
};
