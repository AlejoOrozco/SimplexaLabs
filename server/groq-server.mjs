import http from 'node:http';
import { Groq } from 'groq-sdk';

const PORT = Number(process.env.PORT || 5174);

if (!process.env.GROQ_API_KEY) {
  console.error('Missing GROQ_API_KEY in environment (.env).');
  process.exit(1);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) {
        reject(new Error('Body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

function json(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(data));
}

const SYSTEM_PROMPT = [
  'Eres un asesor de ventas de SimpLexaLabs. Responde SIEMPRE en español, tono humano, cercano y profesional.',
  'SimpLexaLabs automatiza conversaciones 24/7 en WhatsApp, Instagram y sitios web: responde al instante, califica leads, resuelve FAQs y agenda citas automáticamente.',
  'Tu objetivo es entender el negocio del usuario, mostrar cómo la automatización le ayuda a vender más y guiarlo a reservar una demo.',
  'Haz 1–3 preguntas cortas y concretas cuando necesites contexto (tipo de negocio, ticket promedio, canales, volumen de mensajes).',
  'No inventes integraciones ni promesas que no conoces; si algo no está claro, dilo y sugiere la mejor aproximación.',
  'Si preguntan por precios, explica que hay planes básico, medio, completo y enterprise, y recomienda uno según el tamaño y necesidades que te cuenten.',
  'MUY IMPORTANTE: Solo puedes responder preguntas relacionadas con SimpLexaLabs, automatización de mensajes, ventas, agenda y casos de uso del producto.',
  'Si el usuario hace una pregunta que no tenga relación clara con SimpLexaLabs (por ejemplo ciencia, historia, tareas, programación genérica, chistes, etc.), NO respondas a esa pregunta.',
  'En esos casos, contesta algo como: "Puedo ayudarte solo con dudas sobre cómo SimpLexaLabs automatiza mensajes y genera más ventas. ¿Cómo se relaciona tu pregunta con tu negocio o con lo que quieres automatizar?" y vuelve a encaminar la conversación al producto.',
].join('\n');

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      return json(res, 200, { ok: true });
    }

    if (req.method === 'POST' && req.url === '/api/chat') {
      const body = await readJson(req);
      const messages = Array.isArray(body?.messages) ? body.messages : [];

      const safeMessages = messages
        .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .slice(-8);

      const payload = {
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
        temperature: 0.9,
        top_p: 0.95,
        max_tokens: 700,
        stream: true,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...safeMessages],
      };

      if (process.env.NODE_ENV !== 'production') {
        console.log(
          'Groq chat payload:',
          JSON.stringify(
            {
              ...payload,
              apiKey: undefined,
            },
            null,
            2,
          ),
        );
      }

      const stream = await groq.chat.completions.create(payload);

      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      });

      for await (const chunk of stream) {
        const delta = chunk?.choices?.[0]?.delta?.content || '';
        if (delta) res.write(delta);
      }

      res.end();
      return;
    }

    return json(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error(err);
    return json(res, 500, { error: 'Server error' });
  }
});

server.listen(PORT, () => {
  console.log(`Groq server listening on http://localhost:${PORT}`);
});

