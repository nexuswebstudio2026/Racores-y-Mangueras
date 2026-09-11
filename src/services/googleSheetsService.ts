import { products } from '../data/catalogData';
import { hoseTypes } from '../data/hoseTypes';
import { CustomerQuoteRecord, GoogleSheetsDatabaseInfo } from '../types';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
            error_callback?: (err: unknown) => void;
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

const CLIENT_ID =
  (import.meta as unknown as { env?: { VITE_GOOGLE_CLIENT_ID?: string } }).env?.VITE_GOOGLE_CLIENT_ID ||
  '1067710464095-0kuu27comlk8qn1hk00afok8f625lhn2.apps.googleusercontent.com';

const SCOPES =
  'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file';

const STORAGE_KEY = 'rym_google_sheets_db';
const TOKEN_KEY = 'rym_google_access_token';
const TOKEN_EXPIRY_KEY = 'rym_google_token_expiry';

export function getStoredSpreadsheet(): GoogleSheetsDatabaseInfo | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredSpreadsheet(info: GoogleSheetsDatabaseInfo): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
}

export function removeStoredSpreadsheet(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

export function getStoredAccessToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!token || !expiry) return null;
  if (Date.now() > Number(expiry)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    return null;
  }
  return token;
}

export function saveAccessToken(token: string, expiresInSeconds: number = 3500): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + expiresInSeconds * 1000));
}

/**
 * Requests OAuth Access Token via Google Identity Services popup
 */
export function requestGoogleAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check if valid token is already saved
    const cachedToken = getStoredAccessToken();
    if (cachedToken) {
      resolve(cachedToken);
      return;
    }

    if (!window.google?.accounts?.oauth2) {
      reject(
        new Error(
          'Google Identity Services no está cargado aún en el navegador. Por favor recarga o verifica tu conexión.'
        )
      );
      return;
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response) => {
          if (response.error) {
            reject(new Error(`Error de autenticación con Google: ${response.error}`));
            return;
          }
          if (response.access_token) {
            saveAccessToken(response.access_token);
            resolve(response.access_token);
          } else {
            reject(new Error('No se recibió token de acceso de Google'));
          }
        },
        error_callback: (err) => {
          reject(new Error(`Error en el diálogo de Google OAuth: ${JSON.stringify(err)}`));
        },
      });

      client.requestAccessToken({ prompt: '' });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Creates the complete Google Sheets database structure and populates initial data
 */
export async function createDatabaseSpreadsheet(accessToken: string): Promise<GoogleSheetsDatabaseInfo> {
  const createUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

  const sheetDefinitions = [
    {
      properties: {
        title: 'Productos e Inventario',
        gridProperties: { frozenRowCount: 1 },
      },
    },
    {
      properties: {
        title: 'Cotizaciones de Clientes',
        gridProperties: { frozenRowCount: 1 },
      },
    },
    {
      properties: {
        title: 'Mangueras y Normas SAE',
        gridProperties: { frozenRowCount: 1 },
      },
    },
    {
      properties: {
        title: 'Servicios de Taller',
        gridProperties: { frozenRowCount: 1 },
      },
    },
  ];

  const createResponse = await fetch(createUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: 'Racores y Mangueras de Nariño - Base de Datos Oficial',
      },
      sheets: sheetDefinitions,
    }),
  });

  if (!createResponse.ok) {
    const errorJson = await createResponse.json().catch(() => ({}));
    throw new Error(
      `Fallo al crear la hoja en Google Sheets (${createResponse.status}): ${
        errorJson.error?.message || createResponse.statusText
      }`
    );
  }

  const createdSheet = await createResponse.json();
  const spreadsheetId = createdSheet.spreadsheetId;
  const spreadsheetUrl =
    createdSheet.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Seed Data for each sheet
  await populateInitialData(spreadsheetId, accessToken);

  const databaseInfo: GoogleSheetsDatabaseInfo = {
    spreadsheetId,
    spreadsheetUrl,
    title: 'Racores y Mangueras de Nariño - Base de Datos Oficial',
    connectedAt: new Date().toLocaleString('es-CO'),
    lastSyncedAt: new Date().toLocaleString('es-CO'),
    sheetsCount: 4,
    totalProductsCount: products.length,
    totalQuotesCount: 0,
  };

  saveStoredSpreadsheet(databaseInfo);
  return databaseInfo;
}

/**
 * Populates all sheets with headers and catalog data
 */
