/**
 * offlineSync.ts
 * Gestor de cola de sincronización offline para Organizador Docente.
 * Permite encolar peticiones de asistencias y notas cuando el docente está en el aula sin conexión.
 */

export interface SyncAction {
  id: string;
  url: string;
  method: 'POST' | 'PUT' | 'DELETE';
  body?: any;
  timestamp: number;
  tipo: 'asistencia' | 'calificacion' | 'general';
  descripcion?: string;
}

const SYNC_QUEUE_KEY = 'od_offline_sync_queue';

/**
 * Obtiene la lista de acciones pendientes de sincronizar
 */
export function getPendingSyncQueue(): SyncAction[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SYNC_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error leyendo cola offline:', e);
    return [];
  }
}

/**
 * Guarda la cola de acciones pendientes en localStorage
 */
function saveSyncQueue(queue: SyncAction[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    notifyQueueChange(queue.length);
  } catch (e) {
    console.error('Error guardando cola offline:', e);
  }
}

/**
 * Encola una nueva acción para sincronización posterior
 */
export function enqueueSyncAction(action: Omit<SyncAction, 'id' | 'timestamp'>): SyncAction {
  const newAction: SyncAction = {
    ...action,
    id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    timestamp: Date.now(),
  };

  const queue = getPendingSyncQueue();
  
  // Deduplicación inteligente: si ya hay una acción para la misma URL y método, reemplazarla
  const indexExistente = queue.findIndex(
    (item) => item.url === newAction.url && item.method === newAction.method
  );

  if (indexExistente >= 0 && (newAction.method === 'PUT' || newAction.method === 'POST')) {
    queue[indexExistente] = newAction;
  } else {
    queue.push(newAction);
  }

  saveSyncQueue(queue);
  return newAction;
}

/**
 * Notifica a los componentes sobre cambios en la cola
 */
function notifyQueueChange(count: number): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('od:offline-queue-changed', {
      detail: { pendingCount: count },
    })
  );
}

/**
 * Procesa y envía todas las acciones pendientes a la API
 */
export async function processSyncQueue(): Promise<{ synced: number; failed: number }> {
  if (typeof window === 'undefined') return { synced: 0, failed: 0 };
  if (!navigator.onLine) return { synced: 0, failed: 0 };

  const queue = getPendingSyncQueue();
  if (queue.length === 0) return { synced: 0, failed: 0 };

  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let synced = 0;
  let failed = 0;
  const remainingQueue: SyncAction[] = [];

  window.dispatchEvent(
    new CustomEvent('od:offline-syncing', {
      detail: { total: queue.length },
    })
  );

  for (const item of queue) {
    try {
      const response = await fetch(item.url, {
        method: item.method,
        headers,
        body: item.body ? JSON.stringify(item.body) : undefined,
      });

      if (response.ok || response.status === 404) {
        synced++;
      } else if (response.status >= 400 && response.status < 500) {
        synced++;
      } else {
        remainingQueue.push(item);
        failed++;
      }
    } catch (err) {
      remainingQueue.push(item);
      failed++;
    }
  }

  saveSyncQueue(remainingQueue);

  window.dispatchEvent(
    new CustomEvent('od:offline-sync-completed', {
      detail: { synced, failed, remaining: remainingQueue.length },
    })
  );

  return { synced, failed };
}

/**
 * Inicializador de listeners automáticos de reconexión
 */
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[OfflineSync] Conexión a internet detectada. Iniciando sincronización...');
    processSyncQueue();
  });
}
