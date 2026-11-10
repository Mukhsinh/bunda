import React, { useState, useMemo } from 'react';
import {
    Utensils, Search, CheckCircle2, Clock, MapPin, Phone,
    AlertCircle, Filter, Check, RefreshCw, MessageCircle, DollarSign,
    PackageCheck, Truck, ChevronDown, Calendar, User
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminGiziTab({ orders = [], onUpdateStatus, onUpdatePayment, onRefresh, loading }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all | pending | diproses | diantar | diterima
    const [paymentFilter, setPaymentFilter] = useState('all'); // all | lunas | belum_lunas

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                (order.customer_name || '').toLowerCase().includes(search.toLowerCase()) ||
                (order.order_code || '').toLowerCase().includes(search.toLowerCase()) ||
                (order.room_name || '').toLowerCase().includes(search.toLowerCase()) ||
                (order.phone_number || '').includes(search);

            const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter;
            const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;

            return matchesSearch && matchesStatus && matchesPayment;
        });
    }, [orders, search, statusFilter, paymentFilter]);

    // Counts
    const counts = useMemo(() => {
        return {
            total: orders.length,
            pending: orders.filter(o => o.order_status === 'pending').length,
            diproses: orders.filter(o => o.order_status === 'diproses').length,
            diantar: orders.filter(o => o.order_status === 'diantar').length,
            diterima: orders.filter(o => o.order_status === 'diterima').length,
            lunas: orders.filter(o => o.payment_status === 'lunas').length,
            belumLunas: orders.filter(o => o.payment_status === 'belum_lunas').length
        };
    }, [orders]);

    const openWhatsApp = (phone, name, orderCode, roomName, status) => {
        if (!phone) {
            toast.error('Nomor telepon tidak valid');
            return;
        }
        let clean = phone.replace(/\D/g, '');
        if (clean.startsWith('0')) clean = '62' + clean.substring(1);
        const msg = `Halo ${name}, kami dari Instalasi Gizi RSUD Bendan mengonfirmasi pesanan makanan Anda (${orderCode}) untuk ${roomName}. Status saat ini: ${status}. Terima kasih!`;
        window.open(`https://wa.me/${clean}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <div className="animate-slide-up">
            {/* ── SCORECARDS RINGKASAN GIZI ── */}
            <div className="sc-grid">
                <div className="sc-card sc-blue">
                    <div className="sc-emoji">🍲</div>
                    <div className="sc-val">{counts.total}</div>
                    <div className="sc-lbl">Total Pesanan</div>
                </div>
                <div className="sc-card sc-amber">
                    <div className="sc-emoji">⏳</div>
                    <div className="sc-val">{counts.pending}</div>
                    <div className="sc-lbl">Menunggu Verifikasi</div>
                </div>
                <div className="sc-card sc-rose">
                    <div className="sc-emoji">🛵</div>
                    <div className="sc-val">{counts.diantar + counts.diproses}</div>
                    <div className="sc-lbl">Sedang Disiapkan/Diantar</div>
                </div>
                <div className="sc-card sc-green">
                    <div className="sc-emoji">✅</div>
                    <div className="sc-val">{counts.diterima}</div>
                    <div className="sc-lbl">Selesai Diterima</div>
                </div>
            </div>

            {/* ── FILTER & SEARCH BAR ── */}
            <div style={{
                background: 'white', borderRadius: '18px', padding: '18px',
                border: '1px solid #e2e8f0', marginBottom: '20px',
                display: 'flex', flexDirection: 'column', gap: '14px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '38px', height: '38px', borderRadius: '12px',
                            background: '#ffedd5', color: '#ea580c',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Utensils size={20} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>
                                Manajemen Orderan Makanan & Gizi
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b' }}>
                                Pantau pesanan pasien, status pembayaran, dan proses pengantaran ke kamar rawat
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onRefresh}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 14px', borderRadius: '12px',
                            background: '#f8fafc', border: '1px solid #e2e8f0',
                            fontSize: '0.78rem', fontWeight: 700, color: '#334155', cursor: 'pointer'
                        }}
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        <span>Segarkan Data</span>
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Search Input */}
                    <div style={{
                        flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: '8px',
                        background: '#f8fafc', padding: '8px 14px', borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <Search size={16} color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Cari nama pemesan, nomor kamar, kode..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                border: 'none', background: 'transparent', outline: 'none',
                                fontSize: '0.8rem', width: '100%', color: '#1e293b'
                            }}
                        />
                    </div>

                    {/* Status Pengantaran Filter */}
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="filter-dd"
                        style={{ minWidth: '150px' }}
                    >
                        <option value="all">Semua Status Pesanan</option>
                        <option value="pending">⏳ Menunggu (Pending)</option>
                        <option value="diproses">🍳 Sedang Dimasak</option>
                        <option value="diantar">🛵 Sedang Diantar</option>
                        <option value="diterima">✅ Sudah Diterima</option>
                    </select>

                    {/* Status Bayar Filter */}
                    <select
                        value={paymentFilter}
                        onChange={e => setPaymentFilter(e.target.value)}
                        className="filter-dd"
                        style={{ minWidth: '150px' }}
                    >
                        <option value="all">Semua Status Bayar</option>
                        <option value="lunas">🟢 LUNAS</option>
                        <option value="belum_lunas">🔴 BELUM LUNAS (COD)</option>
                    </select>
                </div>
            </div>

            {/* ── DAFTAR ORDERAN ── */}
            {filteredOrders.length === 0 ? (
                <div style={{
                    background: 'white', borderRadius: '20px', padding: '48px 20px',
                    textAlign: 'center', border: '1px solid #e2e8f0'
                }}>
                    <Utensils size={48} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
                    <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800, color: '#334155' }}>
                        Belum Ada Orderan Makanan
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                        Orderan baru dari halaman /makanan akan otomatis muncul di sini secara realtime
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {filteredOrders.map(order => {
                        const items = Array.isArray(order.items) ? order.items : [];
                        const isLunas = order.payment_status === 'lunas';

                        return (
                            <div
                                key={order.id}
                                className="admin-card"
                                style={{
                                    borderLeft: `4px solid ${
                                        order.order_status === 'diterima'
                                            ? '#16a34a'
                                            : order.order_status === 'diantar'
                                                ? '#3b82f6'
                                                : order.order_status === 'diproses'
                                                    ? '#f59e0b'
                                                    : '#ea580c'
                                    }`,
                                    position: 'relative'
                                }}
                            >
                                {/* Header Kartu */}
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px',
                                    marginBottom: '12px'
                                }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                fontSize: '0.75rem', fontWeight: 900,
                                                color: '#ea580c', background: '#ffedd5',
                                                padding: '2px 8px', borderRadius: '8px'
                                            }}>
                                                {order.order_code}
                                            </span>
                                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                                {new Date(order.created_at).toLocaleString('id-ID')}
                                            </span>
                                        </div>

                                        <h3 style={{
                                            margin: '6px 0 2px', fontSize: '1.05rem', fontWeight: 800,
                                            color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif"
                                        }}>
                                            {order.customer_name}
                                        </h3>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                                            <MapPin size={14} color="#ea580c" />
                                            <span>Ruang: <strong>{order.room_name}</strong></span>
                                        </div>
                                    </div>

                                    {/* Badges Status */}
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                                        {/* Badge Bayar */}
                                        <span style={{
                                            fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px',
                                            borderRadius: '20px',
                                            background: isLunas ? '#dcfce7' : '#fee2e2',
                                            color: isLunas ? '#166534' : '#991b1b',
                                            border: `1px solid ${isLunas ? '#86efac' : '#fecaca'}`
                                        }}>
                                            {isLunas ? '✓ LUNAS' : '✕ BELUM LUNAS'}
                                        </span>

                                        {/* Badge Order Status */}
                                        <span style={{
                                            fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px',
                                            borderRadius: '20px',
                                            background:
                                                order.order_status === 'diterima'
                                                    ? '#dcfce7'
                                                    : order.order_status === 'diantar'
                                                        ? '#dbeafe'
                                                        : order.order_status === 'diproses'
                                                            ? '#fef3c7'
                                                            : '#ffedd5',
                                            color:
                                                order.order_status === 'diterima'
                                                    ? '#15803d'
                                                    : order.order_status === 'diantar'
                                                        ? '#1d4ed8'
                                                        : order.order_status === 'diproses'
                                                            ? '#b45309'
                                                            : '#c2410c'
                                        }}>
                                            {order.order_status === 'diterima'
                                                ? 'Sudah Diterima'
                                                : order.order_status === 'diantar'
                                                    ? 'Sedang Diantar'
                                                    : order.order_status === 'diproses'
                                                        ? 'Sedang Dimasak'
                                                        : 'Menunggu'}
                                        </span>
                                    </div>
                                </div>

                                {/* Detail Item Menu */}
                                <div style={{
                                    background: '#f8fafc', borderRadius: '12px', padding: '12px 14px',
                                    border: '1px solid #f1f5f9', marginBottom: '12px'
                                }}>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                                        Rincian Pesanan Menu ({items.length} Macam)
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {items.map((item, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                                <span style={{ color: '#1e293b' }}>
                                                    <strong>{item.qty}x</strong> {item.name}
                                                </span>
                                                <span style={{ fontWeight: 700, color: '#475569' }}>
                                                    Rp{((item.price || 0) * (item.qty || 1)).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{
                                        borderTop: '1px dashed #cbd5e1', paddingTop: '6px', marginTop: '6px',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                                            Metode: <strong style={{ textTransform: 'uppercase', color: '#0f172a' }}>{order.payment_method}</strong>
                                        </span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ea580c' }}>
                                            Total: Rp{(order.total_price || 0).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>

                                {/* Kontak & Catatan */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    flexWrap: 'wrap', gap: '10px', fontSize: '0.78rem', color: '#64748b',
                                    marginBottom: '14px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>📞 WhatsApp: <strong>{order.phone_number}</strong></span>
                                        <button
                                            onClick={() => openWhatsApp(
                                                order.phone_number,
                                                order.customer_name,
                                                order.order_code,
                                                order.room_name,
                                                order.order_status
                                            )}
                                            className="wa-btn"
                                            style={{ margin: 0 }}
                                        >
                                            <MessageCircle size={12} /> Hubungi Pemesan
                                        </button>
                                    </div>
                                    {order.notes && (
                                        <div style={{ fontSize: '0.72rem', fontStyle: 'italic', color: '#94a3b8' }}>
                                            Catatan: "{order.notes}"
                                        </div>
                                    )}
                                </div>

                                {/* ── TOMBOL AKSI PETUGAS GIZI ── */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    flexWrap: 'wrap', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9'
                                }}>
                                    {/* Aksi Bayar */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>Pembayaran:</span>
                                        {isLunas ? (
                                            <button
                                                onClick={() => onUpdatePayment(order.id, 'belum_lunas')}
                                                style={{
                                                    padding: '5px 10px', borderRadius: '8px',
                                                    background: '#fff1f2', border: '1px solid #fecdd3',
                                                    color: '#e11d48', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer'
                                                }}
                                            >
                                                Tandai Belum Lunas
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => onUpdatePayment(order.id, 'lunas')}
                                                style={{
                                                    padding: '5px 12px', borderRadius: '8px',
                                                    background: '#16a34a', border: 'none',
                                                    color: 'white', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer',
                                                    boxShadow: '0 2px 6px rgba(22,163,74,0.3)'
                                                }}
                                            >
                                                ✓ Set Lunas (Terima Uang)
                                            </button>
                                        )}
                                    </div>

                                    {/* Aksi Alur Status Pengantaran */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>Alur Antar:</span>
                                        {order.order_status === 'pending' && (
                                            <button
                                                onClick={() => onUpdateStatus(order.id, 'diproses', order)}
                                                style={{
                                                    padding: '6px 14px', borderRadius: '10px',
                                                    background: '#f59e0b', color: 'white', border: 'none',
                                                    fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer'
                                                }}
                                            >
                                                Proses Masak
                                            </button>
                                        )}

                                        {(order.order_status === 'pending' || order.order_status === 'diproses') && (
                                            <button
                                                onClick={() => onUpdateStatus(order.id, 'diantar', order)}
                                                style={{
                                                    padding: '6px 14px', borderRadius: '10px',
                                                    background: '#2563eb', color: 'white', border: 'none',
                                                    fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer'
                                                }}
                                            >
                                                🛵 Diantar ke Kamar
                                            </button>
                                        )}

                                        {order.order_status !== 'diterima' && (
                                            <button
                                                onClick={() => onUpdateStatus(order.id, 'diterima', order)}
                                                style={{
                                                    padding: '6px 14px', borderRadius: '10px',
                                                    background: '#16a34a', color: 'white', border: 'none',
                                                    fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                                                    boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
                                                }}
                                            >
                                                ✅ Sudah Diterima Pasien
                                            </button>
                                        )}

                                        {order.order_status === 'diterima' && (
                                            <span style={{
                                                fontSize: '0.72rem', color: '#16a34a', fontWeight: 800,
                                                display: 'flex', alignItems: 'center', gap: '4px'
                                            }}>
                                                <CheckCircle2 size={16} /> Pesanan Selesai
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

