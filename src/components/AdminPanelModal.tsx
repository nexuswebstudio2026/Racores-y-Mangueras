import { useState, useEffect, type FormEvent } from 'react';
import { 
  ShieldCheck, 
  Users, 
  ClipboardList, 
  Package, 
  FileSpreadsheet, 
  X, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink, 
  Phone, 
  Mail, 
  KeyRound, 
  MessageSquare, 
  LogOut, 
  UserCheck, 
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { AdminUser, CustomerQuoteRecord, Product } from '../types';
import { 
  getAdminUsers, 
  saveAdminUsers, 
  updateAdminUser, 
  createAdminUser, 
  deleteAdminUser, 
  syncUsersToGoogleSheets, 
  getActivityLogs, 
  addActivityLog 
} from '../services/userService';
import { 
  getStoredSpreadsheet, 
  requestGoogleAccessToken, 
  fetchQuotesFromSpreadsheet 
} from '../services/googleSheetsService';
import { products as initialProducts } from '../data/catalogData';

interface AdminPanelModalProps {
  isOpen: boolean;
  currentUser: AdminUser;
  onClose: () => void;
  onSwitchUser: () => void;
  onLogout: () => void;
  onNotify?: (msg: string) => void;
}

export default function AdminPanelModal({
  isOpen,
  currentUser,
  onClose,
  onSwitchUser,
  onLogout,
  onNotify,
}: AdminPanelModalProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'quotes' | 'inventory' | 'activity'>('users');
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [quotesList, setQuotesList] = useState<CustomerQuoteRecord[]>([]);
  const [inventoryList, setInventoryList] = useState<Product[]>([]);
  const [activityLogs, setActivityLogs] = useState(getActivityLogs());
  const [loading, setLoading] = useState(false);
  const [syncingSheets, setSyncingSheets] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showPins, setShowPins] = useState<Record<string, boolean>>({});

  // New user form state
  const [newUserData, setNewUserData] = useState({
    name: '',
    role: 'Administrador Técnico',
    title: 'Asesor Técnico Especializado',
    email: '',
    phone: '+57 ',
    pin: '1234',
  });

  // Load data
  useEffect(() => {
    if (isOpen) {
      loadAllData();
    }
  }, [isOpen]);

  const loadAllData = async () => {
    setUsersList(getAdminUsers());
    setActivityLogs(getActivityLogs());
    setInventoryList(initialProducts);

    // Try to load quotes from Google Sheets if available
    const db = getStoredSpreadsheet();
    if (db) {
      try {
        const token = await requestGoogleAccessToken();
        const quotes = await fetchQuotesFromSpreadsheet(db.spreadsheetId, token);
        if (quotes && quotes.length > 0) {
          setQuotesList(quotes);
        } else {
          loadMockQuotes();
        }
      } catch {
        loadMockQuotes();
      }
    } else {
      loadMockQuotes();
    }
  };

  const loadMockQuotes = () => {
    setQuotesList([
      {
        id: 'COT-8921',
        timestamp: 'Hoy, 09:30 AM',
        clientName: 'Carlos Benavides',
        companyName: 'Transportes Pasto-Ipiales S.A.S.',
        phone: '+57 315 789 2201',
        email: 'carlos.benavides@transportespi.com',
        city: 'Pasto',
        sector: 'Transporte y Carga Pesada',
        requestType: 'Mangueras Hidráulicas para Volqueta',
        itemsSummary: '2x Manguera SAE 100R2 1/2" 420 Bar + 4x Racores JIC Macho 3/8"',
        totalQuantity: 6,
        notes: 'Urgente para volqueta doble troque en taller San Juan.',
        status: 'En Gestión',
        assignedTo: 'Juan Felipe Piscal',
        internalNotes: 'Se cotizó con terminales acodados a 90 grados.',
      },
      {
        id: 'COT-8922',
        timestamp: 'Hoy, 10:15 AM',
        clientName: 'Ing. Rodrigo Erazo',
        companyName: 'Consorcio Vial del Sur',
        phone: '+57 318 450 1199',
        email: 'rerazo@vialesdelsur.co',
        city: 'Chachagüí',
        sector: 'Construcción y Maquinaria Pesada',
        requestType: 'Línea de Alta Presión Excavadora',
        itemsSummary: '1x Manguera 4 Mallas SAE 100R12 3/4" + 2x Bridas Cat Split Flange Code 62',
        totalQuantity: 3,
        notes: 'Fuga en el brazo principal de retroexcavadora Caterpillar 320D.',
        status: 'Pendiente',
        assignedTo: 'Andrés Camilo Vidal',
        internalNotes: 'Pendiente confirmar muestra de brida en taller.',
      },
      {
        id: 'COT-8923',
        timestamp: 'Ayer, 04:45 PM',
        clientName: 'Germán Rosero',
        companyName: 'Agropecuaria Guaitarilla',
        phone: '+57 316 221 0045',
        email: 'grosero@guaitarilla.com',
        city: 'Túquerres',
        sector: 'Agroindustria Nariñense',
        requestType: 'Manguera de Succión y Acoples Rápidos',
        itemsSummary: '1x Manguera Succión 2" x 6m + 2x Acoples Rápidos Camlock Tipo C y E',
        totalQuantity: 3,
        notes: 'Para motobomba de riego agrícola.',
        status: 'Cotizado',
        assignedTo: 'Lucero Adriana Ibarra',
        internalNotes: 'Propuesta enviada formalmente al correo del cliente.',
      },
    ]);
  };

  if (!isOpen) return null;

  const dbInfo = getStoredSpreadsheet();

  // User Actions
  const handleToggleActive = (user: AdminUser) => {
    if (user.isOwner) {
      alert('El propietario y administrador general no puede ser desactivado.');
      return;
    }
    const updated = { ...user, active: !user.active };
    updateAdminUser(updated);
    setUsersList(getAdminUsers());
    onNotify?.(`${user.name} ahora está ${updated.active ? 'activo' : 'inactivo'}`);
  };

  const handleSaveEditUser = (e: FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateAdminUser(editingUser);
    setUsersList(getAdminUsers());
    setEditingUser(null);
    onNotify?.(`Perfil de ${editingUser.name} actualizado con éxito`);
  };

  const handleCreateUser = (e: FormEvent) => {
    e.preventDefault();
    if (!newUserData.name.trim()) return;

    const initials = newUserData.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const colors = [
      'from-emerald-500 to-teal-700',
      'from-amber-500 to-amber-700',
      'from-blue-500 to-indigo-700',
      'from-purple-500 to-pink-700',
      'from-cyan-500 to-blue-700',
    ];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    createAdminUser({
      name: newUserData.name,
      role: newUserData.role,
      title: newUserData.title,
      email: newUserData.email,
      phone: newUserData.phone,
      pin: newUserData.pin || '1234',
      active: true,
      avatarColor,
      initials,
      isOwner: false,
      permissions: {
        allAccess: true,
        manageUsers: true,
        manageQuotes: true,
        manageInventory: true,
        accessGoogleSheets: true,
      },
    });

    setUsersList(getAdminUsers());
    setShowNewUserModal(false);
    setNewUserData({
      name: '',
      role: 'Administrador Técnico',
      title: 'Asesor Técnico Especializado',
      email: '',
      phone: '+57 ',
      pin: '1234',
    });
    onNotify?.('Nuevo administrador agregado con éxito');
  };

  const handleDeleteUser = (user: AdminUser) => {
    if (confirm(`¿Estás seguro de eliminar a ${user.name} del sistema administrativo?`)) {
      try {
        deleteAdminUser(user.id);
        setUsersList(getAdminUsers());
        onNotify?.(`Usuario ${user.name} eliminado.`);
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Error al eliminar usuario.');
      }
    }
  };

  // Google Sheets Export of Team
  const handleSyncUsersSheets = async () => {
    setSyncingSheets(true);
    try {
      await syncUsersToGoogleSheets();
      onNotify?.('¡Personal del equipo exportado exitosamente a Google Sheets!');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al sincronizar con Google Sheets');
    } finally {
      setSyncingSheets(false);
    }
  };

  // Quotes management
  const handleUpdateQuoteStatus = (id: string, newStatus: CustomerQuoteRecord['status']) => {
    const updated = quotesList.map((q) => (q.id === id ? { ...q, status: newStatus } : q));
    setQuotesList(updated);
    addActivityLog({
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'Estado Cotización',
      details: `${currentUser.name} actualizó cotización ${id} a estado ${newStatus}`,
      category: 'quotes',
    });
    onNotify?.(`Cotización ${id} actualizada a ${newStatus}`);
  };

  const handleAssignQuote = (id: string, advisorName: string) => {
    const updated = quotesList.map((q) => (q.id === id ? { ...q, assignedTo: advisorName } : q));
    setQuotesList(updated);
    addActivityLog({
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'Asignación Cotización',
      details: `Cotización ${id} asignada a ${advisorName}`,
      category: 'quotes',
    });
    onNotify?.(`Cotización asignada a ${advisorName}`);
  };

  const filteredQuotes = quotesList.filter((q) => {
    if (statusFilter === 'all') return true;
    return q.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0e121b] border border-slate-700/80 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[94vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Navbar Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#121826] via-[#0f131f] to-[#121826]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-950/40 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white font-serif tracking-tight">
                  Panel de Administración Integral
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="w-3 h-3" />
                  Acceso Total (100%)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Racores y Mangueras de Nariño • Sistema de Gestión de Personal & Operaciones
              </p>
            </div>
          </div>

          {/* Current User Pill & Session Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <div className="bg-[#161d2d] border border-slate-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2.5 shadow-sm">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentUser.avatarColor} text-white font-bold flex items-center justify-center text-xs shadow`}>
                {currentUser.initials}
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <span className="text-xs font-bold text-white block">{currentUser.name}</span>
                <span className="text-[10px] text-amber-400 font-semibold">{currentUser.role}</span>
              </div>
            </div>

            <button
              onClick={onSwitchUser}
              className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Cambiar de empleado activo"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Cambiar Usuario</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              aria-label="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-[#090c12] px-4 sm:px-6 overflow-x-auto text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'users'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Gestión de Personal ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'quotes'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Cotizaciones ({quotesList.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'inventory'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            Catálogo & Bodega ({inventoryList.length})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'activity'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Google Sheets & Bitácora
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-[#0a0d14]">
          {/* TAB 1: GESTIÓN DE PERSONAL */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Header and Quick Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111623] border border-slate-800 rounded-2xl p-4 sm:p-5">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>Equipo de Administradores Autorizados</span>
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                      {usersList.length} Miembros
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Cada uno de los siguientes miembros del equipo tiene <strong>acceso total (100%)</strong> al panel administrativo, cotizaciones, inventario y sincronización con Google Sheets.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleSyncUsersSheets}
                    disabled={syncingSheets}
                    className="px-3.5 py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                    title="Exportar la lista completa de personal a una nueva pestaña en Google Sheets"
                  >
                    <FileSpreadsheet className={`w-4 h-4 ${syncingSheets ? 'animate-spin' : ''}`} />
                    <span>Sincronizar con Google Sheets</span>
                  </button>

                  <button
                    onClick={() => setShowNewUserModal(true)}
                    className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir Empleado</span>
                  </button>
                </div>
              </div>

              {/* Users Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {usersList.map((user) => {
                  const isCurrent = user.id === currentUser.id;
                  const isPinVisible = !!showPins[user.id];

                  return (
                    <div
                      key={user.id}
                      className={`rounded-2xl border transition-all p-5 flex flex-col justify-between relative overflow-hidden ${
                        isCurrent
                          ? 'bg-[#151c2d] border-amber-500/50 shadow-xl shadow-amber-950/20 ring-1 ring-amber-500/30'
                          : 'bg-[#121622] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isCurrent && (
                        <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-bl-xl uppercase tracking-wider">
                          Sesión Actual
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${user.avatarColor} text-white font-bold flex items-center justify-center text-base shadow-md shrink-0`}>
                            {user.initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-base text-white truncate">{user.name}</h4>
                              {user.isOwner && (
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold shrink-0">
                                  Dueño
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-amber-400/90 truncate">{user.role}</p>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.title}</p>
                          </div>
                        </div>

                        {/* Contact details */}
                        <div className="space-y-1.5 text-xs text-slate-300 bg-[#0c0f17] p-3 rounded-xl border border-slate-800/80">
                          <div className="flex items-center justify-between text-slate-400">
                            <span className="flex items-center gap-1.5 truncate">
                              <Phone className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-slate-200">{user.phone}</span>
                            </span>
                            <span className="text-[10px] text-slate-500">Pasto / Nariño</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-slate-400 truncate pt-1 border-t border-slate-800/60">
                            <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="text-slate-300 truncate text-[11px]">{user.email}</span>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                            <span className="flex items-center gap-1.5 text-slate-400">
                              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                              <span>PIN de Acceso:</span>
                            </span>
                            <div className="flex items-center gap-1 font-mono">
                              <span className="font-bold text-white">
                                {isPinVisible ? user.pin : '••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setShowPins((prev) => ({ ...prev, [user.id]: !prev[user.id] }))
                                }
                                className="text-slate-500 hover:text-slate-300 p-0.5"
                                title="Mostrar/Ocultar PIN"
                              >
                                {isPinVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Acceso Total 100%</span>
                          </span>
                          <span className="text-slate-400">
                            Estado: {user.active ? (
                              <span className="text-emerald-400 font-semibold">Activo</span>
                            ) : (
                              <span className="text-red-400 font-semibold">Inactivo</span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-800">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3 text-amber-400" />
                            <span>Editar</span>
                          </button>

                          <button
                            onClick={() => handleToggleActive(user)}
                            className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                              user.active
                                ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                            }`}
                          >
                            {user.active ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>

                        {!user.isOwner && (
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: GESTIÓN DE COTIZACIONES */}
          {activeTab === 'quotes' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111623] p-4 rounded-xl border border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Cotizaciones Recibidas de Clientes</span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      {quotesList.length} Totales
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Asigna asesores técnicos del equipo, gestiona el estado y registra observaciones técnicas.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Filtrar:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#0c0f17] border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">Todas las cotizaciones</option>
                    <option value="Pendiente">Pendientes</option>
                    <option value="En Gestión">En Gestión</option>
                    <option value="Cotizado">Cotizadas</option>
                    <option value="Cerrado">Cerradas</option>
                  </select>
                </div>
              </div>

              {/* Quotes Cards / Table */}
              <div className="space-y-3">
                {filteredQuotes.length === 0 ? (
                  <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
                    No hay cotizaciones con el filtro seleccionado.
                  </div>
                ) : (
                  filteredQuotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="bg-[#121622] border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-amber-400 font-extrabold text-sm bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                            {quote.id}
                          </span>
                          <div>
                            <h4 className="font-bold text-sm text-white">{quote.clientName}</h4>
                            <span className="text-xs text-slate-400 font-medium">
                              {quote.companyName} • {quote.city} • Sector: {quote.sector}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">Estado:</span>
                          <select
                            value={quote.status}
                            onChange={(e) =>
                              handleUpdateQuoteStatus(
                                quote.id,
                                e.target.value as CustomerQuoteRecord['status']
                              )
                            }
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                              quote.status === 'Pendiente'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : quote.status === 'En Gestión'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                : quote.status === 'Cotizado'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-slate-700/50 text-slate-300 border-slate-600'
                            }`}
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Gestión">En Gestión</option>
                            <option value="Cotizado">Cotizado</option>
                            <option value="Cerrado">Cerrado</option>
                          </select>
                        </div>
                      </div>

                      {/* Items and description */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="md:col-span-2 bg-[#0a0d14] p-3 rounded-lg border border-slate-800/80">
                          <span className="text-slate-400 block mb-1 font-semibold">Productos Requeridos:</span>
                          <p className="text-slate-200 font-medium">{quote.itemsSummary}</p>
                          {quote.notes && (
                            <p className="text-slate-400 text-[11px] mt-1 italic">
                              "Observación cliente: {quote.notes}"
                            </p>
                          )}
                        </div>

                        {/* Advisor Assignment */}
                        <div className="bg-[#0a0d14] p-3 rounded-lg border border-slate-800/80 space-y-2">
                          <span className="text-slate-400 block font-semibold">Asesor Asignado:</span>
                          <select
                            value={quote.assignedTo || ''}
                            onChange={(e) => handleAssignQuote(quote.id, e.target.value)}
                            className="w-full bg-[#141a27] border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-amber-500"
                          >
                            <option value="">Sin Asignar</option>
                            {usersList.map((u) => (
                              <option key={u.id} value={u.name}>
                                {u.name} ({u.role.split('/')[0]})
                              </option>
                            ))}
                          </select>

                          <div className="flex items-center gap-2 pt-1">
                            <a
                              href={`https://wa.me/57${quote.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Hola ${quote.clientName}, te saluda ${currentUser.name} de Racores y Mangueras de Nariño en Pasto. Respecto a tu cotización ${quote.id}:`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg py-1.5 px-2 text-center font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                            >
                              <MessageSquare className="w-3 h-3 text-emerald-400" />
                              <span>WhatsApp</span>
                            </a>
                            <a
                              href={`tel:${quote.phone}`}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg py-1.5 px-2.5 text-center text-[11px] flex items-center justify-center gap-1 transition-colors"
                            >
                              <Phone className="w-3 h-3 text-amber-400" />
                              <span>Llamar</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: INVENTARIO Y CATÁLOGO */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#111623] p-4 rounded-xl border border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">Inventario Técnico de Bodega Pasto</h3>
                  <p className="text-xs text-slate-400">
                    Control de referencias para mangueras, racores y acoples.
                  </p>
                </div>
                <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
                  {inventoryList.length} Referencias Activas
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#141a27] text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Ref</th>
                      <th className="py-3 px-4">Categoría</th>
                      <th className="py-3 px-4">Nombre y Medidas</th>
                      <th className="py-3 px-4">Especificaciones</th>
                      <th className="py-3 px-4">Estado Bodega</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-[#0d1017]">
                    {inventoryList.slice(0, 15).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-mono font-bold text-amber-400">
                          RYM-{String(item.id).padStart(4, '0')}
                        </td>
                        <td className="py-3 px-4 text-slate-400">{item.category}</td>
                        <td className="py-3 px-4 font-bold text-white">{item.name}</td>
                        <td className="py-3 px-4 text-slate-300">{item.specs}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            En Bodega Pasto
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: GOOGLE SHEETS & BITÁCORA */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              {/* Google Sheets Status */}
              <div className="bg-[#121724] border border-slate-800 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                      <FileSpreadsheet className="w-4 h-4" />
                      Base de Datos en Google Sheets
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {dbInfo?.title || 'Racores y Mangueras de Nariño - Base de Datos'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      ID: {dbInfo?.spreadsheetId || 'Conexión activa mediante OAuth 2.0'}
                    </p>
                  </div>

                  {dbInfo?.spreadsheetUrl && (
                    <a
                      href={dbInfo.spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Abrir Hoja en Drive</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Bitácora de Actividad */}
              <div className="bg-[#121622] border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Bitácora de Actividades del Equipo Administrativo
                </h4>

                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {activityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-[#0a0d14] border border-slate-800/80 rounded-xl p-3 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{log.userName}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                            {log.action}
                          </span>
                        </div>
                        <p className="text-slate-300 mt-0.5">{log.details}</p>
                      </div>
                      <span className="text-[11px] text-slate-500 shrink-0 font-mono">
                        {log.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0c0f16] flex items-center justify-between text-xs text-slate-400">
          <span>
            Sesión actual: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition-colors cursor-pointer"
          >
            Cerrar Panel
          </button>
        </div>
      </div>

      {/* MODAL: EDITAR USUARIO */}
      {editingUser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121622] border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white">Editar Perfil de Administrador</h4>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Cargo / Especialidad:</label>
                <input
                  type="text"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Título Descriptivo:</label>
                <input
                  type="text"
                  value={editingUser.title}
                  onChange={(e) => setEditingUser({ ...editingUser, title: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Teléfono:</label>
                  <input
                    type="text"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">PIN de Acceso:</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={editingUser.pin}
                    onChange={(e) => setEditingUser({ ...editingUser, pin: e.target.value })}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Correo:</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AÑADIR NUEVO USUARIO */}
      {showNewUserModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121622] border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white">Añadir Nuevo Administrador</h4>
              <button onClick={() => setShowNewUserModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  placeholder="Ej: Andrés Pantoja"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Cargo / Especialidad:</label>
                <input
                  type="text"
                  placeholder="Ej: Administrador Técnico"
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Título Descriptivo:</label>
                <input
                  type="text"
                  placeholder="Ej: Asesor Técnico de Mostrador"
                  value={newUserData.title}
                  onChange={(e) => setNewUserData({ ...newUserData, title: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Teléfono:</label>
                  <input
                    type="text"
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">PIN de Acceso:</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={newUserData.pin}
                    onChange={(e) => setNewUserData({ ...newUserData, pin: e.target.value })}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Correo Electrónico:</label>
                <input
                  type="email"
                  placeholder="empleado@racoresymanguerasdenarino.com"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                ℹ️ El nuevo empleado tendrá acceso total (100%) a todo el panel administrativo, cotizaciones y catálogo.
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewUserModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400"
                >
                  Crear Administrador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
