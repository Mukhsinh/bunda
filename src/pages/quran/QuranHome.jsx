import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, BookOpen, Star } from 'lucide-react';

const QuranHome = () => {
    const [surahs, setSurahs] = useState([]);
    const [filteredSurahs, setFilteredSurahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                const response = await fetch('https://api.myquran.com/v2/quran/surat/semua');
                const data = await response.json();
                if (data.status) { setSurahs(data.data); setFilteredSurahs(data.data); }
            } catch (error) { console.error('Error:', error); }
            finally { setLoading(false); }
        };
        fetchSurahs();
    }, []);

    useEffect(() => {
        const filtered = surahs.filter(s =>
            s.name_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.number.toString().includes(searchQuery) ||
            s.translation_id.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredSurahs(filtered);
    }, [searchQuery, surahs]);

    const styles = {
        page: { minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc, #f1f5f9)' },
        header: {
            position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9, #4f46e5)',
            padding: '24px 20px 28px', borderRadius: '0 0 28px 28px',
            boxShadow: '0 8px 32px rgba(109, 40, 217, 0.3)',
        },
        headerPattern: {
            position: 'absolute', inset: 0, opacity: 0.06,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
        },
        backBtn: {
            width: '36px', height: '36px', background: 'rgba(255,255,255,0.15)',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', border: 'none', cursor: 'pointer', textDecoration: 'none',
        },
        title: { fontSize: '20px', fontWeight: 700, color: 'white', fontFamily: 'Outfit, sans-serif', margin: 0 },
        subtitle: { fontSize: '11px', color: '#c4b5fd', fontWeight: 500, margin: '2px 0 0 0' },
        searchWrap: { position: 'relative', marginTop: '16px' },
        searchIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#a78bfa' },
        searchInput: {
            width: '100%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '16px', padding: '12px 16px 12px 40px', color: 'white', fontSize: '13px',
            fontWeight: 500, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
        },
        statsBadge: {
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: 'rgba(255,255,255,0.1)', padding: '5px 12px',
            borderRadius: '20px', fontSize: '11px', color: '#c4b5fd', fontWeight: 500,
        },
        list: { padding: '16px 16px 96px', maxWidth: '640px', margin: '0 auto' },
        card: {
            display: 'flex', alignItems: 'center', gap: '12px',
            background: 'white', padding: '14px', borderRadius: '16px',
            border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            textDecoration: 'none', color: 'inherit', marginBottom: '8px',
            transition: 'all 0.2s ease',
        },
        numberBadge: {
            width: '42px', height: '42px', minWidth: '42px',
            background: 'linear-gradient(135deg, #ede9fe, #f3e8ff)',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700, color: '#7c3aed', fontFamily: 'Outfit, sans-serif',
            border: '1px solid rgba(124, 58, 237, 0.1)',
        },
        surahName: { fontWeight: 700, color: '#1e293b', fontFamily: 'Outfit, sans-serif', fontSize: '15px', margin: 0 },
        surahMeta: { fontSize: '11px', color: '#94a3b8', fontWeight: 500, margin: '2px 0 0 0' },
        arabicName: { fontSize: '18px', color: '#7c3aed', fontFamily: "'Scheherazade New', serif" },
        arrow: { color: '#cbd5e1', flexShrink: 0 },
    };

    return (
        <div style={styles.page} className="animate-slide-up">
            <div style={styles.header}>
                <div style={styles.headerPattern} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <Link to="/" style={styles.backBtn}><ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /></Link>
                        <div>
                            <h1 style={styles.title}>Al-Qur'an Digital</h1>
                            <p style={styles.subtitle}>Baca, Dengarkan & Pahami</p>
                        </div>
                    </div>

                    <div style={styles.searchWrap}>
                        <Search size={15} style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Cari surat atau arti..."
                            style={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                        <div style={styles.statsBadge}><BookOpen size={12} /> {surahs.length} Surat</div>
                        <div style={styles.statsBadge}><Star size={12} /> 6236 Ayat</div>
                    </div>
                </div>
            </div>

            <div style={styles.list}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '12px' }}>
                        <div className="spinner" style={{
                            width: '40px', height: '40px', border: '3px solid #ede9fe',
                            borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                        }} />
                        <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 500 }}>Memuat daftar surat...</p>
                    </div>
                ) : (
                    filteredSurahs.map((surah) => (
                        <Link key={surah.number} to={`/quran/${surah.number}`} style={styles.card}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#ddd6fe'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
                        >
                            <div style={styles.numberBadge}>{surah.number}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h3 style={styles.surahName}>{surah.name_id}</h3>
                                <p style={styles.surahMeta}>{surah.translation_id} • {surah.number_of_verses} Ayat • {surah.revelation_id}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                <span style={styles.arabicName}>{surah.name_short}</span>
                                <ChevronRight size={14} style={styles.arrow} />
                            </div>
                        </Link>
                    ))
                )}

                {!loading && filteredSurahs.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ width: '56px', height: '56px', background: '#f1f5f9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#cbd5e1' }}>
                            <Search size={24} />
                        </div>
                        <p style={{ color: '#94a3b8', fontWeight: 500, fontSize: '13px' }}>Surat tidak ditemukan</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuranHome;
