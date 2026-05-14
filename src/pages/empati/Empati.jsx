import React, { useState } from 'react';
import { Play, Pause, Shield, Heart, Baby, Utensils, Brain, ArrowLeft, Maximize, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const topics = [
    {
        id: 1,
        title: 'Teknik Menyusui Kemenkes',
        icon: <Baby size={24} />,
        color: '#0ea5e9',
        bgColor: '#e0f2fe',
        description: 'Panduan lengkap posisi dan pelekatan yang benar agar menyusui nyaman. (Edukasi durasi 1 menit)',
        imageSrc: '/images/empati/empati_breastfeeding_1778754798506.png'
    },
    {
        id: 2,
        title: 'Perawatan Luka & Higienitas',
        icon: <Shield size={24} />,
        color: '#16a34a',
        bgColor: '#dcfce7',
        description: 'Cara menjaga kebersihan diri dan merawat luka pasca melahirkan dengan benar.',
        imageSrc: '/images/empati/empati_hygiene_1778754878193.png'
    },
    {
        id: 3,
        title: 'Nutrisi Pasca Melahirkan',
        icon: <Utensils size={24} />,
        color: '#f59e0b',
        bgColor: '#fef3c7',
        description: 'Daftar makanan bergizi untuk mempercepat pemulihan dan kualitas ASI ibu.',
        imageSrc: '/images/empati/empati_nutrition_1778755013806.png'
    },
    {
        id: 4,
        title: 'Kesehatan Mental & Istirahat',
        icon: <Brain size={24} />,
        color: '#8b5cf6',
        bgColor: '#f5f3ff',
        description: 'Pentingnya menjaga psikologis ibu, mencegah baby blues, dan istirahat cukup.',
        imageSrc: '/images/empati/empati_mentalhealth_1778755087234.png'
    },
    {
        id: 5,
        title: 'Bonding dengan Bayi',
        icon: <Heart size={24} />,
        color: '#ec4899',
        bgColor: '#fdf2f8',
        description: 'Cara tepat membangun ikatan emosional dan fisik yang kuat dengan buah hati.',
        imageSrc: '/images/empati/empati_bonding_1778755126025.png'
    }
];

export default function Empati() {
    const navigate = useNavigate();
    const [selectedVideo, setSelectedVideo] = useState(topics[0]);

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
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Menu EMPATI</h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Video Edukasi Pasca Melahirkan</p>
                </div>
            </div>

            {/* Simulated Cinematic Video Player (Using generated cover posters) */}
            <div style={{
                background: 'black',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                marginBottom: '16px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
            }}>
                <style>{`
                    @keyframes cinematicZoom {
                        0% { transform: scale(1.0); }
                        50% { transform: scale(1.08); }
                        100% { transform: scale(1.0); }
                    }
                `}</style>
                <img
                    src={selectedVideo.imageSrc}
                    alt={selectedVideo.title}
                    key={selectedVideo.id}
                    style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        opacity: 0.85,
                        animation: 'cinematicZoom 20s infinite ease-in-out'
                    }}
                />

                {/* Play Button Overlay */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', border: '1px solid rgba(255,255,255,0.4)' }}>
                        <Play size={28} color="white" fill="white" style={{ marginLeft: '4px' }} />
                    </div>
                </div>

                {/* Duration Badge */}
                <div style={{ position: 'absolute', bottom: '8px', right: '16px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                    00:59
                </div>

                {/* Subtitle / Topic overlay */}
                <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '24px 16px 12px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', color: 'white' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{selectedVideo.title}</h3>
                </div>

                {/* Watermark SAKPORE RSUD BENDAN */}
                <div style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'rgba(255, 255, 255, 0.8)', padding: '4px 8px',
                    borderRadius: '6px', color: '#0ea5e9', fontSize: '0.65rem',
                    fontWeight: 800, letterSpacing: '0.5px', pointerEvents: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                    SAKPORE RSUD
                </div>
            </div>

            {/* Video Title and Desc */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{selectedVideo.title}</h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, paddingLeft: '16px' }}>{selectedVideo.description}</p>
            </div>

            {/* Video List */}
            <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', fontWeight: 700 }}>Daftar Video Edukasi Lainnya</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {topics.map((topic) => (
                    <div
                        key={topic.id}
                        onClick={() => setSelectedVideo(topic)}
                        style={{
                            background: selectedVideo.id === topic.id ? '#f8fafc' : 'white',
                            borderRadius: '16px', padding: '12px',
                            border: selectedVideo.id === topic.id ? `2px solid ${topic.color}` : '1px solid #f1f5f9',
                            boxShadow: 'var(--shadow-sm)',
                            display: 'flex', gap: '16px', alignItems: 'center',
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: topic.bgColor, color: topic.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            {selectedVideo.id === topic.id ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 4px 0', color: selectedVideo.id === topic.id ? topic.color : '#1e293b' }}>
                                {topic.title}
                            </h4>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {topic.description}
                            </p>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>0:59</div>
                    </div>
                ))}
            </div>

            {/* Notice */}
            <div style={{ marginTop: '24px', padding: '16px', borderRadius: '16px', background: '#f0fdf4', border: '1px solid #dcfce7', textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', color: '#166534', margin: 0, fontWeight: 500 }}>
                    <Shield size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
                    Video diverifikasi secara medis oleh <strong>RSUD Bendan Kota Pekalongan</strong>. Pastikan pengaturan volume *speaker* Anda memadai.
                </p>
            </div>
        </div>
    );
}
