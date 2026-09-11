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
  EyeOff,
  DollarSign,
  Truck,
  Receipt,
  Lock,
  Calendar,
  Building2,
  TrendingUp,
  MapPin,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { 
  AdminUser, 
  CustomerQuoteRecord, 
  Product, 
  AccountingRecord, 
  LogisticsOrderRecord 
} from '../types';
import Logo from './Logo';
import { 
  getAdminUsers, 
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
import { 
  getAccountingRecords, 
  addAccountingRecord, 
  updateAccountingRecord, 
  deleteAccountingRecord 
} from '../services/accountingService';
import { 
  getLogisticsOrders, 
  addLogisticsOrder, 
  updateLogisticsOrder, 
  deleteLogisticsOrder 
} from '../services/logisticsService';
import { products as initialProducts } from '../data/catalogData';

interface AdminPanelModalProps {
  isOpen: boolean;
  currentUser: AdminUser;
  onClose: () => void;
  onSwitchUser: () => void;
  onLogout: () => void;
  onNotify?: (msg: string) => void;
}

type TabType = 'quotes' | 'accounting' | 'logistics' | 'users' | 'activity';

export default function AdminPanelModal({
  isOpen,
  currentUser,
  onClose,
  onSwitchUser,
  onLogout,
  onNotify,
}: AdminPanelModalProps) {
  // Determine appropriate initial tab based on role
  const getDefaultTab = (): TabType => {
    if (currentUser.isOwner) return 'quotes';
    if (currentUser.id === 'usr-juan-felipe-piscal') return 'accounting';
    if (currentUser.id === 'usr-lucero-adriana-ibarra') return 'logistics';
    return 'quotes';
  };

  const [activeTab, setActiveTab] = useState<TabType>(getDefaultTab());
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [quotesList, setQuotesList] = useState<CustomerQuoteRecord[]>([]);
  const [inventoryList, setInventoryList] = useState<Product[]>([]);
  const [accountingList, setAccountingList] = useState<AccountingRecord[]>([]);
  const [logisticsList, setLogisticsList] = useState<LogisticsOrderRecord[]>([]);
  const [activityLogs, setActivityLogs] = useState(getActivityLogs());
  const [syncingSheets, setSyncingSheets] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [logisticsFilter, setLogisticsFilter] = useState<string>('all');
  const [accountingFilter, setAccountingFilter] = useState<string>('all');

  // Modals state
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showPins, setShowPins] = useState<Record<string, boolean>>({});
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);
  const [showNewAccountingModal, setShowNewAccountingModal] = useState(false);
  const [showNewLogisticsModal, setShowNewLogisticsModal] = useState(false);
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [myNewPin, setMyNewPin] = useState('');

  // Forms state
  const [newUserData, setNewUserData] = useState({
    name: '',
    role: 'Ventas',
    title: 'Asesor Comercial de Ventas',
    email: '',
    phone: '+57 ',
    pin: '1234',
  });

  const [newQuoteData, setNewQuoteData] = useState({
    clientName: '',
    companyName: '',
    phone: '+57 ',
    email: '',
    city: 'Pasto',
    sector: 'Transporte y Carga Pesada',
    requestType: 'Mangueras Hidráulicas',
    itemsSummary: '',
    notes: '',
  });

  const [newAccountingData, setNewAccountingData] = useState({
    invoiceNumber: '',
    clientName: '',
    concept: '',
    amount: 0,
    paymentMethod: 'Transferencia Bancolombia' as AccountingRecord['paymentMethod'],
    status: 'Cobrado' as AccountingRecord['status'],
    notes: '',
  });

  const [newLogisticsData, setNewLogisticsData] = useState({
    clientName: '',
    destinationCity: 'Ipiales, Nariño',
    carrier: 'Transipiales Carga',
    trackingNumber: '',
    itemsSummary: '',
    status: 'En Alistamiento' as LogisticsOrderRecord['status'],
    estimatedDelivery: 'En 24 horas',
    shippingCost: 35000,
    notes: '',
  });

  // Permissions helpers
  const isOwner = !!currentUser.isOwner || !!currentUser.permissions.canDeleteAll;
  const canManageAccounting = isOwner || !!currentUser.permissions.manageAccounting;
  const canManageLogistics = isOwner || !!currentUser.permissions.manageLogistics;
  const canManageQuotes = isOwner || !!currentUser.permissions.manageQuotes;
  const canManageUsers = isOwner || !!currentUser.permissions.manageUsers;

  // Load data
  useEffect(() => {
    if (isOpen) {
      loadAllData();
      setActiveTab(getDefaultTab());
    }
  }, [isOpen, currentUser.id]);

  const loadAllData = async () => {
    setUsersList(getAdminUsers());
    setActivityLogs(getActivityLogs());
    setInventoryList(initialProducts);
    setAccountingList(getAccountingRecords());
    setLogisticsList(getLogisticsOrders());

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
        sector: 'Construcción y Movimiento de Tierras',
        requestType: 'Ensamble de 4 Espirales R12',
        itemsSummary: '4x Manguera 4 Espirales R12 3/4" + 8x Terminales Brida Código 61',
        totalQuantity: 12,
        notes: 'Para retroexcavadora Caterpillar 320D trabajando en vía Panamericana.',
        status: 'Pendiente',
        assignedTo: 'Joan Sebastian Piscal',
        internalNotes: 'Esperando muestra física en el mostrador.',
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

  // User Actions (Restricted to Libardo Legarda)
  const handleToggleActive = (user: AdminUser) => {
    if (!isOwner) {
      alert('Solo el dueño y administrador general (Libardo Legarda) puede modificar el estado de los usuarios.');
      return;
    }
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
    if (!isOwner) {
      alert('Solo el dueño y administrador general (Libardo Legarda) puede editar perfiles.');
      return;
    }
    if (!editingUser) return;
    updateAdminUser(editingUser);
    setUsersList(getAdminUsers());
    setEditingUser(null);
    onNotify?.(`Perfil de ${editingUser.name} actualizado con éxito`);
  };

  const handleCreateUser = (e: FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      alert('Solo el dueño y administrador general (Libardo Legarda) puede crear nuevos usuarios.');
      return;
    }
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
        allAccess: false,
        canDeleteAll: false,
        manageUsers: false,
        manageQuotes: true,
        manageAccounting: false,
        manageInventory: false,
        manageLogistics: false,
        accessGoogleSheets: false,
      },
    });

    setUsersList(getAdminUsers());
    setShowNewUserModal(false);
    setNewUserData({
      name: '',
      role: 'Ventas',
      title: 'Asesor Comercial de Ventas',
      email: '',
      phone: '+57 ',
      pin: '1234',
    });
    onNotify?.('Nuevo asesor agregado con éxito');
  };

  const handleDeleteUser = (user: AdminUser) => {
    if (!isOwner) {
      alert('Solo el dueño y administrador general (Libardo Legarda) tiene permisos para eliminar usuarios.');
      return;
    }
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

  const handleChangeMyPin = (e: FormEvent) => {
    e.preventDefault();
    if (!myNewPin || myNewPin.length < 4) {
      alert('El PIN debe contener al menos 4 números o caracteres.');
      return;
    }
    const updated = { ...currentUser, pin: myNewPin };
    updateAdminUser(updated);
    setUsersList(getAdminUsers());
    setShowChangePinModal(false);
    setMyNewPin('');
    onNotify?.('Tu PIN de seguridad ha sido actualizado con éxito');
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

  const handleDeleteQuote = (id: string) => {
    if (!isOwner) {
      alert('Acceso restringido: Solo el dueño y administrador (Libardo Legarda) puede eliminar cotizaciones.');
      return;
    }
    if (confirm(`¿Estás seguro de eliminar permanentemente la cotización ${id}?`)) {
      const updated = quotesList.filter((q) => q.id !== id);
      setQuotesList(updated);
      addActivityLog({
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'Eliminación Cotización',
        details: `${currentUser.name} eliminó permanentemente la cotización ${id}`,
        category: 'quotes',
      });
      onNotify?.(`Cotización ${id} eliminada.`);
    }
  };

  const handleCreateQuote = (e: FormEvent) => {
    e.preventDefault();
    if (!newQuoteData.clientName.trim() || !newQuoteData.itemsSummary.trim()) return;

    const newId = `COT-${Math.floor(8900 + Math.random() * 1000)}`;
    const newRecord: CustomerQuoteRecord = {
      id: newId,
      timestamp: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      clientName: newQuoteData.clientName,
      companyName: newQuoteData.companyName || 'Particular / Taller',
      phone: newQuoteData.phone,
      email: newQuoteData.email || 'sin-correo@pasto.com',
      city: newQuoteData.city,
      sector: newQuoteData.sector,
      requestType: newQuoteData.requestType,
      itemsSummary: newQuoteData.itemsSummary,
      totalQuantity: 1,
      notes: newQuoteData.notes,
      status: 'En Gestión',
      assignedTo: currentUser.name,
      internalNotes: `Registrada en mostrador por ${currentUser.name}`,
    };

    setQuotesList([newRecord, ...quotesList]);
    setShowNewQuoteModal(false);
    setNewQuoteData({
      clientName: '',
      companyName: '',
      phone: '+57 ',
      email: '',
      city: 'Pasto',
      sector: 'Transporte y Carga Pesada',
      requestType: 'Mangueras Hidráulicas',
      itemsSummary: '',
      notes: '',
    });

    addActivityLog({
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'Nueva Cotización',
      details: `${currentUser.name} registró cotización ${newId} para ${newRecord.clientName}`,
      category: 'quotes',
    });

    onNotify?.(`Cotización ${newId} creada con éxito`);
  };

  // Accounting management (Juan Felipe Piscal & Libardo Legarda)
  const handleCreateAccounting = (e: FormEvent) => {
    e.preventDefault();
    if (!canManageAccounting) {
      alert('Acceso restringido: Solo Juan Felipe Piscal y Libardo Legarda gestionan Contabilidad.');
      return;
    }
    if (!newAccountingData.clientName.trim() || !newAccountingData.concept.trim()) return;

    const created = addAccountingRecord(
      {
        date: new Date().toLocaleDateString('es-CO'),
        invoiceNumber: newAccountingData.invoiceNumber || `FE-${Date.now().toString().slice(-4)}`,
        clientName: newAccountingData.clientName,
        concept: newAccountingData.concept,
        amount: Number(newAccountingData.amount) || 0,
        paymentMethod: newAccountingData.paymentMethod,
        status: newAccountingData.status,
        recordedBy: currentUser.name,
        notes: newAccountingData.notes,
      },
      currentUser.id,
      currentUser.name
    );

    setAccountingList(getAccountingRecords());
    setShowNewAccountingModal(false);
    setNewAccountingData({
      invoiceNumber: '',
      clientName: '',
      concept: '',
      amount: 0,
      paymentMethod: 'Transferencia Bancolombia',
      status: 'Cobrado',
      notes: '',
    });
    onNotify?.(`Venta/Factura ${created.invoiceNumber} registrada con éxito`);
  };

  const handleUpdateAccountingStatus = (id: string, status: AccountingRecord['status']) => {
    if (!canManageAccounting) return;
    const item = accountingList.find((a) => a.id === id);
    if (!item) return;
    const updated = { ...item, status };
    updateAccountingRecord(updated, currentUser.id, currentUser.name);
    setAccountingList(getAccountingRecords());
    onNotify?.(`Estado de factura ${item.invoiceNumber} actualizado a ${status}`);
  };

  const handleDeleteAccounting = (id: string) => {
    if (!isOwner) {
      alert('Acceso restringido: Solo el dueño y administrador (Libardo Legarda) puede eliminar registros contables.');
      return;
    }
    if (confirm('¿Estás seguro de eliminar este registro contable permanentemente?')) {
      deleteAccountingRecord(id, currentUser.id, currentUser.name);
      setAccountingList(getAccountingRecords());
      onNotify?.('Registro contable eliminado.');
    }
  };

  // Logistics & Orders management (Lucero Adriana Ibarra & Libardo Legarda)
  const handleCreateLogistics = (e: FormEvent) => {
    e.preventDefault();
    if (!canManageLogistics) {
      alert('Acceso restringido: Solo Lucero Adriana Ibarra y Libardo Legarda gestionan Inventarios y Logística.');
      return;
    }
    if (!newLogisticsData.clientName.trim() || !newLogisticsData.destinationCity.trim()) return;

    const created = addLogisticsOrder(
      {
        orderDate: new Date().toLocaleDateString('es-CO'),
        clientName: newLogisticsData.clientName,
        destinationCity: newLogisticsData.destinationCity,
        carrier: newLogisticsData.carrier,
        trackingNumber: newLogisticsData.trackingNumber || `GUIA-${Math.floor(100000 + Math.random() * 900000)}`,
        itemsSummary: newLogisticsData.itemsSummary,
        status: newLogisticsData.status,
        estimatedDelivery: newLogisticsData.estimatedDelivery || 'En 24 horas',
        managedBy: currentUser.name,
        shippingCost: Number(newLogisticsData.shippingCost) || 0,
        notes: newLogisticsData.notes,
      },
      currentUser.id,
      currentUser.name
    );

    setLogisticsList(getLogisticsOrders());
    setShowNewLogisticsModal(false);
    setNewLogisticsData({
      clientName: '',
      destinationCity: 'Ipiales, Nariño',
      carrier: 'Transipiales Carga',
      trackingNumber: '',
      itemsSummary: '',
      status: 'En Alistamiento',
      estimatedDelivery: 'En 24 horas',
      shippingCost: 35000,
      notes: '',
    });
    onNotify?.(`Despacho ${created.id} programado con éxito`);
  };

  const handleUpdateLogisticsStatus = (id: string, status: LogisticsOrderRecord['status']) => {
    if (!canManageLogistics) return;
    const item = logisticsList.find((l) => l.id === id);
    if (!item) return;
    const updated = { ...item, status };
    updateLogisticsOrder(updated, currentUser.id, currentUser.name);
    setLogisticsList(getLogisticsOrders());
    onNotify?.(`Despacho ${item.id} actualizado a "${status}"`);
  };

  const handleDeleteLogistics = (id: string) => {
    if (!isOwner) {
      alert('Acceso restringido: Solo el dueño y administrador (Libardo Legarda) puede eliminar despachos.');
      return;
    }
    if (confirm(`¿Estás seguro de eliminar el despacho ${id} permanentemente?`)) {
      deleteLogisticsOrder(id, currentUser.id, currentUser.name);
      setLogisticsList(getLogisticsOrders());
      onNotify?.(`Despacho eliminado.`);
    }
  };

  // Filtered lists
  const filteredQuotes = quotesList.filter((q) => {
    if (statusFilter === 'all') return true;
    return q.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const filteredLogistics = logisticsList.filter((l) => {
    if (logisticsFilter === 'all') return true;
    return l.status.toLowerCase() === logisticsFilter.toLowerCase();
  });

  const filteredAccounting = accountingList.filter((a) => {
    if (accountingFilter === 'all') return true;
    return a.status.toLowerCase() === accountingFilter.toLowerCase();
  });

  const totalBilled = accountingList
    .filter((a) => a.status === 'Cobrado')
    .reduce((sum, a) => sum + a.amount, 0);

  const pendingCollection = accountingList
    .filter((a) => a.status === 'Pendiente')
    .reduce((sum, a) => sum + a.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0e121b] border border-slate-700/80 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[94vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Navbar Header */}
        <div className="p-4 sm:p-5 border-b border-[#122e66] flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#0a1b38] via-[#071328] to-[#0a1b38]">
          <div className="flex items-center gap-3.5">
            <div className="p-1 rounded-full bg-[#0b2559] border border-[#ffd200]/40 shadow-lg shadow-[#040a16] shrink-0">
              <Logo size="sm" variant="badge" invertSloganForDark={true} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight">
                  Panel de Administración & Operaciones
                </h2>
                {isOwner ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-[#ffd200]/15 text-[#ffd200] border border-[#ffd200]/40">
                    <Sparkles className="w-3 h-3 text-[#ffd200]" />
                    Libardo Legarda (Dueño - Acceso Total)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                    {currentUser.role}
                  </span>
                )}
                <span className="text-[11px] font-bold text-[#ffd200] tracking-wider uppercase bg-[#091b3b] px-2 py-0.5 rounded border border-[#163878]">
                  ★ Calidad y Servicio ★
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Racores y Mangueras de Nariño S.A.S. • Pasto, Nariño
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
              onClick={() => setShowChangePinModal(true)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Cambiar mi PIN de seguridad"
            >
              <KeyRound className="w-4 h-4" />
            </button>

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

        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-slate-800 bg-[#090c12] px-4 sm:px-6 overflow-x-auto text-xs sm:text-sm">
          {/* TAB 1: VENTAS & COTIZACIONES */}
          <button
            onClick={() => setActiveTab('quotes')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'quotes'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Ventas & Cotizaciones ({quotesList.length})
          </button>

          {/* TAB 2: VENTAS & CONTABILIDAD */}
          <button
            onClick={() => setActiveTab('accounting')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'accounting'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Ventas & Contabilidad</span>
            {canManageAccounting && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                Activo
              </span>
            )}
          </button>

          {/* TAB 3: INVENTARIOS, LOGÍSTICA & PEDIDOS */}
          <button
            onClick={() => setActiveTab('logistics')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'logistics'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="w-4 h-4 text-cyan-400" />
            <span>Inventarios, Logística & Pedidos</span>
            {canManageLogistics && (
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-bold">
                Activo
              </span>
            )}
          </button>

          {/* TAB 4: GESTIÓN DE PERSONAL */}
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-4 font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'users'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gestión de Personal ({usersList.length})</span>
            {isOwner && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                Dueño
              </span>
            )}
          </button>

          {/* TAB 5: GOOGLE SHEETS & AUDITORÍA */}
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
          {/* ========================================================================= */}
          {/* TAB 1: VENTAS & COTIZACIONES */}
          {/* ========================================================================= */}
          {activeTab === 'quotes' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111623] p-4 rounded-xl border border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-amber-400" />
                    <span>Gestión Comercial de Cotizaciones & Ventas</span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      {quotesList.length} Solicitudes
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Atención técnica de clientes, asignación a asesores y contacto rápido por WhatsApp o llamada directa.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Filtrar:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-[#0c0f17] border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500"
                    >
                      <option value="all">Todas</option>
                      <option value="Pendiente">Pendientes</option>
                      <option value="En Gestión">En Gestión</option>
                      <option value="Cotizado">Cotizadas</option>
                      <option value="Cerrado">Cerradas</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setShowNewQuoteModal(true)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nueva Cotización</span>
                  </button>
                </div>
              </div>

              {/* Quotes List */}
              <div className="space-y-3">
                {filteredQuotes.length === 0 ? (
                  <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
                    No se encontraron cotizaciones con el filtro seleccionado.
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
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-white">{quote.clientName}</h4>
                              <span className="text-[11px] text-slate-400 font-mono">({quote.timestamp})</span>
                            </div>
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

                          {/* Delete Button: ONLY for Libardo Legarda */}
                          {isOwner && (
                            <button
                              onClick={() => handleDeleteQuote(quote.id)}
                              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer ml-1"
                              title="Eliminar cotización (Permiso exclusivo de Libardo Legarda)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Items and description */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="md:col-span-2 bg-[#0a0d14] p-3 rounded-lg border border-slate-800/80">
                          <span className="text-slate-400 block mb-1 font-semibold">Productos & Mangueras Requeridas:</span>
                          <p className="text-slate-200 font-medium">{quote.itemsSummary}</p>
                          {quote.notes && (
                            <p className="text-slate-400 text-[11px] mt-1 italic">
                              "Observación: {quote.notes}"
                            </p>
                          )}
                          {quote.internalNotes && (
                            <p className="text-amber-400/90 text-[11px] mt-1 font-medium">
                              Nota Interna: {quote.internalNotes}
                            </p>
                          )}
                        </div>

                        {/* Advisor Assignment & Direct Contact */}
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
                                {u.name} ({u.role})
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

          {/* ========================================================================= */}
          {/* TAB 2: VENTAS & CONTABILIDAD */}
          {/* ========================================================================= */}
          {activeTab === 'accounting' && (
            <div className="space-y-6">
              {/* Top Banner with Responsible Person */}
              <div className="bg-[#111623] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span>Módulo de Ventas y Contabilidad</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      Encargado: Juan Felipe Piscal • Supervisión: Libardo Legarda
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Facturación, Balances de Ventas & Registro de Cobros
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Control financiero de ensambles de mangueras hidráulicas, racores y acoples en la sede Pasto.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {canManageAccounting && (
                    <button
                      onClick={() => setShowNewAccountingModal(true)}
                      className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Registrar Venta / Factura</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Financial Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#121622] border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Total Facturado / Cobrado:</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    ${totalBilled.toLocaleString('es-CO')}
                  </div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Ingresos liquidados a satisfacción</span>
                  </div>
                </div>

                <div className="bg-[#121622] border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Cuentas por Cobrar / Pendientes:</span>
                    <Receipt className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-amber-400 font-mono">
                    ${pendingCollection.toLocaleString('es-CO')}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Créditos a talleres o empresas constructoras
                  </div>
                </div>

                <div className="bg-[#121622] border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Total Comprobantes Registrados:</span>
                    <Building2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {accountingList.length}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Registros con soportes de pago
                  </div>
                </div>
              </div>

              {/* Filter & Accounting Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-amber-400" />
                    <span>Libro de Ventas & Facturas</span>
                  </h4>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Estado:</span>
                    <select
                      value={accountingFilter}
                      onChange={(e) => setAccountingFilter(e.target.value)}
                      className="bg-[#0c0f17] border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="Cobrado">Cobrados</option>
                      <option value="Pendiente">Pendientes</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#141a27] text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Factura / ID</th>
                        <th className="py-3 px-4">Fecha</th>
                        <th className="py-3 px-4">Cliente / Empresa</th>
                        <th className="py-3 px-4">Concepto Ensamble</th>
                        <th className="py-3 px-4">Valor Total</th>
                        <th className="py-3 px-4">Medio de Pago</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4">Responsable</th>
                        {isOwner && <th className="py-3 px-4 text-right">Acciones</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-[#0d1017]">
                      {filteredAccounting.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-800/30">
                          <td className="py-3 px-4 font-mono font-bold text-amber-400">
                            {rec.invoiceNumber}
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono">{rec.date}</td>
                          <td className="py-3 px-4 font-bold text-white">{rec.clientName}</td>
                          <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{rec.concept}</td>
                          <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                            ${rec.amount.toLocaleString('es-CO')}
                          </td>
                          <td className="py-3 px-4 text-slate-400">{rec.paymentMethod}</td>
                          <td className="py-3 px-4">
                            {canManageAccounting ? (
                              <select
                                value={rec.status}
                                onChange={(e) =>
                                  handleUpdateAccountingStatus(
                                    rec.id,
                                    e.target.value as AccountingRecord['status']
                                  )
                                }
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border focus:outline-none cursor-pointer ${
                                  rec.status === 'Cobrado'
                                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                }`}
                              >
                                <option value="Cobrado">Cobrado</option>
                                <option value="Pendiente">Pendiente</option>
                              </select>
                            ) : (
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                                  rec.status === 'Cobrado'
                                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                }`}
                              >
                                {rec.status}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-400">{rec.recordedBy}</td>
                          {isOwner && (
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleDeleteAccounting(rec.id)}
                                className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                title="Eliminar registro (Permiso exclusivo de Libardo Legarda)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: INVENTARIOS, LOGÍSTICA & PEDIDOS */}
          {/* ========================================================================= */}
          {activeTab === 'logistics' && (
            <div className="space-y-6">
              {/* Top Banner with Responsible Person */}
              <div className="bg-[#111623] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    <Truck className="w-4 h-4" />
                    <span>Módulo de Inventarios, Logística & Pedidos</span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
                      Encargada: Lucero Adriana Ibarra • Supervisión: Libardo Legarda
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Despachos a Municipios de Nariño/Putumayo & Stock Bodega Pasto
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Seguimiento a transportadoras (Transipiales, Cootranar, Envía), guías de carga y stock en bodega central.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {canManageLogistics && (
                    <button
                      onClick={() => setShowNewLogisticsModal(true)}
                      className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-cyan-500/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Programar Despacho</span>
                    </button>
                  )}
                </div>
              </div>

              {/* SECTION A: DESPACHOS DEPARTAMENTALES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Truck className="w-4 h-4 text-cyan-400" />
                    <span>Control de Despachos Departamentales ({logisticsList.length})</span>
                  </h4>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Estado:</span>
                    <select
                      value={logisticsFilter}
                      onChange={(e) => setLogisticsFilter(e.target.value)}
                      className="bg-[#0c0f17] border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="all">Todos</option>
                      <option value="En Alistamiento">En Alistamiento</option>
                      <option value="Despachado">Despachado</option>
                      <option value="En Tránsito">En Tránsito</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredLogistics.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-[#121622] border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-cyan-400 font-bold text-xs bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                              {ord.id}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">({ord.orderDate})</span>
                          </div>
                          <h5 className="font-bold text-sm text-white mt-1">{ord.clientName}</h5>
                          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mt-0.5">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span>{ord.destinationCity}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {canManageLogistics ? (
                            <select
                              value={ord.status}
                              onChange={(e) =>
                                handleUpdateLogisticsStatus(
                                  ord.id,
                                  e.target.value as LogisticsOrderRecord['status']
                                )
                              }
                              className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                                ord.status === 'Entregado'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : ord.status === 'En Tránsito'
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              }`}
                            >
                              <option value="En Alistamiento">En Alistamiento</option>
                              <option value="Despachado">Despachado</option>
                              <option value="En Tránsito">En Tránsito</option>
                              <option value="Entregado">Entregado</option>
                            </select>
                          ) : (
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-lg border ${
                                ord.status === 'Entregado'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : ord.status === 'En Tránsito'
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              }`}
                            >
                              {ord.status}
                            </span>
                          )}

                          {isOwner && (
                            <button
                              onClick={() => handleDeleteLogistics(ord.id)}
                              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar despacho (Permiso exclusivo de Libardo Legarda)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="bg-[#0a0d14] p-2.5 rounded-lg border border-slate-800/80 text-xs space-y-1">
                        <span className="text-slate-400 font-semibold block">Carga & Mangueras:</span>
                        <p className="text-slate-200 font-medium">{ord.itemsSummary}</p>
                        {ord.notes && (
                          <p className="text-slate-400 text-[11px] italic">"Nota: {ord.notes}"</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/60 text-slate-400">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Transportadora & Guía:</span>
                          <span className="text-white font-semibold">
                            {ord.carrier} ({ord.trackingNumber})
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Entrega Estimada:</span>
                          <span className="text-cyan-300 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {ord.estimatedDelivery}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION B: INVENTARIO & CATÁLOGO BODEGA PASTO */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Package className="w-4 h-4 text-amber-400" />
                      <span>Inventario Técnico de Bodega Pasto ({inventoryList.length} Referencias)</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Disponibilidad inmediata para ensamble y prensado en el taller.
                    </p>
                  </div>
                  <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
                    Stock Pasto Verificado
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
                        <th className="py-3 px-4">Disponibilidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-[#0d1017]">
                      {inventoryList.slice(0, 10).map((item) => (
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
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: GESTIÓN DE PERSONAL & PERMISOS */}
          {/* ========================================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Header with Permissions info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111623] border border-slate-800 rounded-2xl p-4 sm:p-5">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-400" />
                    <span>Directorio del Equipo Administrativo & Roles</span>
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                      {usersList.length} Miembros
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {isOwner ? (
                      <span className="text-amber-300 font-semibold">
                        ⭐ Eres el Dueño y Administrador General. Tienes acceso completo para crear, leer, actualizar y eliminar absolutamente toda la información del sistema.
                      </span>
                    ) : (
                      <span>
                        Directorio oficial de personal. Puedes consultar el equipo y actualizar tu PIN de acceso personal.
                      </span>
                    )}
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

                  {/* Add user button: ONLY for Libardo Legarda */}
                  {isOwner && (
                    <button
                      onClick={() => setShowNewUserModal(true)}
                      className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-amber-500/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Añadir Administrador</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Roles matrix info pill */}
              <div className="bg-[#121622] border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Estructura de Responsabilidades Establecida:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-slate-300">
                  <div className="p-2.5 bg-[#0a0d14] rounded-lg border border-amber-500/30">
                    <strong className="text-amber-300 block">Libardo Legarda</strong>
                    <span>Dueño y Administrador (Acceso total CRUD: Crear, Leer, Actualizar y Eliminar todo).</span>
                  </div>
                  <div className="p-2.5 bg-[#0a0d14] rounded-lg border border-blue-500/30">
                    <strong className="text-blue-300 block">Juan Felipe Piscal</strong>
                    <span>Ventas y Contabilidad (Facturación, balances y atención comercial).</span>
                  </div>
                  <div className="p-2.5 bg-[#0a0d14] rounded-lg border border-emerald-500/30">
                    <strong className="text-emerald-300 block">Lucero Adriana Ibarra</strong>
                    <span>Inventarios, Logística, Pedidos y Ventas (Despachos y bodega Pasto).</span>
                  </div>
                  <div className="p-2.5 bg-[#0a0d14] rounded-lg border border-slate-800">
                    <strong className="text-cyan-300 block">Joan Sebastian Piscal</strong>
                    <span>Ventas (Atención comercial, cotizaciones y seguimiento).</span>
                  </div>
                  <div className="p-2.5 bg-[#0a0d14] rounded-lg border border-slate-800">
                    <strong className="text-orange-300 block">Camilo Vidal</strong>
                    <span>Ventas (Asesoría comercial en terreno y maquinaria).</span>
                  </div>
                  <div className="p-2.5 bg-[#0a0d14] rounded-lg border border-slate-800">
                    <strong className="text-purple-300 block">Juan David Legarda</strong>
                    <span>Ventas (Atención comercial y mostrador Pasto).</span>
                  </div>
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

                          {/* PIN visible if owner OR current user */}
                          {(isOwner || isCurrent) && (
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
                          )}
                        </div>

                        {/* Badges */}
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                user.active ? 'bg-emerald-400' : 'bg-red-400'
                              }`}
                            />
                            <span>{user.active ? 'Activo' : 'Desactivado'}</span>
                          </span>

                          <span className="text-[10px] text-slate-500 font-mono">
                            {user.lastLogin || 'Hoy'}
                          </span>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-800">
                        {isOwner ? (
                          <div className="flex items-center gap-2 w-full justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingUser(user)}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3 h-3 text-amber-400" />
                                <span>Editar</span>
                              </button>

                              {!user.isOwner && (
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
                              )}
                            </div>

                            {!user.isOwner && (
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                title="Eliminar usuario (Permiso exclusivo de Libardo Legarda)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ) : isCurrent ? (
                          <button
                            onClick={() => setShowChangePinModal(true)}
                            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                            <span>Cambiar mi PIN</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">
                            Acceso de consulta
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: GOOGLE SHEETS & BITÁCORA */}
          {/* ========================================================================= */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              {/* Google Sheets Status */}
              <div className="bg-[#121724] border border-slate-800 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                      <FileSpreadsheet className="w-4 h-4" />
                      Base de Datos Corporativa en Google Sheets
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
                      <span>Abrir Hoja en Google Drive</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Bitácora de Actividad */}
              <div className="bg-[#121622] border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Bitácora de Auditoría y Eventos del Equipo
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
            Sesión activa: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition-colors cursor-pointer"
          >
            Cerrar Panel
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CAMBIAR MI PIN PERSONAL */}
      {/* ========================================================================= */}
      {showChangePinModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121622] border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <span>Cambiar mi PIN de Seguridad</span>
              </h4>
              <button onClick={() => setShowChangePinModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangeMyPin} className="space-y-3.5 text-xs">
              <p className="text-slate-400">
                Hola <strong>{currentUser.name}</strong>, ingresa tu nuevo PIN de acceso (4 a 8 caracteres o dígitos):
              </p>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nuevo PIN:</label>
                <input
                  type="password"
                  maxLength={8}
                  placeholder="Ej: 4589"
                  value={myNewPin}
                  onChange={(e) => setMyNewPin(e.target.value)}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono text-center tracking-widest text-base"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowChangePinModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400"
                >
                  Actualizar mi PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REGISTRAR VENTA / FACTURA (CONTABILIDAD) */}
      {/* ========================================================================= */}
      {showNewAccountingModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121622] border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>Registrar Venta / Factura Contable</span>
              </h4>
              <button onClick={() => setShowNewAccountingModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAccounting} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1"># Factura / Comprobante:</label>
                  <input
                    type="text"
                    placeholder="Ej: FE-1043"
                    value={newAccountingData.invoiceNumber}
                    onChange={(e) => setNewAccountingData({ ...newAccountingData, invoiceNumber: e.target.value })}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Valor Total ($ COP):</label>
                  <input
                    type="number"
                    placeholder="450000"
                    value={newAccountingData.amount || ''}
                    onChange={(e) => setNewAccountingData({ ...newAccountingData, amount: Number(e.target.value) })}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Cliente / Razón Social:</label>
                <input
                  type="text"
                  placeholder="Ej: Transportes Pasto S.A.S."
                  value={newAccountingData.clientName}
                  onChange={(e) => setNewAccountingData({ ...newAccountingData, clientName: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Concepto / Ensambles Vendidos:</label>
                <textarea
                  rows={2}
                  placeholder="Ej: 2x Mangueras SAE 100R2 1/2 + 4x Racores JIC Macho"
                  value={newAccountingData.concept}
                  onChange={(e) => setNewAccountingData({ ...newAccountingData, concept: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Forma de Pago:</label>
                  <select
                    value={newAccountingData.paymentMethod}
                    onChange={(e) =>
                      setNewAccountingData({
                        ...newAccountingData,
                        paymentMethod: e.target.value as AccountingRecord['paymentMethod'],
                      })
                    }
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Transferencia Bancolombia">Transferencia Bancolombia</option>
                    <option value="Efectivo Mostrador">Efectivo Mostrador</option>
                    <option value="Crédito 30 días">Crédito 30 días</option>
                    <option value="Nequi / Daviplata">Nequi / Daviplata</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Estado:</label>
                  <select
                    value={newAccountingData.status}
                    onChange={(e) =>
                      setNewAccountingData({
                        ...newAccountingData,
                        status: e.target.value as AccountingRecord['status'],
                      })
                    }
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Cobrado">Cobrado</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewAccountingModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400"
                >
                  Guardar Factura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PROGRAMAR DESPACHO / PEDIDO (LOGÍSTICA) */}
      {/* ========================================================================= */}
      {showNewLogisticsModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121622] border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <span>Programar Despacho Departamental</span>
              </h4>
              <button onClick={() => setShowNewLogisticsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLogistics} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Cliente / Destinatario:</label>
                <input
                  type="text"
                  placeholder="Ej: Agropecuaria del Sur"
                  value={newLogisticsData.clientName}
                  onChange={(e) => setNewLogisticsData({ ...newLogisticsData, clientName: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Ciudad Destino:</label>
                  <input
                    type="text"
                    placeholder="Ej: Ipiales, Nariño"
                    value={newLogisticsData.destinationCity}
                    onChange={(e) => setNewLogisticsData({ ...newLogisticsData, destinationCity: e.target.value })}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Transportadora:</label>
                  <select
                    value={newLogisticsData.carrier}
                    onChange={(e) => setNewLogisticsData({ ...newLogisticsData, carrier: e.target.value })}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Transipiales Carga">Transipiales Carga</option>
                    <option value="Cootranar Carga">Cootranar Carga</option>
                    <option value="Envía Colvanes">Envía Colvanes</option>
                    <option value="Interrapidísimo">Interrapidísimo</option>
                    <option value="Entrega Directa Pasto">Entrega Directa Pasto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Detalle de Mangueras & Carga:</label>
                <textarea
                  rows={2}
                  placeholder="Ej: 4x Mangueras 2 Hilos 3/8 x 2m + 8x Terminales NPT"
                  value={newLogisticsData.itemsSummary}
                  onChange={(e) => setNewLogisticsData({ ...newLogisticsData, itemsSummary: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1"># de Guía:</label>
                  <input
                    type="text"
                    placeholder="TRN-48912"
                    value={newLogisticsData.trackingNumber}
                    onChange={(e) => setNewLogisticsData({ ...newLogisticsData, trackingNumber: e.target.value })}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Costo Flete ($):</label>
                  <input
                    type="number"
                    value={newLogisticsData.shippingCost || ''}
                    onChange={(e) => setNewLogisticsData({ ...newLogisticsData, shippingCost: Number(e.target.value) })}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewLogisticsModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:bg-cyan-400"
                >
                  Programar Despacho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NUEVA COTIZACIÓN (VENTAS) */}
      {/* ========================================================================= */}
      {showNewQuoteModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121622] border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-amber-400" />
                <span>Registrar Nueva Cotización</span>
              </h4>
              <button onClick={() => setShowNewQuoteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nombre del Cliente:</label>
                <input
                  type="text"
                  placeholder="Ej: Wilson Benavides"
                  value={newQuoteData.clientName}
                  onChange={(e) => setNewQuoteData({ ...newQuoteData, clientName: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Empresa / Taller:</label>
                  <input
                    type="text"
                    placeholder="Ej: Volquetas del Sur"
                    value={newQuoteData.companyName}
                    onChange={(e) => setNewQuoteData({ ...newQuoteData, companyName: e.target.value })}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Teléfono / WhatsApp:</label>
                  <input
                    type="text"
                    placeholder="+57 315..."
                    value={newQuoteData.phone}
                    onChange={(e) => setNewQuoteData({ ...newQuoteData, phone: e.target.value })}
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Mangueras & Racores Requeridos:</label>
                <textarea
                  rows={2}
                  placeholder="Ej: 2x Manguera SAE 100R2 1/2 x 1.80m + racores JIC hembra giratoria"
                  value={newQuoteData.itemsSummary}
                  onChange={(e) => setNewQuoteData({ ...newQuoteData, itemsSummary: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Observaciones Técnicas:</label>
                <input
                  type="text"
                  placeholder="Ej: Presión máxima 300 bar, maquinaria pesada"
                  value={newQuoteData.notes}
                  onChange={(e) => setNewQuoteData({ ...newQuoteData, notes: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewQuoteModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400"
                >
                  Crear Cotización
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDITAR USUARIO (SOLO LIBARDO LEGARDA) */}
      {/* ========================================================================= */}
      {editingUser && isOwner && (
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
                <label className="text-slate-300 font-semibold block mb-1">Rol / Cargo:</label>
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
                <label className="text-slate-300 font-semibold block mb-1">Correo Electrónico:</label>
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

      {/* ========================================================================= */}
      {/* MODAL: AÑADIR NUEVO USUARIO (SOLO LIBARDO LEGARDA) */}
      {/* ========================================================================= */}
      {showNewUserModal && isOwner && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121622] border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white">Añadir Nuevo Asesor Comercial</h4>
              <button onClick={() => setShowNewUserModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  placeholder="Ej: Daniel Pantoja"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Cargo / Rol:</label>
                <input
                  type="text"
                  placeholder="Ventas"
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
                  placeholder="Asesor Comercial de Ventas"
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
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
