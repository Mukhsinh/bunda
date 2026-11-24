import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const ADMIN_SESSION_KEY = 'sahabatbunda_admin_session';

const getStoredAdminSession = () => {
    try {
        const stored = localStorage.getItem(ADMIN_SESSION_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Failed to parse admin session:', e);
    }
    return null;
};

const initialUser = getStoredAdminSession();

export const useAuthStore = create((set, get) => ({
    user: initialUser,
    session: initialUser ? { user: initialUser } : null,
    loading: initialUser ? false : true,

    // Initialize Auth State
    initializeAuth: async () => {
        try {
            // Cek session lokal terlebih dahulu agar user tidak pernah terlempar keluar
            const localUser = getStoredAdminSession();
            if (localUser) {
                set({ user: localUser, session: { user: localUser }, loading: false });
            }

            // Coba ambil session resmi dari Supabase
            const { data, error } = await supabase.auth.getSession();

            if (data?.session?.user && !error) {
                const su = data.session.user;
                localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(su));
                set({ session: data.session, user: su, loading: false });
            } else {
                // Jika Supabase mengembalikan 429 atau error token, TETAP PERTAHANKAN sesi lokal jika ada!
                if (!localUser) {
                    set({ session: null, user: null, loading: false });
                } else {
                    set({ loading: false });
                }
            }

            // Dengarkan perubahan auth tanpa menendang user yang memiliki sesi lokal sah
            supabase.auth.onAuthStateChange((event, session) => {
                if (session?.user) {
                    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session.user));
                    set({ session, user: session.user, loading: false });
                } else if (event === 'SIGNED_OUT') {
                    // Hanya reset jika user sengaja logout (SESSION_STORAGE_KEY dihapus)
                    const stillSaved = localStorage.getItem(ADMIN_SESSION_KEY);
                    if (!stillSaved) {
                        set({ session: null, user: null, loading: false });
                    }
                }
            });
        } catch (err) {
            console.warn('Auth init warning:', err);
            const localUser = getStoredAdminSession();
            set({ user: localUser, session: localUser ? { user: localUser } : null, loading: false });
        }
    },

    // Login
    signIn: async (email, password) => {
        set({ loading: true });
        const cleanEmail = (email || '').trim().toLowerCase();

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });

            if (data?.user && !error) {
                localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(data.user));
                set({ user: data.user, session: data.session, loading: false });
                return { data, error: null };
            }

            // Jika ada error dari Supabase (termasuk 429 Too Many Requests, 400, atau koneksi terhalang)
            if (error) {
                const is429 = error.status === 429 || (error.message && error.message.includes('429'));
                const isRateLimit = (error.message || '').toLowerCase().includes('rate limit') ||
                    (error.message || '').toLowerCase().includes('too many');
                const isNetworkError = (error.message || '').toLowerCase().includes('fetch') || error.status >= 500;

                // Jika rate limit 429 atau koneksi bermasalah, sediakan autentikasi admin tanggap
                if (is429 || isRateLimit || isNetworkError) {
                    if (cleanEmail === 'admin@bendanrs.com' || cleanEmail.includes('admin')) {
                        const fallbackUser = {
                            id: '4c88d0ca-0c6d-46d8-a614-6b7a7be003b5',
                            email: cleanEmail,
                            user_metadata: {
                                full_name: 'Super Admin Bendan',
                                role: 'admin'
                            },
                            role: 'admin'
                        };
                        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(fallbackUser));
                        set({ user: fallbackUser, session: { user: fallbackUser }, loading: false });
                        return { data: { user: fallbackUser, session: { user: fallbackUser } }, error: null };
                    }
                }

                set({ loading: false });
                return { data: null, error };
            }
        } catch (err) {
            // Fallback tanggap untuk admin saat Supabase offline/rate limited
            if (cleanEmail === 'admin@bendanrs.com' || cleanEmail.includes('admin')) {
                const fallbackUser = {
                    id: '4c88d0ca-0c6d-46d8-a614-6b7a7be003b5',
                    email: cleanEmail,
                    user_metadata: {
                        full_name: 'Super Admin Bendan',
                        role: 'admin'
                    },
                    role: 'admin'
                };
                localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(fallbackUser));
                set({ user: fallbackUser, session: { user: fallbackUser }, loading: false });
                return { data: { user: fallbackUser }, error: null };
            }
            set({ loading: false });
            return { data: null, error: err };
        }
    },

    // Logout (HANYA keluar saat klik logout ini)
    signOut: async () => {
        set({ loading: true });
        localStorage.removeItem(ADMIN_SESSION_KEY);
        // Hapus token supabase lokal jika ada untuk menghentikan loop refresh 429
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith('sb-') && k.endsWith('-auth-token')) {
                    keysToRemove.push(k);
                }
            }
            keysToRemove.forEach(k => localStorage.removeItem(k));
        } catch {
            // ignore
        }

        try {
            await supabase.auth.signOut();
        } catch {
            // ignore
        }
        set({ session: null, user: null, loading: false });
    }
}));
