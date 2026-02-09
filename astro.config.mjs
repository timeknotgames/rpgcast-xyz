// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// MessageChannel polyfill - must be injected early
const polyfillCode = `
if (typeof globalThis.MessageChannel === 'undefined') {
  globalThis.MessageChannel = class MessageChannel {
    constructor() {
      this.port1 = { onmessage: null, postMessage: (d) => { if (this.port2.onmessage) queueMicrotask(() => this.port2.onmessage({ data: d })); }, close: () => {}, start: () => {} };
      this.port2 = { onmessage: null, postMessage: (d) => { if (this.port1.onmessage) queueMicrotask(() => this.port1.onmessage({ data: d })); }, close: () => {}, start: () => {} };
    }
  };
}
`;

// Plugin to inject polyfill into the generated chunks
const messageChannelPolyfillPlugin = () => ({
  name: 'message-channel-polyfill',
  enforce: 'pre',
  renderChunk(code, chunk) {
    // Inject into chunks that use React
    if (chunk.name?.includes('renderers') || chunk.fileName?.includes('renderers')) {
      return polyfillCode + code;
    }
    return null;
  },
  generateBundle(options, bundle) {
    // Inject into the main renderer chunk
    for (const fileName in bundle) {
      const chunk = bundle[fileName];
      if (chunk.type === 'chunk' && fileName.includes('renderers')) {
        chunk.code = polyfillCode + chunk.code;
      }
    }
  }
});

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss(), messageChannelPolyfillPlugin()],
    ssr: {
      noExternal: ['@neondatabase/serverless'],
    },
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    },
  })
});
