import React, { useState, useEffect } from 'react';
import { ArrowLeft, Syringe, Calendar, CheckCircle2, FileText, Info, AlertCircle, Download, User, Briefcase, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { vaccineData } from '../../lib/vaccineData';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Vaksinasi() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [categorizedSchedule, setCategorizedSchedule] = useState(null);

    useEffect(() => {
        if (dob) {
            calculateSchedule(dob);
        } else {
            setCategorizedSchedule(null);
        }
    }, [dob]);

    const calculateSchedule = (birthDateString) => {
        const birthDate = new Date(birthDateString);
        const today = new Date();

        const processed = { dasar: [], lanjutan: [], bias: [] };

        vaccineData.forEach(v => {
            const dueDate = new Date(birthDate);
            const category = v.category || 'dasar';

            if (category === 'bias') {
                // BIAS uses class level, roughly starting at age 7
                // Age in data is school year/age
                dueDate.setFullYear(dueDate.getFullYear() + v.age);
            } else if (v.unit === 'bulan') {
                dueDate.setMonth(dueDate.getMonth() + v.age);
            } else if (v.unit === 'tahun') {
                dueDate.setFullYear(dueDate.getFullYear() + v.age);
            }

            const isPast = dueDate < today;
            const daysDiff = (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
            const isUpcoming = !isPast && daysDiff <= 14;

            processed[category].push({
                ...v,
                dueDate,
                dueDateStr: dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                statusLabel: isPast ? 'Selesai' : (isUpcoming ? 'Segera' : 'Menunggu'),
                status: isPast ? 'past' : (isUpcoming ? 'upcoming' : 'future')
            });
        });

        setCategorizedSchedule(processed);
    };

    const exportPDF = () => {
        if (!name || !dob) {
            alert('Harap masukkan Nama Anak dan Tanggal Lahir terlebih dahulu!');
            return;
        }

        const doc = new jsPDF();
        doc.setFillColor(14, 165, 233);
        doc.rect(0, 0, 210, 45, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont(undefined, 'bold');
        doc.text('KARTU JADWAL IMUNISASI', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text('Permenkes RI No. 12 Tahun 2017 - RSUD Bendan', 105, 30, { align: 'center' });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.text(`Nama Anak: ${name.toUpperCase()}`, 14, 55);
        doc.text(`Tgl Lahir: ${new Date(dob).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 62);

        let startY = 70;

        Object.keys(categorizedSchedule).forEach(cat => {
            doc.setFont(undefined, 'bold');
            doc.text(cat.toUpperCase(), 14, startY);

            const rows = categorizedSchedule[cat].map(item => [
                item.name,
                item.dueDateStr,
                item.statusLabel,
                item.fungsi
            ]);

            autoTable(doc, {
                startY: startY + 2,
                head: [['Vaksin', 'Jadwal', 'Status', 'Fungsi']],
                body: rows,
                headStyles: { fillColor: [14, 165, 233] },
                styles: { fontSize: 8 },
                columnStyles: { 3: { cellWidth: 70 } }
            });
            startY = doc.lastAutoTable.finalY + 10;
        });

        doc.save(`Jadwal_Imunisasi_${name}.pdf`);
    };

    const CategorySection = ({ title, items, color, icon: Icon }) => (
        <div style={{ marginBottom: '32px' }}>
            <h3 style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: '#1e293b',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <div style={{ padding: '6px', background: `${color}15`, color: color, borderRadius: '8px' }}>
                    <Icon size={18} />
                </div>
                {title}
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
                {items.map((item, idx) => (
                    <div key={idx} style={{
                        background: 'white', borderRadius: '20px', padding: '16px',
                        border: item.status === 'upcoming' ? `2px solid ${color}` : '1px solid #f1f5f9',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{item.name}</h4>
                            <span style={{
                                fontSize: '0.65rem',
                                background: item.status === 'past' ? '#f1f5f9' : (item.status === 'upcoming' ? color : '#f0fdf4'),
                                color: item.status === 'past' ? '#64748b' : (item.status === 'upcoming' ? 'white' : '#16a34a'),
                                padding: '3px 10px', borderRadius: '6px', fontWeight: 800
                            }}>
                                {item.statusLabel.toUpperCase()}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {item.dueDateStr}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Syringe size={12} /> {item.cara}</span>
                        </div>
                        <div style={{ marginTop: '12px', padding: '10px', background: '#f8fafc', borderRadius: '12px', fontSize: '0.7rem', color: '#475569', borderLeft: `3px solid ${color}` }}>
                            <strong>Fungsi:</strong> {item.fungsi}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="animate-slide-up page-content" style={{ paddingTop: 0 }}>
            <div style={{
                background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                margin: '0 -20px 24px -20px',
                padding: '30px 20px 50px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '0 0 40px 40px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 10 }}>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-icon"
                        style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'white', fontWeight: 800 }}>VAKSIN</h2>
                        <h3 style={{ fontSize: '1rem', margin: '4px 0', color: 'white', fontWeight: 700 }}>Validasi Waktu Suntik Imunisasi Ananda</h3>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>Lengkapi perlindungan sehat untuk masa depan cerah 🛡️</p>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '24px', borderRadius: '24px', marginBottom: '24px', background: 'white' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label>Nama Anak</label>
                        <input type="text" className="input" placeholder="Nama lengkap" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label>Tgl Lahir</label>
                        <input type="date" className="input" value={dob} onChange={(e) => setDob(e.target.value)} />
                    </div>
                </div>
            </div>

            {categorizedSchedule && (
                <div className="animate-slide-up">
                    <button onClick={exportPDF} className="btn" style={{ background: '#0ea5e9', color: 'white', width: '100%', borderRadius: '16px', marginBottom: '24px', gap: '8px', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Download size={18} /> Unduh Kartu Jadwal Resmi
                    </button>

                    <CategorySection title="Imunisasi Dasar (0-11 Bulan)" items={categorizedSchedule.dasar} color="#0ea5e9" icon={Syringe} />
                    <CategorySection title="Imunisasi Lanjutan (18-24 Bulan)" items={categorizedSchedule.lanjutan} color="#f59e0b" icon={Plus} />
                    <CategorySection title="Imunisasi Anak Sekolah (BIAS)" items={categorizedSchedule.bias} color="#84cc16" icon={Briefcase} />

                    <div style={{ background: '#fef2f2', padding: '20px', borderRadius: '24px', border: '1px solid #fecade' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#991b1b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={18} /> Edukasi Kemenkes (Permenkes 12/2017)
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: '#7f1d1d', lineHeight: 1.5, margin: 0 }}>
                            Imunisasi bertujuan memberikan kekebalan spesifik terhadap penyakit berbahaya seperti Polio, TB, Campak, dan Hepatitis. Pastikan anak mendapatkan "Imunisasi Rutin Lengkap" hingga usia sekolah.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
