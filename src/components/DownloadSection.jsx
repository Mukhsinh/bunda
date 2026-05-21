import React from 'react';
import { Download, FileText, Presentation } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import pptxgen from 'pptxgenjs';

const DownloadSection = () => {
    const appContent = {
        title: 'SAHABAT BUNDA: Ekosistem Digital Kesehatan & Administrasi',
        sections: [
            {
                id: 1,
                title: '1. Gambaran Umum Inovasi Sahabat Bunda',
                content: 'Sahabat Bunda (Sistem Aplikasi Kesehatan dan Administrasi Berbasis Terpadu - Bunda) adalah ekosistem digital inovatif yang dirancang oleh RSUD Bendan Kota Pekalongan untuk mengintegrasikan layanan kesehatan ibu dan anak dengan administrasi kependudukan. Kebaharuannya terletak pada pendekatan one-stop service yang menggabungkan aspek klinis (pemantauan kesehatan) dengan aspek administratif (pengurusan akta) dan logistik (transportasi pasca-nifas) secara real-time.'
            },
            {
                id: 2,
                title: '2. Latar Belakang Inovasi',
                content: 'Identifikasi Masalah: Tingginya angka stunting di tingkat nasional dan daerah, rendahnya kecepatan akses layanan administrasi kependudukan bagi bayi baru lahir, serta hambatan logistik pasien nifas.\n\nRegulasi Pendukung:\n- Perpres No. 72 Tahun 2021 tentang Percepatan Penurunan Stunting.\n- UU No. 17 Tahun 2023 tentang Kesehatan.\n- Permenkes No. 2 Tahun 2020 tentang Standar Antropometri Anak.\n\nKorelasi & Dampak:\n- Peningkatan Pendapatan RS: Efisiensi alur pasien meningkatkan volume layanan.\n- Efisiensi: Digitalisasi mengurangi beban kerja manual (paperless).\n- Pencegahan Stunting: Pemantauan digital melalui fitur SEHATI memastikan intervensi dini yang akurat.'
            },
            {
                id: 3,
                title: '3. Manfaat dan Tujuan',
                content: 'Tujuan: Mewujudkan pelayanan kesehatan ibu dan anak yang terintegrasi, transparan, dan akuntabel.\n\nManfaat: Mempermudah masyarakat dalam mengakses layanan, meningkatkan akurasi data kesehatan bayi, serta mempercepat distribusi dokumen kependudukan melalui integrasi sistem Disdukcapil.'
            },
            {
                id: 4,
                title: '4. Fitur dan Menu Unggulan',
                content: '- RAMAH: Registrasi Akta Mudah Antar sampai Rumah. Pengurusan akta kelahiran mandiri.\n- SANTUN: Saya Antar sampai Tujuan. Layanan transportasi pulang gratis bagi pasien nifas BPJS.\n- SEHATI: Sistem Edukasi & Kesehatan Terintegrasi. Kalkulator gizi WHO untuk deteksi dini stunting.\n- SINERGI: Konsultasi Online Sinergi. Video telekonsultasi dengan dokter spesialis.\n- BEMBI: Bendan Emergency Mobile Interaction. Ambulans gawat darurat sekali klik.\n- VAKSIN: Informasi dan jadwal vaksinasi terpadu.\n- EMPATI: Edukasi Masyarakat & Pelayanan Terintegrasi. Perpustakaan digital materi kesehatan.'
            },
            {
                id: 5,
                title: '5. Target yang Diharapkan',
                content: 'Sebelum:\n- Proses administrasi manual (2-3 hari).\n- Pemantauan gizi sporadis dan manual.\n- Antrean fisik yang panjang di loket.\n\nSesudah:\n- Administrasi selesai saat pasien pulang (Real-time).\n- Pemantauan gizi terstandarisasi WHO via aplikasi.\n- Antrean terdistribusi secara digital dan efisien.'
            },
            {
                id: 6,
                title: '6. Adaptabilitas',
                content: 'Aplikasi Sahabat Bunda dibangun dengan arsitektur modular yang memungkinkan integrasi mudah dengan API eksternal (Disdukcapil, BPJS) dan dapat diadaptasi oleh berbagai fasilitas kesehatan tingkat lanjut maupun pratama di seluruh Indonesia.'
            },
            {
                id: 7,
                title: '7. Kebermanfaatan Stakeholder',
                content: '- Masyarakat: Kemudahan akses layanan kesehatan dan administrasi tanpa hambatan jarak.\n- Pelaku Usaha: Sinergi dengan mitra transportasi dan logistik.\n- Akademisi/Media: Sumber data kesehatan publik yang valid dan transparan untuk riset serta literasi publik.'
            }
        ]
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(37, 99, 235);
        doc.text('Laporan Inovasi Sahabat Bunda', pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text('RSUD Bendan Kota Pekalongan', pageWidth / 2, 28, { align: 'center' });

        doc.setDrawColor(200);
        doc.line(20, 35, pageWidth - 20, 35);

        let yPos = 45;

        appContent.sections.forEach((section) => {
            // Check for page break
            if (yPos > 260) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(14);
            doc.setTextColor(30);
            doc.setFont('helvetica', 'bold');
            doc.text(section.title, 20, yPos);
            yPos += 8;

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60);

            const splitText = doc.splitTextToSize(section.content, pageWidth - 40);
            doc.text(splitText, 20, yPos);
            yPos += (splitText.length * 6) + 12;
        });

        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 20, 285);
        doc.text('Aplikasi Sahabat Bunda - RSUD Bendan', pageWidth - 20, 285, { align: 'right' });

        doc.save('Laporan_Inovasi_Sahabat_Bunda.pdf');
    };

    const generatePPT = () => {
        let pres = new pptxgen();

        // Master Slide / Theme
        pres.defineSlideMaster({
            title: 'MASTER_SLIDE',
            background: { color: 'FFFFFF' },
            objects: [
                { rect: { x: 0, y: 0, w: '100%', h: 0.8, fill: { color: '2563EB' } } },
                { text: { text: 'SAHABAT BUNDA', options: { x: 0.5, y: 0.2, color: 'FFFFFF', fontSize: 18, bold: true } } }
            ]
        });

        // Title Slide
        let slide0 = pres.addSlide();
        slide0.background = { color: '2563EB' };
        slide0.addText('INOVASI SAHABAT BUNDA', {
            x: 0, y: 3, w: '100%', align: 'center', fontSize: 44, color: 'FFFFFF', bold: true
        });
        slide0.addText('RSUD Bendan Kota Pekalongan', {
            x: 0, y: 4, w: '100%', align: 'center', fontSize: 24, color: 'E0F2FE'
        });

        // Content Slides
        appContent.sections.forEach((section) => {
            let slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });
            slide.addText(section.title.toUpperCase(), {
                x: 0.5, y: 1.2, w: 9, fontSize: 28, color: '1E293B', bold: true
            });

            slide.addText(section.content, {
                x: 0.5, y: 2.2, w: 9, h: 4, fontSize: 16, color: '475569', valign: 'top', lineSpacing: 24
            });
        });

        // Closing Slide
        let slideEnd = pres.addSlide();
        slideEnd.background = { color: '10B981' };
        slideEnd.addText('TERIMA KASIH', {
            x: 0, y: 3.5, w: '100%', align: 'center', fontSize: 48, color: 'FFFFFF', bold: true
        });

        pres.writeFile({ fileName: 'Presentasi_Sahabat_Bunda.pptx' });
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #f8fafc, #eff6ff)',
            borderRadius: '24px',
            padding: '32px',
            marginTop: '16px',
            marginBottom: '32px',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
        }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e293b', marginBottom: '8px', fontFamily: "'Outfit', sans-serif" }}>
                Materi Aplikasi Sahabat Bunda
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '24px', fontWeight: 500 }}>
                Unduh dokumen resmi dan materi presentasi mengenai inovasi kami.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                    onClick={generatePDF}
                    className="grid-card-interactive"
                    style={{
                        padding: '16px 28px',
                        background: 'white',
                        border: '2px solid #3b82f6',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)'
                    }}
                >
                    <div style={{ width: '40px', height: '40px', background: '#dbeafe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={20} color="#2563eb" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Unduh Format</div>
                        <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 800 }}>Laporan PDF</div>
                    </div>
                </button>

                <button
                    onClick={generatePPT}
                    className="grid-card-interactive"
                    style={{
                        padding: '16px 28px',
                        background: 'white',
                        border: '2px solid #10b981',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)'
                    }}
                >
                    <div style={{ width: '40px', height: '40px', background: '#d1fae5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Presentation size={20} color="#059669" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Unduh Format</div>
                        <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 800 }}>Presentasi PPTX</div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default DownloadSection;
