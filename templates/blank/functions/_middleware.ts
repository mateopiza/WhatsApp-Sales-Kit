import { PagesFunction, Env } from './lib/types';

export const onRequest: PagesFunction<Env> = async (context) => {
  const startTime = Date.now();
  const { request } = context;

  // Handle CORS Preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  try {
    const response = await context.next();
    const duration = Date.now() - startTime;

    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    newHeaders.set('Server-Timing', `app;dur=${duration}`);
    if (!newHeaders.has('Content-Type')) {
      newHeaders.set('Content-Type', 'application/json; charset=utf-8');
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  } catch (err: any) {
    const duration = Date.now() - startTime;
    const errorBody = {
      success: false,
      error: err.message || 'Internal Server Error',
      meta: {
        timestamp: new Date().toISOString(),
        executionTimeMs: duration,
      },
    };

    return new Response(JSON.stringify(errorBody), {
      status: err.status || 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Server-Timing': `app;dur=${duration}`,
      },
    });
  }
};
