import { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle, 
  Database, 
  X, 
  Layers, 
  ClipboardList, 
  Wrench, 
  Package, 
  ArrowRight,
  Sparkles,
  Lock,
  Trash2
} from 'lucide-react';
import { 
  getStoredSpreadsheet, 
  requestGoogleAccessToken, 
  createDatabaseSpreadsheet, 
  removeStoredSpreadsheet,
  fetchQuotesFromSpreadsheet,
  appendQuoteToSpreadsheet
} from '../services/googleSheetsService';
import { GoogleSheetsDatabaseInfo, CustomerQuoteRecord } from '../types';
import { products } from '../data/catalogData';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify?: (message: string) => void;
}

export default function GoogleSheetsModal({ isOpen, onClose, onNotify }: GoogleSheetsModalProps) {
  const [dbInfo, setDbInfo] = useState<GoogleSheetsDatabaseInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'quotes' | 'sheets'>('overview');
  const [quotesList, setQuotesList] = useState<CustomerQuoteRecord[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [testSending, setTestSending] = useState(false);

  useEffect(() => {
    const stored = getStoredSpreadsheet();
    setDbInfo(stored);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateDatabase = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Authenticate with Google OAuth
      const token = await requestGoogleAccessToken();
      // 2. Create the complete spreadsheet with initial database structure
      const newDb = await createDatabaseSpreadsheet(token);
      setDbInfo(newDb);
      if (onNotify) {
        onNotify('¡Base de datos generada exitosamente en tu Google Sheets!');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido al conectar con Google';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshQuotes = async () => {
    if (!dbInfo) return;
    setLoadingQuotes(true);
    setError(null);
    try {
      const token = await requestGoogleAccessToken();
      const quotes = await fetchQuotesFromSpreadsheet(dbInfo.spreadsheetId, token);
      setQuotesList(quotes);
      if (onNotify) {
        onNotify(`${quotes.length} cotizaciones sincronizadas desde Google Sheets`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al sincronizar cotizaciones';
      setError(msg);
    } finally {
      setLoadingQuotes(false);
    }
  };

  const handleSendTestQuote = async () => {
    if (!dbInfo) return;
    setTestSending(true);
    setError(null);
    try {
      const token = await requestGoogleAccessToken();
      const testQuote: CustomerQuoteRecord = {
        id: `COT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleString('es-CO'),
        clientName: 'Transportes Pasto Express (Prueba)',
        companyName: 'Flota Regional Nariño',
        phone: '+57 315 478 1702',
        email: 'logistica@pastoexpress.co',
        city: 'Pasto',
        sector: 'Transporte y Carga Pesada',
        requestType: 'Manguera Hidráulica Urgente',
        itemsSummary: '1x Manguera SAE 100R2 1/2" 420 Bar + 2x Racores JIC 3/8"',
        totalQuantity: 3,
        notes: 'Prueba de integración en vivo con Google Sheets.',
        status: 'Pendiente',
      };
      await appendQuoteToSpreadsheet(dbInfo.spreadsheetId, token, testQuote);
      await handleRefreshQuotes();
      if (onNotify) {
        onNotify('Cotización de prueba agregada en vivo a tu Google Sheet');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al enviar cotización de prueba';
      setError(msg);
    } finally {
      setTestSending(false);
    }
  };

  const handleDisconnect = () => {
    if (confirm('¿Estás seguro de desconectar la hoja local? La hoja de cálculo seguirá intacta en tu Google Drive.')) {
      removeStoredSpreadsheet();
      setDbInfo(null);
      setQuotesList([]);
      if (onNotify) {
        onNotify('Base de datos desconectada localmente');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0f131d] border border-slate-700/80 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-[#121826] via-[#101420] to-[#121826]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-950/40">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-serif">
                  Base de Datos en Google Sheets
                </h2>
                {dbInfo ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Conectada
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    No inicializada
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Almacena inventario, catálogo técnico y cotizaciones en tiempo real en tu Google Drive
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs navigation (if connected) */}
        {dbInfo && (
          <div className="flex border-b border-slate-800 bg-[#0a0d14] px-6 text-sm">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-4 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-4 h-4" />
              Estado y Enlaces
            </button>
            <button
              onClick={() => {
                setActiveTab('quotes');
                if (quotesList.length === 0) handleRefreshQuotes();
              }}
              className={`py-3 px-4 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'quotes'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Cotizaciones Registradas
            </button>
            <button
              onClick={() => setActiveTab('sheets')}
              className={`py-3 px-4 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'sheets'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              Estructura de Hojas (4)
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 text-red-300 text-sm">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-200">Atención:</p>
                <p className="text-xs text-red-300/90 mt-1">{error}</p>
              </div>
            </div>
          )}

          {!dbInfo ? (
            /* Non-connected state: Prompt to generate database */
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#131929] to-[#0d121c] border border-slate-700/60 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  Base de Datos Cloud Oficial
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Generar Base de Datos en Google Sheets
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-2xl">
                  Esta acción creará automáticamente una hoja de cálculo completa y estructurada en tu Google Drive con 4 pestañas especializadas para el funcionamiento integral de <strong className="text-white">Racores y Mangueras de Nariño</strong>:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div className="bg-[#182032]/80 border border-slate-700/60 rounded-xl p-3.5 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">1. Productos e Inventario</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {products.length} productos precargados con códigos RYM, descripciones y especificaciones de roscas.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#182032]/80 border border-slate-700/60 rounded-xl p-3.5 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                      <ClipboardList className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">2. Cotizaciones de Clientes</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Recepción automática de cotizaciones con cliente, empresa, teléfono, sector y productos.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#182032]/80 border border-slate-700/60 rounded-xl p-3.5 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">3. Mangueras y Normas SAE</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Tablas técnicas de normas 100R2, 100R5, 100R12, teflón y presiones bar/psi de trabajo.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#182032]/80 border border-slate-700/60 rounded-xl p-3.5 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">4. Servicios de Taller</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Registro de prensados hidráulicos, tiempos de entrega y protocolos de seguridad.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-slate-800">
                  <button
                    onClick={handleCreateDatabase}
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Generando hoja en Google Sheets...</span>
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-5 h-5" />
                        <span>Generar Base de Datos en Google Sheets</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Autenticación segura oficial vía Google OAuth 2.0</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Connected state: Show tabs and tools */
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Database Card */}
                  <div className="bg-gradient-to-br from-[#121826] to-[#0c1018] border border-emerald-500/40 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Base de Datos Activa y Sincronizada
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          {dbInfo.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 font-mono break-all">
                          ID: {dbInfo.spreadsheetId}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <a
                          href={dbInfo.spreadsheetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                          <span>Abrir en Google Sheets</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={handleDisconnect}
                          className="p-2.5 bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 rounded-xl text-sm transition-colors cursor-pointer"
                          title="Desconectar base de datos local"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
                      <div className="bg-[#172033]/60 rounded-xl p-3 border border-slate-800">
                        <span className="text-xs text-slate-400 block">Productos en Catálogo</span>
                        <span className="text-lg font-bold text-amber-400 mt-0.5 block">
                          {products.length} ítems
                        </span>
                      </div>
                      <div className="bg-[#172033]/60 rounded-xl p-3 border border-slate-800">
                        <span className="text-xs text-slate-400 block">Hojas Estructuradas</span>
                        <span className="text-lg font-bold text-emerald-400 mt-0.5 block">
                          4 pestañas
                        </span>
                      </div>
                      <div className="bg-[#172033]/60 rounded-xl p-3 border border-slate-800">
                        <span className="text-xs text-slate-400 block">Cotizaciones Recibidas</span>
                        <span className="text-lg font-bold text-blue-400 mt-0.5 block">
                          {quotesList.length || dbInfo.totalQuotesCount || 0}
                        </span>
                      </div>
                      <div className="bg-[#172033]/60 rounded-xl p-3 border border-slate-800">
                        <span className="text-xs text-slate-400 block">Última Sincronización</span>
                        <span className="text-xs font-semibold text-slate-200 mt-1 block">
                          {dbInfo.lastSyncedAt || 'Reciente'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Testing panel */}
                  <div className="bg-[#121622] border border-slate-800 rounded-2xl p-5 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Pruebas de Escritura en Tiempo Real
                    </h4>
                    <p className="text-xs text-slate-400">
                      Verifica que tu sitio web tiene permisos completos de escritura enviando un registro de prueba a la pestaña <strong>Cotizaciones de Clientes</strong>:
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleSendTestQuote}
                        disabled={testSending}
                        className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {testSending ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <ClipboardList className="w-3.5 h-3.5" />
                        )}
                        <span>Enviar Cotización de Prueba a Sheets</span>
                      </button>

                      <button
                        onClick={handleRefreshQuotes}
                        disabled={loadingQuotes}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingQuotes ? 'animate-spin' : ''}`} />
                        <span>Leer Cotizaciones desde Sheets</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'quotes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Cotizaciones en la Hoja de Cálculo
                      </h4>
                      <p className="text-xs text-slate-400">
                        Pestaña <strong>"Cotizaciones de Clientes"</strong>
                      </p>
                    </div>
                    <button
                      onClick={handleRefreshQuotes}
                      disabled={loadingQuotes}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingQuotes ? 'animate-spin' : ''}`} />
                      <span>Actualizar</span>
                    </button>
                  </div>

                  {quotesList.length === 0 ? (
                    <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center space-y-3">
                      <ClipboardList className="w-8 h-8 text-slate-500 mx-auto" />
                      <p className="text-sm text-slate-400">
                        No hay cotizaciones consultadas aún o la hoja está vacía.
                      </p>
                      <button
                        onClick={handleSendTestQuote}
                        disabled={testSending}
                        className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
                      >
                        Insertar una cotización de prueba ahora
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-[#161c2b] text-slate-400 font-semibold border-b border-slate-800">
                          <tr>
                            <th className="py-2.5 px-3">Código</th>
                            <th className="py-2.5 px-3">Cliente / Empresa</th>
                            <th className="py-2.5 px-3">Teléfono</th>
                            <th className="py-2.5 px-3">Sector</th>
                            <th className="py-2.5 px-3">Detalle Productos</th>
                            <th className="py-2.5 px-3">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 bg-[#0d111a]">
                          {quotesList.map((q) => (
                            <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">{q.id}</td>
                              <td className="py-2.5 px-3">
                                <span className="font-semibold text-white block">{q.clientName}</span>
                                <span className="text-slate-400 text-[11px] block">{q.companyName}</span>
                              </td>
                              <td className="py-2.5 px-3 font-mono">{q.phone}</td>
                              <td className="py-2.5 px-3 text-slate-300">{q.sector}</td>
                              <td className="py-2.5 px-3 max-w-xs truncate text-slate-300" title={q.itemsSummary}>
                                {q.itemsSummary}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  {q.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'sheets' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white">
                    Estructura de Pestañas Creadas en Google Sheets
                  </h4>

                  <div className="space-y-3">
                    <div className="bg-[#141a27] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                          1
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-white">📦 Productos e Inventario</h5>
                          <p className="text-xs text-slate-400">
                            Columnas: ID Ref, Categoría, Nombre, Descripción Técnica, Especificaciones, Precio, Estado, Fecha Registro.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono">
                        {products.length} filas
                      </span>
                    </div>

                    <div className="bg-[#141a27] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                          2
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-white">📋 Cotizaciones de Clientes</h5>
                          <p className="text-xs text-slate-400">
                            Columnas: Código, Fecha/Hora, Cliente, Empresa, Teléfono, Correo, Ciudad, Sector, Solicitud, Ítems, Cantidad, Notas, Estado.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                        En vivo
                      </span>
                    </div>

                    <div className="bg-[#141a27] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">
                          3
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-white">🔧 Mangueras y Normas SAE</h5>
                          <p className="text-xs text-slate-400">
                            Columnas: Código Norma, Nombre Comercial, Normativa, Descripción, Especificaciones Técnicas, Presión Máxima, Disponibilidad.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono">
                        SAE / DIN
                      </span>
                    </div>

                    <div className="bg-[#141a27] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm">
                          4
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-white">🛠️ Servicios de Taller</h5>
                          <p className="text-xs text-slate-400">
                            Columnas: Código Servicio, Servicio Técnico, Descripción Operativa, Tiempo Estimado, Control Calidad, Garantía.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono">
                        4 servicios
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#0d1017] flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {dbInfo ? (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Sincronizado con Google Sheets
              </span>
            ) : (
              <span>Google Sheets API v4 integrada</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {dbInfo && (
              <a
                href={dbInfo.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Ver Hoja en Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
