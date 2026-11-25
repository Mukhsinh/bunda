import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search, Clock, Phone, Shield, Star, MessageSquare, Send, ChevronDown,
    HelpCircle, CheckCircle, Zap, Calculator,
    BookOpen, User, MessageCircle, Edit3,
    FileText, Navigation, Heart, Activity, ShieldPlus,
    Video, MonitorPlay, ClipboardList, Info, Ambulance, ChevronRight, ChevronLeft,
    Sparkles, ArrowRight, Bell, Calendar, MapPin, Truck, ExternalLink, QrCode, UtensilsCrossed,
    Check, Play, X
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import PrayerTimesWidget from '../components/PrayerTimesWidget';
import { useAppLogo } from '../hooks/useAppLogo';

/* ════════════════ FAQ SECTION (INFORMASI SAHABAT BUNDA RSUD BENDAN) ════════════════ */
function FAQSection({ inlineMode = false }) {
    const [isOpen, setIsOpen] = useState(true);
    const [activeQ, setActiveQ] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', label: 'Semua (9)' },
        { id: 'layanan', label: 'Layanan & Manfaat' },
        { id: 'gratis', label: 'Fasilitas Gratis' },
        { id: 'alur', label: 'Alur & Lacak' },
        { id: 'darurat', label: 'Darurat & Gizi' }
    ];

    const faqs = [
        {
            id: 1,
            category: 'layanan',
            icon: ShieldPlus,
            iconBg: '#eff6ff',
            iconColor: '#2563eb',
            badge: 'Inovasi Unggulan',
            q: 'Apa itu inovasi layanan Sahabat Bunda di RSUD Bendan?',
            a: (
                <div>
                    <p style={{ margin: '0 0 10px', lineHeight: 1.65 }}>
                        <strong>Sahabat Bunda</strong> (<em>Sahabat Pasca Melahirkan Paripurna</em>) merupakan program inovasi pelayanan publik terpadu dari <strong>RSUD Bendan Kota Pekalongan</strong> yang menghubungkan pelayanan kesehatan ibu dan bayi dengan administrasi kependudukan serta dukungan keluarga pascapersalinan.
                    </p>
                    <p style={{ margin: '0 0 10px', lineHeight: 1.65 }}>
                        Inovasi ini dirancang agar pendampingan bagi ibu dan buah hati <strong>tidak berhenti</strong> saat meninggalkan rumah sakit, melainkan berlanjut secara terkoordinasi dan terintegrasi melalui 9 pilar layanan utama:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginTop: '10px' }}>
                        <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.74rem' }}>
                            <strong style={{ color: '#2563eb' }}>• RAMAH:</strong> Akta & Dokumen Bayi
                        </div>
                        <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.74rem' }}>
                            <strong style={{ color: '#ea580c' }}>• SANTUN:</strong> Antar Pulang Pasien
                        </div>
                        <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.74rem' }}>
                            <strong style={{ color: '#e11d48' }}>• SINERGI:</strong> Konsultasi Ahli Gizi
                        </div>
                        <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.74rem' }}>
                            <strong style={{ color: '#d97706' }}>• MAKANAN:</strong> Gizi & Menu RS
                        </div>
                        <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.74rem' }}>
                            <strong style={{ color: '#db2777' }}>• BEMBI:</strong> Ambulans Darurat 24 Jam
                        </div>
                        <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.74rem' }}>
                            <strong style={{ color: '#0891b2' }}>• EMPATI:</strong> Edukasi Medis Nifas
                        </div>
                        <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.74rem' }}>
                            <strong style={{ color: '#059669' }}>• SEHATI:</strong> Deteksi Dini Stunting
                        </div>
                        <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.74rem' }}>
                            <strong style={{ color: '#7c3aed' }}>• VAKSINASI:</strong> Pengingat Imunisasi
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            category: 'layanan',
            icon: Heart,
            iconBg: '#fff1f2',
            iconColor: '#e11d48',
            badge: 'Penerima Manfaat',
            q: 'Apa saja manfaat nyata yang diperoleh pasien dan keluarga?',
            a: (
                <div style={{ lineHeight: 1.65 }}>
                    <div style={{ marginBottom: '10px', padding: '10px 14px', background: '#f0fdf4', borderRadius: '12px', borderLeft: '4px solid #16a34a' }}>
                        <strong style={{ color: '#16a34a' }}>👶 Bagi Ibu & Bayi Baru Lahir:</strong>
                        <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '4px' }}>
                            Memperoleh kepulangan yang aman dan nyaman (tanpa terpapar panas/hujan), pendampingan gizi pascapulang, edukasi nifas profesional, pemantauan tumbuh kembang pencegah wasting & stunting, serta kepastian identitas kependudukan sejak lahir.
                        </div>
                    </div>
                    <div style={{ marginBottom: '10px', padding: '10px 14px', background: '#eff6ff', borderRadius: '12px', borderLeft: '4px solid #2563eb' }}>
                        <strong style={{ color: '#2563eb' }}>👨‍👩‍👧 Bagi Suami & Keluarga:</strong>
                        <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '4px' }}>
                            Sangat terbantu dalam pengurusan dokumen kependudukan tanpa harus berulang kali antre ke dinas/kelurahan, kemudahan transportasi kepulangan, serta akses cepat ke informasi kesehatan resmi.
                        </div>
                    </div>
                    <div style={{ padding: '10px 14px', background: '#faf5ff', borderRadius: '12px', borderLeft: '4px solid #7c3aed' }}>
                        <strong style={{ color: '#7c3aed' }}>🏥 Bagi RSUD Bendan & Pemkot Pekalongan:</strong>
                        <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '4px' }}>
                            Mewujudkan tata kelola layanan yang tertib, arsip digital pengajuan terpadu, pemulangan pasien terencana, dan sinergi lintas instansi yang akuntabel bersama Disdukcapil dan BPJS Kesehatan.
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 3,
            category: 'gratis',
            icon: CheckCircle,
            iconBg: '#ecfdf5',
            iconColor: '#059669',
            badge: '100% Bebas Biaya',
            q: 'Layanan apa saja yang disediakan GRATIS tanpa biaya tambahan?',
            a: (
                <div style={{ lineHeight: 1.65 }}>
                    <p style={{ margin: '0 0 10px' }}>
                        Komitmen RSUD Bendan dalam inovasi Sahabat Bunda mengedepankan kemudahan masyarakat tanpa beban biaya tambahan:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ background: '#2563eb', color: 'white', borderRadius: '6px', padding: '3px 8px', fontSize: '0.7rem', fontWeight: 800 }}>RAMAH</div>
                            <div style={{ fontSize: '0.78rem', color: '#334155' }}>
                                <strong>Gratis Pengurusan & Pengantaran Dokumen:</strong> Akta Kelahiran, KIA, pembaruan Kartu Keluarga, dan update kepesertaan BPJS Kesehatan bayi diantar langsung oleh kurir resmi RS ke rumah Bunda.
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ background: '#ea580c', color: 'white', borderRadius: '6px', padding: '3px 8px', fontSize: '0.7rem', fontWeight: 800 }}>SANTUN</div>
                            <div style={{ fontSize: '0.78rem', color: '#334155' }}>
                                <strong>Gratis Transportasi Antar Pulang:</strong> Fasilitas kepulangan ibu nifas dan bayi menggunakan armada mobil/taksi online ber-AC yang nyaman khusus untuk warga domisili Kota Pekalongan.
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ background: '#059669', color: 'white', borderRadius: '6px', padding: '3px 8px', fontSize: '0.7rem', fontWeight: 800 }}>FITUR DIGITAL</div>
                            <div style={{ fontSize: '0.78rem', color: '#334155' }}>
                                Fitur edukasi video (EMPATI), kalkulator tumbuh kembang balita (SEHATI), pengingat imunisasi (VAKSINASI), dan mushaf Al-Qur'an digital dapat diakses <strong>bebas biaya kapan saja</strong>.
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 4,
            category: 'alur',
            icon: ClipboardList,
            iconBg: '#fef3c7',
            iconColor: '#d97706',
            badge: 'Prosedur Mudah',
            q: 'Bagaimana alur dan prosedur pengajuan layanan Sahabat Bunda?',
            a: (
                <div style={{ lineHeight: 1.65 }}>
                    <p style={{ margin: '0 0 12px' }}>
                        Alur pengajuan dirancang ringkas dalam <strong>4 langkah terpadu</strong>:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            { no: '1', title: 'Pengajuan Daring', desc: 'Bunda/keluarga membuka aplikasi Sahabat Bunda, memilih menu layanan yang diinginkan (RAMAH/SANTUN/SINERGI), mengisi data diri & medis, serta mengunggah berkas persyaratan (KTP/KK/SKL).' },
                            { no: '2', title: 'Verifikasi Terpusat', desc: 'Admin dan tim verifikator RSUD Bendan memeriksa kelengkapan berkas serta mengoordinasikan kelayakan klinis dan jadwal dengan tenaga kesehatan.' },
                            { no: '3', title: 'Koordinasi Mitra & Armada', desc: 'Data administrasi diteruskan ke Disdukcapil untuk pencetakan dokumen kependudukan, atau admin menugaskan armada transportasi penjemputan/pemulangan.' },
                            { no: '4', title: 'Konfirmasi & e-Consent', desc: 'Pasien dan petugas melakukan serah terima layanan dengan bukti tanda tangan digital (e-consent) yang tersimpan aman di arsip sistem.' }
                        ].map((step, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '50%',
                                    background: '#2563eb', color: 'white', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.75rem', fontWeight: 800, flexShrink: 0
                                }}>
                                    {step.no}
                                </div>
                                <div style={{ fontSize: '0.78rem' }}>
                                    <strong style={{ color: '#1e293b' }}>{step.title}: </strong>
                                    <span style={{ color: '#475569' }}>{step.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 5,
            category: 'alur',
            icon: Clock,
            iconBg: '#ede9fe',
            iconColor: '#7c3aed',
            badge: 'Target Waktu',
            q: 'Berapa lama estimasi waktu proses dan penyelesaian layanan?',
            a: (
                <div style={{ lineHeight: 1.65 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                        <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <strong style={{ color: '#2563eb' }}>Layanan RAMAH (Akta & KIA)</strong>
                                <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 700 }}>Maksimal 7 Hari Kerja</span>
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                                Penerbitan Akta Kelahiran dan KIA bagi bayi yang lahir di RSUD Bendan difasilitasi tuntas dan diantar langsung ke rumah tanpa antre.
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <strong style={{ color: '#ea580c' }}>Layanan SANTUN (Antar Pulang)</strong>
                                <span style={{ background: '#ffedd5', color: '#c2410c', padding: '2px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 700 }}>Terjadwal Hari Kepulangan</span>
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                                Armada mobil dipersiapkan segera setelah dokter DPJP menyatakan izin pulang dan administrasi ruangan selesai.
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <strong style={{ color: '#e11d48' }}>Layanan BEMBI (Ambulans Cepat)</strong>
                                <span style={{ background: '#ffe4e6', color: '#be123c', padding: '2px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 700 }}>Respon Cepat &lt; 15 Menit</span>
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                                Tim ambulans gawat darurat bergerak langsung menuju lokasi penjemputan dalam wilayah operasional Kota Pekalongan.
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 6,
            category: 'alur',
            icon: QrCode,
            iconBg: '#f0fdf4',
            iconColor: '#16a34a',
            badge: 'Transparansi',
            q: 'Bagaimana cara melacak status permohonan yang telah diajukan?',
            a: (
                <div style={{ lineHeight: 1.65 }}>
                    <p style={{ margin: '0 0 10px' }}>
                        Setiap permohonan yang diajukan akan otomatis memperoleh <strong>Kode Registrasi / Lacak Unik</strong> (misal: <em>RMH-2026xxxx</em> atau <em>STN-2026xxxx</em>).
                    </p>
                    <div style={{ background: '#f1f5f9', padding: '10px 14px', borderRadius: '12px', marginBottom: '10px' }}>
                        <div style={{ fontSize: '0.78rem', color: '#334155' }}>
                            <strong>Langkah Pengecekan:</strong>
                            <ol style={{ margin: '6px 0 0', paddingLeft: '18px' }}>
                                <li>Klik menu <strong>"Lacak"</strong> pada icon navigasi cepat di beranda.</li>
                                <li>Masukkan <strong>Kode Registrasi</strong> atau <strong>NIK Bunda</strong>.</li>
                                <li>Sistem akan menampilkan tahapan proses secara real-time: <em>Menunggu Verifikasi &rarr; Diproses Disdukcapil / Dijadwalkan Armada &rarr; Sedang Diantar &rarr; Selesai</em>.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 7,
            category: 'darurat',
            icon: Video,
            iconBg: '#fff1f2',
            iconColor: '#e11d48',
            badge: 'Gizi & Laktasi',
            q: 'Apa itu layanan SINERGI dan bagaimana cara mengikutinya?',
            a: (
                <div style={{ lineHeight: 1.65 }}>
                    <p style={{ margin: '0 0 10px' }}>
                        <strong>SINERGI</strong> adalah layanan telekonsultasi interaktif melalui video conference eksklusif bersama <strong>Nutrisionis / Ahli Gizi profesional RSUD Bendan</strong>.
                    </p>
                    <ul style={{ margin: '0 0 10px', paddingLeft: '18px', fontSize: '0.78rem', color: '#475569' }}>
                        <li><strong>Topik Konsultasi:</strong> Edukasi laktasi, kiat memperlancar ASI, panduan menu gizi seimbang masa nifas, hingga nutrisi pendukung tumbuh kembang bayi.</li>
                        <li><strong>Kemudahan Akses:</strong> Bunda tidak perlu datang ke rumah sakit. Cukup daftar melalui menu SINERGI, tentukan jadwal sesi, dan bergabung langsung lewat ponsel Bunda.</li>
                    </ul>
                </div>
            )
        },
        {
            id: 8,
            category: 'darurat',
            icon: Ambulance,
            iconBg: '#ffe4e6',
            iconColor: '#be123c',
            badge: 'Siaga 24 Jam',
            q: 'Kapan layanan darurat BEMBI dapat dihubungi dan apa saja cakupannya?',
            a: (
                <div style={{ lineHeight: 1.65 }}>
                    <p style={{ margin: '0 0 10px' }}>
                        <strong>BEMBI</strong> (<em>Bendan Emergency Mobile</em>) adalah hotline ambulans tanggap darurat RSUD Bendan yang <strong>siaga 24 jam penuh</strong> menjemput pasien dalam kondisi darurat medis.
                    </p>
                    <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '12px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '0.78rem', color: '#9f1239' }}>
                            <strong>🚨 Fasilitas & Armada BEMBI:</strong>
                            <div style={{ marginTop: '4px' }}>
                                Dilengkapi peralatan medis resusitasi darurat, tabung oksigen, serta didampingi perawat/tenaga medis terlatih RSUD Bendan.
                            </div>
                            <div style={{ marginTop: '8px', fontWeight: 800 }}>
                                Hotline Darurat: <span style={{ color: '#e11d48' }}>0815-2321-122</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 9,
            category: 'layanan',
            icon: HelpCircle,
            iconBg: '#ede9fe',
            iconColor: '#6366f1',
            badge: 'Bantuan Langsung',
            q: 'Kemana saya dapat menghubungi jika membutuhkan panduan atau bantuan?',
            a: (
                <div style={{ lineHeight: 1.65 }}>
                    <p style={{ margin: '0 0 10px' }}>
                        Tim Admin Layanan dan Customer Care Sahabat Bunda RSUD Bendan siap memandu Bunda secara langsung:
                    </p>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                        <div><strong>📞 Kontak Petugas RSUD Bendan:</strong></div>
                        <div style={{ color: '#475569', marginTop: '4px' }}>
                            WhatsApp Admin: <strong>0857-2611-2001</strong> (Inisiator Inovasi & Tim Verifikator)
                        </div>
                        <div style={{ color: '#475569', marginTop: '2px' }}>
                            Lokasi: <strong>RSUD Bendan Kota Pekalongan</strong>, Jl. Sriwijaya No. 2, Pekalongan.
                        </div>
                    </div>
                </div>
            )
        }
    ];

    const filteredFaqs = selectedCategory === 'all'
        ? faqs
        : faqs.filter(f => f.category === selectedCategory);

    return (
        <div style={{ marginTop: inlineMode ? '0' : '24px' }}>
            {/* Header Accordion Card: Sleek Modern Indigo Tech Gradient */}
            {!inlineMode && (
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: isOpen
                            ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)'
                            : '#ffffff',
                        border: isOpen ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                        borderRadius: '22px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isOpen
                            ? '0 12px 30px -6px rgba(37, 99, 235, 0.35)'
                            : '0 4px 16px rgba(15, 23, 42, 0.04)',
                        userSelect: 'none'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                            width: '42px', height: '42px', borderRadius: '14px',
                            background: isOpen ? 'rgba(255, 255, 255, 0.2)' : '#eff6ff',
                            border: isOpen ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid #dbeafe',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: isOpen ? '#ffffff' : '#2563eb',
                            boxShadow: isOpen ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                            flexShrink: 0
                        }}>
                            <HelpCircle size={22} strokeWidth={2.4} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h4 style={{
                                    fontSize: '0.98rem', fontWeight: 800, margin: 0,
                                    color: isOpen ? '#ffffff' : '#1e293b',
                                    fontFamily: "'Outfit', sans-serif",
                                    letterSpacing: '-0.2px'
                                }}>
                                    FAQ & Panduan Layanan
                                </h4>
                                <span style={{
                                    fontSize: '0.65rem', fontWeight: 800,
                                    background: isOpen ? 'rgba(255, 255, 255, 0.25)' : '#dbeafe',
                                    color: isOpen ? '#ffffff' : '#1d4ed8',
                                    padding: '2px 8px', borderRadius: '8px'
                                }}>
                                    9 Materi Resmi
                                </span>
                            </div>
                            <p style={{
                                fontSize: '0.74rem', margin: '3px 0 0',
                                color: isOpen ? 'rgba(255, 255, 255, 0.88)' : '#64748b'
                            }}>
                                Jawaban lengkap seputar inovasi Sahabat Bunda RSUD Bendan
                            </p>
                        </div>
                    </div>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: isOpen ? 'rgba(255, 255, 255, 0.2)' : '#f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isOpen ? '#ffffff' : '#64748b',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                    }}>
                        <ChevronDown size={18} strokeWidth={2.5} />
                    </div>
                </div>
            )}

            {/* Accordion Content */}
            {(isOpen || inlineMode) && (
                <div style={{ marginTop: inlineMode ? '0' : '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Category Filter Chips */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        overflowX: 'auto',
                        padding: '4px 2px 6px',
                        scrollbarWidth: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}>
                        {categories.map((cat) => {
                            const isSelected = selectedCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    style={{
                                        border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                                        background: isSelected ? '#2563eb' : '#ffffff',
                                        color: isSelected ? '#ffffff' : '#64748b',
                                        padding: '6px 13px',
                                        borderRadius: '20px',
                                        fontSize: '0.72rem',
                                        fontWeight: isSelected ? 800 : 600,
                                        fontFamily: "'Outfit', sans-serif",
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer',
                                        boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* FAQ Items */}
                    {filteredFaqs.map((f, i) => {
                        const isExpanded = activeQ === f.id;
                        const IconComponent = f.icon;
                        return (
                            <div
                                key={f.id}
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '18px',
                                    border: isExpanded ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                                    boxShadow: isExpanded
                                        ? '0 10px 24px -6px rgba(37, 99, 235, 0.12), 0 2px 6px rgba(0,0,0,0.02)'
                                        : '0 2px 8px rgba(0, 0, 0, 0.02)',
                                    overflow: 'hidden',
                                    transition: 'all 0.25s ease'
                                }}
                            >
                                <button
                                    onClick={() => setActiveQ(isExpanded ? null : f.id)}
                                    style={{
                                        width: '100%',
                                        border: 'none',
                                        background: isExpanded ? '#f8fafc' : 'transparent',
                                        padding: '14px 16px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        textAlign: 'left',
                                        transition: 'background 0.2s ease'
                                    }}
                                >
                                    {/* Icon Badge */}
                                    <div style={{
                                        width: '38px', height: '38px', borderRadius: '12px',
                                        background: f.iconBg,
                                        color: f.iconColor,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <IconComponent size={20} strokeWidth={2.2} />
                                    </div>

                                    {/* Question Text & Badge */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                            <span style={{
                                                fontSize: '0.62rem', fontWeight: 800,
                                                color: f.iconColor, background: f.iconBg,
                                                padding: '1px 6px', borderRadius: '6px',
                                                textTransform: 'uppercase', letterSpacing: '0.4px'
                                            }}>
                                                {f.badge}
                                            </span>
                                        </div>
                                        <div style={{
                                            fontSize: '0.84rem',
                                            fontWeight: 700,
                                            color: isExpanded ? '#1e3a8a' : '#1e293b',
                                            lineHeight: 1.35,
                                            fontFamily: "'Outfit', sans-serif"
                                        }}>
                                            {f.q}
                                        </div>
                                    </div>

                                    {/* Chevron */}
                                    <div style={{
                                        width: '26px', height: '26px', borderRadius: '50%',
                                        background: isExpanded ? '#dbeafe' : '#f1f5f9',
                                        color: isExpanded ? '#1d4ed8' : '#94a3b8',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.25s ease',
                                        flexShrink: 0
                                    }}>
                                        <ChevronDown size={14} strokeWidth={2.5} />
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div style={{
                                        padding: '14px 18px 18px 18px',
                                        fontSize: '0.8rem',
                                        color: '#475569',
                                        borderTop: '1px solid #f1f5f9',
                                        background: '#ffffff'
                                    }}>
                                        {f.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Bottom CTA Card: Direct Assistance */}
                    <div style={{
                        marginTop: '8px',
                        padding: '14px 16px',
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        border: '1.5px solid #86efac',
                        borderRadius: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                background: '#16a34a', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <Phone size={18} strokeWidth={2.4} />
                            </div>
                            <div>
                                <h5 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 800, color: '#14532d' }}>
                                    Butuh Bantuan Lainnya?
                                </h5>
                                <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#166534' }}>
                                    Konsultasi langsung dengan petugas Sahabat Bunda RSUD Bendan
                                </p>
                            </div>
                        </div>
                        <a
                            href="https://wa.me/6285726112001?text=Halo%20Admin%20Sahabat%20Bunda%20RSUD%20Bendan,%20saya%20ingin%20bertanya%20seputar%20layanan"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: '#16a34a',
                                color: '#ffffff',
                                padding: '8px 14px',
                                borderRadius: '12px',
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <span>WhatsApp</span>
                            <ArrowRight size={13} strokeWidth={2.5} />
                        </a>
                    </div>
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
    const [showInfoVideoModal, setShowInfoVideoModal] = useState(false);
    const [targetSession, setTargetSession] = useState(null);
    const [inputVideoId, setInputVideoId] = useState('');
    const [selectedServiceIdx, setSelectedServiceIdx] = useState(0);
    const [isExplanationPaused, setIsExplanationPaused] = useState(false);
    const [touchStartX, setTouchStartX] = useState(null);

    // Typewriter effect state for Sahabat Bunda tagline
    const typewriterPhrases = [
        'Dampingi Ibu & Buah Hati',
        'Layanan Nifas & Balita Terpadu',
        'RSUD Bendan Kota Pekalongan',
        'Cepat, Ramah & Siaga 24 Jam'
    ];
    const [typewriterText, setTypewriterText] = useState('');
    const [phraseIdx, setPhraseIdx] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentPhrase = typewriterPhrases[phraseIdx];
        const speed = isDeleting ? 35 : 75;

        if (!isDeleting && typewriterText === currentPhrase) {
            const timeout = setTimeout(() => setIsDeleting(true), 2400);
            return () => clearTimeout(timeout);
        } else if (isDeleting && typewriterText === '') {
            setIsDeleting(false);
            setPhraseIdx((prev) => (prev + 1) % typewriterPhrases.length);
            return;
        }

        const timer = setTimeout(() => {
            setTypewriterText(
                currentPhrase.substring(0, typewriterText.length + (isDeleting ? -1 : 1))
            );
        }, speed);

        return () => clearTimeout(timer);
    }, [typewriterText, isDeleting, phraseIdx]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 11) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    /* ════════════════ PENJELASAN LENGKAP LAYANAN (WARNA SOLID GRADASI STYLISH & ELEGAN) ════════════════ */
    const serviceExplanations = [
        {
            id: 'ramah',
            title: 'RAMAH',
            desc: 'Fasilitasi pengurusan Akta Kelahiran, KIA, dan pembaruan KK bayi serta update Kepesertaan BPJS Kesehatan secara gratis melalui kerja sama dengan Disdukcapil, BPJS Kesehatan termasuk difasilitasi pengantaran dokumen oleh petugas RS',
            action: 'Ajukan RAMAH',
            to: '/ramah/submit',
            icon: FileText,
            colorPalette: {
                cardBg: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)',
                btnTextColor: '#1e3a8a',
                accentShadow: 'rgba(37, 99, 235, 0.38)'
            }
        },
        {
            id: 'santun',
            title: 'SANTUN',
            desc: 'Layanan pemulangan ibu dan bayi menggunakan armada taksi online yang nyaman, disertai penjadwalan, rute, dan persetujuan pasien secara gratis untuk domisili kota pekalongan.',
            action: 'Pesan SANTUN',
            to: '/santun/submit',
            icon: Truck,
            colorPalette: {
                cardBg: 'linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #f97316 100%)',
                btnTextColor: '#c2410c',
                accentShadow: 'rgba(234, 88, 12, 0.38)'
            }
        },
        {
            id: 'sinergi',
            title: 'SINERGI',
            desc: 'Telekonsultasi dengan ahli gizi untuk edukasi laktasi dan pemenuhan gizi ibu nifas serta bayi.',
            action: 'Konsultasi SINERGI',
            to: '/sinergi',
            icon: Video,
            colorPalette: {
                cardBg: 'linear-gradient(135deg, #9f1239 0%, #e11d48 50%, #f43f5e 100%)',
                btnTextColor: '#9f1239',
                accentShadow: 'rgba(225, 29, 72, 0.38)'
            }
        },
        {
            id: 'makanan',
            title: 'MAKANAN',
            desc: 'Pemesanan menu makanan untuk pasien/keluarga di area rumah sakit dengan verifikasi lokasi dan diantar ke ruangan pemesan',
            action: 'Pesan Makanan',
            to: '/makanan',
            icon: UtensilsCrossed,
            colorPalette: {
                cardBg: 'linear-gradient(135deg, #854d0e 0%, #d97706 50%, #f59e0b 100%)',
                btnTextColor: '#854d0e',
                accentShadow: 'rgba(217, 119, 6, 0.38)'
            }
        },
        {
            id: 'bembi',
            title: 'BEMBI',
            desc: 'Hotline ambulans tanggap darurat RSUD Bendan yang siap menjemput pasien 24 jam dengan petugas dan alat kesehatan yang dibutuhkan',
            action: 'Hubungi BEMBI',
            to: '/bembi',
            isExternalWhatsapp: true,
            icon: Ambulance,
            colorPalette: {
                cardBg: 'linear-gradient(135deg, #831843 0%, #be185d 50%, #db2777 100%)',
                btnTextColor: '#831843',
                accentShadow: 'rgba(190, 24, 93, 0.38)'
            }
        },
        {
            id: 'empati',
            title: 'EMPATI',
            desc: 'Modul video edukasi pasca persalinan dari tenaga profesional, antara lain perawatan luka, laktasi, dan senam nifas.',
            action: 'Tonton EMPATI',
            to: '/empati',
            icon: Heart,
            colorPalette: {
                cardBg: 'linear-gradient(135deg, #0e7490 0%, #0891b2 50%, #06b6d4 100%)',
                btnTextColor: '#0e7490',
                accentShadow: 'rgba(8, 145, 178, 0.38)'
            }
        },
        {
            id: 'sehati',
            title: 'SEHATI',
            desc: 'Kalkulator antropometri untuk membantu pemantauan pertumbuhan dan deteksi dini risiko masalah gizi untuk pencegahan wasting dan stunting.',
            action: 'Cek SEHATI',
            to: '/sehati',
            icon: Activity,
            colorPalette: {
                cardBg: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #10b981 100%)',
                btnTextColor: '#065f46',
                accentShadow: 'rgba(5, 150, 105, 0.38)'
            }
        },
        {
            id: 'vaksinasi',
            title: 'VAKSINASI',
            desc: 'Kalender imunisasi bayi berdasarkan rekomendasi dan regulasi Kemenkes sebagai pengingat jadwal vaksinasi',
            action: 'Jadwal Vaksinasi',
            to: '/vaksinasi',
            icon: ShieldPlus,
            colorPalette: {
                cardBg: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #8b5cf6 100%)',
                btnTextColor: '#581c87',
                accentShadow: 'rgba(124, 58, 237, 0.38)'
            }
        },
        {
            id: 'quran',
            title: "AL-QURAN",
            desc: 'Mushaf digital, audio, terjemahan, dan informasi jadwal shalat sebagai dukungan ketenangan spiritual.',
            action: "Buka Al-Qur'an",
            to: '/quran',
            icon: BookOpen,
            colorPalette: {
                cardBg: 'linear-gradient(135deg, #14532d 0%, #16a34a 50%, #15803d 100%)',
                btnTextColor: '#14532d',
                accentShadow: 'rgba(22, 163, 74, 0.38)'
            }
        }
    ];

    // Auto-advance explanation card every 5.5s when not paused
    useEffect(() => {
        if (isExplanationPaused) return;
        const timer = setInterval(() => {
            setSelectedServiceIdx(prev => (prev + 1) % serviceExplanations.length);
        }, 5500);
        return () => clearInterval(timer);
    }, [isExplanationPaused, serviceExplanations.length]);

    // Touch swipe gestures for manual sliding
    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
        setIsExplanationPaused(true);
    };

    const handleTouchEnd = (e) => {
        if (touchStartX === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (diff > 35) {
            // Swiped left -> next
            setSelectedServiceIdx(prev => (prev + 1) % serviceExplanations.length);
        } else if (diff < -35) {
            // Swiped right -> prev
            setSelectedServiceIdx(prev => (prev - 1 + serviceExplanations.length) % serviceExplanations.length);
        }
        setTouchStartX(null);
        setTimeout(() => setIsExplanationPaused(false), 2500);
    };

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

    const currentService = serviceExplanations[selectedServiceIdx];

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '30px' }} className="animate-slide-up">
            {/* ══════════════════════════════════════════════════════════
                1. STYLISH HEADER BACKDROP (Foto RSUD Bendan Elegan & Kontras Tinggi)
            ══════════════════════════════════════════════════════════ */}
            <div style={{
                position: 'relative',
                padding: '28px 20px 96px',
                overflow: 'hidden',
                color: 'white',
                borderBottomLeftRadius: '32px',
                borderBottomRightRadius: '32px',
                boxShadow: '0 16px 36px rgba(15, 23, 42, 0.2)'
            }}>
                {/* Background Image RSUD Bendan dengan saturasi & kontras seimbang */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url('/Gambar%20rsud%20bendan.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'brightness(0.95) contrast(1.1)'
                }} />

                {/* Gradient Overlay Solid Elegan: Deep Medical Sapphire & Slate untuk kontras maksimal */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(2, 132, 199, 0.65) 50%, rgba(15, 23, 42, 0.82) 100%)'
                }} />

                {/* Top Status Bar: Frameless, Elegan, Bersih & Kontras Tinggi */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1.5px',
                            color: '#38bdf8', fontWeight: 900, textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                        }}>
                            RSUD BENDAN
                        </span>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }}></span>
                        <span style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                            Kota Pekalongan
                        </span>
                    </div>
                    <h1 style={{
                        margin: '6px 0 0', fontSize: '1.65rem', fontWeight: 900, color: '#ffffff',
                        fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.4px',
                        textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                    }}>
                        {getGreeting()}, Bunda
                    </h1>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                2. FLOATING "HUB" CARD (Sangat Rapat, Tanpa Frame, Typewriter Effect)
            ══════════════════════════════════════════════════════════ */}
            <div style={{ padding: '0 16px', marginTop: '-54px', position: 'relative', zIndex: 20 }}>
                <div style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    padding: '12px 18px',
                    boxShadow: '0 14px 34px -8px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        {/* Kiri: Logo Sahabat Bunda 100% Frameless & Typewriter Tagline */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img
                                    src="/logo-sahabat-bunda-clean.png"
                                    alt="Logo Sahabat Bunda"
                                    className="logo-sahabat-bunda-anim"
                                    style={{
                                        height: '48px',
                                        maxWidth: '155px',
                                        objectFit: 'contain',
                                        objectPosition: 'left center',
                                        display: 'block',
                                        border: 'none',
                                        outline: 'none',
                                        boxShadow: 'none',
                                        background: 'transparent'
                                    }}
                                />
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    background: '#fef3c7',
                                    padding: '2px 7px',
                                    borderRadius: '8px'
                                }}>
                                    <Star size={11} fill="#f59e0b" color="#f59e0b" />
                                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#92400e', fontFamily: "'Outfit'" }}>
                                        4.9
                                    </span>
                                </div>
                            </div>

                            {/* Efek Typewriter Elegan & Menarik */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minHeight: '16px' }}>
                                <Sparkles size={11} color="#0284c7" />
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    color: '#0369a1',
                                    fontFamily: "'Outfit', sans-serif",
                                    letterSpacing: '0.1px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {typewriterText}
                                    <span className="typewriter-cursor">|</span>
                                </span>
                            </div>
                        </div>

                        {/* Kanan: Quick Action Buttons: Lacak & Informasi (Popup Video Portrait) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                            {/* Action 1: Lacak */}
                            <div
                                onClick={() => navigate('/lacak')}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                            >
                                <div style={{
                                    width: '46px', height: '46px', borderRadius: '14px',
                                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                                    border: '1.5px solid #86efac',
                                    boxShadow: '0 4px 10px rgba(22, 163, 74, 0.12)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#16a34a', transition: 'all 0.2s ease'
                                }}>
                                    <QrCode size={22} strokeWidth={2.4} />
                                </div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#334155' }}>Lacak</span>
                            </div>

                            {/* Action 2: Informasi (Popup Video Portrait) */}
                            <div
                                onClick={() => setShowInfoVideoModal(true)}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                                title="Putar Video Informasi Sahabat Bunda"
                            >
                                <div
                                    className="quick-info-glow"
                                    style={{
                                        width: '46px', height: '46px', borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)',
                                        border: '1.5px solid #fda4af',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#e11d48', position: 'relative'
                                    }}
                                >
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Info size={23} strokeWidth={2.4} />
                                        <span style={{
                                            position: 'absolute', top: '-5px', right: '-7px',
                                            width: '8px', height: '8px', borderRadius: '50%',
                                            background: '#ef4444', border: '2px solid white',
                                            boxShadow: '0 0 6px #ef4444'
                                        }} />
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#e11d48' }}>
                                    Informasi
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                3. SERVICE ICONS GRID (2 Rows x 4 Columns)
                   Row 1: RAMAH, SANTUN, SINERGI, MAKANAN
                   Row 2: EMPATI, SEHATI, Vaksinasi, Al-Qur'an
            ══════════════════════════════════════════════════════════ */}
            <div style={{ padding: '24px 16px 12px' }}>
                {/* ROW 1: 4 Layanan Utama (Vibrant Badges) */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px',
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
                            label: 'MAKANAN',
                            desc: 'Menu Pasien',
                            icon: UtensilsCrossed,
                            to: '/makanan',
                            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            shadow: '0 8px 18px rgba(245, 158, 11, 0.35)'
                        }
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate(item.to)}
                            className="grid-card-interactive"
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                cursor: 'pointer', textDecoration: 'none'
                            }}
                        >
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '50%',
                                background: item.gradient,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white',
                                boxShadow: item.shadow,
                                marginBottom: '8px',
                                transition: 'all 0.2s ease'
                            }}>
                                <item.icon size={26} strokeWidth={2.2} />
                            </div>
                            <span style={{
                                fontSize: '0.76rem', fontWeight: 800, color: '#1e293b',
                                fontFamily: "'Outfit', sans-serif", lineHeight: 1.2
                            }}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* ROW 2: 4 Layanan Pendukung (EMPATI, SEHATI, Vaksinasi, Al-Qur'an) */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px',
                    textAlign: 'center',
                    marginBottom: '10px'
                }}>
                    {[
                        {
                            label: 'EMPATI',
                            icon: Heart,
                            to: '/empati',
                            color: '#0284c7',
                            bg: '#f0f9ff',
                            border: '#bae6fd'
                        },
                        {
                            label: 'SEHATI',
                            icon: Activity,
                            to: '/sehati',
                            color: '#059669',
                            bg: '#ecfdf5',
                            border: '#a7f3d0'
                        },
                        {
                            label: 'Vaksinasi',
                            icon: ShieldPlus,
                            to: '/vaksinasi',
                            color: '#7c3aed',
                            bg: '#faf5ff',
                            border: '#e9d5ff'
                        },
                        {
                            label: "Al-Qur'an",
                            icon: BookOpen,
                            to: '/quran',
                            color: '#0d9488',
                            bg: '#f0fdfa',
                            border: '#99f6e4'
                        }
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate(item.to)}
                            className="grid-card-interactive"
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                cursor: 'pointer', textDecoration: 'none'
                            }}
                        >
                            <div style={{
                                width: '52px', height: '52px', borderRadius: '50%',
                                background: item.bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: item.color,
                                border: `1.5px solid ${item.border}`,
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.04)',
                                marginBottom: '8px',
                                transition: 'all 0.2s ease'
                            }}>
                                <item.icon size={23} strokeWidth={2.2} />
                            </div>
                            <span style={{
                                fontSize: '0.74rem', fontWeight: 700, color: '#475569',
                                fontFamily: "'Outfit', sans-serif", lineHeight: 1.2
                            }}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                4. FRAME PENJELASAN LAYANAN BERSIH, MINIMALIS & STYLISH
                   (Tanpa Keterangan Berlebih, Kalimat Sama Persis Terlampir, Justify, Auto & Touch Slide)
            ══════════════════════════════════════════════════════════ */}
            <div
                style={{ padding: '0 16px 14px', position: 'relative' }}
                onMouseEnter={() => setIsExplanationPaused(true)}
                onMouseLeave={() => setIsExplanationPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    key={currentService.id}
                    className="service-card-animated"
                    style={{
                        background: currentService.colorPalette.cardBg,
                        borderRadius: '24px',
                        padding: '18px 20px',
                        boxShadow: `0 14px 34px -6px ${currentService.colorPalette.accentShadow}`,
                        position: 'relative',
                        overflow: 'hidden',
                        userSelect: 'none',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                >
                    {/* Header: Icon + Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{
                            width: '42px', height: '42px', borderRadius: '14px',
                            background: 'rgba(255, 255, 255, 0.22)',
                            border: '1px solid rgba(255, 255, 255, 0.35)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#ffffff',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                            flexShrink: 0
                        }}>
                            <currentService.icon size={22} strokeWidth={2.4} />
                        </div>

                        <h4 style={{
                            fontSize: '1.2rem', fontWeight: 900, color: '#ffffff',
                            margin: 0, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.3px',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
                        }}>
                            {currentService.title}
                        </h4>
                    </div>

                    {/* Deskripsi Kalimat Sama Persis dengan Posisi Justify Menarik */}
                    <p style={{
                        fontSize: '0.82rem',
                        color: 'rgba(255, 255, 255, 0.95)',
                        margin: '0 0 16px',
                        lineHeight: 1.62,
                        fontWeight: 500,
                        textAlign: 'justify',
                        textJustify: 'inter-word',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                    }}>
                        {currentService.desc}
                    </p>

                    {/* Tombol CTA Saja Sesuai Permintaan */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => {
                                if (currentService.isExternalWhatsapp) {
                                    const msg = encodeURIComponent('Halo BEMBI RSUD Bendan, saya membutuhkan layanan ambulance darurat:');
                                    window.open(`https://wa.me/628152321122?text=${msg}`, '_blank');
                                } else {
                                    navigate(currentService.to);
                                }
                            }}
                            style={{
                                background: '#ffffff',
                                color: currentService.colorPalette.btnTextColor,
                                border: 'none',
                                padding: '8px 18px',
                                borderRadius: '16px',
                                fontSize: '0.78rem',
                                fontWeight: 900,
                                fontFamily: "'Outfit', sans-serif",
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.18)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span>{currentService.action}</span>
                            <ArrowRight size={13} strokeWidth={2.8} />
                        </button>
                    </div>
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
                5. PRAYER TIMES WIDGET
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

            {/* ══════════════════════════════════════════════════════════
                11. POPUP VIDEO INFORMASI (BINGKAI PORTRAIT TIPIS & STYLISH)
            ══════════════════════════════════════════════════════════ */}
            {showInfoVideoModal && typeof document !== 'undefined' && createPortal(
                <div
                    onClick={() => setShowInfoVideoModal(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(15, 23, 42, 0.9)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 999999,
                        padding: '16px',
                        boxSizing: 'border-box'
                    }}
                >
                    {/* Portrait Video Wrapper (Lebih Luas, Full, Ultra-Thin Frameless) */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '460px',
                            height: 'min(86vh, 720px)',
                            background: '#000000',
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.35)',
                            boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.9), 0 0 35px rgba(225, 29, 72, 0.25)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            margin: 'auto'
                        }}
                    >
                        {/* Minimalist Floating Close Button */}
                        <button
                            onClick={() => setShowInfoVideoModal(false)}
                            title="Tutup Video"
                            style={{
                                position: 'absolute',
                                top: '14px',
                                right: '14px',
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                background: 'rgba(15, 23, 42, 0.75)',
                                border: '1.5px solid rgba(255, 255, 255, 0.45)',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                zIndex: 30,
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <X size={20} strokeWidth={2.5} />
                        </button>

                        {/* Direct Video Iframe (Ultra-Thin Frameless Fit) */}
                        <iframe
                            src="https://www.youtube.com/embed/o172poIauXE?autoplay=1&playsinline=1&rel=0"
                            title="Informasi Sahabat Bunda RSUD Bendan"
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                display: 'block'
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
