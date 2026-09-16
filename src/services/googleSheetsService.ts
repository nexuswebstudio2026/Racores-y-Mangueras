import { products } from '../data/catalogData';
import { hoseTypes } from '../data/hoseTypes';
import { CustomerQuoteRecord, GoogleSheetsDatabaseInfo, Product } from '../types';

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
const PUBLIC_PRODUCTS_SHEET_URL =
  (import.meta as unknown as { env?: { VITE_PUBLIC_PRODUCTS_SHEET_URL?: string } }).env?.VITE_PUBLIC_PRODUCTS_SHEET_URL ||
  'https://docs.google.com/spreadsheets/d/1Q950f28lnPvsp7jqAh-42m-b1dNfCJx0_NPKUJkP5vs/gviz/tq?tqx=out:json&sheet=Productos%20e%20Inventario';

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
 * Reads the products table from Google Sheets and converts it to the app's Product model.
 */
export async function fetchProductsFromSpreadsheet(
  spreadsheetId: string,
  accessToken: string
): Promise<Product[]> {
  const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Productos e Inventario!A2:H`;

  const response = await fetch(readUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('No se pudieron consultar los productos de Google Sheets');
  }

  const data = await response.json();
  const rows: string[][] = data.values || [];

  return rows
    .filter((row) => row && row.length > 2 && row[2]?.trim())
    .map((row, index) => {
      const [ref, category, name, description, specs, priceText, stockStatus] = row;
      const idFromRef = Number(String(ref || '').replace(/[^0-9]/g, '')) || index + 1;
      const cleanPrice = Number(String(priceText || '').replace(/[^0-9]/g, '')) || 0;

      return {
        id: idFromRef,
        category: category || 'General',
        name: name || `Producto ${index + 1}`,
        description: description || 'Sin descripción disponible',
        specs: specs || stockStatus || 'Sin especificaciones disponibles',
        estimatedPrice: cleanPrice > 0 ? cleanPrice : undefined,
        image: `https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80`,
      };
    });
}

export async function fetchProductsFromPublicSheet(): Promise<Product[]> {
  const separator = PUBLIC_PRODUCTS_SHEET_URL.includes('?') ? '&' : '?';
  const response = await fetch(`${PUBLIC_PRODUCTS_SHEET_URL}${separator}cacheBust=${Date.now()}`, {
    headers: {
      Accept: 'application/json,text/plain,*/*',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('La hoja pública de Google Sheets no está disponible');
  }

  const text = await response.text();

  if (!text || !text.includes('google.visualization.Query.setResponse')) {
    throw new Error('La URL pública no devolvió datos válidos de la hoja');
  }

  const jsonPart = text.match(/\{.*\}/s)?.[0];
  if (!jsonPart) {
    throw new Error('No se pudo interpretar la respuesta de la hoja pública');
  }

  const payload = JSON.parse(jsonPart) as {
    table?: {
      cols?: Array<{ label?: string }>;
      rows?: Array<{ c?: Array<{ v?: string | number } | null> }>;
    };
  };
  const normalizeHeader = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  const header = payload.table?.cols?.map((column) => normalizeHeader(column.label || '')) || [];
  const rows: string[][] = payload.table?.rows?.map((r) =>
    r.c?.map((cell) => (cell && 'v' in cell ? String(cell.v) : '')) || []
  ) || [];

  if (!rows.length) return [];

  const findHeader = (...names: string[]) => header.findIndex((column) => names.includes(column));
  const findHeaderOccurrence = (name: string, occurrence: number) =>
    header.reduce<number[]>((indexes, column, index) => {
      if (column === name) indexes.push(index);
      return indexes;
    }, [])[occurrence] ?? -1;

  const parseNumberValue = (value: string | number | null | undefined): number => {
    if (value === null || value === undefined || value === '') return 0;

    const text = String(value).trim();
    if (!text) return 0;

    const withoutCurrency = text.replace(/[$\sA-Za-z]/g, '').replace(/\u00A0/g, '');
    if (!withoutCurrency) return 0;

    if (/^\d+(?:\.\d+)?$/.test(withoutCurrency)) {
      const parsed = Number(withoutCurrency);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    if (/^\d{1,3}(?:\.\d{3})+(?:,\d+)?$/.test(withoutCurrency)) {
      const normalized = withoutCurrency.replace(/\./g, '').replace(',', '.');
      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    if (/^\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(withoutCurrency)) {
      const normalized = withoutCurrency.replace(/,/g, '');
      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    if (/^\d+(?:,\d+)?$/.test(withoutCurrency)) {
      const normalized = withoutCurrency.replace(',', '.');
      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    const parsed = Number(withoutCurrency);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const nameIndex = findHeader('nombre del producto');
  const categoryIndex = findHeader('categoria');
  const hoseTypeIndex = findHeader('tipomanguera', 'tipo manguera');
  const diameterIndex = findHeader('diametro (pulgadas)', 'diametro');
  const descriptionIndex = findHeader('descripcion tecnica');
  const specsIndex = findHeader('especificaciones', 'especificaciones tecnicas', 'especificaciones (presion / medida / rosca)');
  const refIndex = header.indexOf('id ref');
  const priceIndex = findHeader('precio de venta metro', 'precio estimado (cop)', 'precio de venta por metro', 'precio de venta por metro cop');
  const costPerRollIndex = findHeader('precio de costo rollo');
  const costPerMeterIndex = findHeader('precio de costo metro');
  const imageIndex = findHeader('url imagen', 'imagen url', 'image url', 'imagen');
  const stockIndex = findHeader('estado / stock');

  return rows
    .filter((row) => row && row.length > 2 && row[nameIndex]?.trim())
    .map((row, index) => {
      const refValue = refIndex >= 0 ? row[refIndex] : '';
      const category = categoryIndex >= 0 ? row[categoryIndex] : 'General';
      const hoseType = hoseTypeIndex >= 0 ? row[hoseTypeIndex] : '';
      const diameter = diameterIndex >= 0 ? row[diameterIndex] : '';
      const name = nameIndex >= 0 ? row[nameIndex] : `Producto ${index + 1}`;
      const description = descriptionIndex >= 0
        ? row[descriptionIndex]
        : hoseType
          ? `Manguera hidráulica tipo ${hoseType}`
          : 'Sin descripción disponible';
      const specs = specsIndex >= 0 ? row[specsIndex] : [
        hoseType && `Tipo: ${hoseType}`,
        diameter && `Diámetro: ${diameter} pulgadas`,
      ].filter(Boolean).join(' | ') || 'Sin especificaciones disponibles';
      const priceText = priceIndex >= 0 ? row[priceIndex] : row[11] || '';
      const costPerRollText = costPerRollIndex >= 0 ? row[costPerRollIndex] : '';
      const costPerMeterText = costPerMeterIndex >= 0 ? row[costPerMeterIndex] : '';
      const imageUrl = imageIndex >= 0 ? row[imageIndex]?.trim() : '';
      const stockStatus = stockIndex >= 0 ? row[stockIndex] : '';
      const numericId = Number(String(refValue || '').replace(/[^0-9]/g, '')) || index + 1;
      const cleanPrice = parseNumberValue(priceText);
      const cleanCostPerRoll = parseNumberValue(costPerRollText);
      const cleanCostPerMeter = parseNumberValue(costPerMeterText);

      return {
        id: numericId,
        reference: refValue || undefined,
        category: category || 'General',
        name,
        description,
        specs,
        hoseType: hoseType || undefined,
        diameter: diameter || undefined,
        stockStatus: stockStatus || undefined,
        estimatedPrice: cleanPrice > 0 ? cleanPrice : undefined,
        costPerRoll: cleanCostPerRoll > 0 ? cleanCostPerRoll : undefined,
        costPerMeter: cleanCostPerMeter > 0 ? cleanCostPerMeter : undefined,
        salePricePerMeter: cleanPrice > 0 ? cleanPrice : undefined,
        image: imageUrl || `https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80`,
      };
    });
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
