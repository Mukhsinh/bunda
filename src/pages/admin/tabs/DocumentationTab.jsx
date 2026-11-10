import React, { useState } from 'react';
import {
    BookOpen, Layers, Users, Heart, Target, Award,
    CheckCircle2, ArrowRight, ShieldCheck, FileText,
    Truck, Video, Ambulance, Activity, ShieldPlus,
    Calendar, Download, ChevronRight, HelpCircle,
    Compass, Sparkles, Building2, MapPin, Search, Printer
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

export default function DocumentationTab() {
    const [activeSection, setActiveSection] = useState('overview');
    const [generatingPdf, setGeneratingPdf] = useState(false);

    const sections = [
        { id: 'overview', label: '1. Gambaran & Fitur Menu', icon: Layers },
        { id: 'beneficiaries', label: '2. Penerima Manfaat', icon: Users },
        { id: 'background', label: '3. Latar Belakang & Urgensi', icon: Heart },
        { id: 'flowchart', label: '4. Konsep & Flowchart', icon: Compass },
        { id: 'goals', label: '5. Tujuan Aplikasi', icon: Target },
        { id: 'benefits', label: '6. Manfaat per Fitur', icon: Award },
    ];

    const scrollToSection = (id) => {
        setActiveSection(id);
        const el = document.getElementById(`doc-sec-${id}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // ── FITUR UNDUH DOKUMEN PDF PROFESIONAL BER-KOP DAN FOOTER SISTEM ──
    const handleDownloadPDF = () => {
        setGeneratingPdf(true);
        const loadingToast = toast.loading('Menyiapkan dokumen PDF profesional ber-kop resmi...');

        try {
            const doc = new jsPDF('portrait', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Ambil pengaturan sistem terkini dari LocalStorage
            let settings = {
                appName: 'Sahabat Bunda',
                hospitalName: 'RSUD Bendan Kota Pekalongan',
                address: 'Jl. Sriwijaya No. 2, Kota Pekalongan, Jawa Tengah 51111',
                footerText: 'SahabatBunda @ 2026. RSUD Bendan Kota Pekalongan. All rights reserved.',
                kopUrl: '',
                logoUrl: ''
            };

            try {
                const saved = localStorage.getItem('sahabatbunda_app_settings');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    settings = { ...settings, ...parsed };
                }
            } catch (err) {
                console.error('Error loading settings for PDF:', err);
            }

            // Fungsi render Kop Surat & Footer dinamis pada setiap halaman
            const renderKopAndFooter = (data) => {
                const pageNum = data.pageNumber;

                // ── KOP SURAT RESMI ──
                if (settings.kopUrl && settings.kopUrl.startsWith('data:image')) {
                    try {
                        doc.addImage(settings.kopUrl, 'JPEG', 14, 8, pageWidth - 28, 22);
                    } catch {
                        drawVectorKop();
                    }
                } else {
                    drawVectorKop();
                }

                function drawVectorKop() {
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(10);
                    doc.setTextColor(30, 41, 59);
                    doc.text('PEMERINTAH KOTA PEKALONGAN', pageWidth / 2, 13, { align: 'center' });

                    doc.setFontSize(14);
                    doc.setTextColor(30, 58, 138); // Navy blue
                    doc.text(settings.hospitalName.toUpperCase(), pageWidth / 2, 19, { align: 'center' });

                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(8);
                    doc.setTextColor(100, 116, 139);
                    doc.text(`${settings.address} | Call Center: (0285) 437222`, pageWidth / 2, 24, { align: 'center' });

                    // Garis Kop Ganda
                    doc.setDrawColor(30, 58, 138);
                    doc.setLineWidth(0.8);
                    doc.line(14, 27, pageWidth - 14, 27);
                    doc.setDrawColor(148, 163, 184);
                    doc.setLineWidth(0.2);
                    doc.line(14, 28, pageWidth - 14, 28);
                }

                // ── FOOTER RESMI DARI PENGATURAN SISTEM ──
                doc.setDrawColor(226, 232, 240);
                doc.setLineWidth(0.3);
                doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

                doc.setFont('helvetica', 'italic');
                doc.setFontSize(7.5);
                doc.setTextColor(148, 163, 184);
                doc.text(settings.footerText, 14, pageHeight - 7);
                doc.text(`Halaman ${pageNum}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
            };

            // ── COVER / TITLE SECTION ──
            autoTable(doc, {
                startY: 33,
                head: [['DOKUMEN RESMI SPESIFIKASI SISTEM & MASTER PLAN INOVASI DAERAH']],
                body: [
                    ['Nama Inovasi: Sahabat Bunda (Sahabat Pasca Melahirkan Paripurna)'],
                    ['Unit Penyelenggara: ' + settings.hospitalName],
                    ['Klasifikasi / Bentuk: Pelayanan Publik Digital & Non-Digital'],
                    ['Urusan Pemerintahan: Kesehatan & Administrasi Kependudukan'],
                    [`Tanggal Terbit Dokumen: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`]
                ],
                theme: 'striped',
                headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', halign: 'center', fontSize: 10 },
                styles: { fontSize: 8.5, cellPadding: 3 },
                didDrawPage: renderKopAndFooter,
                margin: { top: 32, bottom: 18 }
            });

            // ── BAGIAN 1: GAMBARAN APLIKASI & FITUR MENU ──
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 8,
                head: [['1. GAMBARAN APLIKASI & SELURUH FITUR MENU']],
                body: [
                    ['Sahabat Bunda adalah platform inovasi pelayanan kesehatan dan administrasi kependudukan terpadu RSUD Bendan Kota Pekalongan yang mendampingi ibu nifas secara holistik pasca persalinan, mencegah stunting, dan menghapus hambatan birokrasi kependudukan.']
                ],
                headStyles: { fillColor: [67, 56, 202], textColor: 255, fontStyle: 'bold', fontSize: 10 },
                styles: { fontSize: 8.5, cellPadding: 3.5 },
                didDrawPage: renderKopAndFooter,
                margin: { top: 32, bottom: 18 }
            });

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 2,
                head: [['Fitur / Menu', 'Kategori', 'Deskripsi Layanan']],
                body: [
                    ['RAMAH', 'Administrasi Kependudukan', 'Pengurusan Akta Kelahiran, Kartu Identitas Anak (KIA), & KK baru bayi secara gratis & diantar langsung ke rumah bekerjasama dengan Disdukcapil.'],
                    ['SANTUN', 'Transportasi Pasien', 'Layanan pemulangan gratis ibu dan bayi menggunakan armada mobil khusus RSUD Bendan ber-AC dan nyaman, lengkap dengan rute peta & e-consent.'],
                    ['SINERGI', 'Telekonsultasi Gizi', 'Konsultasi virtual video call tatap muka dengan Ahli Gizi RSUD Bendan secara perorangan maupun terjadwal untuk edukasi laktasi dan menu gizi nifas.'],
                    ['MAKANAN', 'Pemesanan Menu Gizi', 'Layanan pemesanan hidangan bergizi lezat diantar ke kamar pasien dengan verifikasi geofencing presisi di area RSUD Bendan.'],
                    ['BEMBI', 'Emergency Ambulance', 'Hotline ambulans tanggap darurat 24 jam dengan koneksi instan ke Call Center IGD RSUD Bendan.'],
                    ['EMPATI', 'Edukasi Medis', 'Modul video pembelajaran resmi dari dokter spesialis (perawatan luka sesar, laktasi, senam nifas).'],
                    ['SEHATI', 'Deteksi Gizi Balita', 'Kalkulator antropometri balita berbasis standar baku Kemenkes RI untuk deteksi dini risiko stunting.'],
                    ['VAKSINASI', 'Jadwal Imunisasi', 'Kalkulator otomatis penentuan jadwal seluruh vaksin wajib bayi mengacu pada rekomendasi IDAI.'],
                    ['AL-QURAN', 'Spiritual Support', 'Mushaf digital 114 surah bersuara dan jadwal sholat terpadu untuk menjaga kesehatan mental dan ketenangan spiritual bunda.'],
                    ['PANEL ADMIN', 'Manajemen & SPJ', 'Pusat verifikasi, pengaturan armada, arsip digital pengajuan, serta laporan SPJ perjalanan dinas resmi.']
                ],
                theme: 'grid',
                headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold', fontSize: 8 },
                styles: { fontSize: 7.5, cellPadding: 2.5 },
                didDrawPage: renderKopAndFooter,
                margin: { top: 32, bottom: 18 }
            });

            // ── BAGIAN 2: PENERIMA MANFAAT ──
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 8,
                head: [['2. SIAPAKAH PENERIMA MANFAAT INOVASI']],
                body: [
                    ['Inovasi Sahabat Bunda menyasar multi-pihak secara inklusif mulai dari masyarakat lapisan bawah hingga tata kelola pemerintahan daerah.']
                ],
                headStyles: { fillColor: [13, 148, 136], textColor: 255, fontStyle: 'bold', fontSize: 10 },
                styles: { fontSize: 8.5, cellPadding: 3.5 },
                didDrawPage: renderKopAndFooter,
                margin: { top: 32, bottom: 18 }
            });

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 2,
                head: [['Kelompok Penerima Manfaat', 'Rincian Manfaat Nyata yang Diterima']],
                body: [
                    ['Ibu Pasca Melahirkan (Bunda)', 'Pemulangan nyaman tanpa risiko benturan luka jahitan di jalan raya, konsultasi gizi mudah tanpa antre, edukasi menyusui yang valid, dan ketenangan jiwa.'],
                    ['Bayi Baru Lahir', 'Mendapatkan kepastian identitas hukum (NIK, Akta Lahir, KIA) sejak awal kelahiran, serta terlindungi dari risiko stunting berkat pemantauan nutrisi.'],
                    ['Keluarga Pasien / Ayah', 'Penghematan biaya transportasi dan tidak perlu izin kerja berhari-hari untuk antre di kantor kelurahan dan Disdukcapil.'],
                    ['RSUD Bendan Pekalongan', 'Tertib administrasi digital, percepatan Bed Occupancy Rate (BOR) karena kepulangan pasien terjadwal rapi, serta kenaikan Indeks Kepuasan Masyarakat (IKM).'],
                    ['Pemerintah Kota Pekalongan', 'Peningkatan cakupan kepemilikan Akta Lahir daerah, penurunan angka kematian ibu dan bayi (AKI/AKB), serta percepatan zero stunting.']
                ],
                theme: 'grid',
                headStyles: { fillColor: [15, 118, 110], textColor: 255, fontStyle: 'bold', fontSize: 8 },
                styles: { fontSize: 7.5, cellPadding: 2.5 },
                didDrawPage: renderKopAndFooter,
                margin: { top: 32, bottom: 18 }
            });

            // ── BAGIAN 3: LATAR BELAKANG DAN GAMBARAN KONDISI SAAT INI ──
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 8,
                head: [['3. LATAR BELAKANG & GAMBARAN KONDISI SAAT INI']],
                body: [
                    ['Munculnya inovasi Sahabat Bunda dipicu oleh kesenjangan nyata antara kebutuhan perawatan ibu nifas dengan kendala birokrasi dan keterbatasan transportasi di Kota Pekalongan.']
                ],
                headStyles: { fillColor: [225, 29, 72], textColor: 255, fontStyle: 'bold', fontSize: 10 },
                styles: { fontSize: 8.5, cellPadding: 3.5 },
                didDrawPage: renderKopAndFooter,
                margin: { top: 32, bottom: 18 }
            });

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 2,
                head: [['Aspek Masalah', 'Kondisi Eksisting (Sebelum Inovasi)', 'Solusi Terintegrasi Sahabat Bunda']],
                body: [
                    ['Administrasi Bayi', 'Keluarga harus antre ke Disdukcapil berhari-hari setelah keluar RS, banyak bayi terlambat memiliki NIK.', 'Semua berkas diunggah via form online; Akta Lahir & KK diantar kurir ke rumah 100% gratis.'],
                    ['Transportasi Pulang', 'Pasien nifas pulang naik sepeda motor di tengah cuaca panas/hujan, membahayakan jahitan caesar.', 'Disediakan armada mobil resmi RSUD Bendan ber-AC menjemput dan mengantar sampai depan pintu rumah.'],
                    ['Edukasi & Gizi', 'Konsultasi gizi terputus saat pasien keluar dari rumah sakit, marak mitos pantang makan telur/ikan.', 'Telekonsultasi video call tatap muka dengan nutrisionis RSUD Bendan kapan saja secara terjadwal.'],
                    ['Pemantauan Imunisasi', 'Buku KIA fisik sering tercecer, tanggal jadwal imunisasi terlewatkan.', 'Kalkulator pintar otomatis memetakan seluruh tanggal imunisasi sejak bayi lahir.'],
                    ['Baby Blues / Mental', 'Ibu rentan mengalami stres pasca persalinan tanpa dukungan spiritual.', 'Fitur Al-Quran audio, tafsir terjemahan, dan pengingat waktu sholat terintegrasi.']
                ],
                theme: 'grid',
                headStyles: { fillColor: [190, 18, 60], textColor: 255, fontStyle: 'bold', fontSize: 8 },
                styles: { fontSize: 7.5, cellPadding: 2.5 },
                didDrawPage: renderKopAndFooter,
                margin: { top: 32, bottom: 18 }
            });

            // ── BAGIAN 4: GAMBARAN KONSEP INOVASI & FLOWCHART ──
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 8,
                head: [['4. GAMBARAN KONSEP INOVASI & ALUR FLOWCHART']],
                body: [
                    ['Arsitektur Sahabat Bunda menggabungkan sistem digital (web app realtime) dengan pelayanan lapangan (armada pengantaran & kurir dokumen).']
                ],
                headStyles: { fillColor: [2, 132, 199], textColor: 255, fontStyle: 'bold', fontSize: 10 },
                styles: { fontSize: 8.5, cellPadding: 3.5 },
                didDrawPage: renderKopAndFooter,
                margin: { top: 32, bottom: 18 }
            });

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 2,
                head: [['Tahap', 'Pelaku', 'Deskripsi Alur Tindakan']],
                body: [
                    ['1. Pengajuan', 'Pasien / Keluarga', 'Mengakses aplikasi portal Sahabat Bunda tanpa login rumit, memilih menu RAMAH/SANTUN, mengisi data & upload berkas.'],
                    ['2. Verifikasi', 'Admin RSUD Bendan', 'Memvalidasi kelengkapan berkas kependudukan dan mengecek kelayakan medis untuk jadwal penjemputan armada.'],
                    ['3. Integrasi Disdukcapil', 'Sistem & Disdukcapil', 'Data diteruskan secara otomatis ke Disdukcapil untuk penerbitan Akta Lahir, KIA, dan pembaruan KK baru.'],
                    ['4. Penugasan Driver', 'Admin & Pengemudi', 'Driver menerima disposisi titik penjemputan, menjemput Bunda dan bayi, dan mengantarkan dengan nyaman.'],
                    ['5. Tanda Tangan e-Consent', 'Pasien & Driver', 'Pasien menandatangani bukti penyerahan secara digital via layar sentuh sebagai akuntabilitas SPJ resmi.'],
                    ['6. Pendampingan Nifas', 'Ahli Gizi & Dokter', 'Sesi konsultasi video call rutin (SINERGI) dan evaluasi tumbuh kembang mandiri (SEHATI) di rumah.']
                ],
                theme: 'grid',
                headStyles: { fillColor: [3, 105, 161], textColor: 255, fontStyle: 'bold', fontSize: 8 },
                styles: { fontSize: 7.5, cellPadding: 2.5 },
                didDrawPage: renderKopAndFooter,
                margin: { top: 32, bottom: 18 }
            });

            // ── BAGIAN 5: TUJUAN APLIKASI PER MENU ──
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 8,
                head: [['5. TUJUAN APLIKASI (UMUM & SPESIFIK PER LAYANAN)']],
                body: [
                    ['Tujuan Umum: Memberikan pelayanan kesehatan ibu dan anak yang terintegrasi, humanis, cepat, dan tanpa biaya tambahan guna menekan angka kematian serta stunting di Kota Pekalongan.']
                ],
                headStyles: { fillColor: [217, 119, 6], textColor: 255, fontStyle: 'bold', fontSize: 10 },
                styles: { fontSize: 8.5, cellPadding: 3.5 },
                didDrawPage: renderKopAndFooter,
                margin: { top: 32, bottom: 18 }
            });

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 2,
                head: [['Layanan / Menu', 'Tujuan Umum', 'Tujuan Spesifik']],
                body: [
                    ['Layanan RAMAH', 'Tertib administrasi kependudukan sejak kelahiran.', '100% bayi lahir di RSUD Bendan memiliki Akta Lahir & KIA dalam 7 hari kerja tanpa biaya.'],
                    ['Layanan SANTUN', 'Transportasi pemulangan pasien nifas yang aman.', 'Meniadakan komplikasi infeksi/pendarahan luka jahitan akibat goncangan motor di perjalanan pulang.'],
                    ['Layanan SINERGI', 'Optimalisasi status gizi ibu nifas dan bayi.', 'Menjamin kecukupan gizi ibu menyusui dan keberhasilan pemberian ASI eksklusif 6 bulan penuh.'],
                    ['Menu Makanan', 'Akses nutrisi higienis berkualitas tinggi.', 'Memudahkan pasien dan penunggu memesan makanan sehat di kamar rumah sakit sesuai radius geofence.'],
                    ['Layanan BEMBI', 'Kesiapsiagaan gawat darurat ibu dan anak.', 'Respon tanggap darurat ambulance medis di bawah 15 menit di wilayah jangkauan kota.'],
                    ['Modul EMPATI', 'Literasi kesehatan medis mandiri di rumah.', 'Meningkatkan pemahaman ibu mengenai tanda bahaya nifas dan teknik menyusui benar.'],
                    ['Modul SEHATI', 'Deteksi dini stunting dan gizi buruk.', 'Mencegah stunting sedini mungkin melalui pemantauan kurva pertumbuhan Z-score Kemenkes RI.'],
                    ['Modul VAKSINASI', 'Kepatuhan jadwal imunisasi dasar lengkap.', 'Menjamin seluruh bayi mendapatkan imunisasi tepat waktu tanpa ada jadwal yang terlupakan.']
                ],
                theme: 'grid',
                headStyles: { fillColor: [180, 83, 9], textColor: 255, fontStyle: 'bold', fontSize: 8 },
                styles: { fontSize: 7.5, cellPadding: 2.5 },
                didDrawPage: renderKopAndFooter,
                margin: { top: 32, bottom: 18 }
            });

            // ── BAGIAN 6: MANFAAT APLIKASI PER MENU & PER FITUR ──
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 8,
                head: [['6. MANFAAT APLIKASI PER MENU & FITUR DALAM FORMAT PROFESIONAL']],
                body: [
                    ['Kemanfaatan inovasi Sahabat Bunda terbukti memberikan dampak positif langsung pada efisiensi anggaran warga dan peningkatan tata kelola RSUD Bendan.']
                ],
                headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: 'bold', fontSize: 10 },
                styles: { fontSize: 8.5, cellPadding: 3.5 },
                didDrawPage: renderKopAndFooter,
                margin: { top: 32, bottom: 18 }
            });

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 2,
                head: [['Fitur / Layanan', 'Manfaat bagi Pasien & Keluarga', 'Manfaat bagi Manajemen RSUD & Daerah']],
                body: [
                    ['Layanan RAMAH', 'Menghemat biaya transport pengurusan Rp 100.000 - Rp 200.000 dan tidak perlu mengantre di kantor pemerintah.', 'Pencatatan data kependudukan bayi baru lahir terintegrasi otomatis secara elektronik dengan Disdukcapil.'],
                    ['Layanan SANTUN', 'Menikmati perjalanan pulang yang aman, terlindung cuaca, sejuk, dan tidak perlu menyewa kendaraan mobil carteran.', 'Dokumentasi bukti perjalanan dinas tersimpan rapi dengan e-consent digital untuk pertanggungjawaban SPJ transparan.'],
                    ['Layanan SINERGI', 'Mendapatkan solusi langsung dari nutrisionis profesional mengenai ASI seret atau nafsu makan anak.', 'Mengurangi kunjungan rawat jalan non-urgensi ke poliklinik dan memantau status gizi balita binaan secara virtual.'],
                    ['Menu Makanan', 'Kemudahan memesan makanan lezat dan bersih dengan harga terjangkau tanpa harus meninggalkan ruang rawat inap.', 'Pemberdayaan instalasi gizi/kantin RSUD secara modern layaknya aplikasi GoFood dengan tertib pembayaran.'],
                    ['Layanan BEMBI', 'Ketenangan batin karena pertolongan darurat medis siap siaga 24 jam dengan satu klik.', 'Koordinasi IGD dan tim paramedis terarah dengan navigasi peta yang cepat dan terukur.'],
                    ['SEHATI & VAKSIN', 'Edukasi mandiri berbasis data akurat tanpa rasa cemas berlebihan mengenai tumbuh kembang anak.', 'Data agregat pemantauan stunting dapat dijadikan acuan preventif program kesehatan dinas terkait.']
                ],
                theme: 'grid',
                headStyles: { fillColor: [21, 128, 61], textColor: 255, fontStyle: 'bold', fontSize: 8 },
                styles: { fontSize: 7.5, cellPadding: 2.5 },
                didDrawPage: renderKopAndFooter,
                margin: { top: 32, bottom: 18 }
            });

            // Simpan Dokumen PDF
            const fileName = `Dokumentasi_Sistem_Sahabat_Bunda_${settings.hospitalName.replace(/\s+/g, '_')}_2026.pdf`;
            doc.save(fileName);

            toast.dismiss(loadingToast);
            toast.success('Dokumen PDF Dokumentasi Sistem berhasil diunduh!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.dismiss(loadingToast);
            toast.error('Gagal membuat dokumen PDF: ' + error.message);
        } finally {
            setGeneratingPdf(false);
        }
    };

    return (
        <div className="doc-wrapper animate-slide-up" style={{ color: '#1e293b' }}>
            {/* Header Dokumentasi */}
            <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
                borderRadius: '24px',
                padding: '28px 24px',
                color: 'white',
                marginBottom: '24px',
                boxShadow: '0 12px 30px rgba(49, 46, 129, 0.2)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', right: '-30px', top: '-30px', width: '220px', height: '220px',
                    borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, backdropFilter: 'blur(8px)' }}>
                        <BookOpen size={14} /> DOKUMENTASI SISTEM RESMI & MASTER PLAN INOVASI
                    </div>

                    {/* Tombol Unduh PDF Resmi */}
                    <button
                        onClick={handleDownloadPDF}
                        disabled={generatingPdf}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '9px 18px',
                            borderRadius: '14px',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            cursor: generatingPdf ? 'not-allowed' : 'pointer',
                            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                            transition: 'all 0.2s',
                            fontFamily: "'Plus Jakarta Sans', sans-serif"
                        }}
                    >
                        <Download size={16} />
                        <span>{generatingPdf ? 'Membuat PDF...' : 'Unduh Dokumen PDF Resmi'}</span>
                    </button>
                </div>

                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '14px 0 8px', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.5px' }}>
                    Sahabat Bunda RSUD Bendan
                </h1>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#e0e7ff', lineHeight: 1.6, maxWidth: '850px' }}>
                    Sistem Terpadu Pelayanan Pasca Persalinan, Administrasi Kependudukan Terintegrasi, Transportasi Pulang Nifas Gratis, Konsultasi Gizi Virtual, dan Edukasi Kesehatan Ibu-Bayi Kota Pekalongan.
                </p>

                {/* Sub Navigation Bar */}
                <div style={{
                    display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap',
                    paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.15)'
                }}>
                    {sections.map(s => {
                        const Icon = s.icon;
                        const isActive = activeSection === s.id;
                        return (
                            <button
                                key={s.id}
                                onClick={() => scrollToSection(s.id)}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    padding: '8px 14px', borderRadius: '12px',
                                    fontSize: '0.78rem', fontWeight: 700,
                                    border: 'none', cursor: 'pointer',
                                    background: isActive ? 'white' : 'rgba(255,255,255,0.12)',
                                    color: isActive ? '#312e81' : 'white',
                                    boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Icon size={14} />
                                {s.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                {/* ══════════════════════════════════════════════════════════
                    BAGIAN 1: GAMBARAN APLIKASI & SELURUH FITUR MENU
                ══════════════════════════════════════════════════════════ */}
                <div id="doc-sec-overview" style={{
                    background: 'white', borderRadius: '24px', padding: '28px',
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Layers size={22} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, fontFamily: "'Outfit', sans-serif", color: '#1e1b4b' }}>
                                1. Gambaran Aplikasi & Seluruh Fitur Menu
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                                Rincian lengkap arsitektur dan spesifikasi layanan platform Sahabat Bunda
                            </p>
                        </div>
                    </div>

                    <div style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#334155', marginBottom: '20px' }}>
                        <p>
                            <strong>Sahabat Bunda</strong> adalah inovasi platform pelayanan kesehatan dan administrasi digital terintegrasi yang digagas oleh <strong>RSUD Bendan Kota Pekalongan</strong>. Aplikasi ini dirancang untuk mendampingi ibu bersalin (Bunda) mulai dari kepulangan rawat inap, pengurusan identitas hukum bayi baru lahir tanpa repot, pendampingan nutrisi berkelanjutan, hingga pemantauan imunisasi dan evaluasi tumbuh kembang anak secara mandiri.
                        </p>
                    </div>

                    {/* Grid Fitur Menu */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                        {[
                            {
                                tag: 'ADMINISTRASI KEPENDUDUKAN',
                                name: 'RAMAH (Registrasi Akta Mudah Antar ke Rumah)',
                                icon: FileText,
                                color: '#2563eb',
                                bg: '#eff6ff',
                                desc: 'Layanan terintegrasi dengan Disdukcapil untuk pengurusan Akta Kelahiran, Kartu Identitas Anak (KIA), dan Kartu Keluarga (KK) baru bagi bayi yang lahir di RSUD Bendan. Pasien cukup mengisi form digital dan mengunggah foto KTP/KK/Surat Keterangan Lahir (SKL). Dokumen fisik yang telah tuntas diantar langsung ke rumah pasien secara 100% GRATIS.'
                            },
                            {
                                tag: 'TRANSPORTASI PASIEN',
                                name: 'SANTUN (Saya Antar sampai Tujuan)',
                                icon: Truck,
                                color: '#ea580c',
                                bg: '#fff7ed',
                                desc: 'Fasilitas transportasi pemulangan gratis bagi ibu dan bayi pasca persalinan khusus domisili Kota Pekalongan. Menggunakan armada kendaraan RSUD Bendan yang ber-AC, bersih, dan nyaman. Dilengkapi fitur peta OpenStreetMap interaktif, penentuan rute otomatis, estimasi jarak dan waktu tempuh, serta penandatanganan e-consent digital untuk tertib administrasi SPJ.'
                            },
                            {
                                tag: 'TELEKONSULTASI GIZI',
                                name: 'SINERGI (Sistem Integrasi Edukasi & Rekonsiliasi Gizi)',
                                icon: Video,
                                color: '#16a34a',
                                bg: '#f0fdf4',
                                desc: 'Layanan telekonsultasi video call tatap muka eksklusif dengan Ahli Gizi profesional RSUD Bendan. Mendukung sesi individual maupun konsultasi grup terjadwal (Jitsi Meet). Pasien dapat berkonsultasi mengenai asupan nutrisi nifas, ASI eksklusif, MPASI bergizi, dan tata laksana gizi balita tanpa harus hadir ke rumah sakit.'
                            },
                            {
                                tag: 'EMERGENCY HOTLINE',
                                name: 'BEMBI (Bendan Emergency Mobile)',
                                icon: Ambulance,
                                color: '#ef4444',
                                bg: '#fef2f2',
                                desc: 'Layanan ambulans tanggap darurat (quick response) 24 jam untuk pasien ibu bersalin, nifas, dan bayi dalam kondisi kegawatdaruratan medis. Terkoneksi satu sentuhan (one-click) dengan Call Center IGD dan petugas medis darurat RSUD Bendan.'
                            },
                            {
                                tag: 'EDUKASI MEDIS DIGITAL',
                                name: 'EMPATI (Edukasi Medis Pasca Persalinan Terpadu)',
                                icon: Heart,
                                color: '#0284c7',
                                bg: '#f0f9ff',
                                desc: 'Kumpulan modul video pembelajaran medis yang divalidasi oleh dokter spesialis kandungan dan anak RSUD Bendan. Membahas perawatan luka nifas/caesar, cara menyusui yang benar, senam nifas, manajemen laktasi, dan mengenali tanda bahaya pasca persalinan.'
                            },
                            {
                                tag: 'DETEKSI GIZI & STUNTING',
                                name: 'SEHATI (Sistem Evaluasi Kesehatan & Tumbuh Kembang)',
                                icon: Activity,
                                color: '#d97706',
                                bg: '#fffbeb',
                                desc: 'Kalkulator pintar antropometri balita berdasarkan Standar Baku Kemenkes RI (BB/U, TB/U, BB/TB, IMT/U). Bunda dapat memasukkan usia, berat, dan tinggi badan buah hati untuk mendeteksi dini risiko stunting, gizi kurang, atau gizi lebih secara cepat dan akurat.'
                            },
                            {
                                tag: 'JADWAL IMUNISASI',
                                name: 'VAKSINASI (Penjadwalan Imunisasi Otomatis)',
                                icon: ShieldPlus,
                                color: '#7c3aed',
                                bg: '#f5f3ff',
                                desc: 'Alat bantu otomatis untuk menghitung jadwal seluruh imunisasi wajib bayi (Hepatitis B, BCG, Polio, DPT-HB-Hib, PCV, Rotavirus, Campak-Rubella) hanya dengan memasukkan tanggal lahir buah hati, mengacu pada rekomendasi IDAI dan Kemenkes.'
                            },
                            {
                                tag: 'KETENANGAN SPIRITUAL',
                                name: "AL-QUR'AN & PENGINGAT SHOLAT",
                                icon: BookOpen,
                                color: '#4f46e5',
                                bg: '#eef2ff',
                                desc: 'Fitur pendamping spiritual yang memuat mushaf digital 114 surah dengan terjemahan bahasa Indonesia, audio murottal, dan widget waktu sholat otomatis Pekalongan dengan hitung mundur waktu berikutnya, guna menunjang ketenangan mental bunda (mencegah baby blues).'
                            },
                            {
                                tag: 'TRANSPARANSI PUBLIK',
                                name: 'LACAK LAYANAN (Realtime Tracking Engine)',
                                icon: Search,
                                color: '#059669',
                                bg: '#ecfdf5',
                                desc: 'Modul pelacakan terpusat di mana keluarga pasien dapat memantau status permohonan RAMAH maupun SANTUN kapan saja secara mandiri menggunakan kode tracking unik atau nomor handphone yang terdaftar.'
                            },
                            {
                                tag: 'COMMAND CENTER',
                                name: 'PANEL ADMIN & MANAJEMEN SPJ',
                                icon: Building2,
                                color: '#1e293b',
                                bg: '#f8fafc',
                                desc: 'Dashboard terpadu bagi administrator RSUD Bendan untuk memverifikasi dokumen pemohon, menjadwalkan armada penjemputan, memantau riwayat telekonsultasi, mengunduh arsip digital berkas pendaftaran (ZIP/PDF/Excel), serta menghasilkan bukti fisik SPJ kegiatan pemulangan pasien.'
                            }
                        ].map((fitur, idx) => {
                            const Icon = fitur.icon;
                            return (
                                <div key={idx} style={{
                                    border: '1px solid #e2e8f0', borderRadius: '18px', padding: '18px',
                                    background: '#ffffff', display: 'flex', flexDirection: 'column',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: fitur.color, background: fitur.bg, padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.5px' }}>
                                            {fitur.tag}
                                        </span>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: fitur.bg, color: fitur.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Icon size={18} />
                                        </div>
                                    </div>
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 6px', color: '#1e293b', fontFamily: "'Outfit', sans-serif" }}>
                                        {fitur.name}
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.55 }}>
                                        {fitur.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    BAGIAN 2: PENERIMA MANFAAT
                ══════════════════════════════════════════════════════════ */}
                <div id="doc-sec-beneficiaries" style={{
                    background: 'white', borderRadius: '24px', padding: '28px',
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={22} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, fontFamily: "'Outfit', sans-serif", color: '#14532d' }}>
                                2. Siapakah Penerima Manfaat Inovasi?
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                                Identifikasi pemangku kepentingan dan pihak-pihak yang merasakan dampak langsung
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                        {[
                            {
                                role: '1. Ibu Bersalin (Bunda)',
                                icon: Heart,
                                color: '#ec4899',
                                items: [
                                    'Mendapatkan ketenangan batin karena tidak perlu terbebani memikirkan transportasi pulang paska melahirkan.',
                                    'Bebas dari kelelahan mengurus akta lahir dan dokumen anak ke kantor dinas saat kondisi fisik masih pemulihan.',
                                    'Memperoleh akses bimbingan gizi dan laktasi langsung dari tenaga ahli rumah sakit secara online.'
                                ]
                            },
                            {
                                role: '2. Bayi Baru Lahir',
                                icon: Sparkles,
                                color: '#f59e0b',
                                items: [
                                    'Terjamin hak kewarganegaraan dan identitas legalnya (NIK, Akta Lahir, KIA) sejak hari pertama kelahiran.',
                                    'Memperoleh akses jaminan kesehatan (BPJS) lebih cepat berkat ketersediaan NIK resmi tanpa penundaan.',
                                    'Terkawal jadwal imunisasinya secara teratur dan terpantau kurva status gizinya untuk mencegah stunting.'
                                ]
                            },
                            {
                                role: '3. Keluarga & Ayah Pasien',
                                icon: Users,
                                color: '#3b82f6',
                                items: [
                                    'Menghemat biaya sewa ambulans/taksi online untuk pemulangan ibu dan bayi ke rumah.',
                                    'Tidak perlu izin meninggalkan pekerjaan berhari-hari hanya untuk mengantre berkas kependudukan di kantor Disdukcapil.',
                                    'Dapat memantau proses kepulangan dan status berkas secara transparan melalui gawai.'
                                ]
                            },
                            {
                                role: '4. Tenaga Medis & Ahli Gizi RSUD',
                                icon: Activity,
                                color: '#10b981',
                                items: [
                                    'Memiliki kanal telekonsultasi resmi dan terdata rapi untuk edukasi gizi balita paska rawat inap.',
                                    'Mengurangi penumpukan antrean fisik di poliklinik rawat jalan RSUD Bendan.',
                                    'Data riwayat konsultasi tersimpan rapi dalam database rumah sakit untuk monitoring berkala.'
                                ]
                            },
                            {
                                role: '5. Manajemen RSUD Bendan',
                                icon: Building2,
                                color: '#6366f1',
                                items: [
                                    'Meningkatkan Indeks Kepuasan Masyarakat (IKM) terhadap layanan rumah sakit daerah.',
                                    'Optimalisasi perputaran tempat tidur (Bed Occupancy Rate) di ruang nifas karena pemulangan tertata cepat.',
                                    'Akuntabilitas dan transparansi pelaporan Surat Pertanggungjawaban (SPJ) transportasi armada.'
                                ]
                            },
                            {
                                role: '6. Pemkot Pekalongan & Disdukcapil',
                                icon: ShieldCheck,
                                color: '#065f46',
                                items: [
                                    'Mendongkrak capaian persentase kepemilikan Akta Lahir & KIA hingga mendekati 100% di Kota Pekalongan.',
                                    'Mendukung program nasional penurunan angka stunting dan percepatan digitalisasi pelayanan publik daerah.'
                                ]
                            }
                        ].map((group, i) => {
                            const Icon = group.icon;
                            return (
                                <div key={i} style={{
                                    border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px',
                                    background: '#fafafa'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${group.color}20`, color: group.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Icon size={16} />
                                        </div>
                                        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>{group.role}</h4>
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#475569', lineHeight: 1.6 }}>
                                        {group.items.map((it, idx) => (
                                            <li key={idx} style={{ marginBottom: '6px' }}>{it}</li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    BAGIAN 3: LATAR BELAKANG & GAMBARAN KONDISI SAAT INI
                ══════════════════════════════════════════════════════════ */}
                <div id="doc-sec-background" style={{
                    background: 'white', borderRadius: '24px', padding: '28px',
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Heart size={22} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, fontFamily: "'Outfit', sans-serif", color: '#991b1b' }}>
                                3. Latar Belakang & Kondisi yang Mendasari Inovasi
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                                Perbandingan komparatif kondisi sebelum inovasi (Before) versus setelah hadirnya Sahabat Bunda (After)
                            </p>
                        </div>
                    </div>

                    <div style={{ fontSize: '0.88rem', lineHeight: 1.7, color: '#334155', marginBottom: '20px' }}>
                        <p>
                            Masa nifas pasca persalinan merupakan salah satu periode paling kritis dalam kehidupan seorang ibu dan bayi baru lahir. Kondisi fisik ibu yang masih lemah akibat luka jalan lahir maupun operasi sesar seringkali dihadapkan pada tuntutan administratif dan mobilitas fisik yang membebani. Di sisi lain, periode 1000 Hari Pertama Kehidupan (HPK) membutuhkan pengawasan nutrisi yang ketat guna mencegah ancaman stunting pada generasi masa depan.
                        </p>
                    </div>

                    {/* Tabel Perbandingan Before vs After */}
                    <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#1e293b', width: '22%' }}>Aspek Pelayanan</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#dc2626', background: '#fef2f2', width: '39%' }}>
                                        ⚠️ Kondisi Sebelum Inovasi (Problem)
                                    </th>
                                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#15803d', background: '#f0fdf4', width: '39%' }}>
                                        ✨ Kondisi Setelah Inovasi (Solusi Sahabat Bunda)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    {
                                        aspect: 'Pengurusan Akta Lahir & KK',
                                        before: 'Keluarga harus datang secara mandiri ke kantor Disdukcapil atau kelurahan, mengantre lama, dan memakan waktu berhari-hari. Akibatnya banyak akta lahir terlambat dibuat berbulan-bulan.',
                                        after: 'Cukup isi formulir online dan upload dokumen lewat menu RAMAH saat di rumah sakit. Akta lahir, KK baru, dan KIA diproses kilat dan diantar langsung ke rumah secara gratis.'
                                    },
                                    {
                                        aspect: 'Pemulangan Pasien Nifas',
                                        before: 'Pasien nifas dari keluarga prasejahtera bingung mencari transportasi pulang yang aman. Sebagian terpaksa pulang naik sepeda motor dengan menggendong bayi baru lahir yang sangat berisiko.',
                                        after: 'Disediakan armada mobil resmi RSUD Bendan ber-AC secara gratis lewat menu SANTUN. Pasien diantar selamat dan nyaman sampai di depan pintu rumah.'
                                    },
                                    {
                                        aspect: 'Konsultasi Gizi & Masalah ASI',
                                        before: 'Ibu yang mengalami masalah ASI seret atau kebingungan MPASI harus datang kembali ke rumah sakit dan antre di poli gizi, sehingga seringkali diabaikan hingga anak malnutrisi.',
                                        after: 'Telekonsultasi video call tatap muka terjadwal via menu SINERGI bersama Ahli Gizi RSUD Bendan, praktis dari rumah via smartphone tanpa biaya tambahan.'
                                    },
                                    {
                                        aspect: 'Pemantauan Status Gizi Balita',
                                        before: 'Ibu hanya bergantung pada posyandu bulanan dan sering kali tidak memahami kurva pertumbuhan anak, menyebabkan keterlambatan penanganan stunting.',
                                        after: 'Menu SEHATI menyediakan kalkulator antropometri digital mandiri sesuai standar Kemenkes yang dapat diakses setiap saat dengan interpretasi status yang jelas.'
                                    },
                                    {
                                        aspect: 'Edukasi Perawatan Pasca Salin',
                                        before: 'Edukasi hanya berupa selebaran kertas (leaflet) yang mudah hilang atau penjelasan lisan singkat saat pasien hendak keluar rumah sakit.',
                                        after: 'Modul video interaktif terverifikasi dokter di menu EMPATI dan dukungan spiritual di menu AL-QUR’AN yang dapat dipelajari ulang kapan saja.'
                                    }
                                ].map((row, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#334155', verticalAlign: 'top' }}>
                                            {row.aspect}
                                        </td>
                                        <td style={{ padding: '12px 16px', color: '#991b1b', background: '#fff5f5', verticalAlign: 'top', lineHeight: 1.5 }}>
                                            {row.before}
                                        </td>
                                        <td style={{ padding: '12px 16px', color: '#166534', background: '#f6fef9', verticalAlign: 'top', lineHeight: 1.5, fontWeight: 500 }}>
                                            {row.after}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    BAGIAN 4: GAMBARAN KONSEP & FLOWCHART SISTEM
                ══════════════════════════════════════════════════════════ */}
                <div id="doc-sec-flowchart" style={{
                    background: 'white', borderRadius: '24px', padding: '28px',
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Compass size={22} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, fontFamily: "'Outfit', sans-serif", color: '#78350f' }}>
                                4. Gambaran Konsep Aplikasi & Flowchart Alur Pelayanan
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                                Diagram alur logika sistem mengikuti kaidah diagram alir resmi (ISO/ANSI Standard)
                            </p>
                        </div>
                    </div>

                    <div style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#334155', marginBottom: '24px' }}>
                        <p>
                            Alur sistem Sahabat Bunda memadukan interaksi antara <strong>Pasien (Bunda)</strong>, <strong>Petugas Verifikator RSUD</strong>, <strong>Driver Armada SANTUN</strong>, <strong>Ahli Gizi SINERGI</strong>, serta <strong>Disdukcapil</strong>. Diagram alir di bawah ini menyajikan siklus proses dari titik awal persalinan hingga akhir pelayanan:
                        </p>
                    </div>

                    {/* Flowchart Diagram Visual Box */}
                    <div style={{
                        background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '20px',
                        padding: '28px 20px', overflowX: 'auto', textAlign: 'center'
                    }}>
                        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '14px', minWidth: '600px' }}>

                            {/* Node 1: START */}
                            <div style={{
                                width: '220px', padding: '12px', borderRadius: '30px',
                                background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white',
                                fontWeight: 800, fontSize: '0.85rem', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
                            }}>
                                🟢 MULAI: Pasien Melahirkan di RSUD Bendan
                            </div>

                            {/* Arrow */}
                            <div style={{ color: '#94a3b8', fontSize: '1.2rem' }}>↓</div>

                            {/* Node 2: INPUT / PORTAL */}
                            <div style={{
                                width: '280px', padding: '12px 18px', borderRadius: '12px',
                                background: '#ffffff', border: '2px solid #3b82f6', color: '#1e3a8a',
                                fontWeight: 700, fontSize: '0.82rem', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)'
                            }}>
                                📱 Pasien Mengakses Portal SahabatBunda
                                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>
                                    Memilih Layanan yang Dibutuhkan
                                </div>
                            </div>

                            {/* Arrow */}
                            <div style={{ color: '#94a3b8', fontSize: '1.2rem' }}>↓</div>

                            {/* Node 3: BRANCHING / JALUR LAYANAN */}
                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', width: '100%' }}>
                                {/* Branch A: RAMAH */}
                                <div style={{ flex: 1, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '12px' }}>
                                    <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#1d4ed8', marginBottom: '4px' }}>
                                        Jalur RAMAH
                                    </div>
                                    <div style={{ fontSize: '0.74rem', color: '#475569' }}>
                                        Input Data Bayi & Upload Berkas (KTP/SKL/KK)
                                    </div>
                                    <div style={{ color: '#3b82f6', margin: '4px 0' }}>↓</div>
                                    <div style={{ background: 'white', padding: '6px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 600, color: '#1e40af' }}>
                                        Diverifikasi Petugas & Terhubung ke Disdukcapil
                                    </div>
                                    <div style={{ color: '#3b82f6', margin: '4px 0' }}>↓</div>
                                    <div style={{ background: '#dbeafe', padding: '6px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, color: '#1e40af' }}>
                                        Akta & KK Diantar ke Rumah Pasien
                                    </div>
                                </div>

                                {/* Branch B: SANTUN */}
                                <div style={{ flex: 1, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '14px', padding: '12px' }}>
                                    <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#c2410c', marginBottom: '4px' }}>
                                        Jalur SANTUN
                                    </div>
                                    <div style={{ fontSize: '0.74rem', color: '#475569' }}>
                                        Pilih Titik Antar di Peta OSM & Setujui E-Consent
                                    </div>
                                    <div style={{ color: '#f97316', margin: '4px 0' }}>↓</div>
                                    <div style={{ background: 'white', padding: '6px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 600, color: '#9a3412' }}>
                                        Penugasan Driver & Notifikasi WhatsApp Armada
                                    </div>
                                    <div style={{ color: '#f97316', margin: '4px 0' }}>↓</div>
                                    <div style={{ background: '#ffedd5', padding: '6px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, color: '#9a3412' }}>
                                        Penjemputan & Pengantaran Aman ke Rumah
                                    </div>
                                </div>

                                {/* Branch C: SINERGI */}
                                <div style={{ flex: 1, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '12px' }}>
                                    <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#15803d', marginBottom: '4px' }}>
                                        Jalur SINERGI
                                    </div>
                                    <div style={{ fontSize: '0.74rem', color: '#475569' }}>
                                        Pendaftaran Konsultasi Nutrisi & Gizi Bayi
                                    </div>
                                    <div style={{ color: '#22c55e', margin: '4px 0' }}>↓</div>
                                    <div style={{ background: 'white', padding: '6px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 600, color: '#166534' }}>
                                        Penjadwalan Sesi & Penerbitan ID Video Jitsi
                                    </div>
                                    <div style={{ color: '#22c55e', margin: '4px 0' }}>↓</div>
                                    <div style={{ background: '#dcfce7', padding: '6px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, color: '#166534' }}>
                                        Tatap Muka Video Call Bersama Ahli Gizi
                                    </div>
                                </div>
                            </div>

                            {/* Arrow */}
                            <div style={{ color: '#94a3b8', fontSize: '1.2rem' }}>↓</div>

                            {/* Node 4: DECISION POINT (Belah Ketupat) */}
                            <div style={{
                                width: '320px', padding: '12px 16px', borderRadius: '16px',
                                background: '#fef3c7', border: '2px solid #f59e0b', color: '#78350f',
                                fontWeight: 800, fontSize: '0.82rem', position: 'relative'
                            }}>
                                ⚖️ Keputusan: Apakah Layanan Telah Tuntas & Sesuai?
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginTop: '6px', fontWeight: 700 }}>
                                    <span style={{ color: '#16a34a' }}>[ YA ] → Lanjut SPJ & Feedback</span>
                                    <span style={{ color: '#dc2626' }}>[ TIDAK ] → Perbaikan Data</span>
                                </div>
                            </div>

                            {/* Arrow */}
                            <div style={{ color: '#94a3b8', fontSize: '1.2rem' }}>↓</div>

                            {/* Node 5: OUTPUT / DATABASE SPJ */}
                            <div style={{
                                width: '340px', padding: '12px', borderRadius: '14px',
                                background: 'white', border: '2px dashed #6366f1', color: '#3730a3',
                                fontWeight: 700, fontSize: '0.82rem'
                            }}>
                                📊 Dashboard Admin: Pembentukan SPJ, Rekapitulasi Data, & Dokumentasi Digital
                            </div>

                            {/* Arrow */}
                            <div style={{ color: '#94a3b8', fontSize: '1.2rem' }}>↓</div>

                            {/* Node 6: END */}
                            <div style={{
                                width: '220px', padding: '12px', borderRadius: '30px',
                                background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white',
                                fontWeight: 800, fontSize: '0.85rem'
                            }}>
                                🏁 SELESAI: Pasien Puas & Berkas Tertib
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    BAGIAN 5: TUJUAN APLIKASI PER MENU (UMUM & SPESIFIK)
                ══════════════════════════════════════════════════════════ */}
                <div id="doc-sec-goals" style={{
                    background: 'white', borderRadius: '24px', padding: '28px',
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Target size={22} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, fontFamily: "'Outfit', sans-serif", color: '#1e3a8a' }}>
                                5. Tujuan Aplikasi (Tujuan Umum & Spesifik)
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                                Sasaran strategis dan operasional yang menjadi tolak ukur keberhasilan sistem
                            </p>
                        </div>
                    </div>

                    {/* Tujuan Umum Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                        border: '1px solid #bfdbfe', borderRadius: '18px', padding: '20px',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#1e40af', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle2 size={18} color="#2563eb" /> TUJUAN UMUM
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#1e3a8a', lineHeight: 1.6, margin: 0 }}>
                            Mewujudkan pelayanan kesehatan ibu dan anak yang paripurna, inklusif, dan terintegrasi di RSUD Bendan Kota Pekalongan melalui pemanfaatan teknologi digital terpadu; guna mempermudah administrasi kependudukan bayi baru lahir, memfasilitasi pemulangan nifas yang aman dan bermartabat, menekan prevalensi stunting melalui intervensi gizi dini, serta meningkatkan derajat kepuasan masyarakat terhadap layanan publik pemerintah daerah.
                        </p>
                    </div>

                    {/* Tujuan Spesifik per Menu */}
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b', marginBottom: '14px' }}>
                        Tujuan Spesifik per Menu Layanan:
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                        {[
                            {
                                menu: 'Menu RAMAH',
                                goals: [
                                    'Mempercepat penerbitan 3 dokumen kependudukan (Akta Lahir, KIA, KK) maksimal 7 hari kerja sejak lahir.',
                                    'Menghilangkan beban biaya transportasi dan antrean fisik keluarga di kantor Disdukcapil.',
                                    'Mendukung ketercapaian target 100% kepemilikan akta kelahiran di Kota Pekalongan.'
                                ]
                            },
                            {
                                menu: 'Menu SANTUN',
                                goals: [
                                    'Menjamin pemulangan ibu dan bayi dengan aman dalam kendaraan layak medis ber-AC tanpa biaya.',
                                    'Mencegah risiko komplikasi perjalanan pasca persalinan akibat transportasi roda dua yang rentan.',
                                    'Menyediakan data tracking perjalanan dan e-consent digital untuk akuntabilitas pertanggungjawaban dinas.'
                                ]
                            },
                            {
                                menu: 'Menu SINERGI',
                                goals: [
                                    'Membuka akses telekonsultasi gizi fleksibel tanpa batas jarak bagi bunda paska rawat inap.',
                                    'Meningkatkan cakupan pemberian ASI Eksklusif 6 bulan pertama pada bayi baru lahir.',
                                    'Mencegah kejadian gagal tumbuh (growth faltering) yang berpotensi menjadi stunting permanen.'
                                ]
                            },
                            {
                                menu: 'Menu BEMBI',
                                goals: [
                                    'Menyediakan saluran darurat langsung (direct emergency line) 24 jam dengan waktu respon cepat.',
                                    'Meminimalkan risiko morbiditas dan mortalitas ibu dan bayi akibat keterlambatan rujukan gawat darurat.'
                                ]
                            },
                            {
                                menu: 'Menu SEHATI & VAKSINASI',
                                goals: [
                                    'Memberikan edukasi mandiri kepada bunda agar mampu membaca kurva antropometri standar Kemenkes.',
                                    'Mencegah keterlambatan pemberian imunisasi dasar lengkap melalui perhitungan kalender otomatis.'
                                ]
                            },
                            {
                                menu: 'Menu ADMIN DASHBOARD',
                                goals: [
                                    'Menyajikan visualisasi data statistik real-time untuk pengambilan keputusan manajemen RSUD.',
                                    'Mengotomatiskan pembuatan berkas SPJ, ekspor Excel/PDF, dan pengarsipan digital yang rapi.'
                                ]
                            }
                        ].map((item, idx) => (
                            <div key={idx} style={{
                                border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px',
                                background: '#f8fafc'
                            }}>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', margin: '0 0 8px' }}>
                                    {item.menu}
                                </h4>
                                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78rem', color: '#475569', lineHeight: 1.55 }}>
                                    {item.goals.map((g, gIdx) => (
                                        <li key={gIdx} style={{ marginBottom: '4px' }}>{g}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    BAGIAN 6: MANFAAT APLIKASI PER MENU & PER FITUR
                ══════════════════════════════════════════════════════════ */}
                <div id="doc-sec-benefits" style={{
                    background: 'white', borderRadius: '24px', padding: '28px',
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Award size={22} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, fontFamily: "'Outfit', sans-serif", color: '#581c87' }}>
                                6. Manfaat Aplikasi per Menu & per Fitur
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                                Matriks analisis kemanfaatan profesional yang terukur bagi pasien, rumah sakit, dan daerah
                            </p>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#1e293b', width: '15%' }}>Menu Layanan</th>
                                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#1e293b', width: '28%' }}>Manfaat Bagi Pasien & Keluarga</th>
                                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#1e293b', width: '28%' }}>Manfaat Bagi RSUD Bendan</th>
                                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#1e293b', width: '29%' }}>Indikator Dampak (KPI)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    {
                                        menu: 'RAMAH (Akta)',
                                        pasien: 'Dokumen kependudukan (Akta Lahir, KIA, KK) selesai otomatis diantar ke rumah tanpa repot antre.',
                                        rs: 'Data kelahiran tervalidasi cepat, memperkuat reputasi rumah sakit ramah ibu dan anak.',
                                        kpi: 'Tingkat kepemilikan akta kelahiran baru mencapai 100% tepat waktu.'
                                    },
                                    {
                                        menu: 'SANTUN (Transport)',
                                        pasien: 'Pemulangan gratis, nyaman, terproteksi dari cuaca dan polusi jalanan dengan kendaraan ber-AC.',
                                        rs: 'Pemanfaatan armada rumah sakit terkelola efisien dan pertanggungjawaban SPJ terotomatisasi.',
                                        kpi: 'Efisiensi waktu pemulangan dan 0% komplikasi perjalanan nifas.'
                                    },
                                    {
                                        menu: 'SINERGI (Gizi)',
                                        pasien: 'Bimbingan pola makan nifas dan MPASI anak fleksibel via tatap muka video call gratis dari rumah.',
                                        rs: 'Monitoring pasca perawatan berjalan optimal tanpa membebani kapasitas poli fisik.',
                                        kpi: 'Kenaikan tingkat keberhasilan ASI Eksklusif dan penurunan risiko stunting.'
                                    },
                                    {
                                        menu: 'BEMBI (Emergency)',
                                        pasien: 'Rasa aman karena tersedianya kontak darurat terpadu ambulans 24 jam dalam sekali klik.',
                                        rs: 'Koordinasi penanganan kasus gawat darurat ibu dan anak menjadi sangat cepat dan terarah.',
                                        kpi: 'Response time armada ambulans darurat di bawah standar toleransi medis.'
                                    },
                                    {
                                        menu: 'EMPATI & SEHATI',
                                        pasien: 'Literasi kesehatan nifas meningkat dan kemampuan deteksi mandiri status gizi balita terwujud.',
                                        rs: 'Mengurangi kunjungan rumah sakit untuk keluhan ringan yang sebenarnya bisa diatasi mandiri.',
                                        kpi: 'Tingginya pemahaman ibu terhadap tanda bahaya nifas & kurva tumbuh kembang.'
                                    },
                                    {
                                        menu: 'ADMIN & SPJ',
                                        pasien: 'Mendapatkan kepastian layanan yang transparan dan dapat dilacak real-time.',
                                        rs: 'Dokumentasi arsip tertib digital, bebas kertas (paperless), dan pelaporan audit keuangan instansi sangat mudah.',
                                        kpi: 'Waktu pembuatan rekapitulasi laporan SPJ terpangkas dari hari ke menit.'
                                    }
                                ].map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                                        <td style={{ padding: '12px 14px', fontWeight: 800, color: '#312e81', verticalAlign: 'top' }}>
                                            {row.menu}
                                        </td>
                                        <td style={{ padding: '12px 14px', color: '#475569', verticalAlign: 'top', lineHeight: 1.5 }}>
                                            {row.pasien}
                                        </td>
                                        <td style={{ padding: '12px 14px', color: '#475569', verticalAlign: 'top', lineHeight: 1.5 }}>
                                            {row.rs}
                                        </td>
                                        <td style={{ padding: '12px 14px', color: '#166534', fontWeight: 600, verticalAlign: 'top', lineHeight: 1.5, background: 'rgba(240, 253, 244, 0.4)' }}>
                                            {row.kpi}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}

