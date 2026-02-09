// MessageChannel polyfill for Cloudflare Workers
// React 19 uses MessageChannel for scheduling, which is not available in Workers

if (typeof globalThis.MessageChannel === 'undefined') {
  // @ts-ignore
  globalThis.MessageChannel = class MessageChannel {
    port1: any;
    port2: any;

    constructor() {
      const callbacks: Function[] = [];

      this.port1 = {
        onmessage: null as ((ev: any) => void) | null,
        postMessage: (data: any) => {
          if (this.port2.onmessage) {
            queueMicrotask(() => {
              this.port2.onmessage!({ data });
            });
          }
        },
        close: () => {},
        start: () => {},
      };

      this.port2 = {
        onmessage: null as ((ev: any) => void) | null,
        postMessage: (data: any) => {
          if (this.port1.onmessage) {
            queueMicrotask(() => {
              this.port1.onmessage!({ data });
            });
          }
        },
        close: () => {},
        start: () => {},
      };
    }
  };
}

export {};
