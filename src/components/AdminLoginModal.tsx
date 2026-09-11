import { useState, type FormEvent } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  UserCheck, 
  KeyRound,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { AdminUser } from '../types';
import { getAdminUsers, loginAdminUser } from '../services/userService';
import Logo from './Logo';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
}

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
  const users = getAdminUsers();
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || '');
  const [pin, setPin] = useState<string>('1234');
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedUser = users.find((u) => u.id === selectedUserId) || users[0];

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = loginAdminUser(selectedUserId, pin);
    if (result.success && result.user) {
      onLoginSuccess(result.user);
      onClose();
    } else {
      setError(result.message || 'Error al iniciar sesión.');
    }
  };

  const handleSelectUser = (user: AdminUser) => {
    setSelectedUserId(user.id);
    setPin(user.pin || '1234');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#081224] border-2 border-[#163878] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#122e66] flex items-center justify-between bg-gradient-to-r from-[#0b2046] via-[#08152e] to-[#0b2046]">
          <div className="flex items-center gap-3.5">
            <div className="p-1 rounded-full bg-[#0b2559] border border-[#ffd200]/40 shadow-lg">
              <Logo size="sm" variant="badge" invertSloganForDark={true} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight">
                  Acceso Administrativo
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ffd200]/15 text-[#ffd200] border border-[#ffd200]/40">
                  Calidad y Servicio
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Panel de control y operaciones de Racores y Mangueras de Nariño
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-[#0e2754] transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 flex items-start gap-3 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* User selector list */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Selecciona tu perfil de administrador:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {users.map((u) => {
                const isSelected = u.id === selectedUserId;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectUser(u)}
                    className={`text-left p-3 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/40 shadow-md shadow-amber-950/20'
                        : 'bg-[#151b29]/70 border-slate-800 hover:border-slate-700 hover:bg-[#182032]'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${u.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0`}>
                      {u.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-white truncate block">{u.name}</span>
                        {u.isOwner && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-semibold shrink-0">
                            Dueño
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 truncate block mt-0.5">
                        {u.title}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected user confirmation and PIN form */}
          {selectedUser && (
            <form onSubmit={handleLogin} className="bg-[#131826] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${selectedUser.avatarColor} text-white font-bold flex items-center justify-center text-sm`}>
                    {selectedUser.initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{selectedUser.name}</span>
                      <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Acceso Total (100%)
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">{selectedUser.role}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>PIN de Acceso:</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="text-[11px] text-amber-400/80 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>{showHint ? 'Ocultar sugerencia' : 'Ver PIN predeterminado'}</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="password"
                    maxLength={10}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Ingresa tu PIN"
                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-4 py-3 text-white text-base tracking-widest font-mono focus:border-amber-500 focus:outline-none transition-colors"
                    required
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">
                    4 dígitos
                  </div>
                </div>

                {showHint && (
                  <p className="text-xs text-amber-300/90 mt-2 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    💡 <strong>PIN predeterminado:</strong> Cada miembro del equipo tiene asignado <code>1234</code> de manera inicial. Puedes cambiarlo en cualquier momento dentro de la pestaña de administración.
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <UserCheck className="w-5 h-5" />
                  <span>Ingresar como {selectedUser.name.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Los 6 miembros del equipo cuentan con acceso total al panel administrativo</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0d1017] flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Racores y Mangueras de Nariño • Pasto
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
