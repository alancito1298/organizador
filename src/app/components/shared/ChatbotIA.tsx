'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const PROMPTS_SUGERIDOS = [
  '📝 Secuencia didáctica de 3 clases',
  '📝 Crear evaluación con 5 preguntas',
  '💡 Dinámica corta para iniciar clase',
  '♿ Idea para adaptación curricular',
];

export default function ChatbotIA() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: '¡Hola, docente! 👋 Soy tu **Asistente Pedagógico IA**.\n\n¿En qué puedo ayudarte hoy? Puedo crear secuencias didácticas, armar evaluaciones, buscar actividades o sugerir dinámicas para el aula.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const [esPlus, setEsPlus] = useState<boolean>(true);
  const [consultasUsadas, setConsultasUsadas] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar historial persistente guardado en la sesión
  useEffect(() => {
    try {
      localStorage.setItem(
        'suscripcion_usuario',
        JSON.stringify({ estado: 'Plus', plan: 'Plus', esPlus: true })
      );
      setEsPlus(true);

      const historialGuardado = localStorage.getItem('chat_historial_ia');
      if (historialGuardado) {
        const parsed = JSON.parse(historialGuardado);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMensajes(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Guardar mensajes automáticamente en cada cambio
  useEffect(() => {
    try {
      if (mensajes.length > 0) {
        localStorage.setItem('chat_historial_ia', JSON.stringify(mensajes));
      }
    } catch (e) {
      console.error(e);
    }
  }, [mensajes]);

  const vaciarChat = () => {
    const msjInicial: Message[] = [
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: '¡Hola, docente! 👋 Soy tu **Asistente Pedagógico IA**.\n\n¿En qué puedo ayudarte hoy? Puedo crear secuencias didácticas, armar evaluaciones, buscar actividades o sugerir dinámicas para el aula.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setMensajes(msjInicial);
    try {
      localStorage.setItem('chat_historial_ia', JSON.stringify(msjInicial));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (abierto) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensajes, abierto]);

  const enviarMensaje = async (textoEnviar?: string) => {
    const texto = (textoEnviar || input).trim();
    if (!texto || cargando) return;

    // Control de límite para usuarios sin Plan Plus (1 consulta gratis de prueba)
    if (!esPlus && consultasUsadas >= 1) {
      setMensajes((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'bot',
          text: '🔒 **Función Exclusiva del Plan Plus**\n\nHas probado la versión de demostración. Para realizar consultas ilimitadas a tu Asistente Pedagógico IA, **suscribite al Plan Plus** por solo $4.999/mes.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      return;
    }

    const nuevoMensajeUsuario: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: texto,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMensajes((prev) => [...prev, nuevoMensajeUsuario]);
    if (!textoEnviar) setInput('');
    setCargando(true);
    if (!esPlus) setConsultasUsadas((prev) => prev + 1);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ prompt: texto }),
      });

      const data = await res.json();
      const respuestaTexto = data.response || data.error || 'No se pudo obtener respuesta.';

      setMensajes((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: respuestaTexto,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMensajes((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'Ocurrió un error al consultar a la IA. Por favor, intenta de nuevo.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setCargando(false);
    }
  };

  const copiarTexto = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('¡Texto copiado a la papelera!');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* BOTÓN FLOTANTE */}
      {!abierto && (
        <button
          onClick={() => setAbierto(true)}
          className="bg-primary hover:bg-primary/90 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 border-2 border-white/30"
          aria-label="Abrir Asistente Pedagógico IA"
        >
          <span className="text-2xl animate-bounce">🤖</span>
          <span className="hidden sm:inline font-bold text-sm">Asistente IA</span>
          <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
            PLUS
          </span>
        </button>
      )}

      {/* VENTANA DE CHAT */}
      {abierto && (
        <div className="bg-surface rounded-2xl shadow-2xl border border-outline-variant w-[92vw] sm:w-[400px] h-[520px] max-h-[85vh] flex flex-col overflow-hidden transition-all duration-300">
          {/* HEADER CHAT */}
          <div className="bg-primary text-white p-4 flex items-center justify-between border-b border-primary-container">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl text-xl">🤖</div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  Asistente Pedagógico IA
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold px-2 py-0.5 rounded-full">
                    PLUS
                  </span>
                </h3>
                <p className="text-[11px] text-white/80">Secuencias, exámenes e ideas de clase</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={vaciarChat}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
                title="Vaciar conversación y empezar de nuevo"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
              <button
                onClick={() => setAbierto(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
                aria-label="Cerrar chat"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          </div>

          {/* MENSAJES */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-surface-container-low/50">
            {mensajes.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm relative group ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-surface text-on-surface border border-outline-variant rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => copiarTexto(msg.text)}
                      className="mt-2 text-[11px] text-primary hover:underline flex items-center gap-1 font-medium bg-primary/5 px-2 py-1 rounded-md w-max"
                      title="Copiar respuesta"
                    >
                      <span className="material-symbols-outlined text-[14px]">content_copy</span> Copiar
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-on-surface-variant/70 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {cargando && (
              <div className="flex items-center gap-2 text-xs text-primary font-medium p-2 bg-surface rounded-xl border border-outline-variant w-max animate-pulse">
                <span>🤖</span> Pensando respuesta pedagógica...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* PROMPTS RÁPIDOS (Si hay pocos mensajes) */}
          {mensajes.length <= 2 && (
            <div className="px-3 py-2 bg-surface border-t border-outline-variant flex gap-1.5 overflow-x-auto no-scrollbar">
              {PROMPTS_SUGERIDOS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => enviarMensaje(p)}
                  className="text-[11px] bg-surface-container hover:bg-surface-lavender text-primary border border-primary/20 rounded-full px-3 py-1 font-medium whitespace-nowrap transition"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* BANNER PLAN PLUS (SI CORRESPONDE) */}
          {!esPlus && (
            <div className="bg-tertiary-fixed/20 p-2 text-center text-xs text-on-surface font-medium border-t border-tertiary-fixed/30 flex items-center justify-between px-4">
              <span>🌟 ¿Querés consultas ilimitadas con la IA?</span>
              <Link href="/planes" className="text-primary font-bold underline hover:text-primary/80">
                Ver Plan Plus
              </Link>
            </div>
          )}

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviarMensaje();
            }}
            className="p-3 bg-surface border-t border-outline-variant flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí tu consulta pedagógica..."
              disabled={cargando}
              className="flex-1 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-outline-variant focus:outline-none focus:border-primary transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || cargando}
              className="bg-primary hover:bg-primary/90 text-white p-2.5 rounded-xl disabled:opacity-40 transition flex items-center justify-center"
              aria-label="Enviar consulta"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
