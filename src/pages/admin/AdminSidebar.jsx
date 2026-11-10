import React from 'react';
import {
    FileText, Truck, Monitor, Archive, ClipboardList,
    BookOpen, Settings, LogOut, ChevronLeft, ChevronRight,
    ExternalLink, ShieldCheck, Heart, User, Home, X, LayoutDashboard
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminSidebar({
    activeTab,
    setActiveTab,
    userProfile,
    onSignOut,
    pendingCounts = {},
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen
}) {
    const navigate = useNavigate();
    const isNutritionist = userProfile?.role === 'narasumber';

    const menuGroups = [
        {
            title: 'RINGKASAN & OVERVIEW',
            items: [
                {
                    key: 'dashboard',
                    label: 'Dashboard Utama',
                    sub: 'Ringkasan & Analitik',
                    icon: LayoutDashboard,
                    color: '#38bdf8'
                }
            ]
        },
        {
            title: 'LAYANAN UTAMA',
            items: [
                {
                    key: 'ramah',
                    label: 'Layanan RAMAH',
                    sub: 'Akta Lahir & KK',
                    icon: FileText,
                    badge: pendingCounts.ramah,
                    color: '#2563eb',
                    hidden: isNutritionist
                },
                {
                    key: 'santun',
                    label: 'Layanan SANTUN',
                    sub: 'Transport Pulang',
                    icon: Truck,
                    badge: pendingCounts.santun,
                    color: '#ea580c',
                    hidden: isNutritionist
                },
                {
                    key: 'sinergi',
                    label: 'Layanan SINERGI',
                    sub: 'Konsultasi Ahli Gizi',
                    icon: Monitor,
                    color: '#16a34a'
                }
            ]
        },
        {
            title: 'DOKUMEN & LAPORAN',
            items: [
                {
                    key: 'arsip',
                    label: 'Arsip Berkas',
                    sub: 'Riwayat Digital',
                    icon: Archive,
                    color: '#6366f1',
                    hidden: isNutritionist
                },
                {
                    key: 'spj',
                    label: 'Laporan SPJ',
                    sub: 'Surat Pertanggungjawaban',
                    icon: ClipboardList,
                    color: '#8b5cf6',
                    hidden: isNutritionist
                }
            ]
        },
        {
            title: 'SISTEM & PANDUAN',
            items: [
                {
                    key: 'dokumentasi',
                    label: 'Dokumentasi Sistem',
                    sub: 'Master Plan & Flowchart',
                    icon: BookOpen,
                    color: '#0891b2'
                },
                {
                    key: 'pengaturan',
                    label: 'Pengaturan Sistem',
                    sub: 'Logo, Kop, Footer & User',
                    icon: Settings,
                    color: '#475569',
                    hidden: isNutritionist
                }
            ]
        }
    ];

    const handleItemClick = (key) => {
        setActiveTab(key);
        navigate(`/admin/${key}`);
        if (mobileOpen) {
            setMobileOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.65)',
                        backdropFilter: 'blur(4px)', zIndex: 998,
                        transition: 'opacity 0.3s ease'
                    }}
                />
            )}

            {/* Sidebar Element */}
            <aside
                className={`admin-sidebar-container ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
                style={{
                    width: collapsed ? '80px' : '260px',
                    minWidth: collapsed ? '80px' : '260px',
                    height: '100vh',
                    background: '#0f172a',
                    color: '#e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    zIndex: 999,
                    borderRight: '1px solid #1e293b',
                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '4px 0 24px rgba(0,0,0,0.15)'
                }}
            >
                {/* ── Brand Header ── */}
                <div style={{
                    padding: collapsed ? '20px 12px' : '20px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    borderBottom: '1px solid #1e293b',
                    background: '#0b1120'
                }}>
                    {!collapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                            <div style={{
                                width: '38px', height: '38px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontWeight: 900, fontSize: '1rem',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)', flexShrink: 0
                            }}>
                                SB
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <h3 style={{
                                    margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'white',
                                    fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.3px',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                }}>
                                    SahabatBunda
                                </h3>
                                <p style={{
                                    margin: 0, fontSize: '0.65rem', color: '#94a3b8',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                }}>
                                    RSUD Bendan Pekalongan
                                </p>
                            </div>
                        </div>
                    )}

                    {collapsed && (
                        <div style={{
                            width: '38px', height: '38px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 900, fontSize: '1rem',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
                        }}>
                            SB
                        </div>
                    )}

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="sidebar-collapse-btn"
                        style={{
                            background: '#1e293b', border: 'none', color: '#94a3b8',
                            width: '28px', height: '28px', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                        }}
                        title={collapsed ? 'Perluas Sidebar' : 'Kecilkan Sidebar'}
                    >
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="sidebar-mobile-close-btn"
                        style={{
                            background: 'none', border: 'none', color: '#94a3b8',
                            cursor: 'pointer', display: 'none'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ── User Status Card ── */}
                {!collapsed && (
                    <div style={{
                        padding: '16px 20px',
                        background: 'rgba(30, 41, 59, 0.4)',
                        borderBottom: '1px solid #1e293b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '38px', height: '38px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontWeight: 800, fontSize: '0.85rem'
                            }}>
                                <User size={18} />
                            </div>
                            <span style={{
                                position: 'absolute', bottom: '0', right: '0', width: '10px', height: '10px',
                                borderRadius: '50%', background: '#10b981', border: '2px solid #0f172a'
                            }} />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{
                                fontSize: '0.82rem', fontWeight: 800, color: 'white',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                            }}>
                                {userProfile?.full_name || 'Super Admin'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                <span style={{
                                    fontSize: '0.62rem', fontWeight: 800, padding: '1px 6px', borderRadius: '6px',
                                    background: isNutritionist ? 'rgba(249, 115, 22, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                    color: isNutritionist ? '#fb923c' : '#60a5fa', textTransform: 'uppercase'
                                }}>
                                    {isNutritionist ? 'Narasumber Gizi' : 'Super Admin'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Navigation Items ── */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {menuGroups.map((group, gIdx) => {
                        const visibleItems = group.items.filter(i => !i.hidden);
                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={gIdx}>
                                {!collapsed && (
                                    <div style={{
                                        fontSize: '0.65rem', fontWeight: 800, color: '#64748b',
                                        textTransform: 'uppercase', letterSpacing: '0.08em',
                                        padding: '0 12px', marginBottom: '8px'
                                    }}>
                                        {group.title}
                                    </div>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {visibleItems.map(item => {
                                        const Icon = item.icon;
                                        const isActive = activeTab === item.key;

                                        return (
                                            <button
                                                key={item.key}
                                                onClick={() => handleItemClick(item.key)}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: collapsed ? '0' : '12px',
                                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                                    padding: collapsed ? '12px 0' : '10px 14px',
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    background: isActive
                                                        ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.25), rgba(30, 58, 138, 0.4))'
                                                        : 'transparent',
                                                    color: isActive ? '#60a5fa' : '#94a3b8',
                                                    borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    transition: 'all 0.2s',
                                                    textAlign: 'left'
                                                }}
                                                title={collapsed ? item.label : undefined}
                                            >
                                                <div style={{
                                                    color: isActive ? '#60a5fa' : '#94a3b8',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                                </div>

                                                {!collapsed && (
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{
                                                            fontSize: '0.82rem', fontWeight: isActive ? 800 : 600,
                                                            color: isActive ? 'white' : '#cbd5e1'
                                                        }}>
                                                            {item.label}
                                                        </div>
                                                        <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                                                            {item.sub}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Badge Count */}
                                                {item.badge > 0 && (
                                                    <span style={{
                                                        background: '#ef4444', color: 'white',
                                                        fontSize: '0.65rem', fontWeight: 900,
                                                        padding: '1px 6px', borderRadius: '10px',
                                                        boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)'
                                                    }}>
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Footer / Logout Bar ── */}
                <div style={{
                    padding: collapsed ? '16px 8px' : '16px 14px',
                    borderTop: '1px solid #1e293b',
                    background: '#0b1120',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                }}>
                    <Link
                        to="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: collapsed ? '0' : '10px',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            color: '#94a3b8',
                            textDecoration: 'none',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                        }}
                        title={collapsed ? 'Kembali ke Beranda Pasien' : undefined}
                    >
                        <Home size={16} />
                        {!collapsed && <span>Ke Portal Pasien</span>}
                    </Link>

                    <button
                        onClick={onSignOut}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: collapsed ? '0' : '10px',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            background: 'rgba(239, 68, 68, 0.08)',
                            color: '#f87171',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            transition: 'all 0.2s'
                        }}
                        title={collapsed ? 'Keluar Sesi' : undefined}
                    >
                        <LogOut size={16} />
                        {!collapsed && <span>Keluar Panel Admin</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}

