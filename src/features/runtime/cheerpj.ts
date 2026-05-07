declare global {
  interface Window {
    cheerpjInit?: () => Promise<void>;
    cheerpjCreateDisplay?: (width: number, height: number) => void;
    cheerpjRunJar?: (path: string) => Promise<void>;
  }
}

const CHEERPJ_LOADER = 'https://cjrtnc.leaningtech.com/4.3/loader.js';

export type CheerpJStatus = 'idle' | 'loading' | 'ready' | 'failed';

export async function initializeCheerpJ(): Promise<void> {
  await loadScript(CHEERPJ_LOADER);
  if (!window.cheerpjInit || !window.cheerpjCreateDisplay) {
    throw new Error('CheerpJ loader did not expose the expected runtime API.');
  }
  await window.cheerpjInit();
  window.cheerpjCreateDisplay(720, 420);
}

function loadScript(src: string): Promise<void> {
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
  if (existing?.dataset.loaded === 'true') {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = existing ?? document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    if (!existing) {
      document.head.append(script);
    }
  });
}
