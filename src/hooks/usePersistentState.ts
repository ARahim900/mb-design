import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';

// Every storage access is guarded: Safari private mode, blocked site data and some in-app
// browsers throw on the mere property access, and the page must still work without it.
function readStored(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

function writeStored(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable: the value simply is not remembered.
  }
}

/**
 * useState that survives a reload. The stored value is read synchronously in the initialiser,
 * so the first render already uses it and nothing flashes. `decode` validates whatever was
 * stored (it may be stale or hand-edited) and returns null to fall back. Pass module-level
 * `decode`/`encode` functions so the write effect does not rerun on every render.
 */
export function usePersistentState<T>(
  key: string,
  fallback: T,
  decode: (stored: unknown) => T | null,
  encode?: (value: T) => unknown,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stored = readStored(key);
    return stored === null ? fallback : decode(stored) ?? fallback;
  });

  useEffect(() => {
    writeStored(key, encode ? encode(value) : value);
  }, [key, value, encode]);

  return [value, setValue];
}
