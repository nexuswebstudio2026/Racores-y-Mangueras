import { AdminUser, ActivityLogItem } from '../types';
import { initialAdminUsers } from '../data/usersData';
import { getStoredSpreadsheet, requestGoogleAccessToken } from './googleSheetsService';

const USERS_STORAGE_KEY = 'rym_admin_users_list';
const SESSION_STORAGE_KEY = 'rym_current_admin_user';
const ACTIVITY_STORAGE_KEY = 'rym_admin_activity_log';

export function getAdminUsers(): AdminUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialAdminUsers));
      return initialAdminUsers;
    }
    const parsed: AdminUser[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialAdminUsers));
      return initialAdminUsers;
    }

    // Merge system initial users to guarantee updated roles & permissions
    const merged = initialAdminUsers.map((initUser) => {
      const existing = parsed.find((p) => p.id === initUser.id);
      if (existing) {
        return {
          ...initUser,
          pin: existing.pin || initUser.pin,
          active: existing.active !== undefined ? existing.active : initUser.active,
          phone: existing.phone || initUser.phone,
          email: existing.email || initUser.email,
          lastLogin: existing.lastLogin || initUser.lastLogin,
        };
      }
      return initUser;
    });

    // Also include any custom users added by the owner
    const customUsers = parsed.filter(
      (p) => !initialAdminUsers.some((init) => init.id === p.id)
    );

    const result = [...merged, ...customUsers];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(result));
    return result;
  } catch {
    return initialAdminUsers;
  }
}

export function saveAdminUsers(users: AdminUser[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function getCurrentUser(): AdminUser | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed: AdminUser = JSON.parse(raw);
    const users = getAdminUsers();
    const fresh = users.find((u) => u.id === parsed.id);
    return fresh || parsed;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: AdminUser | null): void {
  if (user) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

export function loginAdminUser(userId: string, pin: string): { success: boolean; user?: AdminUser; message?: string } {
  const users = getAdminUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return { success: false, message: 'Usuario no encontrado en la base de datos' };
  }

  if (!user.active) {
    return { success: false, message: 'Este perfil de usuario se encuentra desactivado temporalmente' };
  }

  // Check pin (default fallback if empty or matches)
  if (user.pin && user.pin !== pin) {
    return { success: false, message: 'PIN de seguridad incorrecto. Intenta de nuevo.' };
  }

  // Update last login
  const now = new Date().toLocaleString('es-CO');
  user.lastLogin = now;
  saveAdminUsers(users);
  setCurrentUser(user);

  addActivityLog({
    userId: user.id,
    userName: user.name,
    action: 'Inicio de Sesión',
    details: `El usuario ${user.name} ingresó al panel administrativo`,
    category: 'auth',
  });

  return { success: true, user };
}

export function logoutAdminUser(): void {
  const current = getCurrentUser();
  if (current) {
    addActivityLog({
      userId: current.id,
      userName: current.name,
      action: 'Cierre de Sesión',
      details: `${current.name} cerró su sesión administrativa`,
      category: 'auth',
    });
  }
  setCurrentUser(null);
}

export function updateAdminUser(updated: AdminUser): void {
  const users = getAdminUsers();
  const idx = users.findIndex((u) => u.id === updated.id);
  if (idx !== -1) {
    users[idx] = updated;
    saveAdminUsers(users);

    const curr = getCurrentUser();
    if (curr && curr.id === updated.id) {
      setCurrentUser(updated);
    }

    addActivityLog({
      userId: updated.id,
      userName: updated.name,
      action: 'Perfil Actualizado',
      details: `Se actualizaron los datos o credenciales de ${updated.name}`,
      category: 'users',
    });
  }
}

export function createAdminUser(newUser: Omit<AdminUser, 'id'>): AdminUser {
  const users = getAdminUsers();
  const id = `usr-${Date.now()}`;
  const user: AdminUser = {
    ...newUser,
    id,
    permissions: newUser.permissions || {
      allAccess: false,
      canDeleteAll: false,
      manageUsers: false,
      manageQuotes: true,
      manageAccounting: false,
      manageInventory: false,
      manageLogistics: false,
      accessGoogleSheets: false,
    },
  };
  users.push(user);
  saveAdminUsers(users);

  addActivityLog({
    userId: user.id,
    userName: user.name,
    action: 'Usuario Creado',
    details: `Se añadió un nuevo administrador al sistema: ${user.name}`,
    category: 'users',
  });

  return user;
}

export function deleteAdminUser(userId: string): boolean {
  const users = getAdminUsers();
  const target = users.find((u) => u.id === userId);
  if (!target) return false;
  if (target.isOwner) {
    throw new Error('No es posible eliminar al propietario / administrador general.');
  }

  const filtered = users.filter((u) => u.id !== userId);
  saveAdminUsers(filtered);

  addActivityLog({
    userId,
    userName: target.name,
    action: 'Usuario Eliminado',
    details: `Se eliminó al usuario ${target.name} del sistema`,
    category: 'users',
  });

  return true;
}

// Activity Log Management
export function getActivityLogs(): ActivityLogItem[] {
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (!raw) return getInitialLogs();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : getInitialLogs();
  } catch {
    return getInitialLogs();
  }
}

