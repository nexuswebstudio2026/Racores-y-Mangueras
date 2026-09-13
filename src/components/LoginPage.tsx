import { useState, useEffect, type FormEvent } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Phone, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  UserCheck, 
  Shield, 
  Check,
  CheckCircle2,
  Building2,
  MapPin,
  KeyRound,
  FileSpreadsheet
} from 'lucide-react';
import { AdminUser } from '../types';
import { getAdminUsers, loginAdminUser } from '../services/userService';
import Logo from './Logo';
import { companyInfo } from '../data/companyData';

interface LoginPageProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToHome: () => void;
  onNotify?: (msg: string) => void;
}

export default function LoginPage({
  onLoginSuccess,
  onBackToHome,
  onNotify,
}: LoginPageProps) {
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
    <div className="w-full bg-[#060e1e] text-slate-100 min-h-[calc(100vh-140px)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#091834] hover:bg-[#0e254e] text-slate-300 hover:text-[#ffd200] border border-[#173b7a] transition-all text-xs font-bold cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#ffd200]" />
            <span>← Volver al Sitio Principal</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <MapPin className="w-3.5 h-3.5 text-[#ffd200]" />
            <span>Sede Pasto, Nariño</span>
          </div>
        </div>

        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-[#091b3b] via-[#071329] to-[#091b3b] border-2 border-[#163878] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#ffd200]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#0b2559]/50 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className="p-3.5 rounded-2xl bg-[#0b2559] border-2 border-[#ffd200]/50 shadow-xl shrink-0">
                <Logo size="md" variant="badge" invertSloganForDark={true} />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-black bg-[#ffd200] text-[#060e1f] shadow-sm tracking-wide">
                    PÁGINA DE INGRESO
                  </span>
                  <span className="text-xs font-bold text-[#ffd200] tracking-wider uppercase font-mono">
                    ★ CALIDAD Y SERVICIO ★
                  </span>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    NIT: {companyInfo.nit}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-heading tracking-tight mt-2">
                  Portal de Acceso para Usuarios
                </h1>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Acceso institucional de <strong className="text-white">Racores y Mangueras de Nariño S.A.S.</strong> Selecciona tu perfil registrado para ingresar directamente a tu panel de trabajo, cotizaciones, inventario y gestión operativa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Department Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold border-b border-[#122e66]">
          <span className="text-slate-400 uppercase tracking-wider text-[11px] mr-2 shrink-0">
            Filtrar por Área:
          </span>
          {[
            { id: 'all', label: `Todo el Personal (${users.length})` },
            { id: 'owner', label: '👑 Dueño & Gerencia' },
            { id: 'sales', label: '💼 Ventas & Mostrador' },
            { id: 'inventory', label: '📦 Inventario & Bodega' },
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

        {/* Main Grid: User Profile Cards + Interactive Authentication Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* User Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#ffd200]" />
                <span>Usuarios Autorizados</span>
              </h2>
              <span className="text-xs text-slate-400">
                Selecciona tu usuario
              </span>
            </div>

            <div className="space-y-3">
              {filteredUsers.map((user) => {
                const isSelected = user.id === selectedUserId;
                return (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className={`relative rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#0d2248] border-[#ffd200] shadow-xl shadow-[#ffd200]/15 ring-2 ring-[#ffd200]/30'
                        : 'bg-[#09152b] border-[#153472] hover:border-[#ffd200]/50 hover:bg-[#0c1c38]'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${user.avatarColor} text-white font-black flex items-center justify-center text-base shadow-lg shrink-0 border border-white/20`}>
                        {user.initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading font-bold text-base text-white truncate">
                            {user.name}
                          </h3>
                          {user.isOwner && (
                            <span className="text-[10px] bg-gradient-to-r from-[#ffd200] to-[#f5b800] text-[#060e1f] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                              <Sparkles className="w-3 h-3 text-[#060e1f]" />
                              <span>DUEÑO</span>
                            </span>
                          )}
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#ffd200] shrink-0" />
                          )}
                        </div>
                        <p className="text-xs font-semibold text-[#ffd200] truncate mt-0.5">
                          {user.role}
                        </p>
                        <p className="text-[11px] text-slate-300 truncate mt-0.5">
                          {user.title} • <span className="font-mono text-slate-400">{user.phone}</span>
                        </p>
                      </div>
                    </div>

                    {/* Quick Access action */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickLogin(user);
                        }}
                        className="px-3.5 py-2 bg-[#ffd200] hover:bg-[#ffe259] text-[#060e1f] rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <span>Ingresar</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#060e1f]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Login Form Panel (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-[#0a1630] border-2 border-[#193a7a] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#14326d] pb-4">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#ffd200]" />
                  <h3 className="font-heading font-bold text-base text-white">
                    Formulario de Ingreso
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  Acceso Seguro
                </span>
              </div>

              {selectedUser ? (
                <div className="space-y-4">
                  {/* Selected Profile Highlight */}
                  <div className="p-4 rounded-2xl bg-[#0e2246] border border-[#1b4385] flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedUser.avatarColor} text-white font-black flex items-center justify-center text-base shadow shrink-0`}>
                      {selectedUser.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-white truncate">
                          {selectedUser.name}
                        </h4>
                        {selectedUser.isOwner && (
                          <span className="text-[9px] bg-[#ffd200] text-[#060e1f] font-black px-1.5 py-0.2 rounded">
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
                          htmlFor="login-page-pin"
                          className="block text-xs font-bold text-slate-200 uppercase tracking-wider"
                        >
                          PIN de Seguridad:
                        </label>
                        <button
                          type="button"
                          onClick={() => setPin('1234')}
                          className="text-[11px] text-[#ffd200] hover:underline font-semibold cursor-pointer"
                        >
                          Usar PIN 1234
                        </button>
                      </div>

                      <div className="relative">
                        <input
                          id="login-page-pin"
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
                        <span>PIN por defecto configurado: <strong className="text-white">1234</strong></span>
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#ffd200] via-[#f5b800] to-[#e8a800] hover:from-[#ffe259] hover:to-[#ffd200] text-[#060e1f] font-black py-3.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#ffd200]/25 disabled:opacity-50"
                      id="submit-login-page-btn"
                    >
                      <span>Entrar al Panel de Control</span>
                      <ArrowRight className="w-4 h-4 text-[#060e1f]" />
                    </button>
                  </form>

                  {/* 1-Click Fast Access */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin(selectedUser)}
                      className="w-full py-2.5 px-3 bg-[#0d2248] hover:bg-[#122e62] border border-[#1b4385] hover:border-[#ffd200]/50 text-slate-200 hover:text-[#ffd200] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#ffd200]" />
                      <span>Ingreso Express Directo como {selectedUser.name.split(' ')[0]}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <Users className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p>Selecciona un usuario de la lista para ingresar.</p>
                </div>
              )}

              {/* Information Footnote */}
              <div className="pt-4 border-t border-[#14326d] text-xs text-slate-400 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Shield className="w-4 h-4 text-[#ffd200]" />
                  <span>Seguridad Corporativa</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Racores y Mangueras de Nariño S.A.S. mantiene auditoría de sesiones para control de cotizaciones, bodega y despachos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Roles Matrix on Page */}
        <div className="bg-[#09152b] border border-[#14326d] rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-[#122b5e] pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#ffd200]" />
                <span>Niveles de Acceso y Funciones por Cargo</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Estructura operativa para el personal de sede Pasto
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#ffd200] bg-[#ffd200]/10 px-2.5 py-1 rounded-md border border-[#ffd200]/20">
              Calidad y Servicio
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#122e66] text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Colaborador</th>
                  <th className="py-2.5 px-3">Cargo</th>
                  <th className="py-2.5 px-3">Cotizaciones</th>
                  <th className="py-2.5 px-3">Contabilidad</th>
                  <th className="py-2.5 px-3">Inventario</th>
                  <th className="py-2.5 px-3 text-right">Acción</th>
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
                      {u.permissions?.allAccess || u.permissions?.manageInventory ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Habilitado
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
                        Ingresar
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
