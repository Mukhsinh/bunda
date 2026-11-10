import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search, Clock, Phone, Shield, Star, MessageSquare, Send, ChevronDown,
    HelpCircle, CheckCircle, Zap, Calculator,
    BookOpen, User, MessageCircle, Edit3,
    FileText, Navigation, Heart, Activity, ShieldPlus,
    Video, MonitorPlay, ClipboardList, Info, Ambulance, ChevronRight,
    Sparkles, ArrowRight, Bell, Calendar, MapPin, Truck, ExternalLink, QrCode, UtensilsCrossed
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import PrayerTimesWidget from '../components/PrayerTimesWidget';
import { useAppLogo } from '../hooks/useAppLogo';

/* ════════════════ FAQ SECTION ════════════════ */
function FAQSection({ inlineMode = false }) {
    const [isOpen, setIsOpen] = useState(inlineMode);
    const [activeQ, setActiveQ] = useState(null);

    const faqs = [
        {
            icon: '📋',
            q: 'Apa itu layanan Sahabat Bunda?',
            a: 'Sahabat Bunda adalah ekosistem layanan inovatif RSUD Bendan yang mendampingi Bunda sejak masa persalinan hingga pemulihan.\n\n✨ Fitur Unggulan:\n• 🟢 RAMAH: Registrasi Akta Mudah (Gratis & Tuntas)\n• 🟢 SANTUN: Layanan Antar-Jemput Pasien (Gratis)\n• 🟢 SINERGI: Konsultasi Online Ahli Gizi\n• 🟢 BEMBI: Emergency Ambulance 24 Jam\n• 🟢 EMPATI: Edukasi Video Medis Profesional\n• 🟢 SEHATI: Deteksi Gizi Balita (Standar Kemenkes)\n• 🟢 VAKSIN: Penjadwalan Imunisasi Otomatis\n• 🟢 AL-QUR\'AN: Support Ketenangan Spiritual'
        },
        {
            icon: '🎁',
            q: 'Apa manfaat yang saya peroleh?',
            a: '🎁 Layanan RAMAH:\n   Pengurusan akta lahir gratis dan dokumen kependudukan lengkap diantar langsung ke rumah.\n\n🚗 Layanan SANTUN:\n   Fasilitas antar jemput pasien pasca melahirkan gratis khusus wilayah Kota Pekalongan.'
        },
        {
            icon: '📝',
            q: 'Bagaimana cara mengisi formulir?',
            a: '1️⃣ Pilih Menu Layanan yang diinginkan.\n2️⃣ Isi Data Diri & Medis secara lengkap.\n3️⃣ Unggah Dokumen (KTP Pasutri/SKL).\n4️⃣ Klik Kirim dan simpan kode lacak Anda.'
        },
        {
            icon: '⏱️',
            q: 'Berapa lama prosesnya?',
            a: '⌛ RAMAH:\n   Estimasi penyelesaian berkas 7 hari kerja.\n\n🚀 SANTUN:\n   Langsung diproses sesuai antrean & ketersediaan armada RSUD Bendan.'
        },
        {
            icon: '💬',
            q: 'Bagaimana jika saya bingung?',
            a: 'Bunda dapat langsung menghubungi Admin melalui tombol WhatsApp di halaman utama untuk mendapatkan panduan atau bantuan langsung dari petugas kami.'
        },
        {
            icon: '📽️',
            q: 'Apa itu layanan SINERGI?',
            a: 'SINERGI adalah layanan Konsultasi Online melalui Video Call eksklusif dengan Ahli Gizi RSUD Bendan. Layanan ini memudahkan Bunda untuk berkonsultasi mengenai asupan gizi bunda, buah hati, dan lainnya tanpa harus datang ke rumah sakit.'
        },
        {
            icon: '🚑',
            q: 'Apa itu layanan BEMBI?',
            a: 'BEMBI (Bendan Emergency Mobile) adalah layanan ambulance panggil cepat RSUD Bendan untuk kondisi kegawatdaruratan Pasien (termasuk Ibu dan Bayi). Layanan ini siaga 24 jam untuk menjamin kecepatan penanganan medis.'
        }
    ];

    return (
        <div style={{ marginTop: inlineMode ? '0' : '20px' }}>
            {!inlineMode && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        width: '100%', padding: '16px 18px',
                        background: isOpen
                            ? 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)'
                            : 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '20px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease',
                        boxShadow: isOpen ? '0 10px 25px rgba(79, 70, 229, 0.2)' : '0 2px 10px rgba(0,0,0,0.03)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: isOpen ? 'rgba(255,255,255,0.2)' : '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <HelpCircle size={20} color={isOpen ? 'white' : '#4f46e5'} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: isOpen ? 'white' : '#1e293b', fontFamily: "'Outfit', sans-serif" }}>FAQ & Bantuan Layanan</h4>
                            <p style={{ fontSize: '0.72rem', margin: 0, color: isOpen ? 'rgba(255,255,255,0.8)' : '#64748b' }}>Jawaban atas pertanyaan umum seputar Sahabat Bunda</p>
                        </div>
                    </div>
                    <ChevronDown size={20} color={isOpen ? 'white' : '#4f46e5'} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                </button>
            )}
            {(isOpen || inlineMode) && (
                <div style={{ marginTop: inlineMode ? '0' : '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {faqs.map((f, i) => (
                        <div key={i} style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                            <button onClick={() => setActiveQ(activeQ === i ? null : i)} style={{ width: '100%', border: 'none', background: 'transparent', padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                                <span style={{ fontSize: '1.1rem' }}>{f.icon}</span>
                                <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>{f.q}</span>
                                <ChevronDown size={14} color="#94a3b8" style={{ transform: activeQ === i ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                            </button>
                            {activeQ === i && <div style={{ padding: '0 18px 14px 44px', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{f.a}</div>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ════════════════ TESTIMONIALS ════════════════ */
function TestimonialSection() {
    const [testimonials, setTestimonials] = useState([]);
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTestimonials = async () => {
        const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
        if (data) setTestimonials(data);
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !text) return;
        setIsSubmitting(true);
        const { error } = await supabase.from('testimonials').insert([{ name, text, rating }]);
        if (!error) {
            setName('');
            setText('');
            setRating(5);
            fetchTestimonials();
            toast.success('Terima kasih atas ulasan Bunda!');
        }
        setIsSubmitting(false);
    };

    const display = testimonials.length > 0 ? testimonials : [
        { id: 1, name: 'Budi Santoso & Istri', text: 'Layanan SANTUN sangat membantu istri saya pulang pasca salin. Sopir ramah dan mobil bersih ber-AC!', rating: 5 },
        { id: 2, name: 'Siti Aminah', text: 'RAMAH mempermudah akta lahir anak saya tanpa ribet antri di Disdukcapil.', rating: 5 },
        { id: 3, name: 'Dewi Lestari', text: 'Sesi konsultasi SINERGI video call dengan ahli gizi sangat jelas dan edukatif.', rating: 5 }
    ];

    return (
        <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', fontFamily: "'Outfit', sans-serif", margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={18} fill="#f59e0b" color="#f59e0b" /> Testimoni Bunda
                </h3>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: '#fef3c7', padding: '4px 10px', borderRadius: '12px',
                    border: '1px solid #fde68a'
                }}>
                    <Star size={12} fill="#f59e0b" color="#f59e0b" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#92400e', fontFamily: "'Outfit', sans-serif" }}>
                        4.9/5 <span style={{ fontWeight: 600 }}>Kepuasan</span>
                    </span>
                </div>
            </div>

            <div className="marquee-wrapper" style={{ marginBottom: '18px' }}>
                <div className="marquee-content">
                    {[...display, ...display].map((t, i) => (
                        <div key={i} className="testimonial-card" style={{
                            background: 'white', borderRadius: '18px', padding: '16px',
                            border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                            minWidth: '240px', maxWidth: '280px'
                        }}>
                            <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                                {[...Array(5)].map((_, j) => (
                                    <Star key={j} size={12} fill={j < t.rating ? "#f59e0b" : "none"} color={j < t.rating ? "#f59e0b" : "#cbd5e1"} />
                                ))}
                            </div>
                            <p style={{ fontSize: '0.78rem', color: '#475569', fontStyle: 'italic', margin: '0 0 6px', lineHeight: 1.5 }}>"{t.text}"</p>
                            <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>— {t.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{
                background: 'white', borderRadius: '22px', padding: '20px', border: '1px solid #e2e8f0',
                boxShadow: '0 8px 24px rgba(0,0,0,0.03)', position: 'relative'
            }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1e293b', margin: '0 0 14px', fontFamily: "'Outfit', sans-serif" }}>
                    Beri Ulasan Layanan
                </h4>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '4px', display: 'block' }}>Nama Bunda / Keluarga</label>
                        <input
                            type="text" value={name} onChange={(e) => setName(e.target.value)} required
                            placeholder="Contoh: Bunda Siti"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.82rem', outline: 'none', background: '#f8fafc' }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '4px', display: 'block' }}>Pengalaman Anda</label>
                        <textarea
                            value={text} onChange={(e) => setText(e.target.value)} required
                            placeholder="Ceritakan pengalaman menggunakan layanan Sahabat Bunda..."
                            rows={3}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.82rem', outline: 'none', resize: 'vertical', background: '#f8fafc' }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s} size={20} cursor="pointer"
                                    fill={s <= rating ? "#f59e0b" : "none"}
                                    color={s <= rating ? "#f59e0b" : "#cbd5e1"}
                                    onClick={() => setRating(s)}
                                />
                            ))}
                        </div>
                        <button
                            type="submit" disabled={isSubmitting}
                            style={{
                                padding: '10px 22px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
                                border: 'none', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer',
                                boxShadow: '0 6px 16px rgba(79, 70, 229, 0.25)', transition: 'all 0.2s ease'
                            }}
                        >
                            {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ════════════════ MAIN PAGE ════════════════ */
export default function HomePage() {
    const navigate = useNavigate();
    const logoUrl = useAppLogo();
    const [liveSessions, setLiveSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [showVideoIdModal, setShowVideoIdModal] = useState(false);
    const [targetSession, setTargetSession] = useState(null);
    const [inputVideoId, setInputVideoId] = useState('');
    const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 11) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    const promoBanners = [
        {
            tag: 'Layanan RAMAH',
            title: 'Akta Lahir, KIA & KK Baru Gratis',
            desc: 'Pengurusan dokumen kependudukan tuntas tanpa antri, diantar langsung ke rumah Bunda.',
            action: 'Ajukan RAMAH',
            to: '/ramah/submit',
            color: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            icon: FileText
        },
        {
            tag: 'Layanan SANTUN',
            title: 'Antar Pulang Pasien Pasca Salin',
            desc: 'Fasilitas transportasi pulang ber-AC khusus warga Kota Pekalongan, 100% gratis.',
            action: 'Pesan Transport',
            to: '/santun/submit',
            color: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
            icon: Truck
        },
        {
            tag: 'BEMBI 24 Jam',
            title: 'Ambulance Emergency Siaga Cepat',
            desc: 'Panggilan darurat terintegrasi dengan tim medis RSUD Bendan siap melayani 24 jam.',
            action: 'Hubungi BEMBI',
            to: '/bembi',
            color: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
            icon: Ambulance
        }
    ];

    useEffect(() => {
        const promoTimer = setInterval(() => {
            setCurrentPromoIndex(prev => (prev + 1) % promoBanners.length);
        }, 5000);
        return () => clearInterval(promoTimer);
    }, [promoBanners.length]);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                setLoadingSessions(true);
                // 1. Fetch group sessions
                const { data: groupSessions, error: gError } = await supabase
                    .from('sinergi_sessions')
                    .select('*')
                    .not('status', 'in', '("Completed","Archived")')
                    .order('scheduled_at', { ascending: true });

                if (gError) throw gError;

                // 2. Fetch individual scheduled requests
                const { data: indRequests, error: iError } = await supabase
                    .from('sinergi_requests')
                    .select('*')
                    .eq('status', 'Scheduled')
                    .is('session_id', null)
                    .order('scheduled_at', { ascending: true });

                if (iError) throw iError;

                const mappedInd = (indRequests || []).map(r => ({
                    ...r,
                    title: `Konsultasi: ${r.name}`,
                    is_group: false,
                    access_id: r.tracking_code
                }));

                const mappedGroup = (groupSessions || []).map(s => ({
                    ...s,
                    is_group: true
                }));

                const combined = [...mappedGroup, ...mappedInd].sort((a, b) =>
                    new Date(a.scheduled_at) - new Date(b.scheduled_at)
                );

                setLiveSessions(combined);
            } catch (err) {
                console.error("Error fetching sessions:", err);
            } finally {
                setLoadingSessions(false);
            }
        };

        fetchSessions();
        const sessionSub = supabase
            .channel('sinergi_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'sinergi_sessions' }, fetchSessions)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'sinergi_requests' }, fetchSessions)
            .subscribe();

        return () => {
            supabase.removeChannel(sessionSub);
        };
    }, []);

    const activePromo = promoBanners[currentPromoIndex];

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '30px' }} className="animate-slide-up">
            {/* ══════════════════════════════════════════════════════════
                1. STYLISH HEADER BACKDROP (Foto Cerah RSUD Bendan Murni)
            ══════════════════════════════════════════════════════════ */}
            <div style={{
                position: 'relative',
                padding: '28px 20px 96px',
                overflow: 'hidden',
                color: 'white',
                borderBottomLeftRadius: '32px',
                borderBottomRightRadius: '32px',
                boxShadow: '0 16px 36px rgba(15, 23, 42, 0.15)'
            }}>
                {/* Background Image Murni RSUD Bendan - Dibuat Lebih Terang, Segar, dan Jernih */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url('/Gambar%20rsud%20bendan.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'brightness(1.18) contrast(1.08)'
                }} />

                {/* Minimalist Soft Vignette di bagian atas & bawah agar teks tetap terbaca tajam */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.05) 40%, rgba(15, 23, 42, 0.45) 100%)'
                }} />

                {/* Top Status Bar: Bersih & Clean (Tanpa icon BEMBI, chat, ID) */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                            fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.4px',
                            color: '#ffffff', fontWeight: 900, textShadow: '0 2px 6px rgba(0,0,0,0.9)'
                        }}>
                            RSUD BENDAN
                        </span>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#38bdf8' }}></span>
                        <span style={{ fontSize: '0.78rem', color: '#f1f5f9', fontWeight: 700, textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>Kota Pekalongan</span>
                    </div>
                    <h2 style={{
                        margin: '4px 0 0', fontSize: '1.45rem', fontWeight: 900, color: '#ffffff',
                        fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.3px',
                        textShadow: '0 2px 8px rgba(0,0,0,0.9)'
                    }}>
                        {getGreeting()}, Bunda
                    </h2>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                2. FLOATING "HUB" CARD (Logo Sahabat Bunda Lebih Jelas di Depan)
            ══════════════════════════════════════════════════════════ */}
            <div style={{ padding: '0 16px', marginTop: '-54px', position: 'relative', zIndex: 20 }}>
                <div style={{
                    background: '#ffffff',
                    borderRadius: '26px',
                    padding: '20px 22px',
                    boxShadow: '0 18px 45px -10px rgba(15, 23, 42, 0.12), 0 4px 14px rgba(0,0,0,0.04)',
                    border: '1px solid #e2e8f0',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Top Row: Logo Sahabat Bunda di Depan & Jelas | Quick Action Badges on Right */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px' }}>
                        {/* Kiri: Logo Sahabat Bunda Lebih Besar & Terlihat Jelas di Depan */}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src="/logo%20sahabat%20bunda.png"
                                alt="Logo Sahabat Bunda"
                                style={{
                                    height: '68px',
                                    maxWidth: '175px',
                                    objectFit: 'contain',
                                    objectPosition: 'left center',
                                    display: 'block',
                                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))'
                                }}
                            />
                        </div>

                        {/* Kanan: Quick Action Buttons (Icon Lebih Besar, Rapi & Proporsional) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            {/* Action 1: Lacak */}
                            <div
                                onClick={() => navigate('/lacak')}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                            >
                                <div style={{
                                    width: '52px', height: '52px', borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                                    border: '1.5px solid #86efac',
                                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.16)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#16a34a', transition: 'all 0.2s ease'
                                }}>
                                    <QrCode size={24} strokeWidth={2.4} />
                                </div>
                                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155' }}>Lacak</span>
                            </div>

                            {/* Action 2: Darurat BEMBI */}
                            <div
                                onClick={() => {
                                    const message = encodeURIComponent('Halo BEMBI RSUD Bendan, saya membutuhkan layanan ambulance darurat:');
                                    window.open(`https://wa.me/628152321122?text=${message}`, '_blank');
                                }}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                            >
                                <div style={{
                                    width: '52px', height: '52px', borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                                    border: '1.5px solid #fca5a5',
                                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.16)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#ef4444', transition: 'all 0.2s ease'
                                }}>
                                    <Ambulance size={24} strokeWidth={2.4} />
                                </div>
                                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155' }}>BEMBI</span>
                            </div>

                            {/* Action 3: Riwayat / Sinergi */}
                            <div
                                onClick={() => navigate('/sinergi')}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                            >
                                <div style={{
                                    width: '52px', height: '52px', borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                    border: '1.5px solid #93c5fd',
                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.16)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#2563eb', transition: 'all 0.2s ease'
                                }}>
                                    <Calendar size={24} strokeWidth={2.4} />
                                </div>
                                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155' }}>Jadwal</span>
                            </div>
                        </div>
                    </div>

                    {/* Divider Line */}
                    <div style={{ height: '1px', background: '#f1f5f9', margin: '0 -20px 14px' }}></div>

                    {/* Bottom Row: Rating Badge on Left | Sinergi Pill Button on Right */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '28px', height: '28px', borderRadius: '50%',
                                background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Star size={15} fill="#f59e0b" color="#f59e0b" />
                            </div>
                            <div>
                                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b', fontFamily: "'Outfit'" }}>
                                    4.9/5 <span style={{ color: '#64748b', fontWeight: 600 }}>Rating Bunda</span>
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/sinergi')}
                            style={{
                                border: '1.5px solid #2563eb',
                                background: 'white',
                                color: '#1d4ed8',
                                padding: '6px 14px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontFamily: "'Outfit', sans-serif",
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span>Konsultasi Online</span>
                            <div style={{
                                width: '18px', height: '18px', borderRadius: '50%', background: '#2563eb',
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <ChevronRight size={12} strokeWidth={3} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                3. SERVICE ICONS GRID (Access by KAI Layout: 2 Rows)
                   Row 1: Vibrant Colorful Circles (Train Style)
                   Row 2: Soft Pastel Circles (Quick Services)
            ══════════════════════════════════════════════════════════ */}
            <div style={{ padding: '24px 16px 12px' }}>
                {/* ROW 1: 5 Primary Colorful Circular Badges */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '10px',
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>
                    {[
                        {
                            label: 'RAMAH',
                            desc: 'Akta Lahir',
                            icon: FileText,
                            to: '/ramah/submit',
                            gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                            shadow: '0 8px 18px rgba(37, 99, 235, 0.35)'
                        },
                        {
                            label: 'SANTUN',
                            desc: 'Antar Pulang',
                            icon: Truck,
                            to: '/santun/submit',
                            gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                            shadow: '0 8px 18px rgba(249, 115, 22, 0.35)'
                        },
                        {
                            label: 'SINERGI',
                            desc: 'Konsultasi',
                            icon: Video,
                            to: '/sinergi',
                            gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            shadow: '0 8px 18px rgba(239, 68, 68, 0.35)'
                        },
                        {
                            label: 'BEMBI',
                            desc: 'Ambulance',
                            icon: Ambulance,
                            to: '/bembi',
                            gradient: 'linear-gradient(135deg, #d946ef 0%, #c026d3 100%)',
                            shadow: '0 8px 18px rgba(217, 70, 239, 0.35)'
                        },
                        {
                            label: 'EMPATI',
                            desc: 'Edukasi Nifas',
                            icon: Heart,
                            to: '/empati',
                            gradient: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
                            shadow: '0 8px 18px rgba(14, 165, 233, 0.35)'
                        }
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => {
                                if (item.to === '/bembi') {
                                    const msg = encodeURIComponent('Halo BEMBI RSUD Bendan, saya membutuhkan layanan ambulance darurat:');
                                    window.open(`https://wa.me/628152321122?text=${msg}`, '_blank');
                                } else {
                                    navigate(item.to);
                                }
                            }}
                            className="grid-card-interactive"
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                cursor: 'pointer', textDecoration: 'none'
                            }}
                        >
                            <div style={{
                                width: '54px', height: '54px', borderRadius: '50%',
                                background: item.gradient,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white',
                                boxShadow: item.shadow,
                                marginBottom: '8px'
                            }}>
                                <item.icon size={25} strokeWidth={2.2} />
                            </div>
                            <span style={{
                                fontSize: '0.75rem', fontWeight: 800, color: '#1e293b',
                                fontFamily: "'Outfit', sans-serif", lineHeight: 1.2
                            }}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* ROW 2: 5 Secondary Soft Blue Circular Badges */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '10px',
                    textAlign: 'center',
                    marginBottom: '10px'
                }}>
                    {[
                        {
                            label: 'SEHATI',
                            icon: Activity,
                            to: '/sehati',
                            color: '#2563eb',
                            bg: '#eff6ff'
                        },
                        {
                            label: 'Vaksinasi',
                            icon: ShieldPlus,
                            to: '/vaksinasi',
                            color: '#2563eb',
                            bg: '#eff6ff'
                        },
                        {
                            label: "Al-Qur'an",
                            icon: BookOpen,
                            to: '/quran',
                            color: '#2563eb',
                            bg: '#eff6ff'
                        },
                        {
                            label: 'Lacak',
                            icon: Search,
                            to: '/lacak',
                            color: '#2563eb',
                            bg: '#eff6ff'
                        },
                        {
                            label: 'Makanan',
                            icon: UtensilsCrossed,
                            to: '/makanan',
                            color: '#ea580c',
                            bg: '#fff7ed'
                        }
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => {
                                if (item.action) item.action();
                                else navigate(item.to);
                            }}
                            className="grid-card-interactive"
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                cursor: 'pointer', textDecoration: 'none'
                            }}
                        >
                            <div style={{
                                width: '50px', height: '50px', borderRadius: '50%',
                                background: item.bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: item.color,
                                border: '1px solid #dbeafe',
                                boxShadow: '0 4px 10px rgba(37, 99, 235, 0.06)',
                                marginBottom: '8px'
                            }}>
                                <item.icon size={22} strokeWidth={2.2} />
                            </div>
                            <span style={{
                                fontSize: '0.72rem', fontWeight: 700, color: '#475569',
                                fontFamily: "'Outfit', sans-serif", lineHeight: 1.2
                            }}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                4. HIGHLIGHT HERO BANNER: "Live Konsultasi" (Access by KAI Live Tracking style)
            ══════════════════════════════════════════════════════════ */}
            <div style={{ padding: '10px 16px 16px' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 45%, #a855f7 100%)',
                    borderRadius: '24px',
                    padding: '22px 20px',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 12px 28px -6px rgba(79, 70, 229, 0.35)'
                }}>
                    {/* Wavy backdrop graphics */}
                    <div style={{
                        position: 'absolute', right: '-20px', bottom: '-20px', width: '200px', height: '200px',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                        borderRadius: '50%', pointerEvents: 'none'
                    }}></div>

                    {/* Live Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{
                            background: 'white',
                            color: '#4338ca',
                            fontSize: '0.7rem',
                            fontWeight: 900,
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontFamily: "'Outfit', sans-serif",
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            Live Online <Sparkles size={11} fill="#f59e0b" color="#f59e0b" />
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#e0e7ff', fontWeight: 600 }}>
                            SINERGI Video Call
                        </span>
                    </div>

                    <h3 style={{
                        fontSize: '1.25rem', fontWeight: 900, color: 'white',
                        margin: '0 0 6px', fontFamily: "'Outfit', sans-serif"
                    }}>
                        Konsultasi Gizi Eksklusif
                    </h3>

                    <p style={{
                        fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.9)',
                        margin: '0 0 16px', lineHeight: 1.45, maxWidth: '85%'
                    }}>
                        Tatap muka video call langsung bersama Ahli Gizi RSUD Bendan secara real-time dan interaktif.
                    </p>

                    {/* Action button & Session count */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <button
                            onClick={() => {
                                setTargetSession(null);
                                setShowVideoIdModal(true);
                            }}
                            style={{
                                background: '#ffffff',
                                color: '#4338ca',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '24px',
                                fontSize: '0.82rem',
                                fontWeight: 800,
                                fontFamily: "'Outfit', sans-serif",
                                cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span>Buka Live SINERGI</span>
                            <ArrowRight size={14} />
                        </button>

                        <div style={{
                            fontSize: '0.72rem', color: '#ffffff', background: 'rgba(255,255,255,0.2)',
                            padding: '6px 12px', borderRadius: '14px', backdropFilter: 'blur(4px)', fontWeight: 600
                        }}>
                            {liveSessions.length > 0 ? `${liveSessions.length} Sesi Terjadwal` : 'Tersedia Sekarang'}
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                5. SCHEDULED LIVE SESSIONS CHIPS (If any sessions active)
            ══════════════════════════════════════════════════════════ */}
            {liveSessions.length > 0 && (
                <div style={{ padding: '0 16px 14px' }}>
                    <div style={{
                        background: '#ffffff', borderRadius: '20px', padding: '14px 16px',
                        border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                                Jadwal Sesi Hari Ini
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Ketuk untuk bergabung</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {liveSessions.slice(0, 3).map(session => (
                                <div
                                    key={session.id}
                                    onClick={() => {
                                        const type = session.is_group ? 'group' : 'individual';
                                        navigate(`/sinergi/video?sessionId=${session.id}&type=${type}`);
                                    }}
                                    style={{
                                        background: '#f8fafc', borderRadius: '12px', padding: '10px 12px',
                                        border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.title}</p>
                                        <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '2px 0 0', fontWeight: 600 }}>Tatap muka konsultasi gizi</p>
                                    </div>
                                    <div style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800 }}>
                                        {new Date(session.scheduled_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':')} WIB
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                6. CAROUSEL PROMO BANNER (KAI Promo style)
            ══════════════════════════════════════════════════════════ */}
            <div style={{ padding: '0 16px 16px' }}>
                <div style={{
                    background: activePromo.color,
                    borderRadius: '20px',
                    padding: '18px 20px',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, paddingRight: '12px' }}>
                            <span style={{
                                background: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', fontWeight: 800,
                                padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px'
                            }}>
                                {activePromo.tag}
                            </span>
                            <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '8px 0 4px', color: 'white', fontFamily: "'Outfit'" }}>
                                {activePromo.title}
                            </h4>
                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.88)', margin: '0 0 12px', lineHeight: 1.4 }}>
                                {activePromo.desc}
                            </p>
                            <button
                                onClick={() => {
                                    if (activePromo.to === '/bembi') {
                                        const msg = encodeURIComponent('Halo BEMBI RSUD Bendan, saya membutuhkan layanan ambulance darurat:');
                                        window.open(`https://wa.me/628152321122?text=${msg}`, '_blank');
                                    } else {
                                        navigate(activePromo.to);
                                    }
                                }}
                                style={{
                                    background: 'white', color: '#1e293b', border: 'none', padding: '6px 14px',
                                    borderRadius: '16px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                                    display: 'inline-flex', alignItems: 'center', gap: '4px'
                                }}
                            >
                                {activePromo.action} <ChevronRight size={12} strokeWidth={3} />
                            </button>
                        </div>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255,255,255,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <activePromo.icon size={26} color="white" />
                        </div>
                    </div>

                    {/* Dots indicator */}
                    <div style={{ display: 'flex', gap: '4px', marginTop: '12px', justifyContent: 'center' }}>
                        {promoBanners.map((_, i) => (
                            <div
                                key={i}
                                onClick={() => setCurrentPromoIndex(i)}
                                style={{
                                    width: i === currentPromoIndex ? '16px' : '6px',
                                    height: '6px',
                                    borderRadius: '3px',
                                    background: i === currentPromoIndex ? 'white' : 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                7. PRAYER TIMES WIDGET
            ══════════════════════════════════════════════════════════ */}
            <div style={{ padding: '0 16px 16px' }}>
                <PrayerTimesWidget />
            </div>

            {/* ══════════════════════════════════════════════════════════
                8. WHATSAPP PETUGAS & INFORMASI LAYANAN
            ══════════════════════════════════════════════════════════ */}
            <div style={{ padding: '0 16px 16px' }}>
                <div style={{
                    background: '#ffffff', borderRadius: '22px', padding: '18px 20px',
                    border: '1px solid #f1f5f9', boxShadow: '0 6px 18px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                                <Phone size={16} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1e293b', margin: 0, fontFamily: "'Outfit'" }}>
                                    Pusat Bantuan & Layanan
                                </h4>
                                <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>
                                    Layanan tersedia 24 jam di RSUD Bendan
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => window.open('https://wa.me/6282324408910', '_blank')}
                        style={{
                            background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px',
                            padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MessageCircle size={24} color="#16a34a" />
                            <div>
                                <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#166534', margin: 0 }}>
                                    Chat WhatsApp Petugas
                                </p>
                                <p style={{ fontSize: '0.7rem', color: '#15803d', margin: 0 }}>
                                    Respons cepat untuk pertanyaan dan panduan
                                </p>
                            </div>
                        </div>
                        <ChevronRight size={18} color="#16a34a" />
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                9. TESTIMONIALS & FAQ CONTAINER
            ══════════════════════════════════════════════════════════ */}
            <div id="faq-container" style={{ padding: '0 16px' }}>
                <FAQSection />
                <TestimonialSection />
            </div>

            {/* ══════════════════════════════════════════════════════════
                10. VIDEO ACCESS MODAL (for SINERGI direct access)
            ══════════════════════════════════════════════════════════ */}
            {showVideoIdModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, padding: '20px'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '28px', padding: '32px',
                        width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        animation: 'modalIn 0.3s ease-out'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                                <Shield size={22} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#1e293b' }}>
                                    {targetSession ? 'Verifikasi Akses' : 'Masuk Sinergi'}
                                </h3>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                                    {targetSession ? `Sesi: ${targetSession.title}` : 'Gunakan ID yang dikirim melalui WhatsApp'}
                                </p>
                            </div>
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>INPUT ID AKSES</label>
                            <input
                                type="text"
                                value={inputVideoId}
                                onChange={(e) => setInputVideoId(e.target.value.toUpperCase())}
                                placeholder="CONTOH: ABC12"
                                maxLength={10}
                                style={{
                                    width: '100%', padding: '16px', borderRadius: '16px',
                                    background: '#f8fafc', border: '2px solid #e2e8f0',
                                    fontSize: '1.2rem', fontWeight: 900, color: '#1e293b', outline: 'none',
                                    textAlign: 'center', letterSpacing: '4px'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => {
                                    setShowVideoIdModal(false);
                                    setTargetSession(null);
                                    setInputVideoId('');
                                }}
                                style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
                            >
                                Batal
                            </button>
                            <button
                                onClick={async () => {
                                    if (!inputVideoId) return;

                                    const inputCode = inputVideoId.trim().toUpperCase();

                                    let found = targetSession ?
                                        ((targetSession.access_id && targetSession.access_id.trim().toUpperCase() === inputCode) ? targetSession : null) :
                                        liveSessions.find(s => s.access_id && s.access_id.trim().toUpperCase() === inputCode);

                                    if (inputCode === 'ADMIN' && targetSession) found = targetSession;

                                    if (found) {
                                        const type = found.is_group ? 'group' : 'individual';
                                        navigate(`/sinergi/video?sessionId=${found.id}&type=${type}`);
                                        setShowVideoIdModal(false);
                                        setTargetSession(null);
                                        setInputVideoId('');
                                        return;
                                    }

                                    try {
                                        const { data, error } = await supabase
                                            .from('sinergi_requests')
                                            .select('*')
                                            .eq('tracking_code', inputCode)
                                            .eq('status', 'Scheduled')
                                            .single();

                                        if (data && !error) {
                                            const finalType = data.session_id ? 'group' : 'individual';
                                            const finalId = data.session_id || data.id;
                                            navigate(`/sinergi/video?sessionId=${finalId}&type=${finalType}`);
                                            setShowVideoIdModal(false);
                                            setTargetSession(null);
                                            setInputVideoId('');
                                        } else {
                                            toast.error('ID Akses tidak valid atau sesi belum dimulai.');
                                        }
                                    } catch (err) {
                                        toast.error('Gagal memverifikasi ID Akses.');
                                    }
                                }}
                                style={{
                                    flex: 1, padding: '16px', borderRadius: '16px', border: 'none',
                                    background: 'linear-gradient(135deg, #4f46e5, #4338ca)', color: 'white',
                                    fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)'
                                }}
                            >
                                Bergabung
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
