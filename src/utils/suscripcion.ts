/**
 * Utilidades para verificación de estado de suscripción y membresía Premium (Plan Plus)
 */

export interface SuscripcionData {
  id?: number;
  estado?: string;
  periodo?: string;
  fechaInicio?: string;
  fechaFin?: string | null;
  planId?: number;
  plan?: {
    id?: number;
    nombre?: string;
    precio?: number;
    maxcursos?: number;
  } | null;
  [key: string]: any;
}

/**
 * Determina con precisión si una suscripción o usuario cuenta con beneficios Premium / Plus activos.
 * 
 * Reglas:
 * 1. El estado debe ser 'activa', 'trial' (período de prueba Plus) o 'plus'.
 * 2. Si tiene fecha de vencimiento (`fechaFin`), debe ser igual o posterior al día actual.
 * 3. El plan debe ser Plus (planId 2, nombre 'Plus', o precio de plan > 0).
 */
export function isPremiumSubscription(suscripcion: SuscripcionData | null | undefined): boolean {
  if (!suscripcion || typeof suscripcion !== 'object') return false;

  const estado = String(suscripcion.estado || '').toLowerCase();
  const esEstadoActivo = estado === 'activa' || estado === 'trial' || estado === 'plus';
  if (!esEstadoActivo) return false;

  // Si tiene fecha de vencimiento, comprobar que no esté vencida
  if (suscripcion.fechaFin) {
    const timeFin = new Date(suscripcion.fechaFin).getTime();
    if (!isNaN(timeFin) && timeFin < Date.now()) {
      return false;
    }
  }

  // Verificar si el plan asignado es Plus / de pago
  const planNombre = String(suscripcion.plan?.nombre || suscripcion.nombre || '').toLowerCase();
  const planId = Number(suscripcion.planId ?? suscripcion.plan?.id);
  const planPrecio = Number(suscripcion.plan?.precio ?? 0);

  const esPlus = planNombre.includes('plus') || planId === 2 || planPrecio > 0;
  return esPlus;
}

