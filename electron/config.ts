// Built-in Node Modules
import path from 'node:path';

interface ServerConfig {
  readonly port: number;
  readonly host: string;
  readonly corsOrigins: string[];
}

interface AIConfig {
  readonly defaultModel: string;
  readonly supportedProviders: readonly string[];
  readonly requestTimeout: number;
}

interface AppConfig {
  readonly window: {
    readonly width: number;
    readonly height: number;
    readonly minWidth: number;
    readonly minHeight: number;
  };
  readonly paths: {
    readonly mainDist: string;
    readonly rendererDist: string;
    readonly publicDir: string;
  };
}

const SERVER_CONFIG: ServerConfig = {
  port: 51763,
  host: 'localhost',
  corsOrigins: [
    'http://localhost:59771',
    'http://localhost:5173', // Vite dev server default
    'http://localhost:3000', // Common dev port
    'http://127.0.0.1:59771',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ]
};

const AI_CONFIG: AIConfig = {
  defaultModel: 'gemini-2.0-flash',
  supportedProviders: ['Gemini'] as const,
  requestTimeout: 30000
};

function getAppConfig(): AppConfig {
  const appRoot = process.env.APP_ROOT || path.join(__dirname, '..');
  const mainDist = path.join(appRoot, 'dist-electron');
  const rendererDist = path.join(appRoot, 'dist');
  const publicDir = process.env.VITE_DEV_SERVER_URL 
    ? path.join(appRoot, 'public') 
    : rendererDist;

  return {
    window: {
      width: 1280,
      height: 720,
      minWidth: 768,
      minHeight: 512
    },
    paths: {
      mainDist,
      rendererDist,
      publicDir
    }
  };
}

export {
  SERVER_CONFIG,
  AI_CONFIG,
  getAppConfig
}; 