
export default async function handler(
  req: { method?: string; body?: { messages?: { role: string; content: string }[] } },
  res: { setHeader: (name: string, value: string) => void; status: (code: number) => { send: (body: string) => void }; send: (body: string) => void }
) {
  if (req.method !== "POST") {
    res.status(405).send(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const body = req.body ?? {};
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const lastUser = messages.filter((m: { role: string }) => m.role === "user").pop()?.content ?? "";

  const reply =
    lastUser.trim().length > 0
      ? "Gracias por tu mensaje. Un asesor te contactará pronto. Mientras tanto, cuéntanos más: ¿en qué industria estás y cuántos mensajes recibes al día por WhatsApp o redes?"
      : "Cuéntanos: ¿qué vendes y por dónde te llegan más mensajes (WhatsApp, Instagram, web)?";

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.status(200).send(reply);
}
