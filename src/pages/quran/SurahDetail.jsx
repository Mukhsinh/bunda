import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Play, Pause, Eye, EyeOff, SkipForward, Square, Volume2 } from 'lucide-react';

const SurahDetail = () => {
    const { id } = useParams();
    const [surah, setSurah] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeAudio, setActiveAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showTranslation, setShowTranslation] = useState(true);
    const [isPlayingAll, setIsPlayingAll] = useState(false);
    const [currentPlayAllIndex, setCurrentPlayAllIndex] = useState(-1);
    const audioRef = useRef(null);
    const playAllRef = useRef(false);

    useEffect(() => {
        const fetchSurahDetail = async () => {
            try {
                const metaRes = await fetch(`https://api.myquran.com/v2/quran/surat/${id}`);
                const metaData = await metaRes.json();
                if (metaData.status) {
                    const metadata = metaData.data;
                    const ayahRes = await fetch(`https://api.myquran.com/v2/quran/ayat/${id}/1-${metadata.number_of_verses}`);
                    const ayahData = await ayahRes.json();
                    if (ayahData.status || ayahData.data) {
                        setSurah({ ...metadata, ayahs: ayahData.data });
                    }
                }
            } catch (error) { console.error('Error:', error); }
            finally { setLoading(false); }
        };
        fetchSurahDetail();
        return () => { playAllRef.current = false; if (audioRef.current) audioRef.current.pause(); };
    }, [id]);

    const handlePlayAudio = useCallback((url, index) => {
        if (activeAudio === index && isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
            return;
        }
        if (audioRef.current) audioRef.current.pause();
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.play().catch(() => { });
        setActiveAudio(index);
        setIsPlaying(true);
        audio.onended = () => { setIsPlaying(false); setActiveAudio(null); };
    }, [activeAudio, isPlaying]);

    const playChain = useCallback((idx, ayahs) => {
        if (!playAllRef.current || idx >= ayahs.length) {
            playAllRef.current = false;
            setIsPlayingAll(false);
            setCurrentPlayAllIndex(-1);
            setActiveAudio(null);
            setIsPlaying(false);
            return;
        }
        const ayah = ayahs[idx];
        if (!ayah.audio) { playChain(idx + 1, ayahs); return; }

        setCurrentPlayAllIndex(idx);
        setActiveAudio(idx);
        setIsPlaying(true);

        if (audioRef.current) audioRef.current.pause();
        const audio = new Audio(ayah.audio);
        audioRef.current = audio;
        audio.play().catch(() => playChain(idx + 1, ayahs));
        audio.onended = () => playChain(idx + 1, ayahs);
        audio.onerror = () => playChain(idx + 1, ayahs);

        const el = document.getElementById(`ayah-${idx}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    const handlePlayAll = useCallback(() => {
        if (isPlayingAll) {
            playAllRef.current = false;
            setIsPlayingAll(false);
            setCurrentPlayAllIndex(-1);
            setActiveAudio(null);
            setIsPlaying(false);
            if (audioRef.current) audioRef.current.pause();
            return;
        }
        if (!surah?.ayahs?.length) return;
        playAllRef.current = true;
        setIsPlayingAll(true);
        playChain(0, surah.ayahs);
    }, [isPlayingAll, surah, playChain]);

    const handleSkipNext = useCallback(() => {
        if (!isPlayingAll || !surah?.ayahs) return;
        const nextIdx = currentPlayAllIndex + 1;
        if (nextIdx < surah.ayahs.length) {
            if (audioRef.current) audioRef.current.pause();
            playChain(nextIdx, surah.ayahs);
        }
    }, [isPlayingAll, currentPlayAllIndex, surah, playChain]);

    // Styles
    const s = {
        page: { minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc, #f1f5f9)', paddingBottom: '100px' },
        header: {
            position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9, #4f46e5)',
            padding: '20px 20px 16px', borderRadius: '0 0 24px 24px',
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
        controlBar: {
            position: 'sticky', top: 0, zIndex: 20,
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        },
        playAllBtn: (active) => ({
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: '12px', fontFamily: 'inherit',
            background: active ? '#ef4444' : '#7c3aed', color: 'white',
            boxShadow: active ? '0 4px 14px rgba(239,68,68,0.3)' : '0 4px 14px rgba(124,58,237,0.3)',
            transition: 'all 0.2s',
        }),
        skipBtn: {
            width: '32px', height: '32px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center',
        },
        toggleBtn: (active) => ({
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '8px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700,
            border: active ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
            background: active ? '#ecfdf5' : '#f8fafc', color: active ? '#059669' : '#64748b',
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
        }),
        progressBar: (pct) => ({
            height: '3px', background: '#f1f5f9', overflow: 'hidden',
        }),
        progressFill: (pct) => ({
            height: '100%', width: `${pct}%`,
            background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
            transition: 'width 0.3s ease',
        }),
        verseCard: (isCurrent) => ({
            borderRadius: '16px', overflow: 'hidden',
            transition: 'all 0.3s ease', marginBottom: '10px',
            background: isCurrent ? '#f5f3ff' : 'white',
            border: isCurrent ? '2px solid #c4b5fd' : '1px solid #f1f5f9',
            boxShadow: isCurrent ? '0 8px 24px rgba(124,58,237,0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
        }),
        verseTopBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderBottom: '1px solid rgba(0,0,0,0.03)' },
        verseBadge: (isCurrent) => ({
            width: '30px', height: '30px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700, fontFamily: 'Outfit, sans-serif',
            background: isCurrent ? '#7c3aed' : '#f8fafc', color: isCurrent ? 'white' : '#94a3b8',
        }),
        audioBtn: (isCurrent) => ({
            width: '30px', height: '30px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
            background: isCurrent ? '#7c3aed' : '#f8fafc',
            color: isCurrent ? 'white' : '#94a3b8',
            animation: isCurrent ? 'pulse 2s infinite' : 'none',
        }),
        arabicText: {
            fontSize: '24px', fontFamily: "'Scheherazade New', 'Amiri', serif",
            lineHeight: 2.2, color: '#1e293b', textAlign: 'right', direction: 'rtl',
            padding: '16px 20px', wordBreak: 'break-word', overflowWrap: 'break-word',
        },
        translationText: {
            fontSize: '13px', color: '#475569', lineHeight: 1.7, fontFamily: 'Outfit, sans-serif',
            padding: '0 20px 14px', borderTop: '1px solid #f1f5f9', paddingTop: '12px', margin: '0 0 0 0',
        },
    };

    if (loading) return (
        <div style={{ ...s.page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #ede9fe', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 500, marginTop: '12px' }}>Memuat ayat...</p>
        </div>
    );

    if (!surah) return (
        <div style={{ ...s.page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Surat Tidak Ditemukan</h1>
            <Link to="/quran" style={{ color: '#7c3aed', fontWeight: 500, fontSize: '13px' }}>← Kembali</Link>
        </div>
    );

    const progressPct = surah.ayahs ? ((currentPlayAllIndex + 1) / surah.ayahs.length) * 100 : 0;

    return (
        <div style={s.page} className="animate-slide-up">
            {/* Header */}
            <div style={s.header}>
                <div style={s.headerPattern} />
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Link to="/quran" style={s.backBtn}><ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /></Link>
                        <div>
                            <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', fontFamily: 'Outfit, sans-serif', margin: 0 }}>{surah.name_id}</h1>
                            <p style={{ fontSize: '11px', color: '#c4b5fd', fontWeight: 500, margin: '2px 0 0 0' }}>{surah.translation_id} • {surah.number_of_verses} Ayat</p>
                        </div>
                    </div>
                    <span style={{ fontSize: '22px', fontFamily: "'Scheherazade New', serif", color: 'rgba(255,255,255,0.85)' }}>{surah.name_short}</span>
                </div>
            </div>

            {/* Controls Bar */}
            <div style={s.controlBar}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', maxWidth: '640px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={handlePlayAll} style={s.playAllBtn(isPlayingAll)}>
                            {isPlayingAll ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                            {isPlayingAll ? 'Berhenti' : 'Putar Semua'}
                        </button>
                        {isPlayingAll && (
                            <button onClick={handleSkipNext} style={s.skipBtn}>
                                <SkipForward size={14} />
                            </button>
                        )}
                    </div>
                    <button onClick={() => setShowTranslation(!showTranslation)} style={s.toggleBtn(showTranslation)}>
                        {showTranslation ? <Eye size={12} /> : <EyeOff size={12} />}
                        Terjemahan
                    </button>
                </div>
                {isPlayingAll && (
                    <div style={s.progressBar(progressPct)}>
                        <div style={s.progressFill(progressPct)} />
                    </div>
                )}
            </div>

            {/* Bismillah */}
            {id !== '9' && id !== '1' && (
                <div style={{ textAlign: 'center', padding: '24px 16px 8px' }}>
                    <p style={{ fontSize: '22px', fontFamily: "'Scheherazade New', serif", color: '#475569', lineHeight: 1.8 }}>
                        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                    </p>
                    {showTranslation && (
                        <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', fontWeight: 500, fontStyle: 'italic' }}>
                            "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang"
                        </p>
                    )}
                </div>
            )}

            {/* Verses */}
            <div style={{ padding: '12px 16px 0', maxWidth: '640px', margin: '0 auto' }}>
                {surah.ayahs.map((ayah, index) => {
                    const isCurrent = activeAudio === index && isPlaying;
                    return (
                        <div key={index} id={`ayah-${index}`} style={s.verseCard(isCurrent)}>
                            <div style={s.verseTopBar}>
                                <div style={s.verseBadge(isCurrent)}>{ayah.ayah}</div>
                                <button onClick={() => handlePlayAudio(ayah.audio, index)} style={s.audioBtn(isCurrent)}>
                                    {isCurrent ? <Pause size={13} fill="currentColor" /> : <Volume2 size={13} />}
                                </button>
                            </div>
                            <div style={s.arabicText}>{ayah.arab}</div>
                            {showTranslation && (
                                <div style={s.translationText}>
                                    <span style={{ color: '#7c3aed', fontWeight: 700, fontSize: '11px', marginRight: '4px' }}>{ayah.ayah}.</span>
                                    {ayah.text}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Scroll to Top */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                    position: 'fixed', bottom: '96px', right: '16px',
                    width: '40px', height: '40px', background: 'white',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#94a3b8', border: '1px solid #f1f5f9', cursor: 'pointer', zIndex: 30,
                }}
            >
                <ChevronRight size={18} style={{ transform: 'rotate(-90deg)' }} />
            </button>
        </div>
    );
};

export default SurahDetail;
