import React, { useState } from 'react';
import {
    Menu, Bell, Search, User, LogOut, ExternalLink,
    Shield, RefreshCw, Smartphone, Monitor, ChevronDown, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminHeader({
    activeTab,
    userProfile,
    onSignOut,
    onToggleMobileSidebar,
    notifications = [],
    onClearNotifications,
    onRefreshData,
    viewMode,
    onToggleViewMode
}) {
    const [showNotifPopover, setShowNotifPopover] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const tabTitles = {
        dashboard: { title: 'Dashboard Eksekutif & Ringkasan Layanan', desc: 'Pusat Analitik Terpadu & Pemantauan Kinerja Realtime RSUD Bendan' },
        ramah: { title: 'Manajemen Layanan RAMAH', desc: 'Pengurusan Akta Kelahiran, KIA, dan Kartu Keluarga Baru' },
        santun: { title: 'Manajemen Layanan SANTUN', desc: 'Pemulangan Pasien Nifas & Penugasan Armada Transportasi' },
        sinergi: { title: 'Manajemen Konsultasi SINERGI', desc: 'Jadwal Telekonsultasi Video Call Tatap Muka & Ahli Gizi' },
        gizi: { title: 'Admin Gizi — Pesanan Menu Makanan', desc: 'Manajemen Pesanan Makanan Pasien, Ruang Perawatan, dan Pembayaran' },
        arsip: { title: 'Arsip Berkas Digital', desc: 'Database Historis Pengajuan dan Berkas Pasien' },
        spj: { title: 'Rekapitulasi Laporan SPJ', desc: 'Pertanggungjawaban Perjalanan Dinas & Verifikasi Biaya' },
        dokumentasi: { title: 'Dokumentasi Sistem & Master Plan', desc: 'Buku Panduan Teknis, Konsep Flowchart, dan Analisis Manfaat' },
        pengaturan: { title: 'Pengaturan Aplikasi & Pengguna', desc: 'Kustomisasi Logo, Kop Surat, Footer, dan Hak Akses Pengguna' }
    };

    const currentTabInfo = tabTitles[activeTab] || { title: 'Dashboard Administrasi', desc: 'Pusat Komando Sahabat Bunda' };

    return (
        <header style={{
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 900,
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
            {/* Left: Mobile Hamburger & Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                    onClick={onToggleMobileSidebar}
                    className="admin-hamburger-btn"
                    style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        width: '38px',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#334155',
                        cursor: 'pointer'
                    }}
                    title="Menu Navigasi"
                >
                    <Menu size={20} />
                </button>

                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                        <span>Admin</span>
                        <span>/</span>
                        <span style={{ color: '#2563eb', fontWeight: 700, textTransform: 'capitalize' }}>{activeTab}</span>
                    </div>
                    <h2 style={{
                        margin: '2px 0 0', fontSize: '1.15rem', fontWeight: 900, color: '#0f172a',
                        fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.3px', lineHeight: 1.2
                    }}>
                        {currentTabInfo.title}
                    </h2>
                </div>
            </div>

            {/* Right: Actions, Notifications, User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Refresh Data Button */}
                <button
                    onClick={onRefreshData}
                    style={{
                        background: '#f8fafc', border: '1px solid #e2e8f0',
                        borderRadius: '10px', width: '38px', height: '38px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#64748b', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    title="Muat Ulang Data"
                >
                    <RefreshCw size={16} />
                </button>

                {/* Notification Bell */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowNotifPopover(!showNotifPopover)}
                        style={{
                            background: notifications.length > 0 ? '#eff6ff' : '#f8fafc',
                            border: notifications.length > 0 ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                            borderRadius: '10px', width: '38px', height: '38px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: notifications.length > 0 ? '#2563eb' : '#64748b',
                            cursor: 'pointer', position: 'relative'
                        }}
                        title="Notifikasi"
                    >
                        <Bell size={18} />
                        {notifications.length > 0 && (
                            <span style={{
                                position: 'absolute', top: '-4px', right: '-4px',
                                background: '#ef4444', color: 'white', fontSize: '0.65rem',
                                fontWeight: 900, width: '18px', height: '18px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 2px 5px rgba(239, 68, 68, 0.4)'
                            }}>
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {/* Notification Popover */}
                    {showNotifPopover && (
                        <div style={{
                            position: 'absolute', top: '48px', right: 0, width: '300px',
                            background: 'white', borderRadius: '16px', boxShadow: '0 12px 35px rgba(0,0,0,0.15)',
                            border: '1px solid #e2e8f0', padding: '16px', zIndex: 1001
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e293b' }}>Notifikasi Masuk</span>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={onClearNotifications}
                                        style={{ fontSize: '0.7rem', color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}
                                    >
                                        Tandai Dibaca
                                    </button>
                                )}
                            </div>

                            {notifications.length === 0 ? (
                                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, textAlign: 'center', padding: '16px 0' }}>
                                    Belum ada notifikasi baru.
                                </p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                                    {notifications.map((n, i) => (
                                        <div key={i} style={{ padding: '8px 10px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                            <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#1e293b' }}>{n.title}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#64748b' }}>{n.name} ({n.phone})</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* User Avatar & Logout */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px', borderLeft: '1px solid #e2e8f0' }}>
                    <div style={{
                        width: '38px', height: '38px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                        color: 'white', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem'
                    }}>
                        {(userProfile?.full_name || 'Admin')[0].toUpperCase()}
                    </div>
                    <div className="admin-header-user-text" style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                            {userProfile?.full_name || 'Super Admin'}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                            {userProfile?.email || 'admin@bendanrs.com'}
                        </span>
                    </div>

                    <button
                        onClick={onSignOut}
                        style={{
                            marginLeft: '4px', background: '#fee2e2', border: 'none',
                            borderRadius: '8px', padding: '8px', color: '#dc2626',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        title="Keluar"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </header>
    );
}

