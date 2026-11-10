import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Navigation, ShoppingBag, Plus, Minus,
    CheckCircle2, X, QrCode, CreditCard, Banknote, ShieldCheck,
    AlertCircle, Sparkles, Clock, Utensils, Info, Share2, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

// Titik Koordinat Resmi RSUD Bendan Kota Pekalongan
const RSUD_BENDAN_COORDS = {
    lat: -6.89147,
    lng: 109.66152,
    name: 'RSUD Bendan Kota Pekalongan',
    address: 'Jl. Sriwijaya No. 2, Bendan, Kota Pekalongan'
};

// Toleransi radius geofence (dalam meter)
const GEOFENCE_RADIUS_METERS = 800;

// Rumus Haversine untuk kalkulasi jarak GPS presisi tinggi (meter)
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // radius bumi dalam meter
    const toRad = deg => (deg * Math.PI) / 180;
    const phi1 = toRad(lat1);
    const phi2 = toRad(lat2);
    const deltaPhi = toRad(lat2 - lat1);
    const deltaLambda = toRad(lon2 - lon1);

    const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
}

// Daftar Menu Makanan & Tarif Resmi (GoFood Style - Menampilkan Menu & Tarif Saja)
const MENU_ITEMS = [
    {
        id: 1,
        category: 'makanan',
        name: 'Geprek Juara',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 2,
        category: 'makanan',
        name: 'Nasi Rasa Rumah',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 3,
        category: 'makanan',
        name: 'Nasi Goreng Nagih',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 4,
        category: 'mie_sup',
        name: 'Mie Hangat Bahagia',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 5,
        category: 'mie_sup',
        name: 'Kwietiau Mantul',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 6,
        category: 'mie_sup',
        name: 'Soto Gurih Penuh Rasa',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 7,
        category: 'mie_sup',
        name: 'Sop Ayam Dapur Ibu',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 8,
        category: 'makanan',
        name: 'Nasi Wangi Daun Jeruk',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 9,
        category: 'makanan',
        name: 'Nasi Balado Pedas Manja',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 10,
        category: 'makanan',
        name: 'Teriyaki Sakura Bowl',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 11,
        category: 'makanan',
        name: 'Pecak Panggang Sayur Asem',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 12,
        category: 'makanan',
        name: 'Nasi Ikan Goreng Sambal Mantul',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 13,
        category: 'minuman',
        name: 'Aneka Jus Buah',
        price: 7000,
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 14,
        category: 'minuman',
        name: 'Jus Buah Apokat',
        price: 8000,
        image: 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 15,
        category: 'minuman',
        name: 'Jus Campur Rame Rasa',
        price: 10000,
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80'
    }
];

