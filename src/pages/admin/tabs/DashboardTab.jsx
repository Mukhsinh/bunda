import React, { useMemo } from 'react';
import {
    Activity, FileText, Truck, Monitor, CheckCircle, Clock,
    AlertCircle, Users, ArrowUpRight, TrendingUp, Calendar,
    ShieldCheck, Sparkles, ChevronRight, Award, Compass, Heart
} from 'lucide-react';
import { Line } from 'react-chartjs-2';

export default function DashboardTab({
    ramahDocs = [],
    santunReqs = [],
    sinergiCons = [],
    onNavigateTab,
    userProfile
}) {
    // Aggregated Metrics
    const totalRamah = ramahDocs.length;
    const ramahDone = ramahDocs.filter(d => d.status === 'completed').length;
    const ramahPending = ramahDocs.filter(d => d.status === 'pending').length;
    const ramahProcess = ramahDocs.filter(d => d.status === 'verified' || d.status === 'delivering' || d.status === 'processing').length;

    const totalSantun = santunReqs.length;
    const santunDone = santunReqs.filter(r => r.status === 'completed').length;
    const santunPending = santunReqs.filter(r => r.status === 'requested').length;
    const santunProcess = santunReqs.filter(r => r.status === 'assigned' || r.status === 'in_progress').length;

    const totalSinergi = sinergiCons.length;
    const sinergiDone = sinergiCons.filter(c => c.status === 'Completed').length;
    const sinergiPending = sinergiCons.filter(c => c.status === 'Pending').length;
    const sinergiScheduled = sinergiCons.filter(c => c.status === 'Scheduled').length;

    const grandTotal = totalRamah + totalSantun + totalSinergi;
    const grandCompleted = ramahDone + santunDone + sinergiDone;
    const grandPending = ramahPending + santunPending + sinergiPending;
    const grandProcess = ramahProcess + santunProcess + sinergiScheduled;
    const completionRate = grandTotal > 0 ? ((grandCompleted / grandTotal) * 100).toFixed(1) : '100';

    // 6 Month Trend Data Calculation
    const trendData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const currentMonthIdx = new Date().getMonth();
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const m = (currentMonthIdx - i + 12) % 12;
            last6Months.push({ idx: m, label: months[m] });
        }

        const countsRamah = [0, 0, 0, 0, 0, 0];
        const countsSantun = [0, 0, 0, 0, 0, 0];
        const countsSinergi = [0, 0, 0, 0, 0, 0];

        ramahDocs.forEach(d => {
            const m = new Date(d.created_at).getMonth();
            const slot = last6Months.findIndex(item => item.idx === m);
            if (slot !== -1) countsRamah[slot]++;
        });

        santunReqs.forEach(r => {
            const m = new Date(r.created_at).getMonth();
            const slot = last6Months.findIndex(item => item.idx === m);
            if (slot !== -1) countsSantun[slot]++;
        });

        sinergiCons.forEach(c => {
            const m = new Date(c.created_at).getMonth();
            const slot = last6Months.findIndex(item => item.idx === m);
            if (slot !== -1) countsSinergi[slot]++;
        });

        return {
            labels: last6Months.map(m => m.label),
            ramah: countsRamah,
            santun: countsSantun,
            sinergi: countsSinergi
        };
    }, [ramahDocs, santunReqs, sinergiCons]);

    // Multi-line chart options
    const multiChartData = {
        labels: trendData.labels,
        datasets: [
            {
                label: 'RAMAH (Akta & KK)',
                data: trendData.ramah,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.08)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#2563eb'
            },
            {
                label: 'SANTUN (Transport)',
                data: trendData.santun,
                borderColor: '#ea580c',
                backgroundColor: 'rgba(234, 88, 12, 0.08)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#ea580c'
            },
            {
                label: 'SINERGI (Konsultasi Gizi)',
                data: trendData.sinergi,
                borderColor: '#16a34a',
                backgroundColor: 'rgba(22, 163, 74, 0.08)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#16a34a'
            }
        ]
    };

    const multiChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { family: "'Plus Jakarta Sans', sans-serif", weight: '700', size: 12 },
                    usePointStyle: true,
                    boxWidth: 8
                }
            },
            tooltip: {
                backgroundColor: '#0f172a',
                titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 13, weight: '700' },
                bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
                padding: 12,
                cornerRadius: 10
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1, font: { family: "'Plus Jakarta Sans'", size: 11 } },
                grid: { color: '#f1f5f9' }
            },
            x: {
                ticks: { font: { family: "'Plus Jakarta Sans'", size: 11, weight: '600' } },
                grid: { display: false }
            }
        }
    };

    // Unified Recent Activities List
    const recentActivities = useMemo(() => {
        const list = [];
        ramahDocs.slice(0, 5).forEach(d => {
            list.push({
                id: `ramah-${d.id}`,
                service: 'RAMAH',
                type: 'Pengurusan Akta & KK',
                name: d.applicant_name || 'Pasien',
                date: new Date(d.created_at),
                status: d.status,
                color: '#2563eb',
                tab: 'ramah'
            });
        });

        santunReqs.slice(0, 5).forEach(r => {
            list.push({
                id: `santun-${r.id}`,
                service: 'SANTUN',
                type: 'Antar Pulang Pasien',
                name: r.patient_name || 'Pasien',
                date: new Date(r.created_at),
                status: r.status,
                color: '#ea580c',
                tab: 'santun'
            });
        });

        sinergiCons.slice(0, 5).forEach(c => {
            list.push({
                id: `sinergi-${c.id}`,
                service: 'SINERGI',
                type: 'Konsultasi Ahli Gizi',
                name: c.patient_name || 'Bunda',
                date: new Date(c.created_at),
                status: c.status,
                color: '#16a34a',
                tab: 'sinergi'
            });
        });

        return list.sort((a, b) => b.date - a.date).slice(0, 7);
    }, [ramahDocs, santunReqs, sinergiCons]);

    return (
        <div className="dashboard-tab-container animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* ══════════════ 1. WELCOME HERO BANNER ══════════════ */}
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a8a 100%)',
                borderRadius: '24px',
                padding: '28px 28px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.25)'
            }}>
                <div style={{
                    position: 'absolute', right: '-40px', top: '-40px', width: '260px', height: '260px',
                    borderRadius: '50%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', padding: '5px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '12px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                        <Sparkles size={14} color="#60a5fa" />
                        <span>EXECUTIVE COMMAND CENTER • RSUD BENDAN KOTA PEKALONGAN</span>
                    </div>

                    <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: '0 0 6px', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.5px' }}>
                        Dashboard Eksekutif SAKPORE
                    </h1>

                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, maxWidth: '800px' }}>
                        Monitoring terpadu pelayanan pasca persalinan RSUD Bendan: status penerbitan akta lahir & KK (RAMAH), transportasi pulang nifas gratis (SANTUN), dan telekonsultasi gizi klinis (SINERGI) secara komprehensif dan realtime.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#93c5fd', background: 'rgba(30, 58, 138, 0.5)', padding: '6px 12px', borderRadius: '10px' }}>
                            <Activity size={14} /> Server Status: <strong>Online & Stabil</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#cbd5e1' }}>
                            <Calendar size={14} /> {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════ 2. STYLISH & ELEGANT SCORECARDS ══════════════ */}
            <div className="sc-grid">
                {/* Scorecard 1: Total Layanan */}
                <div className="sc-card sc-blue">
                    <div className="sc-emoji">📊</div>
                    <div className="sc-lbl">Total Seluruh Layanan</div>
                    <div className="sc-val">{grandTotal}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontSize: '0.72rem', color: '#2563eb', fontWeight: 700 }}>
                        <TrendingUp size={13} />
                        <span>Akumulasi RAMAH, SANTUN & SINERGI</span>
                    </div>
                </div>

                {/* Scorecard 2: Selesai */}
                <div className="sc-card sc-green">
                    <div className="sc-emoji">✅</div>
                    <div className="sc-lbl">Layanan Selesai (Tuntas)</div>
                    <div className="sc-val">{grandCompleted}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
                        <ShieldCheck size={13} />
                        <span>{completionRate}% Tingkat Penyelesaian Sukses</span>
                    </div>
                </div>

                {/* Scorecard 3: Dalam Proses */}
                <div className="sc-card sc-amber">
                    <div className="sc-emoji">⚡</div>
                    <div className="sc-lbl">Sedang Ditindaklanjuti</div>
                    <div className="sc-val">{grandProcess}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>
                        <Clock size={13} />
                        <span>Verifikasi Dukcapil / Armada Bertugas</span>
                    </div>
                </div>

                {/* Scorecard 4: Antrean Menunggu */}
                <div className="sc-card sc-rose">
                    <div className="sc-emoji">⏳</div>
                    <div className="sc-lbl">Menunggu Verifikasi Baru</div>
                    <div className="sc-val">{grandPending}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontSize: '0.72rem', color: '#e11d48', fontWeight: 700 }}>
                        <AlertCircle size={13} />
                        <span>Perlu Respon Tim Petugas</span>
                    </div>
                </div>
            </div>

            {/* ══════════════ 3. THREE SERVICE SUMMARY CARDS ══════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '16px' }}>
                {/* RAMAH CARD */}
                <div style={{
                    background: 'white', borderRadius: '20px', padding: '22px',
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                        Layanan RAMAH
                                    </h3>
                                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Penerbitan Akta Lahir, KIA, KK</span>
                                </div>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '20px' }}>
                                {totalRamah} Total
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: '#f8fafc', padding: '12px', borderRadius: '14px', marginBottom: '16px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>{ramahDone}</div>
                                <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>SELESAI</div>
                            </div>
                            <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#d97706' }}>{ramahProcess}</div>
                                <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>PROSES</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#dc2626' }}>{ramahPending}</div>
                                <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>MENUNGGU</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => onNavigateTab('ramah')}
                        style={{
                            width: '100%', padding: '10px', borderRadius: '12px',
                            background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe',
                            fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span>Kelola Pengajuan RAMAH</span>
                        <ChevronRight size={14} />
                    </button>
                </div>

                {/* SANTUN CARD */}
                <div style={{
                    background: 'white', borderRadius: '20px', padding: '22px',
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Truck size={20} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                        Layanan SANTUN
                                    </h3>
                                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Transportasi Pulang Nifas Gratis</span>
                                </div>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#fff7ed', color: '#c2410c', padding: '4px 10px', borderRadius: '20px' }}>
                                {totalSantun} Total
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: '#f8fafc', padding: '12px', borderRadius: '14px', marginBottom: '16px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>{santunDone}</div>
                                <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>TERLAYANI</div>
                            </div>
                            <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#d97706' }}>{santunProcess}</div>
                                <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>ARMADA JALAN</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#dc2626' }}>{santunPending}</div>
                                <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>ANTREAN</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => onNavigateTab('santun')}
                        style={{
                            width: '100%', padding: '10px', borderRadius: '12px',
                            background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa',
                            fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span>Kelola Armada SANTUN</span>
                        <ChevronRight size={14} />
                    </button>
                </div>

                {/* SINERGI CARD */}
                <div style={{
                    background: 'white', borderRadius: '20px', padding: '22px',
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Monitor size={20} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                        Layanan SINERGI
                                    </h3>
                                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Telekonsultasi Ahli Gizi RSUD</span>
                                </div>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#f0fdf4', color: '#15803d', padding: '4px 10px', borderRadius: '20px' }}>
                                {totalSinergi} Total
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: '#f8fafc', padding: '12px', borderRadius: '14px', marginBottom: '16px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>{sinergiDone}</div>
                                <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>SELESAI</div>
                            </div>
                            <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#d97706' }}>{sinergiScheduled}</div>
                                <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>TERJADWAL</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#dc2626' }}>{sinergiPending}</div>
                                <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>MENUNGGU</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => onNavigateTab('sinergi')}
                        style={{
                            width: '100%', padding: '10px', borderRadius: '12px',
                            background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0',
                            fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span>Jadwal Konsultasi Gizi</span>
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* ══════════════ 4. PERFORMANCE CHART & RECENT ACTIVITY ══════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
                {/* Tren 6 Bulan Terakhir */}
                <div style={{
                    background: 'white', borderRadius: '20px', padding: '24px',
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                📈 Tren Pelayanan Multi-Layanan
                            </h3>
                            <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#64748b' }}>
                                Perbandingan volume pelayanan 6 bulan terakhir (RAMAH vs SANTUN vs SINERGI)
                            </p>
                        </div>
                        <span style={{ fontSize: '0.72rem', background: '#f1f5f9', padding: '4px 10px', borderRadius: '10px', fontWeight: 700, color: '#475569' }}>
                            Tahun 2026
                        </span>
                    </div>

                    <div style={{ height: '260px' }}>
                        <Line data={multiChartData} options={multiChartOptions} />
                    </div>
                </div>

                {/* Aktivitas Terbaru Lintas Layanan */}
                <div style={{
                    background: 'white', borderRadius: '20px', padding: '24px',
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                ⚡ Aktivitas & Pengajuan Terkini
                            </h3>
                            <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#64748b' }}>
                                Log pengajuan dan status operasional terbaru
                            </p>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#059669', background: '#dcfce7', padding: '3px 8px', borderRadius: '8px', fontWeight: 800 }}>
                            ● Realtime
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {recentActivities.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                                Belum ada riwayat aktivitas layanan.
                            </div>
                        ) : (
                            recentActivities.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => onNavigateTab(item.tab)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '10px 14px', borderRadius: '12px', background: '#f8fafc',
                                        border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '8px', height: '8px', borderRadius: '50%',
                                            background: item.color
                                        }} />
                                        <div>
                                            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e293b' }}>
                                                {item.name}
                                            </div>
                                            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                                                {item.service} • {item.type}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{
                                            fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                                            background: item.status === 'completed' || item.status === 'Completed' ? '#dcfce7' : item.status === 'pending' || item.status === 'requested' || item.status === 'Pending' ? '#fee2e2' : '#fef3c7',
                                            color: item.status === 'completed' || item.status === 'Completed' ? '#166534' : item.status === 'pending' || item.status === 'requested' || item.status === 'Pending' ? '#991b1b' : '#92400e'
                                        }}>
                                            {item.status}
                                        </span>
                                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>
                                            {item.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ══════════════ 5. QUICK ACTIONS HUB ══════════════ */}
            <div style={{
                background: 'white', borderRadius: '20px', padding: '22px 24px',
                border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}>
                <h3 style={{ margin: '0 0 14px', fontSize: '1rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    🚀 Akses Cepat & Tindakan Manajemen
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <button
                        onClick={() => onNavigateTab('ramah')}
                        style={{
                            padding: '12px 16px', borderRadius: '14px', border: '1px solid #dbeafe',
                            background: '#f8fafc', color: '#1e40af', fontWeight: 700, fontSize: '0.78rem',
                            display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textAlign: 'left'
                        }}
                    >
                        <FileText size={18} color="#2563eb" />
                        <div>
                            <div>Verifikasi RAMAH</div>
                            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Berkas akta & KK</span>
                        </div>
                    </button>

                    <button
                        onClick={() => onNavigateTab('santun')}
                        style={{
                            padding: '12px 16px', borderRadius: '14px', border: '1px solid #ffedd5',
                            background: '#f8fafc', color: '#9a3412', fontWeight: 700, fontSize: '0.78rem',
                            display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textAlign: 'left'
                        }}
                    >
                        <Truck size={18} color="#ea580c" />
                        <div>
                            <div>Jadwal Armada SANTUN</div>
                            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Antar pasien nifas</span>
                        </div>
                    </button>

                    <button
                        onClick={() => onNavigateTab('sinergi')}
                        style={{
                            padding: '12px 16px', borderRadius: '14px', border: '1px solid #dcfce7',
                            background: '#f8fafc', color: '#166534', fontWeight: 700, fontSize: '0.78rem',
                            display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textAlign: 'left'
                        }}
                    >
                        <Monitor size={18} color="#16a34a" />
                        <div>
                            <div>Telekonsultasi Gizi</div>
                            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Jadwal video tatap muka</span>
                        </div>
                    </button>

                    <button
                        onClick={() => onNavigateTab('spj')}
                        style={{
                            padding: '12px 16px', borderRadius: '14px', border: '1px solid #f3e8ff',
                            background: '#f8fafc', color: '#6b21a8', fontWeight: 700, fontSize: '0.78rem',
                            display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textAlign: 'left'
                        }}
                    >
                        <Award size={18} color="#8b5cf6" />
                        <div>
                            <div>Rekapitulasi SPJ</div>
                            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Klaim transport resmi</span>
                        </div>
                    </button>

                    <button
                        onClick={() => onNavigateTab('dokumentasi')}
                        style={{
                            padding: '12px 16px', borderRadius: '14px', border: '1px solid #cffafe',
                            background: '#f8fafc', color: '#0e7490', fontWeight: 700, fontSize: '0.78rem',
                            display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textAlign: 'left'
                        }}
                    >
                        <Compass size={18} color="#0891b2" />
                        <div>
                            <div>Dokumen Master Plan</div>
                            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Flowchart & Unduh PDF</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

