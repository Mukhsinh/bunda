import React, { useState, useEffect } from 'react';
import { ArrowLeft, Syringe, Calendar, CheckCircle2, FileText, Info, AlertCircle, Download, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { vaccineData } from '../../lib/vaccineData';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Vaksinasi() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        if (dob) {
            calculateSchedule(dob);
        } else {
            setSchedule([]);
        }
    }, [dob]);

    const calculateSchedule = (birthDateString) => {
        const birthDate = new Date(birthDateString);
        const computedSchedule = vaccineData.map(v => {
            const dueDate = new Date(birthDate);
            if (v.unit === 'bulan') dueDate.setMonth(dueDate.getMonth() + v.age);

            const today = new Date();
            const isPast = dueDate < today;
            const isUpcoming = !isPast && (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24) <= 7;

            return {
                ...v,
                dueDateStr: dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                statusLabel: isPast ? 'Selesai' : (isUpcoming ? 'Segera' : 'Menunggu'),
                status: isPast ? 'past' : (isUpcoming ? 'upcoming' : 'future')
            };
        });
        setSchedule(computedSchedule);
    };

    const exportPDF = () => {
        if (!name || !dob) {
            alert('Harap masukkan Nama Anak dan Tanggal Lahir terlebih dahulu untuk mencetak Laporan Jadwal!');
            return;
        }

        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        // Stylish Certificate Header
        doc.setFillColor(14, 165, 233);
        doc.rect(0, 0, 210, 50, 'F');
        doc.setFillColor(3, 105, 161);
        doc.rect(0, 50, 210, 5, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont(undefined, 'bold');
        doc.text('KARTU JADWAL IMUNISASI', 105, 25, { align: 'center' });

        doc.setFontSize(14);
        doc.setFont(undefined, 'normal');
        doc.text('RSUD Bendan Kota Pekalongan', 105, 36, { align: 'center' });

        // Elegant Info Box
        doc.setDrawColor(226, 232, 240);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(20, 65, 170, 25, 4, 4, 'FD');

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`NAMA ANAK  : ${name.toUpperCase()}`, 25, 75);

        const dobDate = new Date(dob);
        const dobStr = dobDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        doc.setFont(undefined, 'normal');
        doc.text(`TANGGAL LAHIR: ${dobStr}`, 25, 83);
        doc.text(`TANGGAL CETAK: ${new Date().toLocaleDateString('id-ID')}`, 130, 75);

        // Subtitle
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Rincian Timeline Pemberian Vaksin Kemenkes / IDAI', 20, 105);

        const tableColumn = ["Status", "Vaksin", "Usia", "Tgl Jadwal", "Keterangan Medis"];
        const tableRows = [];

        schedule.forEach(item => {
            tableRows.push([
                item.statusLabel,
                item.name,
                `${item.age} ${item.unit}`,
                item.dueDateStr,
                item.description
            ]);
        });

        autoTable(doc, {
            startY: 110,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: {
                fillColor: [14, 165, 233], textColor: 255,
                halign: 'center', fontStyle: 'bold'
            },
            styles: {
                fontSize: 10, cellPadding: 6, valign: 'middle'
            },
            columnStyles: {
                0: { halign: 'center', fontStyle: 'bold' },
                1: { fontStyle: 'bold' },
                2: { halign: 'center' },
                3: {},
                4: { cellWidth: 'auto' }
            },
            didParseCell: function (data) {
                if (data.section === 'body' && data.column.index === 0) {
                    const status = data.cell.raw;
                    if (status === 'Selesai') data.cell.styles.textColor = [22, 163, 74];
                    else if (status === 'Segera') data.cell.styles.textColor = [217, 119, 6];
                    else data.cell.styles.textColor = [100, 116, 139];
                }
            }
        });

        // Bottom Banner Warning
        doc.setFillColor(254, 243, 199); // Amber 100
        doc.setTextColor(180, 83, 9); // Amber 700
        doc.rect(20, doc.lastAutoTable.finalY + 15, 170, 20, 'F');
        doc.setFont(undefined, 'bold');
        doc.setFontSize(11);
        doc.text('CATATAN PENTING:', 25, doc.lastAutoTable.finalY + 22);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.text('Bawa Buku KIA setiap kali berkunjung. Jadwal di atas merupakan panduan rutinitas standar.', 25, doc.lastAutoTable.finalY + 28);
        doc.text('Konsultasikan lebih lanjut dengan dokter spesialis anak di RSUD Bendan.', 25, doc.lastAutoTable.finalY + 33);

        doc.save(`Jadwal_Vaksinasi_${name}.pdf`);
    };

    return (
        <div className="animate-slide-up page-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: 'white', border: '1px solid #e2e8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    <ArrowLeft size={20} color="#64748b" />
                </button>
                <div>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Menu VAKSINASI</h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Jadwal Imunisasi Rutin Lengkap</p>
                </div>
            </div>

            <div className="card" style={{ padding: '24px', borderRadius: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={14} color="var(--primary)" />
                            Nama Anak
                        </label>
                        <input
                            type="text" className="input" placeholder="Masukkan Nama Lengkap"
                            value={name} onChange={(e) => setName(e.target.value)}
                            style={{ marginTop: '8px' }}
                        />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} color="var(--primary)" />
                            Tanggal Lahir
                        </label>
                        <input
                            type="date" className="input" value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            style={{ marginTop: '8px' }}
                        />
                    </div>
                </div>

                {(!dob || !name) && (
                    <div style={{
                        marginTop: '16px', padding: '12px', background: '#f0f9ff',
                        borderRadius: '12px', display: 'flex', gap: '8px', alignItems: 'center'
                    }}>
                        <Info size={16} color="#0ea5e9" />
                        <p style={{ fontSize: '0.75rem', color: '#0369a1', margin: 0 }}>
                            Lengkapi nama dan tanggal lahir untuk melihat jadwal bayi Anda dan mengaktifkan cetak PDF.
                        </p>
                    </div>
                )}
            </div>

            {/* Always rendered button but triggers alert if inputs missing */}
            <button
                onClick={exportPDF}
                className="btn btn-primary"
                style={{
                    width: '100%', marginBottom: '24px',
                    background: (name && dob) ? 'linear-gradient(135deg, #0ea5e9, #2563eb)' : '#cbd5e1',
                    color: (name && dob) ? 'white' : '#64748b',
                    border: 'none', boxShadow: (name && dob) ? '0 4px 12px rgba(14, 165, 233, 0.3)' : 'none',
                    cursor: (name && dob) ? 'pointer' : 'not-allowed'
                }}
            >
                <Download size={18} /> Cetak Jadwal Vaksin Berwarna (PDF)
            </button>

            {schedule.length > 0 && (
                <div className="animate-slide-up">
                    <h3 style={{ fontSize: '1rem', marginBottom: '16px', fontWeight: 700 }}>Timeline Pemberian Vaksin</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {schedule.map((item, idx) => (
                            <div key={idx} style={{
                                background: 'white', borderRadius: '20px', padding: '16px',
                                border: item.status === 'upcoming' ? '2px solid #f59e0b' : '1px solid #f1f5f9',
                                boxShadow: item.status === 'upcoming' ? '0 4px 12px rgba(245, 158, 11, 0.15)' : 'var(--shadow-sm)',
                                display: 'flex', gap: '16px', position: 'relative'
                            }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '12px',
                                    background: item.status === 'past' ? '#f1f5f9' : (item.status === 'upcoming' ? '#fef3c7' : '#f0fdf4'),
                                    color: item.status === 'past' ? '#94a3b8' : (item.status === 'upcoming' ? '#f59e0b' : '#16a34a'),
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>
                                    {item.status === 'past' ? <CheckCircle2 size={24} /> : <Syringe size={24} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: item.status === 'past' ? '#64748b' : '#1e293b' }}>
                                            {item.name}
                                        </h4>
                                        {item.status === 'upcoming' && <span style={{ fontSize: '0.65rem', background: '#f59e0b', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>SEGERA</span>}
                                        {item.status === 'past' && <span style={{ fontSize: '0.65rem', background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>SELESAI</span>}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={12} /> {item.dueDateStr} ({item.age} {item.unit})
                                    </div>
                                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '8px', lineHeight: 1.4, margin: '8px 0 0 0' }}>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '32px', padding: '20px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                        <h4 style={{ fontSize: '0.85rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={16} /> Catatan Penting
                        </h4>
                        <ul style={{ fontSize: '0.75rem', color: '#64748b', paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <li>Jadwal di atas adalah standar dasar Kemenkes/IDAI. Konsultasikan lebih lanjut dengan dokter spesialis anak.</li>
                            <li>Bawa Buku KIA setiap kali berkunjung ke RSUD Bendan.</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