export function addActivityLog(log: Omit<ActivityLogItem, 'id' | 'timestamp'>): void {
  const logs = getActivityLogs();
  const newLog: ActivityLogItem = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toLocaleString('es-CO'),
  };
  logs.unshift(newLog);
  // Keep last 100 entries
  if (logs.length > 100) logs.length = 100;
  localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(logs));
}

function getInitialLogs(): ActivityLogItem[] {
  return [
    {
      id: 'log-1',
      timestamp: 'Hoy, 08:30 AM',
      userId: 'usr-libardo-legarda',
      userName: 'Libardo Legarda',
      action: 'Apertura de Operaciones',
      details: 'Inicio del sistema de Racores y Mangueras de Nariño.',
      category: 'auth',
    },
    {
      id: 'log-2',
      timestamp: 'Hoy, 09:15 AM',
      userId: 'usr-juan-felipe-piscal',
      userName: 'Juan Felipe Piscal',
      action: 'Revisión Técnica',
      details: 'Verificación de catálogo de mangueras hidráulicas R2 y R12.',
      category: 'inventory',
    },
    {
      id: 'log-3',
      timestamp: 'Hoy, 09:40 AM',
      userId: 'usr-lucero-adriana-ibarra',
      userName: 'Lucero Adriana Ibarra',
      action: 'Sincronización Google Sheets',
      details: 'Conexión exitosa con la base de datos oficial en Google Sheets.',
      category: 'sheets',
    },
  ];
}

/**
 * Sync team members to Google Sheets in a dedicated sheet "Gestión de Personal"
 */
export async function syncUsersToGoogleSheets(): Promise<boolean> {
  const dbInfo = getStoredSpreadsheet();
  if (!dbInfo) throw new Error('No hay una hoja de Google Sheets conectada');

  const token = await requestGoogleAccessToken();
  const users = getAdminUsers();

  const headers = [
    'ID Usuario',
    'Nombre Completo',
    'Cargo / Rol',
    'Título Operativo',
    'Teléfono / Celular',
    'Correo Electrónico',
    'Nivel de Acceso',
    'Estado',
    'Último Acceso Registrado',
  ];

  const rows = users.map((u) => [
    u.id,
    u.name,
    u.role,
    u.title,
    u.phone,
    u.email,
    u.isOwner
      ? 'Dueño & Administrador (Acceso Total CRUD: Crear, Leer, Modificar, Eliminar)'
      : u.role,
    u.active ? 'Activo' : 'Inactivo',
    u.lastLogin || 'No registrado',
  ]);

  // First, check if sheet exists or add it
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${dbInfo.spreadsheetId}:batchUpdate`;

  // We try to append or update
  try {
    await fetch(appendUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title: 'Gestión de Personal',
                gridProperties: { frozenRowCount: 1 },
              },
            },
          },
        ],
      }),
    });
  } catch {
    // If sheet already exists, proceed to write
  }

  // Now overwrite/write values
  const writeUrl = `https://sheets.googleapis.com/v4/spreadsheets/${dbInfo.spreadsheetId}/values/Gestión de Personal!A1:I?valueInputOption=USER_ENTERED`;
  const writeResponse = await fetch(writeUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range: 'Gestión de Personal!A1:I',
      values: [headers, ...rows],
    }),
  });

  if (!writeResponse.ok) {
    const err = await writeResponse.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Error al actualizar personal en Google Sheets');
  }

  addActivityLog({
    userId: 'admin-system',
    userName: 'Sistema',
    action: 'Sincronización Personal',
    details: `Se exportaron ${users.length} usuarios del equipo a Google Sheets`,
    category: 'sheets',
  });

  return true;
}
