'use client';

import { useEffect, useState } from 'react';
import { Share2, Smartphone, Download, Check, X, Share as ShareIcon, PlusSquare } from 'lucide-react';

export default function ShareAndInstallButtons({
  variant = 'compact',
}: {
  variant?: 'compact' | 'full' | 'floating';
}) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIosModal, setShowIosModal] = useState(false);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Detección de iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(iosDevice);

    // Capturar evento PWA en Android/Chrome/Windows
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // 1. COMPARTIR PÁGINA
  const handleShare = async () => {
    const shareData = {
      title: 'Organizador Docente',
      text: 'Organizá tu agenda, planificaciones, cursos y notas en un solo lugar 📚✨',
      url: 'https://www.organizadordocente.com',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Usuario canceló compartir
      }
    } else {
      // Fallback a copiar enlace
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 3000);
      } catch (err) {
        alert('Copiá este enlace: https://www.organizadordocente.com');
      }
    }
  };

  // 2. ACCESO RÁPIDO / INSTALAR PWA
  const handleInstall = async () => {
    if (deferredPrompt) {
      // Prompt nativo en Android/Chrome
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIos) {
      // Instrucciones en iOS
      setShowIosModal(true);
    } else {
      // Modal general Android/Navegador
      setShowAndroidModal(true);
    }
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${variant === 'full' ? 'w-full justify-center flex-wrap' : ''}`}>
        {/* BOTÓN COMPARTIR */}
        <button
          onClick={handleShare}
          title="Compartir aplicación"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-800/80 hover:bg-violet-700 text-violet-100 text-xs font-semibold transition border border-violet-500/40 shadow-sm shrink-0"
        >
          {copiado ? (
            <>
              <Check size={14} className="text-emerald-400" />
              <span className="text-emerald-300">¡Enlace copiado!</span>
            </>
          ) : (
            <>
              <Share2 size={14} className="text-yellow-400" />
              <span>Compartir</span>
            </>
          )}
        </button>

        {/* BOTÓN ACCESO RÁPIDO / INSTALAR APP */}
        <button
          onClick={handleInstall}
          title="Agregar acceso rápido en la pantalla de inicio"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-violet-950 text-xs font-bold transition shadow-md shrink-0 uppercase tracking-wider"
        >
          <Smartphone size={14} />
          <span>Acceso Rápido</span>
        </button>
      </div>

      {/* MODAL INSTRUCCIONES iOS (APPLE SAFARI) */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 animate-fade-in">
          <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center relative border border-violet-200">
            <button
              onClick={() => setShowIosModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={20} />
            </button>
            <div className="text-4xl mb-2">📱🍎</div>
            <h3 className="text-lg font-bold text-violet-950 mb-2">
              Agregar en tu iPhone / iPad
            </h3>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Creá un icono directo en tu pantalla de inicio sin ocupar memoria:
            </p>
            <ol className="text-xs text-left bg-violet-50 rounded-xl p-4 space-y-3 font-medium text-violet-900 border border-violet-200 mb-4">
              <li className="flex items-center gap-2">
                <span className="bg-violet-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shrink-0 font-bold">1</span>
                Tocá el botón <strong className="flex items-center gap-1 text-violet-950 px-1 bg-white rounded border border-violet-300"><ShareIcon size={12} /> Compartir</strong> abajo en Safari.
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-violet-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shrink-0 font-bold">2</span>
                Buscá y seleccioná <strong className="flex items-center gap-1 text-violet-950 px-1 bg-white rounded border border-violet-300"><PlusSquare size={12} /> Agregar a inicio</strong>.
              </li>
            </ol>
            <button
              onClick={() => setShowIosModal(false)}
              className="w-full py-2.5 bg-violet-700 text-white font-bold rounded-xl hover:bg-violet-800 transition text-xs"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}

      {/* MODAL INSTRUCCIONES ANDROID / DESKTOP */}
      {showAndroidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 animate-fade-in">
          <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center relative border border-violet-200">
            <button
              onClick={() => setShowAndroidModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={20} />
            </button>
            <div className="text-4xl mb-2">📲🤖</div>
            <h3 className="text-lg font-bold text-violet-950 mb-2">
              Agregar acceso en Android
            </h3>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Creá el icono directo en tu celular para entrar en 1 clic:
            </p>
            <ol className="text-xs text-left bg-violet-50 rounded-xl p-4 space-y-3 font-medium text-violet-900 border border-violet-200 mb-4">
              <li className="flex items-center gap-2">
                <span className="bg-violet-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shrink-0 font-bold">1</span>
                Tocá los <strong>3 puntos (⋮)</strong> arriba a la derecha en Chrome.
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-violet-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shrink-0 font-bold">2</span>
                Elegí <strong>"Agregar a la pantalla principal"</strong> o <strong>"Instalar aplicación"</strong>.
              </li>
            </ol>
            <button
              onClick={() => setShowAndroidModal(false)}
              className="w-full py-2.5 bg-violet-700 text-white font-bold rounded-xl hover:bg-violet-800 transition text-xs"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
