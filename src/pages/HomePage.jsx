import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search, Clock, Phone, Shield, Star, MessageSquare, Send, ChevronDown,
    HelpCircle, CheckCircle, Zap, Calculator,
    BookOpen, User, MessageCircle, Edit3,
    FileText, Navigation, Heart, Activity, ShieldPlus
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import PrayerTimesWidget from '../components/PrayerTimesWidget';

/* ════════════════ FAQ SECTION ════════════════ */
function FAQSection({ inlineMode = false }) {
    const [isOpen, setIsOpen] = useState(inlineMode);
    const [activeQ, setActiveQ] = useState(null);

    const faqs = [
        {
            icon: '📋',
            q: 'Apa itu layanan Sahabat Bunda?',
            a: 'Sahabat Bunda adalah ekosistem layanan inovatif RSUD Bendan yang mendampingi Bunda sejak masa persalinan hingga pemulihan.\n\n✨ Fitur Unggulan:\n• 🟢 RAMAH: Registrasi Akta Mudah (Gratis & Tuntas)\n• 🟢 SANTUN: Layanan Antar-Jemput Pasien (Gratis)\n• 🟢 EMPATI: Edukasi Video Medis Profesional\n• 🟢 SEHATI: Deteksi Gizi Balita (Standar Kemenkes)\n• 🟢 VAKSIN: Penjadwalan Imunisasi Otomatis\n• 🟢 AL-QUR\'AN: Support Ketenangan Spiritual'
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
        }
    ];

    return (
        <div style={{ marginTop: inlineMode ? '0' : '28px' }}>
            {!inlineMode && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        width: '100%', padding: '16px 20px',
                        background: isOpen
                            ? 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)'
                            : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                        border: isOpen ? 'none' : '1px solid #bae6fd',
                        borderRadius: '20px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease',
                        boxShadow: isOpen ? '0 10px 25px rgba(30, 64, 175, 0.2)' : '0 2px 10px rgba(0,0,0,0.03)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: isOpen ? 'rgba(255,255,255,0.2)' : '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <HelpCircle size={18} color={isOpen ? 'white' : '#1d4ed8'} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0, color: isOpen ? 'white' : '#1e293b', fontFamily: "'Outfit', sans-serif" }}>FAQ Layanan</h4>
                            <p style={{ fontSize: '0.7rem', margin: 0, color: isOpen ? 'rgba(255,255,255,0.8)' : '#64748b' }}>Bantuan cepat</p>
                        </div>
                    </div>
                    <ChevronDown size={20} color={isOpen ? 'white' : '#1d4ed8'} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
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
        }
        setIsSubmitting(false);
    };

    const display = testimonials.length > 0 ? testimonials : [
        { id: 1, name: 'Budi Santoso', text: 'Layanan SANTUN sangat membantu istri saya. Sopir ramah!', rating: 5 },
        { id: 2, name: 'Siti Aminah', text: 'RAMAH mempermudah akta lahir anak saya.', rating: 5 }
    ];

    return (
        <div style={{ marginTop: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', fontFamily: "'Outfit', sans-serif", margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={18} fill="#f59e0b" color="#f59e0b" /> Testimoni Pengguna
                </h3>
            </div>

            {/* Moved Rating Badge */}
            <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#fef3c7', padding: '6px 12px', borderRadius: '12px',
                marginBottom: '16px', border: '1px solid #fde68a'
            }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#92400e', fontFamily: "'Outfit', sans-serif" }}>
                    4.9/5 <span style={{ fontWeight: 500 }}>Rating Kepuasan Bunda</span>
                </span>
            </div>

            <div className="marquee-wrapper" style={{ marginBottom: '24px' }}>
                <div className="marquee-content">
                    {[...display, ...display].map((t, i) => (
                        <div key={i} className="testimonial-card">
                            <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                                {[...Array(5)].map((_, j) => <Star key={j} size={12} fill={j < t.rating ? "#f59e0b" : "none"} color={j < t.rating ? "#f59e0b" : "#cbd5e1"} />)}
                            </div>
                            <p style={{ fontSize: '0.78rem', color: '#475569', fontStyle: 'italic', margin: '0 0 4px' }}>"{t.text}"</p>
                            <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>— {t.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{
                background: 'white', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)', position: 'relative'
            }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1e293b', margin: '0 0 16px', fontFamily: "'Outfit', sans-serif" }}>Beri Ulasan</h4>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '6px', display: 'block' }}>Nama Lengkap</label>
                        <input
                            type="text" value={name} onChange={(e) => setName(e.target.value)} required
                            placeholder="Masukkan nama Anda"
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none', background: '#f8fafc' }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '6px', display: 'block' }}>Ulasan Anda</label>
                        <textarea
                            value={text} onChange={(e) => setText(e.target.value)} required
                            placeholder="Ceritakan pengalaman Anda..."
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none', minHeight: '100px', resize: 'vertical', background: '#f8fafc' }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s} size={22} cursor="pointer"
                                    fill={s <= rating ? "#f59e0b" : "none"}
                                    color={s <= rating ? "#f59e0b" : "#cbd5e1"}
                                    onClick={() => setRating(s)}
                                />
                            ))}
                        </div>
                        <button
                            type="submit" disabled={isSubmitting}
                            style={{
                                padding: '12px 28px', borderRadius: '14px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white',
                                border: 'none', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.2)'
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
    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }} className="animate-slide-up">
            {/* ═══ MODERN HERO BANNER (REFINED) ═══ */}
            <div style={{
                position: 'relative', height: '180px', overflow: 'hidden',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0ea5e9 100%)',
                borderRadius: '0 0 40px 40px', boxShadow: '0 10px 30px rgba(37, 99, 235, 0.15)',
            }}>
                {/* Abstract Wave Shapes at TOP */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', lineHeight: 0, zIndex: 1, transform: 'rotate(180deg)' }}>
                    <svg viewBox="0 0 1440 320" style={{ width: '100%', height: 'auto', opacity: 0.15 }}>
                        <path fill="#ffffff" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', lineHeight: 0, zIndex: 1, transform: 'rotate(180deg) scaleX(-1)' }}>
                    <svg viewBox="0 0 1440 320" style={{ width: '100%', height: 'auto', opacity: 0.1 }}>
                        <path fill="#ffffff" fillOpacity="1" d="M0,128L60,144C120,160,240,192,360,186.7C480,181,600,139,720,122.7C840,107,960,117,1080,128C1200,139,1320,149,1380,154.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                    </svg>
                </div>

                {/* Hero Content */}
                <div style={{ position: 'relative', zIndex: 5, padding: '35px 24px' }}>
                    <h1 style={{
                        fontFamily: "'Outfit', sans-serif", fontSize: '2.4rem', fontWeight: 900,
                        color: 'white', margin: 0, lineHeight: 1.1, letterSpacing: '-1px',
                        textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>Sahabat Bunda</h1>
                    <p style={{
                        fontFamily: "'Outfit', sans-serif", fontSize: '0.9rem', color: 'rgba(255,255,255,1)',
                        marginTop: '8px', lineHeight: 1.4, fontWeight: 700,
                        textShadow: '0 1px 4px rgba(0,0,0,0.2)'
                    }}>
                        Layanan inovatif untuk pasien melahirkan di <span style={{ fontWeight: 900 }}>RSUD Bendan</span>
                    </p>

                </div>
            </div>

            <div style={{ padding: '0 20px 40px', marginTop: '-30px', position: 'relative', zIndex: 10 }}>
                {/* ═══ PRAYER TIMES ═══ */}
                <div style={{ marginBottom: '24px' }}>
                    <PrayerTimesWidget />
                </div>

                {/* ═══ MAIN SERVICES (REFINED) ═══ */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                    <Link to="/ramah/submit" style={{ textDecoration: 'none' }}>
                        <div className="grid-card-interactive" style={{
                            background: 'white', borderRadius: '24px', padding: '24px 16px 20px',
                            textAlign: 'left', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.08)',
                            border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                            position: 'relative', overflow: 'hidden'
                        }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '18px',
                                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '16px', position: 'relative',
                                boxShadow: '0 10px 20px rgba(37, 99, 235, 0.25)'
                            }}>
                                <FileText size={32} color="white" strokeWidth={2.5} />
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#1e293b', margin: 0, fontFamily: "'Outfit', sans-serif" }}>RAMAH</h3>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', lineHeight: 1.3, fontWeight: 600 }}>
                                Registrasi Akta Mudah <span style={{ color: '#2563eb' }}>Antar Sampai Rumah.</span>
                            </p>
                        </div>
                    </Link>

                    <Link to="/santun/submit" style={{ textDecoration: 'none' }}>
                        <div className="grid-card-interactive" style={{
                            background: 'white', borderRadius: '24px', padding: '24px 16px 20px',
                            textAlign: 'left', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.08)',
                            border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                            position: 'relative', overflow: 'hidden'
                        }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '18px',
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '16px', position: 'relative',
                                boxShadow: '0 10px 20px rgba(16, 185, 129, 0.25)'
                            }}>
                                <Navigation size={32} color="white" strokeWidth={2.5} />
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#1e293b', margin: 0, fontFamily: "'Outfit', sans-serif" }}>SANTUN</h3>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', lineHeight: 1.3, fontWeight: 600 }}>
                                Saya <span style={{ color: '#10b981' }}>Antar Sampai Tujuan.</span>
                            </p>
                        </div>
                    </Link>
                </div>

                {/* ═══ KESEHATAN & EDUKASI SECTION (SPLIT) ═══ */}
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e293b', fontFamily: "'Outfit', sans-serif", marginBottom: '16px' }}>
                    Kesehatan & Edukasi
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                    {/* Left: Sub-menu Grid 2x2 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {[
                            { to: '/empati', label: 'EMPATI', Icon: Heart, color: '#0ea5e9' },
                            { to: '/sehati', label: 'SEHATI', Icon: Activity, color: '#f59e0b' },
                            { to: '/vaksinasi', label: 'VAKSIN', Icon: ShieldPlus, color: '#10b981' },
                            { to: '/quran', label: 'AL-QUR\'AN', Icon: BookOpen, color: '#8b5cf6' },
                        ].map((m, i) => (
                            <Link key={i} to={m.to} style={{ textDecoration: 'none' }}>
                                <div className="grid-card-interactive" style={{
                                    background: 'white', borderRadius: '20px', padding: '20px 12px',
                                    textAlign: 'center', border: '1px solid #f1f5f9', height: '100%',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                                }}>
                                    <div style={{
                                        width: '56px', height: '56px', borderRadius: '16px',
                                        background: `linear-gradient(135deg, ${m.color}, ${m.color}dd)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginBottom: '12px',
                                        boxShadow: `0 8px 16px ${m.color}50`
                                    }}>
                                        <m.Icon size={28} color="white" strokeWidth={2.5} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', fontFamily: "'Outfit', sans-serif" }}>{m.label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Right: Info Card & FAQ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{
                            background: 'white', borderRadius: '24px', padding: '20px',
                            border: '1px solid #f1f5f9', boxShadow: '0 10px 20px rgba(0,0,0,0.02)',
                            display: 'flex', flexDirection: 'column', gap: '16px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MessageSquare size={20} color="#0ea5e9" />
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Informasi Layanan</h4>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                                <Clock size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                Layanan tersedia 24 jam. Dokumen diproses pada jam kerja.
                            </p>

                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                background: '#f8fafc', borderRadius: '16px', padding: '12px',
                                border: '1px solid #f1f5f9', cursor: 'pointer',
                                transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden'
                            }} className="wa-hover-box" onClick={() => window.open('https://wa.me/6282324408910', '_blank')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 2 }}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '12px',
                                        background: 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        <img src="/admin-3d-transparent.png" alt="Petugas" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16a34a', margin: 0 }}>Hubungi via WhatsApp</p>
                                        <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>Klik untuk chat langsung</p>
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#22c55e', opacity: 0.1, position: 'absolute', right: '-5px'
                                }}>
                                    <MessageCircle size={60} fill="currentColor" />
                                </div>
                            </div>
                        </div>

                        <FAQSection inlineMode />
                    </div>
                </div>

                <TestimonialSection />
            </div>

            {/* Injected Global Styles for Animations */}
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .floating-animation {
                    animation: float 4s ease-in-out infinite;
                }
                .grid-card-interactive {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .grid-card-interactive:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
                }
                .grid-card-interactive:active {
                    transform: translateY(-4px) scale(0.98);
                }
            `}</style>
        </div>
    );
}