export default function MenuMakanan() {
    const navigate = useNavigate();

    // Geolocation States
    const [geoStatus, setGeoStatus] = useState('checking'); // 'checking' | 'inside' | 'outside' | 'error'
    const [userDistance, setUserDistance] = useState(null);
    const [userCoords, setUserCoords] = useState(null);
    const [demoSimulation, setDemoSimulation] = useState(false);

    // Filter & Cart States
    const [activeCategory, setActiveCategory] = useState('all');
    const [cart, setCart] = useState({}); // { [id]: quantity }
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);

    // Form Checkout
    const [orderForm, setOrderForm] = useState({
        customerName: '',
        phoneNumber: '',
        roomName: 'Ruang Nifas VK',
        notes: '',
        paymentMethod: 'qris' // 'qris' | 'va' | 'cod'
    });

    // Cek Geolocation saat Komponen Dimuat
    useEffect(() => {
        checkUserLocation();
    }, [demoSimulation]);

    const checkUserLocation = () => {
        if (demoSimulation) {
            setGeoStatus('inside');
            setUserDistance(45);
            return;
        }

        if (!navigator.geolocation) {
            setGeoStatus('outside');
            return;
        }

        setGeoStatus('checking');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setUserCoords({ lat, lng });

                const distance = calculateHaversineDistance(
                    lat, lng,
                    RSUD_BENDAN_COORDS.lat, RSUD_BENDAN_COORDS.lng
                );
                setUserDistance(distance);

                if (distance <= GEOFENCE_RADIUS_METERS) {
                    setGeoStatus('inside');
                } else {
                    setGeoStatus('outside');
                }
            },
            (err) => {
                console.warn('Geolocation error / permission denied:', err);
                // Default ke status outside tetapi izinkan simulasi demo
                setGeoStatus('outside');
                setUserDistance(1250);
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
        );
    };

    // Cart Handlers
    const addToCart = (id) => {
        setCart(prev => ({
            ...prev,
            [id]: (prev[id] || 0) + 1
        }));
        toast.success('Ditambahkan ke keranjang!', { duration: 1500 });
    };

    const removeFromCart = (id) => {
        setCart(prev => {
            const next = { ...prev };
            if (next[id] > 1) {
                next[id] -= 1;
            } else {
                delete next[id];
            }
            return next;
        });
    };

    // Perhitungan Total
    const cartItemIds = Object.keys(cart).filter(id => cart[id] > 0);
    const totalItems = cartItemIds.reduce((sum, id) => sum + cart[id], 0);
    const totalPrice = cartItemIds.reduce((sum, id) => {
        const item = MENU_ITEMS.find(m => m.id === parseInt(id));
        return sum + (item ? item.price * cart[id] : 0);
    }, 0);

    // Submit Pesanan
    const handleProcessOrder = (e) => {
        e.preventDefault();
        if (!orderForm.customerName || !orderForm.phoneNumber) {
            toast.error('Harap isi nama dan nomor WhatsApp Anda!');
            return;
        }

        const orderCode = 'GZ-' + Math.floor(10000 + Math.random() * 90000);
        const orderSummary = {
            orderCode,
            customerName: orderForm.customerName,
            phoneNumber: orderForm.phoneNumber,
            roomName: orderForm.roomName,
            notes: orderForm.notes,
            paymentMethod: orderForm.paymentMethod,
            totalPrice,
            items: cartItemIds.map(id => {
                const item = MENU_ITEMS.find(m => m.id === parseInt(id));
                return {
                    name: item.name,
                    qty: cart[id],
                    price: item.price
                };
            }),
            orderedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        };

        setOrderSuccess(orderSummary);
        setShowCheckoutModal(false);
        setCart({});
        toast.success('Pemesanan & Pembayaran Berhasil Dikonfirmasi!');
    };

    const filteredMenu = activeCategory === 'all'
        ? MENU_ITEMS
        : MENU_ITEMS.filter(m => m.category === activeCategory);

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: totalItems > 0 ? '110px' : '40px' }} className="animate-slide-up">
            {/* ── HEADER RESTORAN GIZI (GoFood Style) ── */}
            <div style={{
                background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 60%, #9a3412 100%)',
                padding: '20px 16px 40px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '0 0 28px 28px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', position: 'relative', zIndex: 10 }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'rgba(255,255,255,0.2)', border: 'none',
                            color: 'white', width: '38px', height: '38px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', backdropFilter: 'blur(6px)'
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.25)', padding: '4px 10px', borderRadius: '12px', fontWeight: 800 }}>
                            INSTALASI GIZI RSUD BENDAN
                        </span>
                    </div>
                </div>

                <div style={{ position: 'relative', zIndex: 10 }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Dapur Gizi Sehat Bendan
                    </h1>
                    <p style={{ margin: '4px 0 12px', fontSize: '0.8rem', color: '#ffedd5', lineHeight: 1.4 }}>
                        Menu Lezat, Sehat & Higienis Siap Diantar Langsung ke Kamar Pasien
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 800, background: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '8px' }}>
                            ⭐ 4.9 (500+ Ulasan)
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#fed7aa' }}>
                            <Clock size={14} /> 15 - 25 Menit Pengantaran
                        </div>
                    </div>
                </div>
            </div>

            {/* ── GEOFENCING STATUS BADGE ── */}
            <div style={{ padding: '0 16px', marginTop: '-20px', position: 'relative', zIndex: 20, marginBottom: '16px' }}>
                <div style={{
                    background: 'white', borderRadius: '18px', padding: '14px 18px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: geoStatus === 'inside' ? '#dcfce7' : '#fee2e2',
                            color: geoStatus === 'inside' ? '#16a34a' : '#dc2626',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <MapPin size={20} />
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{
                                    fontSize: '0.75rem', fontWeight: 800,
                                    color: geoStatus === 'inside' ? '#166534' : '#991b1b'
                                }}>
                                    {geoStatus === 'inside'
                                        ? '🟢 Terverifikasi di Area RSUD Bendan'
                                        : geoStatus === 'checking'
                                            ? '⏳ Mendeteksi Koordinat Anda...'
                                            : '🔴 Di Luar Jangkauan RSUD Bendan'}
                                </span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748b' }}>
                                {geoStatus === 'inside'
                                    ? `Layanan kamar aktif (Jarak: ${userDistance || 0}m dari pusat RSUD)`
                                    : `Pemesanan khusus pasien & penunggu di RSUD Bendan (Jarak Anda: ${userDistance ? Math.round(userDistance) + 'm' : 'di luar area'})`}
                            </p>
                        </div>
                    </div>

                    {/* Simulation Switch for Demo/Developer */}
                    <button
                        onClick={() => {
                            setDemoSimulation(!demoSimulation);
                            toast.success(!demoSimulation ? 'Mode Simulasi Area RSUD Bendan Diaktifkan!' : 'Kembali ke GPS perangkat.');
                        }}
                        style={{
                            padding: '6px 12px', borderRadius: '12px', border: '1px solid #fed7aa',
                            background: demoSimulation ? '#ea580c' : '#fff7ed',
                            color: demoSimulation ? 'white' : '#c2410c',
                            fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer'
                        }}
                    >
                        {demoSimulation ? 'Matikan Simulasi' : '⚡ Simulasi di RSUD'}
                    </button>
                </div>
            </div>

            {/* Peringatan jika di luar area */}
            {geoStatus === 'outside' && (
                <div style={{ padding: '0 16px', marginBottom: '16px' }}>
                    <div style={{
                        background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px',
                        padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px'
                    }}>
                        <AlertCircle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div style={{ fontSize: '0.75rem', color: '#991b1b', lineHeight: 1.45 }}>
                            <strong>Informasi Geofencing:</strong> Pemesanan menu makanan hanya diproses saat berada di wilayah RSUD Bendan Pekalongan untuk memastikan kesegaran hidangan yang diantar ke kamar. Anda dapat menekan tombol <strong>"⚡ Simulasi di RSUD"</strong> di atas untuk mencoba fitur ini.
                        </div>
                    </div>
                </div>
            )}

            {/* ── KATEGORI MENU (GoFood Pill Style) ── */}
            <div style={{
                display: 'flex', gap: '8px', overflowX: 'auto', padding: '0 16px 16px',
                scrollbarWidth: 'none'
            }}>
                {[
                    { id: 'all', label: 'Semua Menu' },
                    { id: 'makanan', label: '🍛 Nasi & Lauk' },
                    { id: 'mie_sup', label: '🍜 Mie & Soto/Sop' },
                    { id: 'minuman', label: '🍹 Aneka Jus Buah' }
                ].map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        style={{
                            whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: '20px',
                            border: activeCategory === cat.id ? 'none' : '1px solid #e2e8f0',
                            background: activeCategory === cat.id ? '#ea580c' : 'white',
                            color: activeCategory === cat.id ? 'white' : '#475569',
                            fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer',
                            boxShadow: activeCategory === cat.id ? '0 4px 12px rgba(234, 88, 12, 0.25)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* ── LIST MENU MAKANAN (GoFood Card Layout) ── */}
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filteredMenu.map(item => {
                    const qtyInCart = cart[item.id] || 0;

                    return (
                        <div
                            key={item.id}
                            style={{
                                background: 'white', borderRadius: '20px', padding: '14px',
                                border: '1px solid #f1f5f9', boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                                display: 'flex', gap: '14px', alignItems: 'center'
                            }}
                        >
                            {/* Gambar Makanan HD Menggugah Selera */}
                            <div style={{
                                width: '100px', height: '100px', borderRadius: '16px',
                                overflow: 'hidden', flexShrink: 0, position: 'relative'
                            }}>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            {/* Info Menu & Tarif (Hanya Menu dan Tarif Saja) */}
                            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
                                <h3 style={{
                                    margin: 0, fontSize: '0.96rem', fontWeight: 800,
                                    color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    lineHeight: 1.35
                                }}>
                                    {item.name}
                                </h3>

                                {/* Tarif & Tombol Tambah */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                                    <span style={{
                                        fontSize: '1.05rem', fontWeight: 900, color: '#ea580c',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                                    }}>
                                        Rp{item.price.toLocaleString('id-ID')}
                                    </span>

                                    {/* Action Add / Qty Control */}
                                    {qtyInCart === 0 ? (
                                        <button
                                            onClick={() => addToCart(item.id)}
                                            disabled={geoStatus === 'outside'}
                                            style={{
                                                padding: '6px 16px', borderRadius: '14px',
                                                background: geoStatus === 'outside' ? '#cbd5e1' : '#ea580c',
                                                color: 'white', border: 'none', fontWeight: 800,
                                                fontSize: '0.78rem', cursor: geoStatus === 'outside' ? 'not-allowed' : 'pointer',
                                                boxShadow: geoStatus === 'outside' ? 'none' : '0 3px 10px rgba(234, 88, 12, 0.3)'
                                            }}
                                        >
                                            + Tambah
                                        </button>
                                    ) : (
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                            background: '#fff7ed', border: '1px solid #fed7aa',
                                            padding: '3px 8px', borderRadius: '12px'
                                        }}>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                style={{ background: 'none', border: 'none', color: '#c2410c', cursor: 'pointer', display: 'flex' }}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#9a3412', minWidth: '16px', textAlign: 'center' }}>
                                                {qtyInCart}
                                            </span>
                                            <button
                                                onClick={() => addToCart(item.id)}
                                                style={{ background: 'none', border: 'none', color: '#c2410c', cursor: 'pointer', display: 'flex' }}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── FLOATING CART BAR (GoFood Style) ── */}
            {totalItems > 0 && (
                <div style={{
                    position: 'fixed', bottom: '20px', left: '16px', right: '16px',
                    maxWidth: '448px', margin: '0 auto', zIndex: 100
                }}>
                    <div
                        onClick={() => setShowCheckoutModal(true)}
                        style={{
                            background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                            color: 'white', borderRadius: '20px', padding: '14px 20px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            boxShadow: '0 12px 30px rgba(234, 88, 12, 0.45)', cursor: 'pointer',
                            animation: 'bounceIn 0.3s ease'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                background: 'rgba(255,255,255,0.2)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', fontWeight: 900
                            }}>
                                <ShoppingBag size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#ffedd5', fontWeight: 600 }}>
                                    {totalItems} Menu Terpilih
                                </div>
                                <div style={{ fontSize: '1.05rem', fontWeight: 900, fontFamily: "'Plus Jakarta Sans'" }}>
                                    Rp{totalPrice.toLocaleString('id-ID')}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 800 }}>
                            <span>Lanjut Pesan</span>
                            <ChevronRight size={18} />
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL CHECKOUT & PEMBAYARAN LANGSUNG ── */}
            {showCheckoutModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.75)',
                    backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end',
                    justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'white', borderRadius: '28px 28px 0 0', padding: '24px',
                        width: '100%', maxWidth: '480px', maxHeight: '88vh', overflowY: 'auto',
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, fontFamily: "'Plus Jakarta Sans'" }}>
                                    Konfirmasi & Pembayaran
                                </h3>
                                <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b' }}>
                                    Pengantaran langsung ke kamar pasien RSUD Bendan
                                </p>
                            </div>
                            <button
                                onClick={() => setShowCheckoutModal(false)}
                                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                                <X size={18} color="#64748b" />
                            </button>
                        </div>

                        <form onSubmit={handleProcessOrder} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Rincian Menu */}
                            <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '14px', border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>
                                    Ringkasan Menu
                                </div>
                                {cartItemIds.map(id => {
                                    const item = MENU_ITEMS.find(m => m.id === parseInt(id));
                                    const itemTotal = item.price * cart[id];
                                    return (
                                        <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginBottom: '6px' }}>
                                            <span style={{ color: '#1e293b' }}>
                                                {cart[id]}x <strong>{item.name}</strong>
                                            </span>
                                            <span style={{ fontWeight: 800, color: '#0f172a' }}>
                                                Rp{itemTotal.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    );
                                })}
                                <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '0.9rem', color: '#ea580c' }}>
                                    <span>Total Tagihan:</span>
                                    <span>Rp{totalPrice.toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            {/* Data Antar Ruangan */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                        Nama Pasien / Pemesan
                                    </label>
                                    <input
                                        type="text" required
                                        placeholder="Contoh: Bunda Rina / Bpk. Rudi"
                                        value={orderForm.customerName}
                                        onChange={e => setOrderForm(p => ({ ...p, customerName: e.target.value }))}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                        Ruang / Kamar di RSUD Bendan
                                    </label>
                                    <select
                                        value={orderForm.roomName}
                                        onChange={e => setOrderForm(p => ({ ...p, roomName: e.target.value }))}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none', background: 'white' }}
                                    >
                                        <option value="Ruang Nifas VK (Lantai 2)">Ruang Nifas VK (Lantai 2)</option>
                                        <option value="Ruang Melati (Lantai 2)">Ruang Melati (Lantai 2)</option>
                                        <option value="Ruang Flamboyan (Lantai 3)">Ruang Flamboyan (Lantai 3)</option>
                                        <option value="Ruang Bougenville (Lantai 3)">Ruang Bougenville (Lantai 3)</option>
                                        <option value="Ruang Perinatologi (Bayi)">Ruang Perinatologi (Bayi)</option>
                                        <option value="Lobby Utama / Penunggu Pasien">Lobby Utama / Penunggu Pasien</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                        Nomor WhatsApp (Untuk Notifikasi Pengantaran)
                                    </label>
                                    <input
                                        type="tel" required
                                        placeholder="Contoh: 081234567890"
                                        value={orderForm.phoneNumber}
                                        onChange={e => setOrderForm(p => ({ ...p, phoneNumber: e.target.value }))}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Pilihan Metode Pembayaran */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                                    Metode Pembayaran
                                </label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {[
                                        { id: 'qris', label: 'QRIS Instan (GoPay, OVO, Dana, BCA, Livin)', icon: QrCode, badge: 'Rekomendasi' },
                                        { id: 'va', label: 'Virtual Account Bank (BCA, BRI, Mandiri)', icon: CreditCard, badge: 'Otomatis' },
                                        { id: 'cod', label: 'Bayar Tunai di Kamar Pasien (COD Kasir Gizi)', icon: Banknote, badge: 'Tunai' }
                                    ].map(pay => (
                                        <label
                                            key={pay.id}
                                            onClick={() => setOrderForm(p => ({ ...p, paymentMethod: pay.id }))}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '10px 14px', borderRadius: '12px', cursor: 'pointer',
                                                border: orderForm.paymentMethod === pay.id ? '2px solid #ea580c' : '1px solid #e2e8f0',
                                                background: orderForm.paymentMethod === pay.id ? '#fff7ed' : '#f8fafc'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <pay.icon size={18} color={orderForm.paymentMethod === pay.id ? '#ea580c' : '#64748b'} />
                                                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b' }}>{pay.label}</span>
                                            </div>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ea580c', background: '#ffedd5', padding: '2px 6px', borderRadius: '6px' }}>
                                                {pay.badge}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Tombol Konfirmasi Bayar */}
                            <button
                                type="submit"
                                style={{
                                    marginTop: '8px', padding: '14px', borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                                    color: 'white', border: 'none', fontWeight: 800,
                                    fontSize: '0.95rem', cursor: 'pointer',
                                    boxShadow: '0 6px 18px rgba(234, 88, 12, 0.35)'
                                }}
                            >
                                Bayar Sekarang & Konfirmasi Pesanan
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── RESI PEMESANAN & STRUK DIGITAL (Setelah Berhasil) ── */}
            {orderSuccess && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.8)',
                    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000, padding: '20px'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '24px', padding: '28px 24px',
                        width: '100%', maxWidth: '400px', textAlign: 'center',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.3)', position: 'relative'
                    }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '50%',
                            background: '#dcfce7', color: '#16a34a', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px'
                        }}>
                            <CheckCircle2 size={32} />
                        </div>

                        <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 900, fontFamily: "'Plus Jakarta Sans'" }}>
                            Pesanan & Pembayaran Berhasil!
                        </h3>
                        <p style={{ margin: '0 0 16px', fontSize: '0.75rem', color: '#64748b' }}>
                            Dapur Gizi RSUD Bendan sedang menyiapkan hidangan sehat Anda
                        </p>

                        {/* Struk Box */}
                        <div style={{
                            background: '#f8fafc', borderRadius: '16px', padding: '16px',
                            border: '1px solid #e2e8f0', textAlign: 'left', marginBottom: '20px',
                            fontSize: '0.78rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ color: '#64748b' }}>Nomor Pesanan:</span>
                                <span style={{ fontWeight: 800, color: '#ea580c' }}>{orderSuccess.orderCode}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ color: '#64748b' }}>Penerima:</span>
                                <span style={{ fontWeight: 700, color: '#1e293b' }}>{orderSuccess.customerName}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ color: '#64748b' }}>Ruang Antar:</span>
                                <span style={{ fontWeight: 700, color: '#1e293b' }}>{orderSuccess.roomName}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#64748b' }}>Metode Bayar:</span>
                                <span style={{ fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>
                                    {orderSuccess.paymentMethod} (Lunas)
                                </span>
                            </div>
                            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 900, color: '#0f172a' }}>
                                <span>Total Biaya:</span>
                                <span>Rp{orderSuccess.totalPrice.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setOrderSuccess(null);
                                navigate('/');
                            }}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '14px',
                                background: '#ea580c', color: 'white', border: 'none',
                                fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer'
                            }}
                        >
                            Selesai & Kembali ke Beranda
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

