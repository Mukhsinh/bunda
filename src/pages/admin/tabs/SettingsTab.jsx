import React, { useState, useEffect, useRef } from 'react';
import {
    Settings, Image as ImageIcon, FileText, Layout, Users,
    UploadCloud, CheckCircle, Save, RefreshCw, Trash2,
    Shield, Key, UserPlus, Mail, Phone, Lock, Edit3, X, Eye, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';

const DEFAULT_SETTINGS = {
    appName: 'Sahabat Bunda (SAKPORE)',
    hospitalName: 'RSUD Bendan Kota Pekalongan',
    address: 'Jl. Sriwijaya No. 2, Kota Pekalongan, Jawa Tengah 51111',
    hotline: '0815-2321-122',
    adminWa: '0823-2440-8910',
    email: 'admin@bendanrs.com',
    footerText: 'SahabatBunda @ 2026. RSUD Bendan Kota Pekalongan. All rights reserved.',
    tagline: 'Pelayanan Pasca Melahirkan Paripurna & Bebas Stunting',
    logoUrl: '',
    kopUrl: ''
};

export default function SettingsTab({ currentAdminUser }) {
    const [subTab, setSubTab] = useState('aplikasi'); // 'aplikasi' | 'pengguna'
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [savingSettings, setSavingSettings] = useState(false);

    // Image previews
    const [logoPreview, setLogoPreview] = useState(null);
    const [kopPreview, setKopPreview] = useState(null);
    const logoFileRef = useRef(null);
    const kopFileRef = useRef(null);

    // User management state
    const [usersList, setUsersList] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [searchUser, setSearchUser] = useState('');
    const [newUserForm, setNewUserForm] = useState({
        full_name: '',
        email: '',
        password: '',
        role: 'admin',
        phone_number: ''
    });
    const [creatingUser, setCreatingUser] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('sahabatbunda_app_settings');
            if (saved) {
                const parsed = JSON.parse(saved);
                setSettings(prev => ({ ...prev, ...parsed }));
                if (parsed.logoUrl) setLogoPreview(parsed.logoUrl);
                if (parsed.kopUrl) setKopPreview(parsed.kopUrl);
            }
        } catch (e) {
            console.error('Failed to parse settings:', e);
        }
    }, []);

    // Load users from profiles
    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsersList(data || []);
        } catch (err) {
            console.error('Error fetching users:', err);
            // Fallback list if table query has restrictions
            setUsersList([
                {
                    id: currentAdminUser?.id || '1',
                    full_name: currentAdminUser?.user_metadata?.full_name || 'Super Admin Bendan',
                    email: currentAdminUser?.email || 'admin@bendanrs.com',
                    role: 'admin',
                    created_at: new Date().toISOString()
                }
            ]);
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        if (subTab === 'pengguna') {
            fetchUsers();
        }
    }, [subTab]);

    // Handle Logo Selection
    const handleLogoSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Ukuran logo maksimal 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setLogoPreview(reader.result);
                setSettings(prev => ({ ...prev, logoUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle Kop Surat Selection
    const handleKopSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) {
                toast.error('Ukuran kop surat maksimal 4MB');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setKopPreview(reader.result);
                setSettings(prev => ({ ...prev, kopUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Save Settings
    const handleSaveSettings = (e) => {
        e.preventDefault();
        setSavingSettings(true);
        try {
            localStorage.setItem('sahabatbunda_app_settings', JSON.stringify(settings));
            setTimeout(() => {
                setSavingSettings(false);
                toast.success('Pengaturan aplikasi berhasil disimpan!');
            }, 500);
        } catch (e) {
            setSavingSettings(false);
            toast.error('Gagal menyimpan pengaturan: ' + e.message);
        }
    };

    // Reset Settings
    const handleResetSettings = () => {
        if (!window.confirm('Kembalikan seluruh pengaturan ke default pabrik?')) return;
        localStorage.removeItem('sahabatbunda_app_settings');
        setSettings(DEFAULT_SETTINGS);
        setLogoPreview(null);
        setKopPreview(null);
        toast.success('Pengaturan telah di-reset ke nilai bawaan.');
    };

    // Create New User
    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!newUserForm.email || !newUserForm.password) {
            toast.error('Email dan kata sandi wajib diisi!');
            return;
        }

        setCreatingUser(true);
        try {
            // Sign up user via supabase auth or insert into profiles
            const { data, error } = await supabase.auth.signUp({
                email: newUserForm.email,
                password: newUserForm.password,
                options: {
                    data: {
                        full_name: newUserForm.full_name,
                        role: newUserForm.role
                    }
                }
            });

            if (error) throw error;

            if (data?.user) {
                await supabase.from('profiles').upsert({
                    id: data.user.id,
                    role: newUserForm.role,
                    full_name: newUserForm.full_name,
                    phone_number: newUserForm.phone_number
                });
            }

            toast.success(`Pengguna ${newUserForm.full_name || newUserForm.email} berhasil ditambahkan!`);
            setShowAddUserModal(false);
            setNewUserForm({ full_name: '', email: '', password: '', role: 'admin', phone_number: '' });
            fetchUsers();
        } catch (err) {
            console.error('Error adding user:', err);
            toast.error('Gagal menambah pengguna: ' + err.message);
        } finally {
            setCreatingUser(false);
        }
    };

    // Delete User
    const handleDeleteUser = async (userItem) => {
        if (userItem.email === 'admin@bendanrs.com') {
            toast.error('Akun Superadmin utama tidak dapat dihapus demi keamanan!');
            return;
        }
        if (!window.confirm(`Yakin ingin menghapus akses pengguna ${userItem.full_name || userItem.email}?`)) return;

        try {
            const { error } = await supabase.from('profiles').delete().eq('id', userItem.id);
            if (error) throw error;
            toast.success('Pengguna berhasil dihapus.');
            fetchUsers();
        } catch (err) {
            toast.error('Gagal menghapus: ' + err.message);
        }
    };

    // Update Role
    const handleChangeRole = async (userId, newRole) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;
            toast.success('Peran pengguna berhasil diperbarui.');
            fetchUsers();
        } catch (err) {
            toast.error('Gagal memperbarui peran: ' + err.message);
        }
    };

    const filteredUsers = usersList.filter(u => {
        const q = searchUser.toLowerCase();
        return (u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q));
    });

    return (
        <div className="animate-slide-up" style={{ color: '#1e293b' }}>
            {/* Header Pengaturan */}
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)',
                borderRadius: '24px',
                padding: '28px 24px',
                color: 'white',
                marginBottom: '24px',
                boxShadow: '0 12px 28px rgba(15, 23, 42, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '5px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
                        <Settings size={14} /> PUSAT KONFIGURASI SISTEM
                    </div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                        Pengaturan & Manajemen Akses
                    </h1>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                        Kustomisasi identitas aplikasi, berkas cetak, logo, footer, dan otoritas pengguna.
                    </p>
                </div>

                {/* Sub Tab Buttons */}
                <div style={{
                    display: 'flex', background: 'rgba(255,255,255,0.1)', padding: '4px',
                    borderRadius: '16px', backdropFilter: 'blur(8px)', gap: '4px'
                }}>
                    <button
                        onClick={() => setSubTab('aplikasi')}
                        style={{
                            border: 'none', padding: '8px 18px', borderRadius: '12px',
                            background: subTab === 'aplikasi' ? 'white' : 'transparent',
                            color: subTab === 'aplikasi' ? '#0f172a' : 'white',
                            fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            boxShadow: subTab === 'aplikasi' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Layout size={15} /> Pengaturan Aplikasi
                    </button>
                    <button
                        onClick={() => setSubTab('pengguna')}
                        style={{
                            border: 'none', padding: '8px 18px', borderRadius: '12px',
                            background: subTab === 'pengguna' ? 'white' : 'transparent',
                            color: subTab === 'pengguna' ? '#0f172a' : 'white',
                            fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            boxShadow: subTab === 'pengguna' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Users size={15} /> Pengaturan Pengguna
                    </button>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                SUBTAB 1: PENGATURAN APLIKASI (LOGO, KOP, FOOTER)
            ══════════════════════════════════════════════════════════ */}
            {subTab === 'aplikasi' && (
                <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Baris 1: Upload Logo & Upload Kop Surat */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>

                        {/* KARTU 1: UPLOAD LOGO APLIKASI */}
                        <div style={{
                            background: 'white', borderRadius: '20px', padding: '24px',
                            border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ImageIcon size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, fontFamily: "'Outfit'" }}>Logo Aplikasi</h3>
                                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b' }}>Tampil pada header & brand aplikasi</p>
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#16a34a', background: '#dcfce7', padding: '3px 8px', borderRadius: '8px' }}>
                                    Aktif
                                </span>
                            </div>

                            {/* Preview Area Logo */}
                            <div style={{
                                width: '100%', height: '140px', background: '#f8fafc',
                                borderRadius: '16px', border: '2px dashed #cbd5e1',
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                justifyContent: 'center', marginBottom: '16px', position: 'relative', overflow: 'hidden'
                            }}>
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo Preview" style={{ maxHeight: '110px', maxWidth: '85%', objectFit: 'contain' }} />
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                        <ImageIcon size={38} style={{ opacity: 0.5, marginBottom: '6px' }} />
                                        <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600 }}>Logo Default SahabatBunda</p>
                                        <span style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>(PNG, SVG, atau JPG transparan)</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons Logo */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input ref={logoFileRef} type="file" accept="image/*" onChange={handleLogoSelect} style={{ display: 'none' }} />
                                <button
                                    type="button"
                                    onClick={() => logoFileRef.current?.click()}
                                    style={{
                                        flex: 1, padding: '10px 14px', borderRadius: '12px',
                                        background: '#2563eb', color: 'white', border: 'none',
                                        fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                    }}
                                >
                                    <UploadCloud size={16} /> Unggah Logo Baru
                                </button>
                                {logoPreview && (
                                    <button
                                        type="button"
                                        onClick={() => { setLogoPreview(null); setSettings(prev => ({ ...prev, logoUrl: '' })); }}
                                        style={{
                                            padding: '10px 12px', borderRadius: '12px',
                                            background: '#fee2e2', color: '#dc2626', border: 'none',
                                            fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer'
                                        }}
                                        title="Hapus Logo Custom"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* KARTU 2: UPLOAD KOP SURAT / DOKUMEN CETAK */}
                        <div style={{
                            background: 'white', borderRadius: '20px', padding: '24px',
                            border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, fontFamily: "'Outfit'" }}>Kop Surat & Instansi</h3>
                                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b' }}>Digunakan pada laporan SPJ & dokumen cetak PDF</p>
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#d97706', background: '#fef3c7', padding: '3px 8px', borderRadius: '8px' }}>
                                    Format Cetak
                                </span>
                            </div>

                            {/* Preview Area Kop */}
                            <div style={{
                                width: '100%', height: '140px', background: '#f8fafc',
                                borderRadius: '16px', border: '2px dashed #cbd5e1',
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                justifyContent: 'center', marginBottom: '16px', position: 'relative', overflow: 'hidden'
                            }}>
                                {kopPreview ? (
                                    <img src={kopPreview} alt="Kop Surat Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: '12px' }}>
                                        <FileText size={38} style={{ opacity: 0.5, marginBottom: '6px' }} />
                                        <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                                            RSUD BENDAN KOTA PEKALONGAN
                                        </p>
                                        <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                                            Jl. Sriwijaya No. 2 Kota Pekalongan (Default Header Kop)
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons Kop */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input ref={kopFileRef} type="file" accept="image/*" onChange={handleKopSelect} style={{ display: 'none' }} />
                                <button
                                    type="button"
                                    onClick={() => kopFileRef.current?.click()}
                                    style={{
                                        flex: 1, padding: '10px 14px', borderRadius: '12px',
                                        background: '#d97706', color: 'white', border: 'none',
                                        fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                    }}
                                >
                                    <UploadCloud size={16} /> Unggah Kop Surat Baru
                                </button>
                                {kopPreview && (
                                    <button
                                        type="button"
                                        onClick={() => { setKopPreview(null); setSettings(prev => ({ ...prev, kopUrl: '' })); }}
                                        style={{
                                            padding: '10px 12px', borderRadius: '12px',
                                            background: '#fee2e2', color: '#dc2626', border: 'none',
                                            fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer'
                                        }}
                                        title="Hapus Kop Surat Custom"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Baris 2: Informasi Footer & Teks Hak Cipta */}
                    <div style={{
                        background: 'white', borderRadius: '20px', padding: '24px',
                        border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Layout size={20} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, fontFamily: "'Outfit'" }}>
                                    Pengaturan Footer & Informasi Kontak Publik
                                </h3>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                                    Informasi hak cipta, alamat resmi, nomor darurat, dan identitas instansi pada footer
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                                    Teks Footer / Hak Cipta
                                </label>
                                <input
                                    type="text"
                                    value={settings.footerText}
                                    onChange={(e) => setSettings(p => ({ ...p, footerText: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                                    Tagline / Slogan Aplikasi
                                </label>
                                <input
                                    type="text"
                                    value={settings.tagline}
                                    onChange={(e) => setSettings(p => ({ ...p, tagline: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                                    Nomor Hotline BEMBI 24 Jam
                                </label>
                                <input
                                    type="text"
                                    value={settings.hotline}
                                    onChange={(e) => setSettings(p => ({ ...p, hotline: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                                    Nomor WhatsApp Admin Pelayanan
                                </label>
                                <input
                                    type="text"
                                    value={settings.adminWa}
                                    onChange={(e) => setSettings(p => ({ ...p, adminWa: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                                />
                            </div>
                        </div>

                        {/* Live Preview Footer */}
                        <div style={{
                            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px',
                            padding: '16px 20px', textAlign: 'center'
                        }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
                                [ Live Preview Footer Aplikasi ]
                            </span>
                            <p style={{ margin: '0 0 4px', fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                                {settings.footerText}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>
                                {settings.tagline} • Hotline: {settings.hotline}
                            </p>
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={handleResetSettings}
                            style={{
                                padding: '12px 20px', borderRadius: '14px', border: '1px solid #e2e8f0',
                                background: 'white', color: '#64748b', fontWeight: 700, fontSize: '0.82rem',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                            }}
                        >
                            <RefreshCw size={14} /> Reset ke Default
                        </button>
                        <button
                            type="submit"
                            disabled={savingSettings}
                            style={{
                                padding: '12px 28px', borderRadius: '14px', border: 'none',
                                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white',
                                fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                boxShadow: '0 6px 18px rgba(37, 99, 235, 0.25)'
                            }}
                        >
                            <Save size={16} /> {savingSettings ? 'Menyimpan...' : 'Simpan Seluruh Pengaturan'}
                        </button>
                    </div>

                </form>
            )}

            {/* ══════════════════════════════════════════════════════════
                SUBTAB 2: PENGATURAN PENGGUNA (USER MANAGEMENT)
            ══════════════════════════════════════════════════════════ */}
            {subTab === 'pengguna' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{
                        background: 'white', borderRadius: '20px', padding: '24px',
                        border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                    }}>
                        {/* Header bar */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, fontFamily: "'Outfit'" }}>
                                    Daftar Pengguna & Hak Akses
                                </h3>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                                    Kelola akun Superadmin, Ahli Gizi (Narasumber SINERGI), dan Staf Pelayanan RSUD Bendan
                                </p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Cari nama atau email..."
                                    value={searchUser}
                                    onChange={(e) => setSearchUser(e.target.value)}
                                    style={{
                                        padding: '8px 14px', borderRadius: '12px', border: '1px solid #cbd5e1',
                                        fontSize: '0.8rem', outline: 'none', width: '200px'
                                    }}
                                />
                                <button
                                    onClick={() => setShowAddUserModal(true)}
                                    style={{
                                        padding: '9px 16px', borderRadius: '12px', border: 'none',
                                        background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white',
                                        fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                                    }}
                                >
                                    <UserPlus size={16} /> Tambah Pengguna
                                </button>
                            </div>
                        </div>

                        {/* User Table */}
                        {loadingUsers ? (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                                Memuat data pengguna...
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                                Tidak ada pengguna yang cocok dengan pencarian.
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                            <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569' }}>Nama & Identitas</th>
                                            <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569' }}>Email Pengguna</th>
                                            <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569' }}>Peran / Role</th>
                                            <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569' }}>Tanggal Registrasi</th>
                                            <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569', textAlign: 'center' }}>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((u, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <div style={{ fontWeight: 800, color: '#1e293b' }}>{u.full_name || 'Pengguna'}</div>
                                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ID: {u.id?.substring(0, 8)}...</span>
                                                </td>
                                                <td style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>
                                                    {u.email || '-'}
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <select
                                                        value={u.role || 'admin'}
                                                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                                                        style={{
                                                            padding: '4px 10px', borderRadius: '8px',
                                                            border: '1px solid #cbd5e1', fontSize: '0.75rem',
                                                            fontWeight: 700,
                                                            color: u.role === 'admin' ? '#1d4ed8' : u.role === 'narasumber' ? '#ea580c' : '#475569',
                                                            background: u.role === 'admin' ? '#eff6ff' : u.role === 'narasumber' ? '#fff7ed' : '#f8fafc'
                                                        }}
                                                    >
                                                        <option value="admin">Super Admin</option>
                                                        <option value="narasumber">Ahli Gizi (Narasumber)</option>
                                                        <option value="petugas">Petugas Layanan</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem' }}>
                                                    {u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                </td>
                                                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => handleDeleteUser(u)}
                                                        style={{
                                                            padding: '6px 10px', borderRadius: '8px',
                                                            background: '#fee2e2', color: '#dc2626', border: 'none',
                                                            cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700
                                                        }}
                                                        title="Hapus Pengguna"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal Tambah Pengguna Baru */}
            {showAddUserModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.75)',
                    backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000, padding: '20px'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '24px', padding: '28px',
                        width: '100%', maxWidth: '440px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                        animation: 'modalIn 0.3s ease-out'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <UserPlus size={20} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#1e293b' }}>
                                    Tambah Pengguna Baru
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowAddUserModal(false)}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Nama Lengkap</label>
                                <input
                                    type="text" required
                                    placeholder="Contoh: drg. Ahmad Fauzi / Siti Rahma, S.Gz"
                                    value={newUserForm.full_name}
                                    onChange={(e) => setNewUserForm(p => ({ ...p, full_name: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Email Resmi</label>
                                <input
                                    type="email" required
                                    placeholder="petugas@bendanrs.com"
                                    value={newUserForm.email}
                                    onChange={(e) => setNewUserForm(p => ({ ...p, email: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Kata Sandi (Min. 6 Karakter)</label>
                                <input
                                    type="password" required minLength={6}
                                    placeholder="Buat kata sandi akun..."
                                    value={newUserForm.password}
                                    onChange={(e) => setNewUserForm(p => ({ ...p, password: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Peran / Otoritas Akun</label>
                                <select
                                    value={newUserForm.role}
                                    onChange={(e) => setNewUserForm(p => ({ ...p, role: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none', background: 'white' }}
                                >
                                    <option value="admin">Super Admin (Akses Penuh Semua Menu)</option>
                                    <option value="narasumber">Ahli Gizi / Narasumber (Akses Khusus SINERGI)</option>
                                    <option value="petugas">Petugas Pelayanan / Driver (Akses RAMAH & SANTUN)</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddUserModal(false)}
                                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={creatingUser}
                                    style={{
                                        flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                                        background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white',
                                        fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                                    }}
                                >
                                    {creatingUser ? 'Menyimpan...' : 'Buat Akun'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

