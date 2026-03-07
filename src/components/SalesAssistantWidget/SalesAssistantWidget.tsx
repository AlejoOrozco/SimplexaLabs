import { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Send, UserCircle2, X } from 'lucide-react';
import './SalesAssistantWidget.css';

type ChatRole = 'user' | 'assistant';
type ChatMessage = { id: string; role: ChatRole; content: string };

function nowId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function SalesAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nowId(),
      role: 'assistant',
      content:
        'Hola, soy el asesor de SimpLexaLabs. ¿Qué vendes y por dónde te llegan más mensajes (WhatsApp, Instagram, web)?',
    },
  ]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [userTurns, setUserTurns] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const canSend = useMemo(() => draft.trim().length > 0 && !sending, [draft, sending]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages.length]);

  async function send() {
    const text = draft.trim();
    if (!text || sending) return;

    if (userTurns >= 8) {
      setError(
        'Lo siento, alcanzaste el límite de consultas de hoy. Si te gustó el asesor, contáctanos para activar tu propio agente.',
      );
      return;
    }

    setError(null);
    setDraft('');
    setSending(true);

    const userMsg: ChatMessage = { id: nowId(), role: 'user', content: text };
    const assistantPlaceholder: ChatMessage = { id: nowId(), role: 'assistant', content: '' };

    // optimistic update
    setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);
    setUserTurns((prev) => prev + 1);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error('No se pudo conectar con el asistente.');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let acc = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          const idx = next.length - 1;
          if (idx >= 0 && next[idx]?.role === 'assistant') {
            next[idx] = { ...next[idx], content: acc };
          }
          return next;
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocurrió un error.');
      setMessages((prev) => {
        const next = [...prev];
        const idx = next.length - 1;
        if (idx >= 0 && next[idx]?.role === 'assistant' && next[idx].content.trim() === '') {
          next[idx] = {
            ...next[idx],
            role: 'assistant',
            content:
              'Ups, tuve un problema para responder. Intenta de nuevo en unos segundos.',
          };
        }
        return next;
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="sales-assistant">
      {!open ? (
        <div className="sales-assistant__teaser-wrapper">
          <button
            className="sales-assistant__fab"
            onClick={() => setOpen(true)}
            aria-label="Abrir chat"
          >
            <MessageCircle size={20} />
            <span className="sales-assistant__fab-text">Prueba Nuestro Asesor</span>
          </button>
        </div>
      ) : (
        <div className="sales-assistant__panel" role="dialog" aria-label="Chatea un uno de Nuestaros Asesores">
          <div className="sales-assistant__header">
            <div className="sales-assistant__title">
              <span className="sales-assistant__badge" aria-hidden>
                <UserCircle2 size={16} />
              </span>
              <div>
                <div className="sales-assistant__name">Asesor SimpLexaLabs</div>
                <div className="sales-assistant__subtitle">Ventas • Automatización • Agenda</div>
              </div>
            </div>
            <button className="sales-assistant__close" onClick={() => setOpen(false)} aria-label="Cerrar chat">
              <X size={18} />
            </button>
          </div>

          <div className="sales-assistant__messages" ref={listRef}>
            {messages.map((m) => {
              return (
                <div
                  key={m.id}
                  className={
                    m.role === 'user'
                      ? 'sales-assistant__msg sales-assistant__msg--user'
                      : 'sales-assistant__msg sales-assistant__msg--assistant'
                  }
                >
                  <div className="sales-assistant__bubble">{m.content}</div>
                </div>
              );
            })}
          </div>

          <div className="sales-assistant__composer">
            {error ? <div className="sales-assistant__error">{error}</div> : null}
            <div className="sales-assistant__row">
              <input
                className="sales-assistant__input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Escribe tu pregunta…"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                disabled={sending}
              />
              <button
                className="sales-assistant__send"
                onClick={() => void send()}
                disabled={!canSend}
                aria-label="Enviar"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="sales-assistant__hint">
              Tip: dime tu industria + cuántos mensajes recibes al día.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

