// Built-in Node Modules
import { Request, Response, NextFunction } from 'express';

// External Modules
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Local Modules
import promptManager from './promptManager';
import { SERVER_CONFIG, AI_CONFIG } from './config';
import logger from './logger';

interface RequestBody {
  readonly apiKey: string;
  readonly provider: string;
  readonly model?: string;
  readonly addinst?: string;
  readonly start?: string;
  readonly destination?: string;
  readonly msg: string;
}

interface EnhanceRequestBody {
  readonly apiKey: string;
  readonly provider: string;
  readonly model?: string;
  readonly language: string;
  readonly directive: string;
  readonly msg: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

interface SuccessResponse {
  message: string;
}

type SupportedProvider = typeof AI_CONFIG.supportedProviders[number];

function isValidProvider(provider: string): provider is SupportedProvider {
  return AI_CONFIG.supportedProviders.includes(provider);
}

function validateRequestBody(req: Request, res: Response, next: NextFunction): void {
  const { apiKey, provider, msg }: Partial<RequestBody> = req.body;
  
  if (!apiKey) {
    logger.warn('Translation request missing API key', { ip: req.ip });
    res.status(400).json({ error: 'API Key is missing in the request.' } as ErrorResponse);
    return;
  }
  
  if (!provider) {
    logger.warn('Translation request missing provider', { ip: req.ip });
    res.status(400).json({ error: 'AI Provider is missing in the request.' } as ErrorResponse);
    return;
  }
  
  if (!isValidProvider(provider)) {
    logger.warn('Translation request with unsupported provider', { provider, ip: req.ip });
    res.status(400).json({ 
      error: `Provider '${provider}' is not currently supported.` 
    } as ErrorResponse);
    return;
  }
  
  if (!msg) {
    logger.warn('Translation request missing message', { ip: req.ip });
    res.status(400).json({ error: 'Message content (msg) is missing.' } as ErrorResponse);
    return;
  }
  
  logger.debug('Request validation passed', { 
    provider, 
    messageLength: msg.length,
    ip: req.ip 
  });
  
  next();
}

function validateEnhanceRequestBody(req: Request, res: Response, next: NextFunction): void {
  const { apiKey, provider, msg }: Partial<EnhanceRequestBody> = req.body;
  
  if (!apiKey) {
    logger.warn('Enhancement request missing API key', { ip: req.ip });
    res.status(400).json({ error: 'API Key is missing in the request.' } as ErrorResponse);
    return;
  }
  
  if (!provider) {
    logger.warn('Enhancement request missing provider', { ip: req.ip });
    res.status(400).json({ error: 'AI Provider is missing in the request.' } as ErrorResponse);
    return;
  }
  
  if (!isValidProvider(provider)) {
    logger.warn('Enhancement request with unsupported provider', { provider, ip: req.ip });
    res.status(400).json({ 
      error: `Provider '${provider}' is not currently supported.` 
    } as ErrorResponse);
    return;
  }
  
  if (!msg) {
    logger.warn('Enhancement request missing message', { ip: req.ip });
    res.status(400).json({ error: 'Message content (msg) is missing.' } as ErrorResponse);
    return;
  }
  
  logger.debug('Enhancement request validation passed', { 
    provider, 
    messageLength: msg.length,
    ip: req.ip 
  });
  
  next();
}

async function handleTranslationRequest(req: Request, res: Response): Promise<void> {
  const {
    apiKey,
    model = AI_CONFIG.defaultModel,
    addinst = '',
    start = 'English',
    destination = 'Korean',
    msg
  }: RequestBody = req.body;

  const requestId = Math.random().toString(36).substring(7);
  
  logger.info('Processing translation request', {
    requestId,
    model,
    sourceLanguage: start,
    targetLanguage: destination,
    messageLength: msg.length,
    hasAdditionalInstruction: Boolean(addinst),
    ip: req.ip
  });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const generativeModel = genAI.getGenerativeModel({ model });

    const fullPrompt = promptManager.buildTranslationPrompt({
      additionalInstruction: addinst,
      sourceLanguage: start,
      targetLanguage: destination,
      text: msg
    });

    logger.debug('Generated prompt for translation', { requestId, promptLength: fullPrompt.length });

    const result = await generativeModel.generateContent(fullPrompt);
    const response = result.response;
    const outputText = response.text();
    
    const output = typeof outputText === 'string' 
      ? outputText 
      : 'No valid response received from model.';

    logger.info('Translation completed successfully', {
      requestId,
      outputLength: output.length
    });

    res.json({ message: output } as SuccessResponse);
  } catch (error) {
    logger.error('Translation request failed', { requestId, error });
    handleTranslationError(error, res);
  }
}

