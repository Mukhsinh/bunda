import React, { useState, useEffect } from 'react';
import {
    Video,
    MessageSquare,
    Calendar,
    User,
    Phone,
    MapPin,
    CheckCircle2,
    AlertCircle,
    Monitor,
    Heart,
    Shield,
    Send,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Sinergi = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [consultation, setConsultation] = useState(null);
    const [jitsiMeeting, setJitsiMeeting] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        whatsapp_number: '',
        address: '',
        consultation_topic: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchActiveConsultation();
    }, []);

    const fetchActiveConsultation = async () => {
        try {
            const { data, error } = await supabase
                .from('sinergi_requests')
                .select('*')
                .or('status.eq.pending,status.eq.scheduled')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setConsultation(data);
            }
        } catch (error) {
            console.log('No active consultation found');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const finalAddress = formData.consultation_topic
                ? `${formData.address}\n(Topik: ${formData.consultation_topic})`
                : formData.address;

            const { data, error } = await supabase
                .from('sinergi_requests')
                .insert([{
                    name: formData.full_name,
                    whatsapp: formData.whatsapp_number,
                    address: finalAddress,
                    status: 'Pending'
                }])
                .select()
                .single();

            if (error) throw error;

            setSuccessMsg('Pendaftaran berhasil! Kami akan segera menghubungi Anda.');
            setConsultation(data);
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (error) {
            console.error('Error submitting consultation:', error);
            alert('Gagal mendaftar. Silakan coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    const joinJitsi = () => {
        if (consultation?.jitsi_room) {
            setJitsiMeeting(true);
        }
    };

    useEffect(() => {
        if (jitsiMeeting && consultation?.jitsi_room) {
            const domain = "meet.jit.si";
            let roomName = consultation.jitsi_room;
            if (roomName.includes('meet.jit.si/')) {
                roomName = roomName.split('meet.jit.si/')[1];
            } else {
                roomName = 'SAKPORE-Consultation-' + consultation.id;
            }

            const initJitsi = () => {
                try {
                    const options = {
                        roomName: roomName,
                        width: '100%',
                        height: 500,
                        parentNode: document.querySelector('#jitsi-container'),
                        userInfo: {
                            displayName: consultation?.name || 'Pasien'
                        }
                    };
                    const api = new window.JitsiMeetExternalAPI(domain, options);

                    api.addListener('videoConferenceLeft', () => {
                        setJitsiMeeting(false);
                    });
                } catch (err) {
                    console.error('Error initializing Jitsi:', err);
                }
            };

            if (!window.JitsiMeetExternalAPI) {
                const script = document.createElement("script");
                script.src = "https://meet.jit.si/external_api.js";
                script.async = true;
                script.onload = initJitsi;
                document.body.appendChild(script);
            } else {
                initJitsi();
            }
        }
    }, [jitsiMeeting, consultation]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #eff6ff, #eef2ff)' }}>
                <div style={{ width: 48, height: 48, border: '4px solid #e0e7ff', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fbff', paddingBottom: 96, fontFamily: "'Outfit', sans-serif" }}>
            {/* Header Section */}
            <div style={{
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
                padding: '30px 20px 50px',
                borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
                boxShadow: '0 10px 30px rgba(13, 71, 161, 0.3)',
                marginBottom: '24px'
            }}>
                {/* Decorative blobs */}
                <div style={{ position: 'absolute', top: -40, right: -40, width: 256, height: 256, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
                <div style={{ position: 'absolute', bottom: -40, left: -40, width: 192, height: 192, background: 'rgba(96,165,250,0.2)', borderRadius: '50%', filter: 'blur(40px)' }}></div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 10, maxWidth: 600, margin: '0 auto' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)', color: 'white',
                            borderRadius: '10px', width: '36px', height: '36px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer',
                            flexShrink: 0
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'white', fontWeight: 800 }}>SINERGI</h2>
                        <h3 style={{ fontSize: '1rem', margin: '4px 0', color: 'white', fontWeight: 700 }}>Sesi bersama Ahli Gizi</h3>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.4 }}>Konsultasi video tatap muka terkait kebutuhan gizi ananda✨</p>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 16px' }}>

                {/* Success Toast */}
                {successMsg && (
                    <div style={{
                        background: '#dcfce7', border: '1px solid #86efac', borderRadius: 16,
                        padding: '14px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
                        animation: 'fadeInUp 0.4s ease-out'
                    }}>
                        <CheckCircle2 size={20} color="#16a34a" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#166534' }}>{successMsg}</span>
                    </div>
                )}

                {!consultation ? (
                    /* ═══════ REGISTRATION FORM ═══════ */
                    <div style={{
                        background: 'white', borderRadius: 32,
                        boxShadow: '0 12px 40px rgba(59,130,246,0.08)',
                        padding: '32px 24px', border: '1px solid #e0f2fe'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                            <div style={{ width: 48, height: 48, background: '#dbeafe', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#1e293b' }}>Daftar Konsultasi</h2>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Lengkapi data untuk menjadwalkan sesi Anda</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Nama */}
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                    <User size={14} color="#3b82f6" /> Nama Lengkap Bunda / Ananda
                                </label>
                                <input
                                    required type="text" name="full_name"
                                    value={formData.full_name} onChange={handleInputChange}
                                    placeholder="Contoh: Siti Aminah / Rayyan"
                                    style={{
                                        width: '100%', padding: '14px 18px', background: '#f8fafc',
                                        border: '1.5px solid #e2e8f0', borderRadius: 16,
                                        fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s',
                                        fontFamily: "'Outfit', sans-serif", boxSizing: 'border-box'
                                    }}
                                    onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'white'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                                />
                            </div>

                            {/* WhatsApp */}
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                    <Phone size={14} color="#3b82f6" /> Nomor WhatsApp
                                </label>
                                <input
                                    required type="tel" name="whatsapp_number"
                                    value={formData.whatsapp_number} onChange={handleInputChange}
                                    placeholder="Contoh: 081234567890"
                                    style={{
                                        width: '100%', padding: '14px 18px', background: '#f8fafc',
                                        border: '1.5px solid #e2e8f0', borderRadius: 16,
                                        fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s',
                                        fontFamily: "'Outfit', sans-serif", boxSizing: 'border-box'
                                    }}
                                    onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'white'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                                />
                            </div>

                            {/* Alamat */}
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                    <MapPin size={14} color="#3b82f6" /> Alamat Lengkap
                                </label>
                                <textarea
                                    required name="address" rows="3"
                                    value={formData.address} onChange={handleInputChange}
                                    placeholder="Masukkan alamat domisili saat ini"
                                    style={{
                                        width: '100%', padding: '14px 18px', background: '#f8fafc',
                                        border: '1.5px solid #e2e8f0', borderRadius: 16,
                                        fontSize: '0.9rem', outline: 'none', resize: 'none',
                                        transition: 'all 0.2s', fontFamily: "'Outfit', sans-serif",
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'white'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                                />
                            </div>

                            {/* Topik */}
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                    <MessageSquare size={14} color="#3b82f6" /> Topik Konsultasi (Opsional)
                                </label>
                                <input
                                    type="text" name="consultation_topic"
                                    value={formData.consultation_topic} onChange={handleInputChange}
                                    placeholder="Contoh: MPASI, Berat Badan Kurang, dll"
                                    style={{
                                        width: '100%', padding: '14px 18px', background: '#f8fafc',
                                        border: '1.5px solid #e2e8f0', borderRadius: 16,
                                        fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s',
                                        fontFamily: "'Outfit', sans-serif", boxSizing: 'border-box'
                                    }}
                                    onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'white'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                                />
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={submitting} style={{
                                width: '100%', background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                                color: 'white', fontWeight: 800, fontSize: '1rem',
                                padding: '16px 20px', borderRadius: 16, border: 'none',
                                cursor: 'pointer', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: 10,
                                boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
                                transition: 'all 0.2s', opacity: submitting ? 0.7 : 1,
                                fontFamily: "'Outfit', sans-serif"
                            }}>
                                {submitting ? (
                                    <div style={{ width: 24, height: 24, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        Kirim Pengajuan Konsultasi
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Info note */}
                        <div style={{
                            marginTop: 24, display: 'flex', alignItems: 'flex-start', gap: 12,
                            padding: '14px 18px', background: '#fffbeb', borderRadius: 16,
                            border: '1px solid #fef3c7'
                        }}>
                            <Shield size={20} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#92400e', lineHeight: 1.6 }}>
                                Setelah mendaftar, tim kami akan memverifikasi data Anda dan menambahkan Anda ke grup WhatsApp khusus untuk penjadwalan video meet.
                            </p>
                        </div>
                    </div>
                ) : (
                    /* ═══════ STATUS VIEW ═══════ */
                    <div style={{
                        background: 'white', borderRadius: 32,
                        boxShadow: '0 12px 40px rgba(59,130,246,0.08)',
                        overflow: 'hidden', border: '1px solid #e0f2fe'
                    }}>
                        {jitsiMeeting ? (
                            <div style={{ padding: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Ruang Konsultasi</h2>
                                    <button onClick={() => window.location.reload()} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 20px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <ArrowLeft size={16} /> Tutup Sesi
                                    </button>
                                </div>
                                <div id="jitsi-container" style={{ width: '100%', height: 500, borderRadius: 16, overflow: 'hidden', background: '#1e293b' }}></div>
                            </div>
                        ) : (
                            <>
                                {/* Status header */}
                                <div style={{
                                    padding: '28px 24px',
                                    background: consultation.status === 'scheduled'
                                        ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                                        : 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    color: 'white'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>Status Konsultasi</h2>
                                            <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>ID: #{(consultation.id || '').slice(0, 8)}</p>
                                        </div>
                                        <div style={{
                                            background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                                            padding: '8px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.3)',
                                            display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 800
                                        }}>
                                            {consultation.status === 'scheduled' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                            <span style={{ textDecoration: 'underline', textUnderlineOffset: 4 }}>
                                                {consultation.status === 'scheduled' ? 'TERJADWAL' : 'MENUNGGU VERIFIKASI'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div style={{ padding: 24 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                                        {/* Left column */}
                                        <div>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Detail Pendaftar</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                                <div style={{ width: 40, height: 40, background: '#f1f5f9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>Nama</p>
                                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{consultation.name}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={{ width: 40, height: 40, background: '#f1f5f9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                                    <Phone size={18} />
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>WhatsApp</p>
                                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{consultation.whatsapp}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right column */}
                                        <div>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Jadwal Sesi</p>
                                            {consultation.scheduled_at ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <div style={{ width: 40, height: 40, background: '#dbeafe', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                                                        <Calendar size={18} />
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>Waktu Meet</p>
                                                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                                                            {new Date(consultation.scheduled_at).toLocaleDateString('id-ID', {
                                                                weekday: 'long', day: 'numeric', month: 'long',
                                                                year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                            })} WIB
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <div style={{ width: 40, height: 40, background: '#fef3c7', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                                                        <AlertCircle size={18} />
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#92400e' }}>Sedang diproses oleh admin...</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Jitsi Meet Section */}
                                    <div style={{
                                        background: '#f8fafc', borderRadius: 20, padding: 24,
                                        border: '1px solid #e2e8f0', marginBottom: 24
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                            <div style={{
                                                width: 48, height: 48, background: 'white', borderRadius: 14,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', color: '#2563eb',
                                                border: '1px solid #e0f2fe', flexShrink: 0
                                            }}>
                                                <Video size={24} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>Akses Video Meet</h3>
                                                <p style={{ margin: '0 0 16px 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                                                    Gunakan link berikut untuk masuk ke ruang konsultasi video pada waktu yang ditentukan.
                                                </p>

                                                <button onClick={joinJitsi} disabled={!consultation.jitsi_room} style={{
                                                    width: '100%', padding: '16px 20px', borderRadius: 14,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                                    fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: consultation.jitsi_room ? 'pointer' : 'not-allowed',
                                                    transition: 'all 0.2s', fontFamily: "'Outfit', sans-serif",
                                                    background: consultation.jitsi_room ? 'linear-gradient(135deg, #16a34a, #15803d)' : '#e2e8f0',
                                                    color: consultation.jitsi_room ? 'white' : '#94a3b8',
                                                    boxShadow: consultation.jitsi_room ? '0 8px 20px rgba(22,163,74,0.3)' : 'none'
                                                }}>
                                                    <Video size={20} />
                                                    {consultation.jitsi_room ? 'Mulai Video Meet' : 'Link Belum Tersedia'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact admin */}
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 6px 0' }}>Ingin membatalkan atau mengubah jadwal?</p>
                                        <a
                                            href={`https://wa.me/6281234567890?text=Halo%20Admin%20SINERGI,%20saya%20ingin%20mengubah%20jadwal%20konsultasi%20atas%20nama%20${consultation.name}`}
                                            target="_blank" rel="noopener noreferrer"
                                            style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.85rem' }}
                                        >
                                            Hubungi Admin via WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Info Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 32, marginBottom: 32 }}>
                    <div style={{
                        background: 'white', padding: '20px 16px', borderRadius: 24,
                        boxShadow: '0 4px 16px rgba(59,130,246,0.06)', border: '1px solid #e0f2fe',
                        textAlign: 'center'
                    }}>
                        <div style={{ width: 44, height: 44, background: '#fce7f3', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899', margin: '0 auto 12px auto' }}>
                            <Heart size={22} />
                        </div>
                        <h3 style={{ margin: '0 0 6px 0', fontSize: '0.82rem', fontWeight: 800, color: '#1e293b' }}>Ahli Gizi Pakar</h3>
                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.5 }}>Didukung ahli gizi profesional RSUD Bendan.</p>
                    </div>

                    <div style={{
                        background: 'white', padding: '20px 16px', borderRadius: 24,
                        boxShadow: '0 4px 16px rgba(59,130,246,0.06)', border: '1px solid #e0f2fe',
                        textAlign: 'center'
                    }}>
                        <div style={{ width: 44, height: 44, background: '#dbeafe', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', margin: '0 auto 12px auto' }}>
                            <Shield size={22} />
                        </div>
                        <h3 style={{ margin: '0 0 6px 0', fontSize: '0.82rem', fontWeight: 800, color: '#1e293b' }}>Privasi Terjaga</h3>
                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.5 }}>Sesi konsultasi bersifat pribadi dan rahasia.</p>
                    </div>

                    <div style={{
                        background: 'white', padding: '20px 16px', borderRadius: 24,
                        boxShadow: '0 4px 16px rgba(59,130,246,0.06)', border: '1px solid #e0f2fe',
                        textAlign: 'center'
                    }}>
                        <div style={{ width: 44, height: 44, background: '#dcfce7', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', margin: '0 auto 12px auto' }}>
                            <CheckCircle2 size={22} />
                        </div>
                        <h3 style={{ margin: '0 0 6px 0', fontSize: '0.82rem', fontWeight: 800, color: '#1e293b' }}>Gratis & Mudah</h3>
                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.5 }}>Layanan ini gratis untuk semua pengguna.</p>
                    </div>
                </div>
            </div>

            {/* Spinner keyframe */}
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default Sinergi;
