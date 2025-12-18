'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Player {
  name: string;
  currentLevel: number;
  lastUpdated: string;
}

interface PlayersData {
  [playerId: string]: Player;
}

export default function AdminPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<PlayersData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [editing, setEditing] = useState<{ playerId: string; name: string; level: number } | null>(null);

  useEffect(() => {
    // Check if already authenticated (stored in sessionStorage)
    const stored = sessionStorage.getItem('admin-authenticated');
    if (stored === 'true') {
      setAuthenticated(true);
      loadPlayers();
    }
  }, []);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const key = adminKey || sessionStorage.getItem('admin-key') || '';
      
      const response = await fetch('/api/admin/players', {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });

      if (response.status === 401) {
        setAuthenticated(false);
        sessionStorage.removeItem('admin-authenticated');
        setError('No autorizado. Ingresa tu ADMIN_KEY.');
        return;
      }

      if (!response.ok) {
        throw new Error('Error al cargar jugadores');
      }

      const data = await response.json();
      setPlayers(data.players || {});
      setAuthenticated(true);
      if (adminKey) {
        sessionStorage.setItem('admin-key', adminKey);
        sessionStorage.setItem('admin-authenticated', 'true');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      setError('Por favor ingresa tu ADMIN_KEY');
      return;
    }
    loadPlayers();
  };

  const handleUpdate = async (playerId: string, name: string, level: number) => {
    try {
      setError(null);
      const key = sessionStorage.getItem('admin-key') || adminKey;
      
      const response = await fetch('/api/admin/players', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerId, name, currentLevel: level })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al actualizar');
      }

      setEditing(null);
      await loadPlayers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    }
  };

  const handleDelete = async (playerId: string) => {
    if (!confirm(`¿Estás seguro de eliminar a "${players[playerId]?.name}"?`)) {
      return;
    }

    try {
      setError(null);
      const key = sessionStorage.getItem('admin-key') || adminKey;
      
      const response = await fetch(`/api/admin/players?playerId=${encodeURIComponent(playerId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al eliminar');
      }

      await loadPlayers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-white mb-6">Admin Panel</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ADMIN_KEY
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu clave de administrador"
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const entries = Object.entries(players);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white">Admin Panel - Jugadores</h1>
            <button
              onClick={() => {
                sessionStorage.removeItem('admin-authenticated');
                sessionStorage.removeItem('admin-key');
                setAuthenticated(false);
                setAdminKey('');
              }}
              className="text-gray-400 hover:text-white text-sm"
            >
              Cerrar sesión
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={loadPlayers}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Recargar
            </button>
            <span className="text-gray-400">
              Total: {entries.length} jugadores
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-400 py-8">Cargando...</div>
        ) : entries.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No hay jugadores registrados</div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Nivel</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Última actualización</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {entries.map(([playerId, player]) => (
                    <tr key={playerId} className="hover:bg-gray-700/50">
                      {editing?.playerId === playerId ? (
                        <>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editing.name}
                              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                              className="w-full px-3 py-1 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm font-mono">{playerId}</td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={editing.level}
                              onChange={(e) => setEditing({ ...editing, level: parseInt(e.target.value) || 1 })}
                              className="w-20 px-3 py-1 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              min="1"
                            />
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{player.lastUpdated}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdate(playerId, editing.name, editing.level)}
                                className="text-green-400 hover:text-green-300 text-sm"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={() => setEditing(null)}
                                className="text-gray-400 hover:text-gray-300 text-sm"
                              >
                                Cancelar
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 text-white">{player.name || '(sin nombre)'}</td>
                          <td className="px-6 py-4 text-gray-400 text-sm font-mono">{playerId}</td>
                          <td className="px-6 py-4 text-white">{player.currentLevel}</td>
                          <td className="px-6 py-4 text-gray-400 text-sm">
                            {new Date(player.lastUpdated).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditing({ playerId, name: player.name, level: player.currentLevel })}
                                className="text-blue-400 hover:text-blue-300 text-sm"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(playerId)}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

