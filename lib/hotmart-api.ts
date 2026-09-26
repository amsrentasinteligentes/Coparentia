// CLIENTE DE LA API REST DE HOTMART (2026-09-25) — distinto del webhook (lib/hotmart-verify.ts):
// el webhook es Hotmart avisándote a TI; esto es tu app PREGUNTÁNDOLE a Hotmart. Se usa solo para
// la reconciliación semanal (app/api/cron/reconciliacion-hotmart/route.ts) — nada en el resto de
// la app depende de esto, así que si Hotmart cambia algo aquí, solo ese job se ve afectado.
//
// Documentación verificada en vivo (developers.hotmart.com, 2026-09-25) — no es de memoria:
// - Token: POST https://api-sec-vlc.hotmart.com/security/oauth/token
//   ?grant_type=client_credentials&client_id=...&client_secret=...
//   header Authorization: Basic <token "Basic" que Hotmart genera junto a client_id/secret>
// - Suscripciones: GET https://developers.hotmart.com/payments/api/v1/subscriptions?product_id=...
//   header Authorization: Bearer <access_token>, pagina con `page_token`/`next_page_token`.

interface RespuestaToken {
  access_token: string;
  expires_in: number;
}

export interface SuscripcionHotmart {
  subscriber_code: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELAYED' | 'CANCELLED_BY_CUSTOMER' | 'CANCELLED_BY_SELLER' | 'CANCELLED_BY_ADMIN' | 'STARTED' | 'OVERDUE';
  date_next_charge?: number;
  product: { id: number; name: string };
  subscriber: { name: string; email: string };
}

interface RespuestaSuscripciones {
  items: SuscripcionHotmart[];
  page_info: { next_page_token?: string; total_results: number };
}

// Credenciales completas: si falta cualquiera de las 3, la reconciliación se salta (no falla el
// resto de la app) — mismo criterio que el resto de integraciones externas opcionales.
export function credencialesHotmartCompletas(): boolean {
  return Boolean(process.env.HOTMART_CLIENT_ID && process.env.HOTMART_CLIENT_SECRET && process.env.HOTMART_BASIC_TOKEN);
}

async function obtenerAccessToken(): Promise<string> {
  const clientId = process.env.HOTMART_CLIENT_ID!;
  const clientSecret = process.env.HOTMART_CLIENT_SECRET!;
  const basico = process.env.HOTMART_BASIC_TOKEN!;
  const url = `https://api-sec-vlc.hotmart.com/security/oauth/token?grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${basico}` },
  });
  if (!resp.ok) throw new Error(`Hotmart OAuth respondió ${resp.status}`);
  const data = (await resp.json()) as RespuestaToken;
  return data.access_token;
}

// Trae TODAS las suscripciones de un producto, sin importar el estado — la reconciliación decide
// después qué significa cada estado. Un usuario nuevo casi no tiene suscriptores, así que traer
// "todo" en vez de filtrar por estado es simple y barato; si el negocio crece mucho, aquí es
// donde se agregaría el filtro por `status` para no traer de más.
export async function obtenerTodasLasSuscripciones(productId: string): Promise<SuscripcionHotmart[]> {
  const token = await obtenerAccessToken();
  const todas: SuscripcionHotmart[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL('https://developers.hotmart.com/payments/api/v1/subscriptions');
    url.searchParams.set('product_id', productId);
    url.searchParams.set('max_results', '100');
    if (pageToken) url.searchParams.set('page_token', pageToken);

    const resp = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    if (!resp.ok) throw new Error(`Hotmart /subscriptions respondió ${resp.status}`);
    const data = (await resp.json()) as RespuestaSuscripciones;
    todas.push(...data.items);
    pageToken = data.page_info?.next_page_token;
  } while (pageToken);

  return todas;
}

// Juicio propio (documentado, revisar si algún día se ve un caso real que no encaje): estos son
// los estados en los que Hotmart todavía considera que la persona debería tener acceso al
// producto — el resto significa que ya no debería tenerlo.
const ESTADOS_CON_ACCESO: SuscripcionHotmart['status'][] = ['ACTIVE', 'STARTED', 'DELAYED', 'OVERDUE'];
export function deberiaTenerAcceso(estado: SuscripcionHotmart['status']): boolean {
  return ESTADOS_CON_ACCESO.includes(estado);
}
