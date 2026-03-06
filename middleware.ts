// Next.js runs only root middleware.ts — re-export the proxy logic so auth/routing runs.
export { default, config } from './proxy';
