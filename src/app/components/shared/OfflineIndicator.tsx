'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  getPendingSyncQueue,
  processSyncQueue,
} from '@/app/utils/offlineSync';

const RUTAS_PUBLICAS = ['/', '/login', '/registro', '/planes', '/recuperar', '/forgotpassword', '/reset-password', '/clave'];

export default function OfflineIndicator() {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);
    setPendingCount(getPendingSyncQueue().length);

    const handleOnline = () => {
      setIsOnline(true);
      setSyncing(true);
      processSyncQueue().then(({ synced, failed }) => {
        setSyncing(false);
        if (synced > 0) {
          setLastSyncResult(`¡${synced} cambios sincronizados con éxito!`);
          setTimeout(() => setLastSyncResult(null), 4000);
        }
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleQueueChange = (e: any) => {
      setPendingCount(e.detail?.pendingCount ?? getPendingSyncQueue().length);
    };

    const handleSyncCompleted = (e: any) => {
      setSyncing(false);
      setPendingCount(e.detail?.remaining ?? 0);
      if (e.detail?.synced > 0) {
        setLastSyncResult(`¡${e.detail.synced} cambios sincronizados!`);
        setTimeout(() => setLastSyncResult(null), 4000);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('od:offline-queue-changed', handleQueueChange);
    window.addEventListener('od:offline-sync-completed', handleSyncCompleted);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('od:offline-queue-changed', handleQueueChange);
      window.removeEventListener('od:offline-sync-completed', handleSyncCompleted);
    };
  }, []);

  if (RUTAS_PUBLICAS.includes(pathname)) return null;

  // Si está online y no hay cambios pendientes ni mensajes de sync, no mostrar nada
  if (isOnline && pendingCount === 0 && !syncing && !lastSyncResult) {
    return null;
  }

  const handleManualSync = () => {
    if (syncing || !isOnline) return;
    setSyncing(true);
    processSyncQueue().then(({ synced }) => {
      setSyncing(false);
      if (synced > 0) {
        setLastSyncResult(`¡${synced} cambios sincronizados!`);
        setTimeout(() => setLastSyncResult(null), 4000);
      }
    });
  };

  return (
    <div className="fixed bottom-20 left-4 z-40 max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
      {!isOnline ? (
        <div className="bg-amber-500 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-3 border border-amber-400/30 text-sm font-medium">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-200"></span>
          </span>
          <div className="flex-1">
            <p className="font-bold text-xs uppercase tracking-wide">Modo Offline en Aula</p>
            <p className="text-xs text-amber-100">
              {pendingCount > 0
                ? `${pendingCount} cambio${pendingCount > 1 ? 's' : ''} guardado${pendingCount > 1 ? 's' : ''} localmente`
                : 'Sin internet. Tus cambios se guardarán localmente.'}
            </p>
          </div>
        </div>
      ) : syncing ? (
        <div className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-3 border border-indigo-400/30 text-sm font-medium">
          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <div className="flex-1">
            <p className="font-bold text-xs">Sincronizando con la nube...</p>
            <p className="text-xs text-indigo-200">{pendingCount} pendiente{pendingCount > 1 ? 's' : ''}</p>
          </div>
        </div>
      ) : lastSyncResult ? (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border border-emerald-400/30 text-sm font-medium">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span className="text-xs font-semibold">{lastSyncResult}</span>
        </div>
      ) : pendingCount > 0 ? (
        <div className="bg-surface-lavender border border-primary/20 text-primary px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between gap-3 text-sm">
          <span className="text-xs font-medium">{pendingCount} pendiente{pendingCount > 1 ? 's' : ''}</span>
          <button
            onClick={handleManualSync}
            className="text-xs bg-primary text-white px-2.5 py-1 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Sincronizar
          </button>
        </div>
      ) : null}
    </div>
  );
}
