import { useState, useEffect, type FormEvent } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Phone, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  UserCheck, 
  Shield, 
  FileSpreadsheet, 
  Briefcase,
  Check,
  Building2,
  MapPin
} from 'lucide-react';
import { AdminUser } from '../types';
import { getAdminUsers, loginAdminUser } from '../services/userService';
import Logo from './Logo';
import { companyInfo } from '../data/companyData';

interface UserAccessPanelProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToStore?: () => void;
  onNotify?: (msg: string) => void;
  mode?: 'fullpage' | 'section';
}

export default function UserAccessPanel({
  onLoginSuccess,
  onBackToStore,
  onNotify,
  mode = 'fullpage',
}: UserAccessPanelProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    const loadedUsers = getAdminUsers();
    setUsers(loadedUsers);
    // Preselect Libardo Legarda (Owner) or first user
    const defaultUser = loadedUsers.find((u) => u.isOwner) || loadedUsers[0];
    if (defaultUser) {
      setSelectedUserId(defaultUser.id);
      setPin(defaultUser.pin || '1234');
    }
  }, []);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleSelectUser = (user: AdminUser) => {
    setSelectedUserId(user.id);
    setPin(user.pin || '1234');
    setError(null);
  };

  const handleLogin = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedUserId) {
      setError('Por favor selecciona un perfil de usuario');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = loginAdminUser(selectedUserId, pin);

    if (result.success && result.user) {
      onNotify?.(`¡Bienvenido al sistema, ${result.user.name}!`);
      onLoginSuccess(result.user);
    } else {
      setError(result.message || 'PIN incorrecto. Por favor intenta de nuevo.');
    }
    setIsSubmitting(false);
  };

  const handleQuickLogin = (user: AdminUser) => {
    setSelectedUserId(user.id);
    const userPin = user.pin || '1234';
    setPin(userPin);
    setError(null);
    const result = loginAdminUser(user.id, userPin);
    if (result.success && result.user) {
      onNotify?.(`Acceso directo concedido como ${result.user.name}`);
      onLoginSuccess(result.user);
    } else {
      setError(result.message || 'Error al iniciar sesión');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'owner') return u.isOwner;
    if (activeCategory === 'sales') return u.role.toLowerCase().includes('ventas') || u.role.toLowerCase().includes('comercial');
    if (activeCategory === 'inventory') return u.role.toLowerCase().includes('inventario') || u.role.toLowerCase().includes('logística');
    if (activeCategory === 'workshop') return u.role.toLowerCase().includes('taller') || u.role.toLowerCase().includes('soldadura');
    return true;
  });

  return (
    <div id="acceso-usuarios" className={`w-full bg-[#060e1e] text-slate-100 ${mode === 'fullpage' ? 'min-h-[calc(100vh-80px)] py-8' : 'py-16'} px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-[#0a1b38] via-[#071328] to-[#0a1b38] border-2 border-[#163878] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffd200]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0b2559]/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-2.5 rounded-2xl bg-[#0b2559] border-2 border-[#ffd200]/40 shadow-xl shrink-0">
                <Logo size="md" variant="badge" invertSloganForDark={true} />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-[#ffd200] text-[#060e1f] shadow-sm">
                    PORTAL EN PÁGINA
                  </span>
                  <span className="text-xs font-bold text-[#ffd200] tracking-wider uppercase font-mono">
                    ★ CALIDAD Y SERVICIO ★
                  </span>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    NIT: {companyInfo.nit}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-heading tracking-tight mt-1.5">
                  Panel de Acceso y Control de Usuarios
                </h1>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Acceso institucional directo para el personal autorizado de <strong className="text-white">Racores y Mangueras de Nariño S.A.S.</strong> en Pasto. Selecciona tu usuario para gestionar cotizaciones, taller de prensado, inventario y finanzas.
                </p>
              </div>
            </div>

            {onBackToStore && (
              <button
                onClick={onBackToStore}
                className="self-start md:self-center px-4 py-2.5 bg-[#0e2246] hover:bg-[#143162] text-slate-200 hover:text-[#ffd200] border border-[#1b4385] rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Catálogo Público</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Department Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold border-b border-[#122e66]">
          <span className="text-slate-400 uppercase tracking-wider text-[11px] mr-2 shrink-0">
            Filtrar Personal:
          </span>
          {[
            { id: 'all', label: `Todos los Usuarios (${users.length})` },
            { id: 'owner', label: '👑 Dueño & Gerencia' },
            { id: 'sales', label: '💼 Ventas & Contabilidad' },
            { id: 'inventory', label: '📦 Inventarios & Logística' },
            { id: 'workshop', label: '🔧 Taller & Prensado' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#ffd200] text-[#060e1f] font-black shadow-md shadow-[#ffd200]/20'
                  : 'bg-[#0a1730] text-slate-300 hover:text-white hover:bg-[#10244c] border border-[#14326d]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Grid: User Cards (Left/Center) + Active Login Box (Right/Side) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* User Cards Grid (8 cols on large screens) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#ffd200]" />
                <span>Personal Autorizado Registrado en el Sistema</span>
              </h2>
              <span className="text-xs text-slate-400">
                Selecciona tu tarjeta para ingresar
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredUsers.map((user) => {
                const isSelected = user.id === selectedUserId;
                return (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className={`relative rounded-2xl p-5 transition-all duration-200 cursor-pointer border-2 ${
                      isSelected
                        ? 'bg-[#0d2248] border-[#ffd200] shadow-xl shadow-[#ffd200]/15 ring-2 ring-[#ffd200]/30'
                        : 'bg-[#09152b] border-[#153472] hover:border-[#ffd200]/50 hover:bg-[#0c1c38]'
                    }`}
                  >
                    {/* Owner Badge */}
                    {user.isOwner && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-[#ffd200] to-[#f5b800] text-[#060e1f] px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-md">
                        <Sparkles className="w-3 h-3 text-[#060e1f]" />
                        <span>DUEÑO & ADMINISTRADOR</span>
                      </div>
                    )}

                    <div className="flex items-start gap-3.5">
                      {/* Avatar */}
                      <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${user.avatarColor} text-white font-black flex items-center justify-center text-lg shadow-lg shrink-0 border border-white/20`}>
                        {user.initials}
                      </div>

                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-bold text-base text-white truncate">
                            {user.name}
                          </h3>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#ffd200] shrink-0" />
                          )}
                        </div>
                        <p className="text-xs font-semibold text-[#ffd200] truncate mt-0.5">
                          {user.role}
                        </p>
                        <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">
                          {user.title}
                        </p>
                      </div>
                    </div>

                    {/* Contact & Meta info */}
                    <div className="mt-4 pt-3 border-t border-[#122b5e] grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div className="flex items-center gap-1.5 truncate">
                        <Phone className="w-3 h-3 text-[#ffd200] shrink-0" />
                        <span className="font-mono">{user.phone || '+57 Pasto'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <span className="text-emerald-400 font-bold">Activo</span>
                      </div>
                    </div>

                    {/* Permissions summary pills */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {user.permissions?.allAccess ? (
                        <span className="text-[10px] font-black bg-[#ffd200]/15 text-[#ffd200] border border-[#ffd200]/30 px-2 py-0.5 rounded-md">
                          Acceso Total (100%)
                        </span>
                      ) : (
                        <>
                          {user.permissions?.manageQuotes && (
                            <span className="text-[10px] font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded">
                              Cotizaciones
                            </span>
                          )}
                          {user.permissions?.manageAccounting && (
                            <span className="text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                              Contabilidad
                            </span>
                          )}
                          {user.permissions?.manageInventory && (
                            <span className="text-[10px] font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded">
                              Inventarios
                            </span>
                          )}
                          {user.permissions?.manageLogistics && (
                            <span className="text-[10px] font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.2 rounded">
                              Logística
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="mt-4 pt-3 border-t border-[#122b5e] flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-slate-400">
                        PIN por defecto: <strong className="text-white">1234</strong>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickLogin(user);
                        }}
                        className="px-3 py-1.5 bg-[#ffd200] hover:bg-[#ffe259] text-[#060e1f] rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <span>Ingreso Rápido</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#060e1f]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Login / Authentication Form (4 cols on large screens, sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-[#0a1630] border-2 border-[#193a7a] rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#14326d] pb-4">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#ffd200]" />
                  <h3 className="font-heading font-bold text-base text-white">
                    Verificación de Acceso
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Seguro
                </span>
              </div>

              {selectedUser ? (
                <div className="space-y-4">
                  {/* Selected User Header Banner */}
                  <div className="p-4 rounded-xl bg-[#0e2246] border border-[#1b4385] flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${selectedUser.avatarColor} text-white font-black flex items-center justify-center text-sm shadow shrink-0`}>
                      {selectedUser.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-white truncate">
                          {selectedUser.name}
                        </h4>
                        {selectedUser.isOwner && (
                          <span className="text-[10px] bg-[#ffd200] text-[#060e1f] font-black px-1.5 py-0.2 rounded">
                            Dueño
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#ffd200] truncate">
                        {selectedUser.role}
                      </p>
                      <p className="text-[11px] text-slate-300 truncate">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-3.5 flex items-start gap-2.5 text-red-200 text-xs">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label 
                          htmlFor="page-user-pin"
                          className="block text-xs font-bold text-slate-200 uppercase tracking-wider"
                        >
                          PIN de Seguridad (4 Dígitos):
                        </label>
                        <button
                          type="button"
                          onClick={() => setPin('1234')}
                          className="text-[11px] text-[#ffd200] hover:underline font-semibold cursor-pointer"
                        >
                          Rellenar 1234
                        </button>
                      </div>

                      <div className="relative">
                        <input
                          id="page-user-pin"
                          type={showPin ? 'text' : 'password'}
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          placeholder="Ingresa PIN (ej. 1234)"
                          maxLength={10}
                          className="w-full bg-[#081224] border-2 border-[#163878] focus:border-[#ffd200] rounded-xl px-4 py-3 text-white placeholder-slate-500 text-base font-mono tracking-widest focus:outline-none transition-colors"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setShowPin(!showPin)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                          aria-label={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
                        >
                          {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#ffd200]" />
                        <span>Para pruebas del sistema puedes usar el PIN <strong>1234</strong></span>
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#ffd200] via-[#f5b800] to-[#e8a800] hover:from-[#ffe259] hover:to-[#ffd200] text-[#060e1f] font-black py-3.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#ffd200]/25 disabled:opacity-50"
                      id="in-page-login-btn"
                    >
                      <span>Entrar al Panel de Control</span>
                      <ArrowRight className="w-4 h-4 text-[#060e1f]" />
                    </button>
                  </form>

                  {/* Immediate 1-Click Access for this user */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin(selectedUser)}
                      className="w-full py-2.5 px-3 bg-[#0d2248] hover:bg-[#122e62] border border-[#1b4385] hover:border-[#ffd200]/50 text-slate-200 hover:text-[#ffd200] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#ffd200]" />
                      <span>Acceso Express Directo (Sin escribir PIN)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <Users className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p>Selecciona un usuario de la lista izquierda para ingresar.</p>
                </div>
              )}

              {/* Security Credentials Summary Info */}
              <div className="pt-4 border-t border-[#14326d] text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Shield className="w-4 h-4 text-[#ffd200]" />
                  <span>Seguridad y Privacidad Operativa</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Las sesiones registran automáticamente auditoría por usuario. Libardo Legarda puede administrar roles, permisos y sincronización con Google Sheets desde el panel principal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Roles & Permissions Matrix Overview on the Page */}
        <div className="bg-[#09152b] border border-[#14326d] rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-[#122b5e] pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#ffd200]" />
                <span>Matriz Institucional de Funciones y Permisos por Perfil</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configuración del organigrama operativo de Racores y Mangueras de Nariño
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#ffd200] bg-[#ffd200]/10 px-2.5 py-1 rounded-md border border-[#ffd200]/20">
              Sede Pasto, Nariño
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#122e66] text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Colaborador</th>
                  <th className="py-2.5 px-3">Cargo Principal</th>
                  <th className="py-2.5 px-3">Cotizaciones</th>
                  <th className="py-2.5 px-3">Contabilidad</th>
                  <th className="py-2.5 px-3">Inventario / Taller</th>
                  <th className="py-2.5 px-3">Google Sheets</th>
                  <th className="py-2.5 px-3 text-right">Acceso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#102754]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#0c1d3c]/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${u.avatarColor} text-white font-bold flex items-center justify-center text-[10px]`}>
                        {u.initials}
                      </div>
                      <span>{u.name}</span>
                      {u.isOwner && (
                        <span className="text-[9px] bg-[#ffd200] text-[#060e1f] font-black px-1.5 py-0.2 rounded">
                          Dueño
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-300">{u.role}</td>
                    <td className="py-3 px-3">
                      {u.permissions?.allAccess || u.permissions?.manageQuotes ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Habilitado
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {u.permissions?.allAccess || u.permissions?.manageAccounting ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Habilitado
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {u.permissions?.allAccess || u.permissions?.manageInventory || u.permissions?.manageLogistics ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Habilitado
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {u.permissions?.allAccess || u.permissions?.accessGoogleSheets ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Sincronizado
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleQuickLogin(u)}
                        className="px-2.5 py-1 bg-[#0f2856] hover:bg-[#ffd200] hover:text-[#060e1f] text-[#ffd200] rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Entrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
