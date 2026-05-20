import React, { useState } from 'react';
import { ArrowLeft, Calculator, FileText, Download, User, Calendar, Activity, Info, ActivitySquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateNutritionIndices } from '../../lib/nutritionData';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Reusable Improved Speedometer (WHO/Permenkes Z-score Gauge)
const Speedometer = ({ title, zScore, status }) => {
    const clampedValue = Math.max(-4, Math.min(4, parseFloat(zScore)));
    // Map -4..+4 to 0..180 degrees
    const angle = ((clampedValue + 4) / 8) * 180;
    const rotation = angle - 90;

    // Color by clinical severity per Permenkes thresholds
    let statusColor = '#22c55e'; // Green = Normal
    const absZ = Math.abs(clampedValue);
    if (absZ > 3) statusColor = '#dc2626';      // Red = Severe
    else if (absZ > 2) statusColor = '#ea580c';  // Orange = Moderate
    else if (clampedValue > 1) statusColor = '#f59e0b'; // Yellow = Risk

    // Arc gradient: matches WHO thresholds
    const arcGradient = 'linear-gradient(90deg, #dc2626 0%, #dc2626 12.5%, #ea580c 12.5%, #ea580c 25%, #22c55e 25%, #22c55e 62.5%, #f59e0b 62.5%, #f59e0b 75%, #ea580c 75%, #ea580c 87.5%, #dc2626 87.5%, #dc2626 100%)';

    return (
        <div style={{ background: '#f8fafc', padding: '20px 16px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h5 style={{ fontSize: '0.8rem', fontWeight: 800, margin: '0 0 20px 0', color: '#1e293b', textAlign: 'center' }}>{title}</h5>

            {/* Speedometer Arc */}
            <div style={{ position: 'relative', width: '160px', height: '80px', borderTopLeftRadius: '80px', borderTopRightRadius: '80px', background: arcGradient, boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.1)' }}>
                {/* Inner cutout */}
                <div style={{ position: 'absolute', top: '24px', left: '24px', right: '24px', bottom: 0, backgroundColor: '#f8fafc', borderTopLeftRadius: '60px', borderTopRightRadius: '60px', boxShadow: '0 -4px 10px rgba(0,0,0,0.05)' }}></div>

                {/* Needle Base */}
                <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#1e293b', zIndex: 10, border: '3px solid white' }}></div>

                {/* Needle */}
                <div style={{ position: 'absolute', bottom: '0px', left: '50%', width: '4px', height: '58px', marginLeft: '-2px', backgroundColor: '#1e293b', transformOrigin: 'bottom center', transform: `rotate(${rotation}deg)`, borderRadius: '4px', transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)', zIndex: 5 }}></div>

                {/* Scale Labels */}
                <span style={{ position: 'absolute', bottom: '-20px', left: '0px', fontSize: '0.65rem', fontWeight: 800, color: '#dc2626' }}>-4</span>
                <span style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', fontWeight: 800, color: '#22c55e' }}>0</span>
                <span style={{ position: 'absolute', bottom: '-20px', right: '0px', fontSize: '0.65rem', fontWeight: 800, color: '#dc2626' }}>+4</span>
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
        name: '', dob: '', gender: 'male', weight: '', height: '', isLyingDown: true
    });
    const [result, setResult] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        const birthDate = new Date(formData.dob);
        const today = new Date();
        let ageMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + today.getMonth() - birthDate.getMonth();
        if (ageMonths < 0) ageMonths = 0;

        if (ageMonths > 216) {
            alert('Kalkulator ini dikhususkan untuk anak usia 0-18 tahun.');
            return;
        }

        const indices = calculateNutritionIndices(
            parseFloat(formData.weight),
            parseFloat(formData.height),
            ageMonths,
            formData.gender,
            formData.isLyingDown
        );

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
        doc.text('Kartu Analisis Gizi Anak', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text('Berdasarkan Permenkes RI No. 2 Tahun 2020', 105, 30, { align: 'center' });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Informasi Pasien', 14, 55);

        const infoBody = [
            ['Nama Lengkap', formData.name],
            ['Jenis Kelamin', formData.gender === 'male' ? 'Laki-laki' : 'Perempuan'],
            ['Tanggal Lahir', formData.dob],
            ['Usia', `${result.ageMonths} Bulan (${(result.ageMonths / 12).toFixed(1)} Tahun)`],
            ['Berat / Tinggi', `${formData.weight} kg / ${formData.height} cm`],
            ['Posisi Ukur', formData.isLyingDown ? 'Telentang (PB)' : 'Berdiri (TB)'],
        ];

        autoTable(doc, {
            startY: 60,
            body: infoBody,
            theme: 'plain',
            styles: { cellPadding: 2, fontSize: 10 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
        });

        // Title for results
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Hasil Analisis Klinis', 14, doc.lastAutoTable.finalY + 8);

        const head = [['Indikator', 'Z-Score', 'Status Gizi', 'Interpretasi Klinis']];
        const body = [];

        if (result.bb_u) body.push(['BB/U (Berat/Umur)', result.bb_u.zScore, result.bb_u.status, 'Menilai berat badan secara umum']);
        if (result.tb_u) body.push(['TB/U (Tinggi/Umur)', result.tb_u.zScore, result.tb_u.status, 'Mendeteksi risiko Stunting']);
        if (result.bb_tb) body.push(['BB/TB (Berat/Tinggi)', result.bb_tb.zScore, result.bb_tb.status, 'Mendeteksi Gizi Buruk/Kurus']);
        if (result.imt_u) body.push(['IMT/U (BMI/Umur)', result.imt_u.zScore, result.imt_u.status, 'Indeks Massa Tubuh (%)']);

        // Visual Graph SECTION: Speedometer Style
        let currentY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text('Visualisasi Status Gizi (WHO Speedometer Gauge):', 14, currentY);
        currentY += 22;

        const drawHorizontalGauge = (x, y, label, zScore) => {
            const width = 36;
            const height = 5;
            const centerY = y + 5;

            // Label Positioned Above
            doc.setFontSize(8);
            doc.setTextColor(30, 41, 59);
            doc.setFont(undefined, 'bold');
            doc.text(label, x + width / 2, centerY - 6, { align: 'center' });

            // Draw 5 segments
            const drawSeg = (startZ, endZ, color) => {
                doc.setFillColor(color[0], color[1], color[2]);
                const sx = x + ((startZ + 4) / 8) * width;
                const sw = ((endZ - startZ) / 8) * width;
                doc.rect(sx, centerY, sw, height, 'F');
            };

            drawSeg(-4, -3, [220, 38, 38]);
            drawSeg(-3, -2, [234, 88, 12]);
            drawSeg(-2, 2, [34, 197, 94]);
            drawSeg(2, 3, [234, 88, 12]);
            drawSeg(3, 4, [220, 38, 38]);

            // Needle
            const clamped = Math.max(-4, Math.min(4, parseFloat(zScore)));
            const needleX = x + ((clamped + 4) / 8) * width;
            doc.setFillColor(30, 41, 59);
            doc.circle(needleX, centerY + height / 2, 2, 'F');
            doc.setDrawColor(255, 255, 255);
            doc.setLineWidth(0.5);
            doc.circle(needleX, centerY + height / 2, 2, 'S');

            // Scale Markers
            doc.setFontSize(6);
            doc.setTextColor(148, 163, 184);
            doc.setFont(undefined, 'normal');
            doc.text('-4', x, centerY + height + 5, { align: 'center' });
            doc.text('0', x + width / 2, centerY + height + 5, { align: 'center' });
            doc.text('+4', x + width, centerY + height + 5, { align: 'center' });

            // Result Text
            doc.setFontSize(7);
            doc.setTextColor(30, 41, 59);
            doc.setFont(undefined, 'bold');
            doc.text(`${zScore}`, needleX, centerY + height + 10, { align: 'center' });
        };

        if (result.bb_u) drawHorizontalGauge(14, currentY, 'BB/U', result.bb_u.zScore);
        if (result.tb_u) drawHorizontalGauge(64, currentY, 'TB/U', result.tb_u.zScore);
        if (result.bb_tb) drawHorizontalGauge(114, currentY, 'BB/TB', result.bb_tb.zScore);
        if (result.imt_u) drawHorizontalGauge(164, currentY, 'IMT/U', result.imt_u.zScore);

        autoTable(doc, {
            startY: currentY + 30,
            head: head,
            body: body,
            theme: 'grid',
            headStyles: { fillColor: [22, 163, 74] },
            styles: { fontSize: 9, cellPadding: 5 }
        });

        doc.save(`Laporan_Gizi_${formData.name}.pdf`);
    };

    return (
        <div className="animate-slide-up page-content" style={{ paddingTop: 0 }}>
            {/* New Stylish Header */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                margin: '0 -20px 24px -20px',
                padding: '30px 20px 50px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '0 0 40px 40px',
                boxShadow: '0 10px 20px rgba(14, 165, 233, 0.15)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 10 }}>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-icon"
                        style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'white', fontWeight: 800 }}>SEHATI</h2>
                        <h3 style={{ fontSize: '1rem', margin: '4px 0', color: 'white', fontWeight: 700 }}>Skrining gizi Buah Hati</h3>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>Pantau tumbuh kembang ceria ananda tercinta 🌈</p>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '24px', borderRadius: '24px' }}>
                <form onSubmit={handleCalculate}>
                    <div className="input-group">
                        <label><User size={14} style={{ marginRight: '6px' }} /> Nama Anak</label>
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
                        <div className="input-group">
                            <label><Activity size={14} style={{ marginRight: '6px' }} /> Berat (kg)</label>
                            <input type="number" step="0.1" name="weight" className="input" placeholder="0.0" value={formData.weight} onChange={handleInputChange} required />
                        </div>
                        <div className="input-group">
                            <label><Activity size={14} style={{ marginRight: '6px' }} /> Tinggi (cm)</label>
                            <input type="number" step="0.1" name="height" className="input" placeholder="0.0" value={formData.height} onChange={handleInputChange} required />
                        </div>
                    </div>

                    {/* Measurement Position Switch */}
                    <div style={{
                        background: '#f1f5f9',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        marginTop: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', display: 'block' }}>Posisi Pengukuran</span>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                {formData.isLyingDown ? 'Telentang (Panjang Badan)' : 'Berdiri (Tinggi Badan)'}
                            </span>
                        </div>
                        <div style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                            <input
                                type="checkbox"
                                name="isLyingDown"
                                checked={formData.isLyingDown}
                                onChange={handleInputChange}
                                style={{ opacity: 0, width: 0, height: 0 }}
                                id="lying-switch"
                            />
                            <label htmlFor="lying-switch" style={{
                                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                background: formData.isLyingDown ? 'var(--primary)' : '#cbd5e1',
                                transition: '.4s', borderRadius: '24px'
                            }}>
                                <span style={{
                                    position: 'absolute', height: '18px', width: '18px', left: formData.isLyingDown ? '28px' : '4px',
                                    bottom: '3px', background: 'white', transition: '.4s', borderRadius: '50%'
                                }}></span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '20px', width: '100%', gap: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calculator size={18} /> Analisis Gizi (Permenkes RI)
                    </button>
                </form>
            </div>

            {result && (
                <div className="animate-slide-up" style={{ marginTop: '24px' }}>
                    <div style={{ background: 'white', borderRadius: '24px', padding: '24px', border: '2px solid var(--primary)', position: 'relative' }}>
                        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>HASIL ANALISIS GIZI</h3>
                            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Usia: {result.ageMonths} Bulan ({(result.ageMonths / 12).toFixed(1)} Tahun)</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                            {result.bb_u && <Speedometer title="BB/U (Berat/Umur)" zScore={result.bb_u.zScore} status={result.bb_u.status} />}
                            {result.tb_u && <Speedometer title="TB/U (Tinggi/Umur)" zScore={result.tb_u.zScore} status={result.tb_u.status} />}
                            {result.bb_tb && <Speedometer title="BB/TB (Berat/Tinggi)" zScore={result.bb_tb.zScore} status={result.bb_tb.status} />}
                            {result.imt_u && <Speedometer title={`IMT/U (BMI: ${result.imt_u.imt})`} zScore={result.imt_u.zScore} status={result.imt_u.status} />}
                        </div>

                        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px', marginBottom: '20px' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', marginBottom: '12px' }}>Edukasi Klinis (Sesuai Permenkes RI)</h4>
                            <div style={{ display: 'grid', gap: '16px' }}>
                                <div style={{ background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <h5 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0369a1', margin: '0 0 6px 0' }}>📏 TB/U: Status Pertumbuhan Linier</h5>
                                    <p style={{ fontSize: '0.7rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                                        Digunakan untuk mendeteksi <strong>Stunting</strong>. Kondisi <em>Sangat Pendek</em> atau <em>Pendek</em> menunjukkan kekurangan gizi kronis atau infeksi berulang dalam jangka waktu lama.
                                    </p>
                                </div>
                                <div style={{ background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <h5 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b91c1c', margin: '0 0 6px 0' }}>⚖️ BB/TB: Kondisi Gizi Akut</h5>
                                    <p style={{ fontSize: '0.7rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                                        Indikator paling baik untuk mendeteksi <strong>Gizi Buruk/Kurus</strong> (Wasting) yang sedang berlangsung dan memerlukan tindakan medis segera.
                                    </p>
                                </div>
                                <div style={{ background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <h5 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ea580c', margin: '0 0 6px 0' }}>📋 IMT/U: Risiko Overweight/Obesitas</h5>
                                    <p style={{ fontSize: '0.7rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                                        Mendeteksi tren kegemukan sejak dini. Sangat penting dipantau pada anak yang sudah mulai MPASI atau usia sekolah.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button onClick={exportPDF} className="btn" style={{ background: '#10b981', color: 'white', width: '100%', borderRadius: '16px', gap: '8px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Download size={18} /> Unduh Laporan Resmi (PDF)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