async function handleEnhanceRequest(req: Request, res: Response): Promise<void> {
  const {
    apiKey,
    model = AI_CONFIG.defaultModel,
    language = 'English',
    directive = 'Improve clarity, grammar, and flow while preserving the original meaning and tone.',
    msg
  }: EnhanceRequestBody = req.body;

  const requestId = Math.random().toString(36).substring(7);
  
  logger.info('Processing enhancement request', {
    requestId,
    model,
    language,
    messageLength: msg.length,
    hasDirective: Boolean(directive),
    ip: req.ip
  });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const generativeModel = genAI.getGenerativeModel({ model });

    const fullPrompt = promptManager.buildEnhancePrompt({
      text: msg,
      language,
      directive,
      output: ''
    });

    logger.debug('Generated prompt for enhancement', { requestId, promptLength: fullPrompt.length });

    const result = await generativeModel.generateContent(fullPrompt);
    const response = result.response;
    const outputText = response.text();
    
    const output = typeof outputText === 'string' 
      ? outputText 
      : 'No valid response received from model.';

    logger.info('Enhancement completed successfully', {
      requestId,
      outputLength: output.length
    });

    res.json({ message: output } as SuccessResponse);
  } catch (error) {
    logger.error('Enhancement request failed', { requestId, error });
    handleEnhancementError(error, res);
  }
}

function handleTranslationError(error: unknown, res: Response): void {
  let errorMessage = 'Unknown error';
  let statusCode = 500;

  if (error instanceof Error) {
    errorMessage = error.message;
    
    if (isApiKeyError(errorMessage)) {
      statusCode = 401;
      errorMessage = 'Invalid or incorrect API Key provided.';
      logger.warn('API key authentication failed', { originalError: error.message });
    } else {
      logger.error('Unexpected translation error', { error: error.message, stack: error.stack });
    }
  } else {
    logger.error('Non-Error object thrown', { error });
  }

  res.status(statusCode).json({
    error: 'Failed to process message',
    details: errorMessage
  } as ErrorResponse);
}

function handleEnhancementError(error: unknown, res: Response): void {
  let errorMessage = 'Unknown error';
  let statusCode = 500;

  if (error instanceof Error) {
    errorMessage = error.message;
    
    if (isApiKeyError(errorMessage)) {
      statusCode = 401;
      errorMessage = 'Invalid or incorrect API Key provided.';
      logger.warn('API key authentication failed', { originalError: error.message });
    } else {
      logger.error('Unexpected enhancement error', { error: error.message, stack: error.stack });
    }
  } else {
    logger.error('Non-Error object thrown', { error });
  }

  res.status(statusCode).json({
    error: 'Failed to process enhancement',
    details: errorMessage
  } as ErrorResponse);
}

function isApiKeyError(errorMessage: string): boolean {
  const apiKeyErrorPatterns = [
    /API key not valid/i,
    /permission denied/i,
    /invalid api key/i
  ];
  
  return apiKeyErrorPatterns.some(pattern => pattern.test(errorMessage));
}

function setupMiddleware(app: express.Application): void {
  app.use(cors({
    origin: SERVER_CONFIG.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 200
  }));
  app.use(express.json({ limit: '10mb' }));
  
  // Request logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.path}`, { 
      userAgent: req.get('User-Agent'),
      ip: req.ip 
    });
    next();
  });
}

function setupRoutes(app: express.Application): void {
  app.post('/api/sendmessage', validateRequestBody, handleTranslationRequest);
  app.post('/api/enhance', validateEnhanceRequestBody, handleEnhanceRequest);
  
  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });
}

function startServer(app: express.Application): void {
  app.listen(SERVER_CONFIG.port, () => {
    logger.info(`Express server started`, {
      host: SERVER_CONFIG.host,
      port: SERVER_CONFIG.port,
      url: `http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`
    });
  });
}

export function createServer(): void {
  dotenv.config();
  
  logger.info('Initializing server');
  
  const app = express();
  
  setupMiddleware(app);
  setupRoutes(app);
  startServer(app);
}

