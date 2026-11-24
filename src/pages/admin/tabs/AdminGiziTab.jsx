import React, { useState, useMemo, useEffect } from 'react';
import {
    Utensils, Search, CheckCircle2, Clock, MapPin, Phone,
    AlertCircle, Filter, Check, RefreshCw, MessageCircle, DollarSign,
    PackageCheck, Truck, ChevronDown, Calendar, User, CheckSquare,
    Square, AlertTriangle, ShieldCheck, Sparkles, ChefHat, ToggleLeft, ToggleRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    DEFAULT_MENU_ITEMS,
    getAvailableMenuIds,
    saveAvailableMenuIds,
    toggleMenuAvailability,
    setAllMenuAvailability,
    MENU_AVAILABILITY_EVENT
} from '../../../lib/foodMenuData';

const SLA_MINUTES = 15;
const SLA_SECONDS = SLA_MINUTES * 60; // 900 seconds

export default function AdminGiziTab({ orders = [], onUpdateStatus, onUpdatePayment, onRefresh, loading }) {
    // Sub-view: 'orders' (Daftar Pesanan & SLA) | 'menu' (Ketersediaan Menu Ready)
    const [subTab, setSubTab] = useState('orders');

    // Filter & Search Orders
    const [searchOrder, setSearchOrder] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'dipesan' | 'selesai'
    const [paymentFilter, setPaymentFilter] = useState('all'); // 'all' | 'lunas' | 'belum_lunas'

    // Menu Availability State
    const [availableMenuIds, setAvailableMenuIds] = useState(getAvailableMenuIds);
    const [menuSearch, setMenuSearch] = useState('');
    const [menuCategory, setMenuCategory] = useState('all');

    // Live Clock for Realtime Countdown Timer (every 1 second)
    const [currentTime, setCurrentTime] = useState(Date.now());
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Sync Menu Availability from External Events
    useEffect(() => {
        const handleSync = (e) => {
            if (e?.detail && Array.isArray(e.detail)) {
                setAvailableMenuIds(e.detail);
            } else {
                setAvailableMenuIds(getAvailableMenuIds());
            }
        };
        window.addEventListener(MENU_AVAILABILITY_EVENT, handleSync);
        window.addEventListener('storage', handleSync);
        return () => {
            window.removeEventListener(MENU_AVAILABILITY_EVENT, handleSync);
            window.removeEventListener('storage', handleSync);
        };
    }, []);

    // Toggle single menu item
    const handleToggleMenu = (id, name) => {
        const updated = toggleMenuAvailability(id);
        setAvailableMenuIds(updated);
        const isNowReady = updated.includes(id);
        if (isNowReady) {
            toast.success(`"${name}" kini TERSEDIA (Ready di /makanan)`);
        } else {
            toast.error(`"${name}" ditandai HABIS (Disembunyikan dari /makanan)`);
        }
    };

    // Toggle All menus
    const handleToggleAllMenus = (ready) => {
        const updated = setAllMenuAvailability(ready);
        setAvailableMenuIds(updated);
        if (ready) {
            toast.success('Semua menu (15 item) berhasil dicentang: TERSEDIA (Ready)!');
        } else {
            toast.error('Semua centang dibatalkan: Seluruh menu berstatus HABIS');
        }
    };

    // Normalized Order Status Helper
    const getNormalizedStatus = (order) => {
        const s = (order.order_status || '').toLowerCase();
        if (s === 'selesai' || s === 'diterima') return 'selesai';
        return 'dipesan'; // 'pending', 'diproses', 'diantar', or 'dipesan'
    };

    // Calculate Timer & SLA stats for an order
    const getOrderSlaData = (order) => {
        const orderTime = new Date(order.created_at || Date.now()).getTime();
        const isCompleted = getNormalizedStatus(order) === 'selesai';

        if (isCompleted) {
            const completedTime = order.completed_at
                ? new Date(order.completed_at).getTime()
                : (order.updated_at ? new Date(order.updated_at).getTime() : orderTime);
            const durationSec = Math.max(0, Math.floor((completedTime - orderTime) / 1000));
            const durationMins = Math.floor(durationSec / 60);
            const durationSecs = durationSec % 60;
            const metSla = durationSec <= SLA_SECONDS;
            return {
                isCompleted: true,
                durationSec,
                durationText: `${durationMins}m ${durationSecs}s`,
                metSla
            };
        }

        // Active Order - Running Countdown
        const elapsedSec = Math.max(0, Math.floor((currentTime - orderTime) / 1000));
        const remainingSec = SLA_SECONDS - elapsedSec;
        const isOverdue = remainingSec < 0;

        const absSec = Math.abs(remainingSec);
        const mins = Math.floor(absSec / 60);
        const secs = absSec % 60;
        const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        const progressPercent = Math.max(0, Math.min(100, (remainingSec / SLA_SECONDS) * 100));

        return {
            isCompleted: false,
            elapsedSec,
            remainingSec,
            isOverdue,
            timeFormatted,
            progressPercent
        };
    };

    // Filtered Orders
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const normStatus = getNormalizedStatus(order);

            const matchesSearch =
                (order.customer_name || '').toLowerCase().includes(searchOrder.toLowerCase()) ||
                (order.order_code || '').toLowerCase().includes(searchOrder.toLowerCase()) ||
                (order.room_name || '').toLowerCase().includes(searchOrder.toLowerCase()) ||
                (order.phone_number || '').includes(searchOrder);

            const matchesStatus = statusFilter === 'all' || normStatus === statusFilter;
            const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;

            return matchesSearch && matchesStatus && matchesPayment;
        });
    }, [orders, searchOrder, statusFilter, paymentFilter]);

    // Order Counts
    const counts = useMemo(() => {
        let dipesanCount = 0;
        let selesaiCount = 0;
        let overdueCount = 0;

        orders.forEach(o => {
            const norm = getNormalizedStatus(o);
            if (norm === 'selesai') {
                selesaiCount++;
            } else {
                dipesanCount++;
                const orderTime = new Date(o.created_at || Date.now()).getTime();
                const elapsedSec = Math.floor((currentTime - orderTime) / 1000);
                if (elapsedSec > SLA_SECONDS) {
                    overdueCount++;
                }
            }
        });

        return {
            total: orders.length,
            dipesan: dipesanCount,
            selesai: selesaiCount,
            overdue: overdueCount,
            readyMenu: availableMenuIds.length,
            totalMenu: DEFAULT_MENU_ITEMS.length
        };
    }, [orders, currentTime, availableMenuIds]);

    // Filtered Menus for Management
    const filteredMenus = useMemo(() => {
        return DEFAULT_MENU_ITEMS.filter(item => {
            const matchesCategory = menuCategory === 'all' || item.category === menuCategory;
            const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
                item.description.toLowerCase().includes(menuSearch.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [menuCategory, menuSearch]);

    const openWhatsApp = (phone, name, orderCode, roomName, status) => {
        if (!phone) {
            toast.error('Nomor WhatsApp pemesan tidak valid');
            return;
        }
        let clean = phone.replace(/\D/g, '');
        if (clean.startsWith('0')) clean = '62' + clean.substring(1);
        const msg = `Halo Bunda/Bpk ${name}, kami dari Instalasi Gizi RSUD Bendan mengonfirmasi pesanan makanan Anda (${orderCode}) di ruangan: *${roomName}*. Status saat ini: *${status === 'selesai' ? 'SELESAI DIANTAR' : 'SEDANG DIPROSES'}*. Terima kasih!`;
        window.open(`https://wa.me/${clean}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <div className="animate-slide-up" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* ── KARTU SKOR RINGKASAN GIZI SOLID MATTE ── */}
            <div className="sc-grid">
                {/* Total Pesanan */}
                <div className="sc-card sc-blue">
                    <div className="sc-badge-top">
                        <span className="sc-pill sc-pill-blue">Instalasi Gizi</span>
                        <div className="sc-icon-wrapper sc-icon-blue">
                            <Utensils size={16} strokeWidth={2.2} />
                        </div>
                    </div>
                    <div className="sc-val">{counts.total}</div>
                    <div className="sc-lbl">Total Pesanan Pasien</div>
                </div>

                {/* Status Dipesan (Belum Selesai) */}
                <div className="sc-card sc-amber">
                    <div className="sc-badge-top">
                        <span className="sc-pill sc-pill-amber">Perlu Penanganan</span>
                        <div className="sc-icon-wrapper sc-icon-amber">
                            <Clock size={20} strokeWidth={2.2} />
                        </div>
                    </div>
                    <div className="sc-val">{counts.dipesan}</div>
                    <div className="sc-lbl">Status Dipesan (Antrean)</div>
                </div>

                {/* Warning Overdue SLA 15 Menit */}
                <div className={`sc-card ${counts.overdue > 0 ? 'sc-rose' : 'sc-amber'}`}>
                    <div className="sc-badge-top">
                        <span className={`sc-pill ${counts.overdue > 0 ? 'sc-pill-rose' : 'sc-pill-amber'}`}>
                            Maks. 15 Menit
                        </span>
                        <div className={`sc-icon-wrapper ${counts.overdue > 0 ? 'sc-icon-rose' : 'sc-icon-amber'}`}>
                            <AlertTriangle size={16} strokeWidth={2.2} />
                        </div>
                    </div>
                    <div className="sc-val" style={{ color: counts.overdue > 0 ? '#e11d48' : '#0f172a' }}>
                        {counts.overdue}
                    </div>
                    <div className="sc-lbl">Peringatan Melebihi SLA</div>
                </div>

                {/* Status Selesai Diterima */}
                <div className="sc-card sc-green">
                    <div className="sc-badge-top">
                        <span className="sc-pill sc-pill-green">Telah Diantar</span>
                        <div className="sc-icon-wrapper sc-icon-green">
                            <CheckCircle2 size={16} strokeWidth={2.2} />
                        </div>
                    </div>
                    <div className="sc-val">{counts.selesai}</div>
                    <div className="sc-lbl">Pesanan Selesai</div>
                </div>
            </div>

            {/* ── SUB-NAV TAB PILIHAN FITUR (SOLID MATTE) ── */}
            <div style={{
                display: 'flex',
                gap: '8px',
                background: '#ffffff',
                padding: '8px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
            }}>
                <button
                    onClick={() => setSubTab('orders')}
                    style={{
                        flex: 1,
                        padding: '12px 18px',
                        borderRadius: '12px',
                        border: 'none',
                        background: subTab === 'orders' ? '#0284c7' : 'transparent',
                        color: subTab === 'orders' ? '#ffffff' : '#475569',
                        fontWeight: 800,
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        boxShadow: subTab === 'orders' ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
                    }}
                >
                    <Utensils size={18} strokeWidth={2.2} />
                    <span>Daftar Pesanan & SLA Realtime ({filteredOrders.length})</span>
                </button>

                <button
                    onClick={() => setSubTab('menu')}
                    style={{
                        flex: 1,
                        padding: '12px 18px',
                        borderRadius: '12px',
                        border: 'none',
                        background: subTab === 'menu' ? '#059669' : 'transparent',
                        color: subTab === 'menu' ? '#ffffff' : '#475569',
                        fontWeight: 800,
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        boxShadow: subTab === 'menu' ? '0 4px 12px rgba(5, 150, 105, 0.25)' : 'none'
                    }}
                >
                    <CheckSquare size={18} strokeWidth={2.2} />
                    <span>Ketersediaan Menu Ready ({counts.readyMenu}/{counts.totalMenu})</span>
                </button>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ── TAB 1: DAFTAR PESANAN & SLA REALTIME ── */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {subTab === 'orders' && (
                <div>
                    {/* Header Filter Box */}
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '18px',
                        padding: '18px 20px',
                        border: '1px solid #e2e8f0',
                        marginBottom: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '12px',
                                    background: '#e0f2fe',
                                    color: '#0284c7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <ChefHat size={22} strokeWidth={2.2} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                                        Monitoring Pesanan Makanan & Hitung Mundur SLA
                                    </h3>
                                    <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748b' }}>
                                        Target Standar Pelayanan (SLA): Maksimal 15 Menit sampai makanan selesai diserahkan ke kamar
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={onRefresh}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '9px 16px',
                                    borderRadius: '12px',
                                    background: '#f8fafc',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    color: '#334155',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                                <span>Segarkan Data</span>
                            </button>
                        </div>

                        {/* Search and Filters */}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{
                                flex: '1 1 240px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: '#f8fafc',
                                padding: '10px 14px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <Search size={16} color="#64748b" />
                                <input
                                    type="text"
                                    placeholder="Cari nama pasien, kode pesanan, nomor kamar..."
                                    value={searchOrder}
                                    onChange={e => setSearchOrder(e.target.value)}
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        outline: 'none',
                                        fontSize: '0.82rem',
                                        width: '100%',
                                        color: '#0f172a',
                                        fontWeight: 600
                                    }}
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="filter-dd"
                                style={{ minWidth: '160px' }}
                            >
                                <option value="all">Semua Status Pesanan</option>
                                <option value="dipesan">⏳ Status Dipesan (Antrean)</option>
                                <option value="selesai">✅ Status Selesai (Diantar)</option>
                            </select>

                            {/* Payment Filter */}
                            <select
                                value={paymentFilter}
                                onChange={e => setPaymentFilter(e.target.value)}
                                className="filter-dd"
                                style={{ minWidth: '160px' }}
                            >
                                <option value="all">Semua Status Bayar</option>
                                <option value="lunas">🟢 LUNAS</option>
                                <option value="belum_lunas">🔴 BELUM LUNAS (COD)</option>
                            </select>
                        </div>
                    </div>

                    {/* Orders List */}
                    {filteredOrders.length === 0 ? (
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '20px',
                            padding: '48px 20px',
                            textAlign: 'center',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '16px',
                                background: '#f1f5f9',
                                color: '#94a3b8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 12px'
                            }}>
                                <Utensils size={28} />
                            </div>
                            <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>
                                Belum Ada Pesanan Makanan Sesuai Filter
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                                Pesanan baru yang dibuat di menu /makanan akan otomatis tampil di sini secara realtime
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {filteredOrders.map(order => {
                                const items = Array.isArray(order.items) ? order.items : [];
                                const isLunas = order.payment_status === 'lunas';
                                const normStatus = getNormalizedStatus(order);
                                const isCompleted = normStatus === 'selesai';
                                const slaData = getOrderSlaData(order);

                                return (
                                    <div
                                        key={order.id}
                                        style={{
                                            background: '#ffffff',
                                            borderRadius: '20px',
                                            border: `1.5px solid ${
                                                isCompleted
                                                    ? '#86efac'
                                                    : slaData.isOverdue
                                                        ? '#fca5a5'
                                                        : '#bae6fd'
                                            }`,
                                            padding: '20px',
                                            boxShadow: slaData.isOverdue && !isCompleted
                                                ? '0 6px 20px rgba(239, 68, 68, 0.12)'
                                                : '0 2px 10px rgba(15, 23, 42, 0.03)',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {/* Top Accent Bar */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: isCompleted
                                                ? '#10b981'
                                                : slaData.isOverdue
                                                    ? '#ef4444'
                                                    : '#0284c7'
                                        }} />

                                        {/* ── HEADER KARTU PESANAN ── */}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            flexWrap: 'wrap',
                                            gap: '12px',
                                            marginBottom: '14px'
                                        }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                    <span style={{
                                                        fontSize: '0.78rem',
                                                        fontWeight: 900,
                                                        color: '#0369a1',
                                                        background: '#e0f2fe',
                                                        padding: '3px 10px',
                                                        borderRadius: '8px',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        {order.order_code}
                                                    </span>
                                                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                                                        {new Date(order.created_at).toLocaleString('id-ID', {
                                                            day: '2-digit', month: 'short', year: 'numeric',
                                                            hour: '2-digit', minute: '2-digit'
                                                        })} WIB
                                                    </span>
                                                </div>

                                                <h3 style={{
                                                    margin: '8px 0 3px',
                                                    fontSize: '1.15rem',
                                                    fontWeight: 900,
                                                    color: '#0f172a'
                                                }}>
                                                    {order.customer_name}
                                                </h3>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#334155', fontWeight: 700 }}>
                                                    <MapPin size={15} color="#ea580c" />
                                                    <span>Lokasi / Kamar: <strong style={{ color: '#0f172a' }}>{order.room_name}</strong></span>
                                                </div>
                                            </div>

                                            {/* Badges Status & SLA Timer */}
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                                {/* Status Badge */}
                                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                                                    {/* Payment Badge */}
                                                    <span style={{
                                                        fontSize: '0.7rem',
                                                        fontWeight: 800,
                                                        padding: '4px 10px',
                                                        borderRadius: '16px',
                                                        background: isLunas ? '#dcfce7' : '#fee2e2',
                                                        color: isLunas ? '#166534' : '#991b1b',
                                                        border: `1px solid ${isLunas ? '#86efac' : '#fca5a5'}`
                                                    }}>
                                                        {isLunas ? '✓ LUNAS' : '✕ BELUM LUNAS'}
                                                    </span>

                                                    {/* Operational Status Badge */}
                                                    <span style={{
                                                        fontSize: '0.72rem',
                                                        fontWeight: 800,
                                                        padding: '4px 12px',
                                                        borderRadius: '16px',
                                                        background: isCompleted ? '#dcfce7' : '#fef3c7',
                                                        color: isCompleted ? '#15803d' : '#b45309',
                                                        border: `1px solid ${isCompleted ? '#86efac' : '#fde68a'}`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '5px'
                                                    }}>
                                                        {isCompleted ? (
                                                            <>
                                                                <CheckCircle2 size={13} />
                                                                <span>SELESAI</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Clock size={13} />
                                                                <span>DIPESAN</span>
                                                            </>
                                                        )}
                                                    </span>
                                                </div>

                                                {/* ── HITUNG MUNDUR OTOMATIS & SLA 15 MENIT ── */}
                                                {!isCompleted ? (
                                                    slaData.isOverdue ? (
                                                        <div style={{
                                                            background: '#fee2e2',
                                                            border: '1.5px solid #ef4444',
                                                            borderRadius: '12px',
                                                            padding: '6px 12px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            color: '#991b1b',
                                                            fontWeight: 800,
                                                            fontSize: '0.74rem',
                                                            boxShadow: '0 2px 6px rgba(239, 68, 68, 0.2)'
                                                        }}>
                                                            <AlertTriangle size={15} color="#dc2626" />
                                                            <span>⚠️ MELEBIHI SLA (+{slaData.timeFormatted})</span>
                                                        </div>
                                                    ) : (
                                                        <div style={{
                                                            background: '#eff6ff',
                                                            border: '1px solid #bfdbfe',
                                                            borderRadius: '12px',
                                                            padding: '6px 12px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            color: '#1d4ed8',
                                                            fontWeight: 800,
                                                            fontSize: '0.74rem'
                                                        }}>
                                                            <Clock size={15} color="#2563eb" />
                                                            <span>SLA 15 Menit: <strong>{slaData.timeFormatted}</strong> tersisa</span>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div style={{
                                                        background: slaData.metSla ? '#f0fdf4' : '#fffbeb',
                                                        border: `1px solid ${slaData.metSla ? '#86efac' : '#fde68a'}`,
                                                        borderRadius: '12px',
                                                        padding: '5px 12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        color: slaData.metSla ? '#166534' : '#92400e',
                                                        fontWeight: 800,
                                                        fontSize: '0.72rem'
                                                    }}>
                                                        <ShieldCheck size={14} color={slaData.metSla ? '#16a34a' : '#d97706'} />
                                                        <span>
                                                            Timer Berhenti: {slaData.durationText} ({slaData.metSla ? '✓ Memenuhi SLA' : 'Melebihi SLA'})
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Progress Bar Hitung Mundur Aktif */}
                                        {!isCompleted && !slaData.isOverdue && (
                                            <div style={{
                                                background: '#f1f5f9',
                                                borderRadius: '6px',
                                                height: '6px',
                                                overflow: 'hidden',
                                                marginBottom: '14px'
                                            }}>
                                                <div style={{
                                                    height: '100%',
                                                    width: `${slaData.progressPercent}%`,
                                                    background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
                                                    transition: 'width 1s linear'
                                                }} />
                                            </div>
                                        )}

                                        {/* ── RINCIAN DETAIL MENU YANG DIPESAN ── */}
                                        <div style={{
                                            background: '#f8fafc',
                                            borderRadius: '14px',
                                            padding: '14px 16px',
                                            border: '1px solid #e2e8f0',
                                            marginBottom: '14px'
                                        }}>
                                            <div style={{
                                                fontSize: '0.72rem',
                                                fontWeight: 800,
                                                color: '#64748b',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                marginBottom: '8px',
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}>
                                                <span>Rincian Makanan & Minuman ({items.length} Macam)</span>
                                                <span>Subtotal</span>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                {items.map((item, i) => (
                                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                                                        <span style={{ color: '#0f172a' }}>
                                                            <strong style={{ color: '#0284c7' }}>{item.qty}x</strong> {item.name}
                                                        </span>
                                                        <span style={{ fontWeight: 700, color: '#334155' }}>
                                                            Rp{((item.price || 0) * (item.qty || 1)).toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div style={{
                                                borderTop: '1px dashed #cbd5e1',
                                                paddingTop: '8px',
                                                marginTop: '8px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                                                    Metode Bayar: <strong style={{ textTransform: 'uppercase', color: '#0f172a' }}>{order.payment_method}</strong>
                                                </span>
                                                <span style={{ fontSize: '1rem', fontWeight: 900, color: '#ea580c' }}>
                                                    Total: Rp{(order.total_price || 0).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Kontak Pemesan & Catatan Khusus */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            flexWrap: 'wrap',
                                            gap: '10px',
                                            fontSize: '0.78rem',
                                            color: '#475569',
                                            marginBottom: '14px'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>WhatsApp: <strong style={{ color: '#0f172a' }}>{order.phone_number}</strong></span>
                                                <button
                                                    onClick={() => openWhatsApp(
                                                        order.phone_number,
                                                        order.customer_name,
                                                        order.order_code,
                                                        order.room_name,
                                                        normStatus
                                                    )}
                                                    className="wa-btn"
                                                    style={{ margin: 0, padding: '5px 10px', borderRadius: '8px' }}
                                                >
                                                    <MessageCircle size={13} /> Chat Pemesan
                                                </button>
                                            </div>

                                            {order.notes && (
                                                <div style={{
                                                    fontSize: '0.74rem',
                                                    background: '#fffbeb',
                                                    border: '1px solid #fde68a',
                                                    padding: '3px 8px',
                                                    borderRadius: '8px',
                                                    color: '#92400e'
                                                }}>
                                                    Catatan: "<strong>{order.notes}</strong>"
                                                </div>
                                            )}
                                        </div>

                                        {/* ── TOMBOL AKSI PETUGAS & CEKLIST SELESAI ── */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            flexWrap: 'wrap',
                                            gap: '12px',
                                            paddingTop: '12px',
                                            borderTop: '1px solid #e2e8f0'
                                        }}>
                                            {/* Status Pembayaran */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b' }}>Status Bayar:</span>
                                                {isLunas ? (
                                                    <button
                                                        onClick={() => onUpdatePayment(order.id, 'belum_lunas')}
                                                        style={{
                                                            padding: '5px 10px',
                                                            borderRadius: '8px',
                                                            background: '#fff1f2',
                                                            border: '1px solid #fecdd3',
                                                            color: '#e11d48',
                                                            fontSize: '0.72rem',
                                                            fontWeight: 700,
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Tandai Belum Lunas
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => onUpdatePayment(order.id, 'lunas')}
                                                        style={{
                                                            padding: '5px 12px',
                                                            borderRadius: '8px',
                                                            background: '#059669',
                                                            border: 'none',
                                                            color: '#ffffff',
                                                            fontSize: '0.72rem',
                                                            fontWeight: 800,
                                                            cursor: 'pointer',
                                                            boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)'
                                                        }}
                                                    >
                                                        ✓ Set Lunas (Terima Uang)
                                                    </button>
                                                )}
                                            </div>

                                            {/* ── CEKLIST SELESAI PETUGAS GIZI ── */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {!isCompleted ? (
                                                    <button
                                                        onClick={() => onUpdateStatus(order.id, 'selesai', order)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            padding: '10px 18px',
                                                            borderRadius: '12px',
                                                            background: '#059669',
                                                            border: 'none',
                                                            color: '#ffffff',
                                                            fontWeight: 900,
                                                            fontSize: '0.84rem',
                                                            cursor: 'pointer',
                                                            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        title="Klik jika makanan telah berhasil diantar dan diserahkan ke pasien"
                                                    >
                                                        <CheckSquare size={18} strokeWidth={2.4} />
                                                        <span>✓ Klik Centang Selesai (Diantar & Diserahkan)</span>
                                                    </button>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <span style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            padding: '8px 14px',
                                                            borderRadius: '12px',
                                                            background: '#ecfdf5',
                                                            border: '1px solid #86efac',
                                                            color: '#15803d',
                                                            fontWeight: 800,
                                                            fontSize: '0.8rem'
                                                        }}>
                                                            <CheckCircle2 size={16} /> Makanan Telah Selesai Diserahkan
                                                        </span>
                                                        <button
                                                            onClick={() => onUpdateStatus(order.id, 'dipesan', order)}
                                                            style={{
                                                                background: '#f8fafc',
                                                                border: '1px solid #cbd5e1',
                                                                borderRadius: '8px',
                                                                padding: '6px 10px',
                                                                fontSize: '0.7rem',
                                                                fontWeight: 700,
                                                                color: '#64748b',
                                                                cursor: 'pointer'
                                                            }}
                                                            title="Kembalikan status jika salah klik"
                                                        >
                                                            Batal Selesai
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ── TAB 2: KETERSEDIAAN MENU READY (CENTANG SATUAN & SEMUA) ── */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {subTab === 'menu' && (
                <div>
                    {/* Control Bar Ketersediaan Menu */}
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '18px',
                        padding: '18px 20px',
                        border: '1px solid #e2e8f0',
                        marginBottom: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                                    Pengaturan Menu Ready / Tersedia di Halaman Pasien (/makanan)
                                </h3>
                                <p style={{ margin: '3px 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                                    Centang menu yang siap dihidangkan hari ini. Hanya menu yang dicentang yang akan tampil dan dapat dipesan pasien.
                                </p>
                            </div>

                            {/* Tombol Centang Sekaligus (All) & Batal Centang */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => handleToggleAllMenus(true)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '9px 16px',
                                        borderRadius: '12px',
                                        background: '#059669',
                                        border: 'none',
                                        color: '#ffffff',
                                        fontSize: '0.8rem',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        boxShadow: '0 3px 10px rgba(5, 150, 105, 0.25)'
                                    }}
                                >
                                    <CheckSquare size={16} />
                                    <span>✓ Centang Semua (Ready Semua)</span>
                                </button>

                                <button
                                    onClick={() => handleToggleAllMenus(false)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '9px 14px',
                                        borderRadius: '12px',
                                        background: '#f8fafc',
                                        border: '1px solid #cbd5e1',
                                        color: '#dc2626',
                                        fontSize: '0.8rem',
                                        fontWeight: 800,
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Square size={16} />
                                    <span>Batal Centang Semua</span>
                                </button>
                            </div>
                        </div>

                        {/* Search and Category Filter for Menus */}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{
                                flex: '1 1 240px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: '#f8fafc',
                                padding: '10px 14px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <Search size={16} color="#64748b" />
                                <input
                                    type="text"
                                    placeholder="Cari nama menu hidangan gizi..."
                                    value={menuSearch}
                                    onChange={e => setMenuSearch(e.target.value)}
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        outline: 'none',
                                        fontSize: '0.82rem',
                                        width: '100%',
                                        color: '#0f172a',
                                        fontWeight: 600
                                    }}
                                />
                            </div>

                            {/* Category Filter */}
                            <select
                                value={menuCategory}
                                onChange={e => setMenuCategory(e.target.value)}
                                className="filter-dd"
                                style={{ minWidth: '160px' }}
                            >
                                <option value="all">Semua Kategori Menu</option>
                                <option value="makanan">🍛 Nasi & Lauk</option>
                                <option value="mie_sup">🍜 Mie, Soto & Sop</option>
                                <option value="minuman">🍹 Jus Buah Segar</option>
                            </select>
                        </div>
                    </div>

                    {/* Grid Daftar Menu dengan Centang Ketersediaan */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '16px'
                    }}>
                        {filteredMenus.map(item => {
                            const isAvailable = availableMenuIds.includes(item.id);

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleToggleMenu(item.id, item.name)}
                                    style={{
                                        background: '#ffffff',
                                        borderRadius: '18px',
                                        border: `2px solid ${isAvailable ? '#10b981' : '#e2e8f0'}`,
                                        padding: '16px',
                                        display: 'flex',
                                        gap: '14px',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: isAvailable
                                            ? '0 4px 14px rgba(16, 185, 129, 0.12)'
                                            : '0 2px 6px rgba(15, 23, 42, 0.02)',
                                        position: 'relative'
                                    }}
                                >
                                    {/* Thumbnail Makanan */}
                                    <div style={{
                                        width: '82px',
                                        height: '82px',
                                        borderRadius: '14px',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        position: 'relative',
                                        border: '1px solid #f1f5f9'
                                    }}>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                filter: isAvailable ? 'none' : 'grayscale(80%)'
                                            }}
                                        />
                                        {!isAvailable && (
                                            <div style={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'rgba(15, 23, 42, 0.45)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#ffffff',
                                                fontSize: '0.65rem',
                                                fontWeight: 900
                                            }}>
                                                HABIS
                                            </div>
                                        )}
                                    </div>

                                    {/* Detail Info Menu */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                            <span style={{
                                                fontSize: '0.66rem',
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                padding: '2px 6px',
                                                borderRadius: '6px',
                                                background: item.category === 'minuman' ? '#ecfdf5' : '#fff7ed',
                                                color: item.category === 'minuman' ? '#047857' : '#c2410c'
                                            }}>
                                                {item.category === 'minuman' ? 'Minuman' : item.category === 'mie_sup' ? 'Mie/Sup' : 'Makanan'}
                                            </span>
                                        </div>

                                        <h4 style={{
                                            margin: '0 0 2px',
                                            fontSize: '0.92rem',
                                            fontWeight: 800,
                                            color: '#0f172a',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {item.name}
                                        </h4>

                                        <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#ea580c', marginBottom: '6px' }}>
                                            Rp{item.price.toLocaleString('id-ID')}
                                        </div>

                                        {/* Status Centang Pill */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: isAvailable ? '#10b981' : '#f1f5f9',
                                                color: isAvailable ? '#ffffff' : '#94a3b8',
                                                border: `1.5px solid ${isAvailable ? '#10b981' : '#cbd5e1'}`
                                            }}>
                                                {isAvailable ? <Check size={14} strokeWidth={3} /> : null}
                                            </div>

                                            <span style={{
                                                fontSize: '0.72rem',
                                                fontWeight: 800,
                                                color: isAvailable ? '#059669' : '#64748b'
                                            }}>
                                                {isAvailable ? '✓ Ready (Tampil di /makanan)' : '✕ Habis (Disembunyikan)'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