async function populateInitialData(spreadsheetId: string, accessToken: string) {
  // 1. Productos e Inventario
  const productsHeader = [
    'ID Ref',
    'Categoría',
    'Nombre del Producto',
    'Descripción Técnica',
    'Especificaciones (Presión / Medida / Rosca)',
    'Precio Estimado (COP)',
    'Estado / Stock',
    'Fecha de Registro',
  ];

  const productsRows = products.map((prod) => {
    const p = prod as { id: number; category?: string; name: string; description?: string; specs?: string; estimatedPrice?: number };
    return [
      `RYM-${String(p.id).padStart(4, '0')}`,
      p.category || 'General',
      p.name,
      p.description || '',
      p.specs || '',
      p.estimatedPrice ? `$${p.estimatedPrice.toLocaleString('es-CO')}` : 'Por Cotizar',
      'Disponible en Bodega Pasto',
      new Date().toLocaleDateString('es-CO'),
    ];
  });

  // 2. Cotizaciones de Clientes
  const quotesHeader = [
    'Código Cotización',
    'Fecha y Hora',
    'Nombre Cliente',
    'Empresa / Taller',
    'Teléfono / WhatsApp',
    'Correo Electrónico',
    'Ciudad / Municipio',
    'Sector Industrial',
    'Tipo Solicitud',
    'Detalle Ítems y Cantidades',
    'Total Unidades',
    'Requerimientos / Notas',
    'Estado Gestión',
  ];

  // 3. Mangueras y Normas SAE
  const hosesHeader = [
    'Código Norma',
    'Nombre Comercial',
    'Normativa Internacional',
    'Descripción de Aplicación',
    'Especificaciones Técnicas',
    'Presión Máxima Recomendada',
    'Disponibilidad Prensado',
  ];

  const hosesRows = hoseTypes.map((hose) => [
    hose.id.toUpperCase(),
    hose.name,
    hose.subtitle || '',
    hose.description || '',
    hose.specs.join(' | '),
    hose.specs.find((s) => s.includes('bar')) || 'Según diámetro',
    'Inmediato en Taller (15-20 min)',
  ]);

  // 4. Servicios de Taller
  const servicesHeader = [
    'Código Servicio',
    'Servicio Técnico Especializado',
    'Descripción Operativa',
    'Tiempo Estimado',
    'Control de Calidad / Pruebas',
    'Garantía Aplicable',
  ];

  const servicesRows = [
    [
      'SRV-01',
      'Prensado Hidráulico de Alta y Extrema Presión',
      'Ensamble y crimpado computarizado de mangueras de 1/4" hasta 2" (1 a 6 mallas de acero).',
      '15 a 25 minutos',
      'Verificación micrométrica de compresión y prueba estática',
      '100% Garantía en sellado y ensamble de terminal',
    ],
    [
      'SRV-02',
      'Diagnóstico y Fabricación de Mangueras Industriales',
      'Confección a medida para succión/descarga de agua, químicos, vapor, cemento y aire comprimido.',
      '30 a 60 minutos',
      'Inspección de compatibilidad química y radio de curvatura',
      'Cumplimiento con normas internacionales SAE/DIN/ISO',
    ],
    [
      'SRV-03',
      'Adaptación y Fabricación de Racores Especiales',
      'Mecanizado y adaptación de roscas métricas, BSP, JIC, NPT, ORFS y bridas CAT/Komatsu.',
      'Mismo día',
      'Verificación con galgas de paso y microscopio de rosca',
      'Garantía de tolerancia cero fugas',
    ],
    [
      'SRV-04',
      'Asesoría en Terreno para Maquinaria Pesada y Flotas',
      'Inspección in situ de líneas de transmisión hidráulica para excavadoras, volquetas y tractores.',
      'Programado',
      'Inspección visual de fatiga térmica, roce y envejecimiento',
      'Informe técnico con recomendaciones de reemplazo preventivo',
    ],
  ];

  // Send batchUpdate
  const batchDataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`;

  await fetch(batchDataUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: [
        {
          range: 'Productos e Inventario!A1:H',
          values: [productsHeader, ...productsRows],
        },
        {
          range: 'Cotizaciones de Clientes!A1:M',
          values: [quotesHeader],
        },
        {
          range: 'Mangueras y Normas SAE!A1:G',
          values: [hosesHeader, ...hosesRows],
        },
        {
          range: 'Servicios de Taller!A1:F',
          values: [servicesHeader, ...servicesRows],
        },
      ],
    }),
  });
}

/**
 * Appends a new customer quote row to "Cotizaciones de Clientes" in Google Sheets
 */
export async function appendQuoteToSpreadsheet(
  spreadsheetId: string,
  accessToken: string,
  quote: CustomerQuoteRecord
): Promise<boolean> {
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Cotizaciones de Clientes!A:M:append?valueInputOption=USER_ENTERED`;

  const row = [
    quote.id,
    quote.timestamp,
    quote.clientName,
    quote.companyName || 'Particular',
    quote.phone,
    quote.email || 'No especificado',
    quote.city || 'Pasto',
    quote.sector,
    quote.requestType,
    quote.itemsSummary,
    quote.totalQuantity,
    quote.notes || 'Sin observaciones adicionales',
    quote.status,
  ];

  const response = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [row],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Error al registrar cotización en Google Sheets: ${err.error?.message || response.statusText}`);
  }

  // Update total quote count in local storage info
  const info = getStoredSpreadsheet();
  if (info) {
    info.totalQuotesCount = (info.totalQuotesCount || 0) + 1;
    info.lastSyncedAt = new Date().toLocaleString('es-CO');
    saveStoredSpreadsheet(info);
  }

  return true;
}

/**
 * Fetches existing quotes recorded in Google Sheets
 */
export async function fetchQuotesFromSpreadsheet(
  spreadsheetId: string,
  accessToken: string
): Promise<CustomerQuoteRecord[]> {
  const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Cotizaciones de Clientes!A2:M`;

  const response = await fetch(readUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('No se pudieron consultar las cotizaciones de Google Sheets');
  }

  const data = await response.json();
  const rows: string[][] = data.values || [];

  return rows.map((row) => ({
    id: row[0] || 'RYM-000',
    timestamp: row[1] || '',
    clientName: row[2] || '',
    companyName: row[3] || '',
    phone: row[4] || '',
    email: row[5] || '',
    city: row[6] || '',
    sector: row[7] || '',
    requestType: row[8] || '',
    itemsSummary: row[9] || '',
    totalQuantity: Number(row[10]) || 1,
    notes: row[11] || '',
    status: (row[12] as CustomerQuoteRecord['status']) || 'Pendiente',
  }));
}
