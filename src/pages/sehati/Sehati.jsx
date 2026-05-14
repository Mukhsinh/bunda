import React, { useState } from 'react';
import { ArrowLeft, Calculator, FileText, Download, User, Calendar, Activity, Info, ActivitySquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateNutritionIndices } from '../../lib/nutritionData';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Reusable Improved Speedometer
const Speedometer = ({ title, zScore, status }) => {
    const clampedValue = Math.max(-4, Math.min(4, parseFloat(zScore)));
    const angle = ((clampedValue + 4) / 8) * 180;
    const rotation = angle - 90;

    let statusColor = '#22c55e'; // Green
    if (clampedValue < -2 || clampedValue > 2) statusColor = '#f59e0b'; // Yellow
    if (clampedValue < -3 || clampedValue > 3) statusColor = '#ef4444'; // Red

    return (
        <div style={{ background: '#f8fafc', padding: '20px 16px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h5 style={{ fontSize: '0.8rem', fontWeight: 800, margin: '0 0 20px 0', color: '#1e293b', textAlign: 'center' }}>{title}</h5>

            {/* Speedometer Arc */}
            <div style={{ position: 'relative', width: '160px', height: '80px', borderTopLeftRadius: '80px', borderTopRightRadius: '80px', background: 'linear-gradient(90deg, #ef4444 0%, #ef4444 12.5%, #f59e0b 12.5%, #f59e0b 25%, #22c55e 25%, #22c55e 62.5%, #f59e0b 62.5%, #f59e0b 75%, #ef4444 75%, #ef4444 100%)', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.1)' }}>
                {/* Inner cutout */}
                <div style={{ position: 'absolute', top: '24px', left: '24px', right: '24px', bottom: 0, backgroundColor: '#f8fafc', borderTopLeftRadius: '60px', borderTopRightRadius: '60px', boxShadow: '0 -4px 10px rgba(0,0,0,0.05)' }}></div>

                {/* Needle Base */}
                <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#1e293b', zIndex: 10, border: '3px solid white' }}></div>

                {/* Needle */}
                <div style={{ position: 'absolute', bottom: '0px', left: '50%', width: '4px', height: '58px', marginLeft: '-2px', backgroundColor: '#1e293b', transformOrigin: 'bottom center', transform: `rotate(${rotation}deg)`, borderRadius: '4px', transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)', zIndex: 5 }}></div>

                {/* Scale Labels */}
                <span style={{ position: 'absolute', bottom: '-20px', left: '0px', fontSize: '0.65rem', fontWeight: 800, color: '#ef4444' }}>-4</span>
                <span style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', fontWeight: 800, color: '#22c55e' }}>0</span>
                <span style={{ position: 'absolute', bottom: '-20px', right: '0px', fontSize: '0.65rem', fontWeight: 800, color: '#ef4444' }}>+4</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '170px', marginTop: '24px', fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>
                <span>Kurang</span><span style={{ color: '#22c55e' }}>Normal</span><span>Lebih</span>
            </div>

            <div style={{ marginTop: '16px', textAlign: 'center', background: 'white', padding: '10px 16px', borderRadius: '12px', border: `1px solid ${statusColor}40`, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', width: '100%', maxWidth: '180px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: statusColor }}>{status}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Z-Score: {zScore}</div>
            </div>
        </div>
    );
};


export default function Sehati() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', dob: '', gender: 'male', weight: '', height: ''
    });
    const [result, setResult] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        const birthDate = new Date(formData.dob);
        const today = new Date();
        let ageMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + today.getMonth() - birthDate.getMonth();
        if (ageMonths < 0) ageMonths = 0;

        if (ageMonths > 60) {
            alert('Kalkulator ini dikhususkan untuk Balita usia 0-60 bulan (5 Tahun).');
            return;
        }

        const indices = calculateNutritionIndices(parseFloat(formData.weight), parseFloat(formData.height), ageMonths, formData.gender);

        setResult({
            ageMonths,
            ...indices
        });
    };

    const exportPDF = () => {
        const doc = new jsPDF();

        // Header Background
        doc.setFillColor(22, 163, 74); // Green Header
        doc.rect(0, 0, 210, 45, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont(undefined, 'bold');
        doc.text('Kartu Analisis Gizi SAKPORE', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text('RSUD Bendan Kota Pekalongan', 105, 30, { align: 'center' });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Informasi Balita', 14, 55);

        const infoBody = [
            ['Nama Lengkap', formData.name],
            ['Jenis Kelamin', formData.gender === 'male' ? 'Laki-laki' : 'Perempuan'],
            ['Tanggal Lahir', formData.dob],
            ['Usia', `${result.ageMonths} Bulan`],
            ['Berat / Tinggi', `${formData.weight} kg / ${formData.height} cm`],
        ];

        autoTable(doc, {
            startY: 60,
            body: infoBody,
            theme: 'plain',
            styles: { cellPadding: 2, fontSize: 10 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
        });

        // Title for the second table
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Hasil Analisis (Standar Kemenkes / WHO)', 14, doc.lastAutoTable.finalY + 8);

        // Table 2: Hasil Analisis
        const head = [['Indikator Kemenkes', 'Z-Score', 'Status Gizi', 'Grafik Z-Score (-4 s/d +4)']];
        const body = [
            ['BB/U (Berat/Umur)', result.bb_u.zScore, result.bb_u.status, ''],
            ['TB/U (Tinggi/Umur)', result.tb_u.zScore, result.tb_u.status, ''],
            ['BB/TB (Berat/Tinggi)', result.bb_tb.zScore, result.bb_tb.status, ''],
            ['IMT/U (BMI/Umur)', result.imt_u.zScore, result.imt_u.status, '']
        ];

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 12,
            head: head,
            body: body,
            theme: 'grid',
            headStyles: { fillColor: [22, 163, 74] }, // Emerald 600
            styles: { fontSize: 9, cellPadding: 5, valign: 'middle', minCellHeight: 20 },
            columnStyles: {
                0: { cellWidth: 45 },
                1: { cellWidth: 25, halign: 'center' },
                2: { cellWidth: 60 },
                3: { cellWidth: 50, halign: 'center' }
            },
            didDrawCell: function (data) {
                if (data.section === 'body' && data.column.index === 3) {
                    const z = parseFloat(body[data.row.index][1]);
                    const cell = data.cell;
                    const w = cell.width;
                    const h = cell.height;
                    const x = cell.x;
                    const y = cell.y;

                    // Speedometer calculations
                    const r = 8; // Safe compact radius
                    const x_center = x + w / 2;
                    const y_center = y + h / 2 + r / 2 - 1; // Snug vertical centering

                    // Draw the colored arc using small overlapping circles
                    for (let i = 0; i <= 24; i++) {
                        const t = i / 24;
                        const a = Math.PI * (1 - t);
                        const cx = x_center + r * Math.cos(a);
                        const cy = y_center - r * Math.sin(a);

                        let color = [34, 197, 94]; // Green
                        if (t < 0.125 || t > 0.875) color = [239, 68, 68]; // Red
                        else if (t < 0.25 || t > 0.75) color = [245, 158, 11]; // Yellow

                        doc.setFillColor(color[0], color[1], color[2]);
                        doc.circle(cx, cy, 1.2, 'F');
                    }

                    // Draw inner cutout (white) to make it look like an arc
                    doc.setFillColor(255, 255, 255);
                    doc.circle(x_center, y_center, r - 2, 'F');

                    // Calculate Needle Angle
                    const clampedZ = Math.max(-4, Math.min(4, z));
                    const p = (clampedZ + 4) / 8;
                    const needleAngle = Math.PI * (1 - p);
                    const nx = x_center + (r - 0.5) * Math.cos(needleAngle);
                    const ny = y_center - (r - 0.5) * Math.sin(needleAngle);

                    // Draw Needle Line
                    doc.setDrawColor(30, 41, 59); // Slate 800
                    doc.setLineWidth(1.0);
                    doc.line(x_center, y_center, nx, ny);

                    // Draw Needle Base Center
                    doc.setFillColor(30, 41, 59);
                    doc.circle(x_center, y_center, 1.8, 'F');
                }
            }
        });

        // Draw footer text dynamically below the table
        const finalY = doc.lastAutoTable.finalY + 8;
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('*Grafik: Titik hijau menunjukkan nilai normal. Kuning berisiko. Merah bahaya.', 14, finalY);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Keterangan Analisis & Penjelasan Gizi:', 14, finalY + 12);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('1. BB/U menunjukkan risiko berat badan kurang atau lebih secara umum.', 14, finalY + 18);
        doc.text('2. TB/U digunakan untuk mendeteksi stunting (pertumbuhan terhambat kronis).', 14, finalY + 24);
        doc.text('3. BB/TB adalah indikator untuk mengukur kondisi kurus (wasting) atau gemuk akut.', 14, finalY + 30);
        doc.text(`4. IMT/U (BMI) mengukur status gizi umum secara spesifik.`, 14, finalY + 36);

        // Advice logic based on worst status
        const isBad = parseFloat(result.imt_u.zScore) < -2 || parseFloat(result.imt_u.zScore) > 2;

        if (isBad) {
            doc.setFillColor(254, 226, 226);
            doc.rect(20, doc.lastAutoTable.finalY + 50, 170, 15, 'F');
            doc.setTextColor(159, 18, 57);
            doc.text('Rekomendasi: Terdapat indikator di luar batas normal. Harap hubungi poli anak.', 25, doc.lastAutoTable.finalY + 59);
        } else {
            doc.setFillColor(220, 252, 231);
            doc.rect(20, doc.lastAutoTable.finalY + 50, 170, 15, 'F');
            doc.setTextColor(22, 101, 52);
            doc.text('Rekomendasi: Semua indikator normal. Lanjutkan pola makan dan asuh balita.', 25, doc.lastAutoTable.finalY + 59);
        }

        doc.save(`Laporan_4Indeks_Gizi_${formData.name}.pdf`);
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
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Menu SEHATI</h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Laporan Gizi 4-Indeks Kemenkes</p>
                </div>
            </div>

            <div className="card" style={{ padding: '24px', borderRadius: '24px' }}>
                <form onSubmit={handleCalculate}>
                    <div className="input-group">
                        <label><User size={14} style={{ marginRight: '6px' }} /> Nama Balita</label>
                        <input
                            type="text" name="name" className="input" placeholder="Masukkan nama"
                            value={formData.name} onChange={handleInputChange} required
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="input-group">
                            <label><Calendar size={14} style={{ marginRight: '6px' }} /> Tgl Lahir</label>
                            <input type="date" name="dob" className="input" value={formData.dob} onChange={handleInputChange} required />
                        </div>
                        <div className="input-group">
                            <label>Jenis Kelamin</label>
                            <select name="gender" className="select" value={formData.gender} onChange={handleInputChange}>
                                <option value="male">Laki-laki</option>
                                <option value="female">Perempuan</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="input-group" style={{ marginBottom: '8px' }}>
                            <label><Activity size={14} style={{ marginRight: '6px' }} /> Berat (kg)</label>
                            <input type="number" step="0.1" name="weight" className="input" placeholder="Misal: 8.5" value={formData.weight} onChange={handleInputChange} required />
                        </div>
                        <div className="input-group" style={{ marginBottom: '8px' }}>
                            <label><Activity size={14} style={{ marginRight: '6px' }} /> Tinggi (cm)</label>
                            <input type="number" step="0.1" name="height" className="input" placeholder="Misal: 75" value={formData.height} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>
                        <Calculator size={18} /> Hitung 4 Indeks Kemenkes
                    </button>
                </form>
            </div>

            {result && (
                <div className="animate-slide-up" style={{ marginTop: '24px' }}>
                    <div style={{ background: 'white', borderRadius: '24px', padding: '24px', border: '2.5px solid var(--primary)', position: 'relative', boxShadow: 'var(--shadow-lg)' }}>
                        <div style={{ position: 'absolute', top: '-14px', left: '24px', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <ActivitySquare size={14} /> LAPORAN ANALISIS GIZI
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginTop: '16px', marginBottom: '24px' }}>
                            <Speedometer title="BB/U (Berat/Umur)" zScore={result.bb_u.zScore} status={result.bb_u.status} />
                            <Speedometer title="TB/U (Tinggi/Umur)" zScore={result.tb_u.zScore} status={result.tb_u.status} />
                            <Speedometer title="BB/TB (Berat/Tinggi)" zScore={result.bb_tb.zScore} status={result.bb_tb.status} />
                            <div style={{ position: 'relative' }}>
                                <Speedometer title={`IMT/U (BMI: ${result.imt_u.imt})`} zScore={result.imt_u.zScore} status={result.imt_u.status} />
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <Info size={16} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', margin: '0 0 4px 0' }}>Keterangan Kemenkes</h4>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                                        Diatas menunjukkan 4 pilar pertumbuhan balita. Warna hijau di gauge menandakan status yang aman dan normal sesuai standar grafik Gizi WHO.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button onClick={exportPDF} className="btn" style={{ border: 'none', color: 'white', background: '#10b981', width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
                            <FileText size={18} /> Cetak Laporan PDF 4-Indeks (Warna Emerald)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
