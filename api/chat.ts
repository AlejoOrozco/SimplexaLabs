import { Groq } from "groq-sdk";

const SYSTEM_PROMPT = [
  "Eres un asesor de ventas de SimpLexaLabs. Responde SIEMPRE en español, tono humano, cercano y profesional.",
  "SimpLexaLabs automatiza conversaciones 24/7 en WhatsApp, Instagram y sitios web: responde al instante, califica leads, resuelve FAQs y agenda citas automáticamente.",
  "Tu objetivo es entender el negocio del usuario, mostrar cómo la automatización le ayuda a vender más y guiarlo a reservar una demo.",
  "Haz 1–3 preguntas cortas y concretas cuando necesites contexto (tipo de negocio, ticket promedio, canales, volumen de mensajes).",
  "No inventes integraciones ni promesas que no conoces; si algo no está claro, dilo y sugiere la mejor aproximación.",
  "Si preguntan por precios, explica que hay planes básico, medio, completo y enterprise, y recomienda uno según el tamaño y necesidades que te cuenten.",
  "MUY IMPORTANTE: Solo puedes responder preguntas relacionadas con SimpLexaLabs, automatización de mensajes, ventas, agenda y casos de uso del producto.",
  "Si el usuario hace una pregunta que no tenga relación clara con SimpLexaLabs (por ejemplo ciencia, historia, tareas, programación genérica, chistes, etc.), NO respondas a esa pregunta.",
  "En esos casos, contesta algo como: \"Puedo ayudarte solo con dudas sobre cómo SimpLexaLabs automatiza mensajes y genera más ventas. ¿Cómo se relaciona tu pregunta con tu negocio o con lo que quieres automatizar?\" y vuelve a encaminar la conversación al producto.",
].join("\n");

type VercelReq = {
  method?: string;
  body?: { messages?: { role: string; content: string }[] };
};

type VercelRes = {
  setHeader(name: string, value: string | number): void;
  writeHead(status: number, headers?: Record<string, string>): void;
  write(chunk: string, encoding?: string, cb?: (err?: Error) => void): boolean;
  end(chunk?: string | (() => void), encoding?: string, cb?: () => void): void;
  status(code: number): { send: (body: string) => void };
  send(body: string): void;
};

export default async function handler(req: VercelReq, res: VercelRes) {
  if (req.method !== "POST") {
    res.setHeader("Content-Type", "application/json");
    res.status(405).send(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).send(JSON.stringify({ error: "GROQ_API_KEY not configured" }));
    return;
  }

  const body = req.body ?? {};
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const safeMessages = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-8) as { role: "user" | "assistant"; content: string }[];

  const groq = new Groq({ apiKey });
  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  try {
    const stream = await groq.chat.completions.create({
      model,
      temperature: 0.9,
      top_p: 0.95,
      max_tokens: 700,
      stream: true,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...safeMessages],
    });

    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    });

    for await (const chunk of stream) {
      const delta = chunk?.choices?.[0]?.delta?.content ?? "";
      if (delta) res.write(delta);
    }
    res.end();
  } catch (err) {
    console.error("[api/chat] Groq error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Error al conectar con el asesor. Intenta de nuevo." }));
  }
}
