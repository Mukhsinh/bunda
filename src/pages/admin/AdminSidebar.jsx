import React from 'react';
import {
    FileText, Truck, Monitor, Archive, ClipboardList,
    BookOpen, Settings, LogOut, ChevronLeft, ChevronRight,
    ExternalLink, ShieldCheck, Heart, User, Home, X, LayoutDashboard,
    Utensils, ChefHat, Ambulance, Video
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppLogo } from '../../hooks/useAppLogo';

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
    const logoUrl = useAppLogo();
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
                    color: '#0284c7',
                    bgTint: '#e0f2fe'
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
                    bgTint: '#eff6ff',
                    hidden: isNutritionist
                },
                {
                    key: 'santun',
                    label: 'Layanan SANTUN',
                    sub: 'Transport Pulang',
                    icon: Ambulance,
                    badge: pendingCounts.santun,
                    color: '#ea580c',
                    bgTint: '#fff7ed',
                    hidden: isNutritionist
                },
                {
                    key: 'sinergi',
                    label: 'Layanan SINERGI',
                    sub: 'Konsultasi Ahli Gizi',
                    icon: Video,
                    color: '#16a34a',
                    bgTint: '#ecfdf5'
                },
                {
                    key: 'gizi',
                    label: 'Admin Gizi & Menu',
                    sub: 'Pesanan & Ready Menu',
                    icon: ChefHat,
                    badge: pendingCounts.gizi,
                    color: '#d97706',
                    bgTint: '#fef3c7'
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
                    bgTint: '#e0e7ff',
                    hidden: isNutritionist
                },
                {
                    key: 'spj',
                    label: 'Laporan SPJ',
                    sub: 'Pertanggungjawaban',
                    icon: ClipboardList,
                    color: '#8b5cf6',
                    bgTint: '#ede9fe',
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
                    color: '#0891b2',
                    bgTint: '#ecfeff'
                },
                {
                    key: 'pengaturan',
                    label: 'Pengaturan Sistem',
                    sub: 'Logo, Kop & Pengguna',
                    icon: Settings,
                    color: '#475569',
                    bgTint: '#f1f5f9',
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
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.45)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 998,
                        transition: 'opacity 0.3s ease'
                    }}
                />
            )}

            {/* Sidebar Element (SOLID MATTE BRIGHT COLOR THEME) */}
            <aside
                className={`admin-sidebar-container ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
                style={{
                    width: collapsed ? '80px' : '260px',
                    minWidth: collapsed ? '80px' : '260px',
                    height: '100vh',
                    background: '#ffffff',
                    color: '#0f172a',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    zIndex: 999,
                    borderRight: '1px solid #e2e8f0',
                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '2px 0 16px rgba(15, 23, 42, 0.04)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}
            >
                {/* ── Brand Header (Bright Solid Matte) ── */}
                <div style={{
                    padding: collapsed ? '20px 12px' : '20px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    borderBottom: '1px solid #e2e8f0',
                    background: '#f8fafc'
                }}>
                    {!collapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt="Logo Sahabat Bunda"
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '12px',
                                        objectFit: 'contain',
                                        background: '#ffffff',
                                        padding: '2px',
                                        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
                                        border: '1px solid #e2e8f0',
                                        flexShrink: 0
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ffffff',
                                    fontWeight: 900,
                                    fontSize: '0.95rem',
                                    boxShadow: '0 3px 10px rgba(2, 132, 199, 0.3)',
                                    flexShrink: 0
                                }}>
                                    SB
                                </div>
                            )}
                            <div style={{ minWidth: 0 }}>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: '0.98rem',
                                    fontWeight: 900,
                                    color: '#0f172a',
                                    letterSpacing: '-0.3px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    SahabatBunda
                                </h3>
                                <p style={{
                                    margin: 0,
                                    fontSize: '0.68rem',
                                    color: '#64748b',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    RSUD Bendan Pekalongan
                                </p>
                            </div>
                        </div>
                    )}

                    {collapsed && (
                        logoUrl ? (
                            <img
                                src={logoUrl}
                                alt="Logo Sahabat Bunda"
                                style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '12px',
                                    objectFit: 'contain',
                                    background: '#ffffff',
                                    padding: '2px',
                                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
                                    border: '1px solid #e2e8f0'
                                }}
                            />
                        ) : (
                            <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ffffff',
                                fontWeight: 900,
                                fontSize: '0.95rem',
                                boxShadow: '0 3px 10px rgba(2, 132, 199, 0.3)'
                            }}>
                                SB
                            </div>
                        )
                    )}

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="sidebar-collapse-btn"
                        style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            color: '#475569',
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            flexShrink: 0,
                            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)'
                        }}
                        title={collapsed ? 'Perluas Sidebar' : 'Kecilkan Sidebar'}
                    >
                        {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="sidebar-mobile-close-btn"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            display: 'none'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ── Navigation Menu Groups (Solid Matte) ── */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    {menuGroups.map((group, gIdx) => {
                        const visibleItems = group.items.filter(i => !i.hidden);
                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={gIdx}>
                                {!collapsed && (
                                    <div style={{
                                        fontSize: '0.66rem',
                                        fontWeight: 800,
                                        color: '#64748b',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.08em',
                                        padding: '0 12px',
                                        marginBottom: '6px'
                                    }}>
                                        {group.title}
                                    </div>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
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
                                                    gap: collapsed ? '0' : '10px',
                                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                                    padding: collapsed ? '12px 0' : '9px 12px',
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    background: isActive
                                                        ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                                                        : 'transparent',
                                                    color: isActive ? '#ffffff' : '#334155',
                                                    borderLeft: isActive ? '4px solid #38bdf8' : '4px solid transparent',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    transition: 'all 0.18s ease',
                                                    textAlign: 'left',
                                                    boxShadow: isActive ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
                                                }}
                                                title={collapsed ? item.label : undefined}
                                                onMouseEnter={(e) => {
                                                    if (!isActive) e.currentTarget.style.background = '#f1f5f9';
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isActive) e.currentTarget.style.background = 'transparent';
                                                }}
                                            >
                                                {/* Stylish Icon Badge Container */}
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '9px',
                                                    background: isActive ? 'rgba(255, 255, 255, 0.2)' : item.bgTint,
                                                    color: isActive ? '#ffffff' : item.color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    transition: 'all 0.2s'
                                                }}>
                                                    <Icon size={17} strokeWidth={isActive ? 2.5 : 2.2} />
                                                </div>

                                                {!collapsed && (
                                                    <span style={{
                                                        flex: 1,
                                                        minWidth: 0,
                                                        fontSize: '0.84rem',
                                                        fontWeight: isActive ? 800 : 700,
                                                        color: isActive ? '#ffffff' : '#1e293b',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}>
                                                        {item.label}
                                                    </span>
                                                )}

                                                {/* Badge Count */}
                                                {item.badge > 0 && (
                                                    <span style={{
                                                        background: '#ef4444',
                                                        color: '#ffffff',
                                                        fontSize: '0.66rem',
                                                        fontWeight: 900,
                                                        padding: '1px 6px',
                                                        borderRadius: '10px',
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

                {/* ── Footer / Logout Bar (Bright Solid Matte) ── */}
                <div style={{
                    padding: collapsed ? '14px 8px' : '14px 14px',
                    borderTop: '1px solid #e2e8f0',
                    background: '#f8fafc',
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
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            color: '#334155',
                            textDecoration: 'none',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            transition: 'all 0.2s',
                            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)'
                        }}
                        title={collapsed ? 'Kembali ke Beranda Pasien' : undefined}
                    >
                        <Home size={16} color="#0284c7" />
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
                            border: '1px solid #fecdd3',
                            background: '#fff1f2',
                            color: '#e11d48',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            fontWeight: 800,
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
