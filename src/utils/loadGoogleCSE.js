let csePromise = null;
let cseLoaded = false;

const DEFAULT_SELECTOR = 'script[data-google-cse]';

function resolveExistingScript(script) {
  if (!script) {
    return null;
  }

  if (script.dataset && script.dataset.googleCseLoaded === 'true') {
    cseLoaded = true;
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    script.addEventListener('load', () => {
      script.dataset.googleCseLoaded = 'true';
      cseLoaded = true;
      resolve();
    }, { once: true });
    script.addEventListener('error', reject, { once: true });
  });
}

export function loadGoogleCSE() {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (cseLoaded) {
    return Promise.resolve();
  }

  if (csePromise) {
    return csePromise;
  }

  const cx = import.meta.env?.VITE_GOOGLE_CSE_CX;
  if (!cx) {
    console.warn('VITE_GOOGLE_CSE_CX 未设置，无法加载 Google CSE 脚本');
    return Promise.reject(new Error('Missing VITE_GOOGLE_CSE_CX'));
  }

  const selector = `${DEFAULT_SELECTOR}, script[src*="cse.google.com/cse.js"]`;
  const existingScript = document.querySelector(selector);
  if (existingScript) {
    csePromise = resolveExistingScript(existingScript) || Promise.resolve();
    return csePromise;
  }

  csePromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://cse.google.com/cse.js?cx=${cx}`;
    script.dataset.googleCse = 'true';

    script.onload = () => {
      script.dataset.googleCseLoaded = 'true';
      cseLoaded = true;
      resolve();
    };
    script.onerror = (error) => {
      csePromise = null;
      reject(error);
    };

    document.head.appendChild(script);
  });

  return csePromise;
}
