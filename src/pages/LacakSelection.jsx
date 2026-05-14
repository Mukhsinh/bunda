import React from 'react';
import { Search, ArrowLeft, Shield, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function LacakSelection() {
    const navigate = useNavigate();

    return (
        <div className="animate-slide-up page-content">
            {/* Header */}
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
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Lacak Pengajuan</h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Pilih layanan yang ingin dilacak</p>
                </div>
            </div>

            {/* Main Selection Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <Link to="/ramah/track" className="modern-track-card ramah-track" style={{ height: 'auto', padding: '24px 16px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
                    <div className="track-icon-wrapper" style={{ width: '56px', height: '56px' }}>
                        <Search size={24} strokeWidth={2.5} />
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#0284c7' }}>Lacak RAMAH</h3>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#0f172a', fontWeight: 500 }}>Registrasi Akta Kelahiran</p>
                    </div>
                </Link>

                <Link to="/santun/track" className="modern-track-card santun-track" style={{ height: 'auto', padding: '24px 16px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
                    <div className="track-icon-wrapper" style={{ width: '56px', height: '56px' }}>
                        <Search size={24} strokeWidth={2.5} />
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#16a34a' }}>Lacak SANTUN</h3>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#0f172a', fontWeight: 500 }}>Layanan Antar Pasien</p>
                    </div>
                </Link>
            </div>

            {/* Info Section */}
            <div className="modern-info-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ padding: '6px', background: 'rgba(22, 163, 74, 0.1)', borderRadius: '8px' }}>
                        <Shield size={18} color="var(--primary)" />
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Informasi Layanan</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ marginTop: '2px', color: 'var(--primary)', opacity: 0.8 }}>
                            <Clock size={16} />
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                            Anda memerlukan <strong>Nomor Tiket</strong> atau <strong>NIK</strong> untuk melacak status dokumen dan pengantaran Anda.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
