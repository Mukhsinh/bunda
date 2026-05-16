import React, { useState } from 'react';
import { Play, Pause, Shield, Heart, Baby, Utensils, Brain, ArrowLeft, Maximize, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const topics = [
    {
        id: 1,
        title: 'Teknik Menyusui Bayi',
        icon: <Baby size={24} />,
        color: '#0ea5e9',
        bgColor: '#e0f2fe',
        description: 'Panduan lengkap posisi dan pelekatan yang benar agar menyusui nyaman.',
        videoSrc: '1B7IjRHiT9dTSzUnQPfqWxi01yli8zsDp',
        imageSrc: '/images/empati/empati_breastfeeding_1778761557180.png'
    },
    {
        id: 2,
        title: 'Perawatan Bayi Baru Lahir',
        icon: <Shield size={24} />,
        color: '#16a34a',
        bgColor: '#dcfce7',
        description: 'Cara merawat kebersihan dan kesehatan bayi baru lahir dengan benar.',
        videoSrc: '1B7mC3jqUWhPbYNiraU360ntkzEDDNTjy',
        imageSrc: '/images/empati/empati_hygiene_1778754878193.png'
    },
    {
        id: 3,
        title: 'Nutrisi Ibu Pasca Melahirkan',
        icon: <Utensils size={24} />,
        color: '#f59e0b',
        bgColor: '#fef3c7',
        description: 'Daftar makanan bergizi untuk mempercepat pemulihan dan kualitas ASI ibu.',
        videoSrc: '1ejlnpyA60rPVzb5e0tkvJmC_VAueIMxD',
        imageSrc: '/images/empati/empati_nutrition_1778755013806.png'
    },
    {
        id: 4,
        title: 'Alat Kontrasepsi Pasca Melahirkan',
        icon: <Heart size={24} />,
        color: '#ec4899',
        bgColor: '#fdf2f8',
        description: 'Informasi mengenai pilihan alat kontrasepsi yang aman pasca melahirkan.',
        videoSrc: '18bSkypN92uuj5ZkCyqkGY-Z7NSLs4p2Y',
        imageSrc: '/images/empati/empati_bonding_1778755126025.png'
    },
    {
        id: 5,
        title: 'Kesehatan Mental Pasca Melahirkan',
        icon: <Brain size={24} />,
        color: '#8b5cf6',
        bgColor: '#f5f3ff',
        description: 'Pentingnya menjaga psikologis ibu, mencegah baby blues, dan istirahat cukup.',
        videoSrc: '1lN9mzQ9tOCAyHE5Ia5mo6Edtpc6AOKZo',
        imageSrc: '/images/empati/empati_mentalhealth_1778755087234.png'
    },
    {
        id: 6,
        title: 'Gangguan Psikotis Pasca Melahirkan',
        icon: <Brain size={24} />,
        color: '#ef4444',
        bgColor: '#fee2e2',
        description: 'Mengenali gejala dan penanganan gangguan psikotis pasca melahirkan.',
        videoSrc: '1L5GXzunq_7tiZzOTVxCCm1g5_T8I-33k',
        imageSrc: '/images/empati/empati_mentalhealth_1778755087234.png'
    }
];


export default function Empati() {
    const navigate = useNavigate();
    const [selectedVideo, setSelectedVideo] = useState(topics[0]);
    const [isLoading, setIsLoading] = useState(true);

    const handleSelectVideo = (topic) => {
        setIsLoading(true);
        setSelectedVideo(topic);
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
                {/* Decorative Waves */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', overflow: 'hidden' }}>
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%', opacity: 0.3, fill: '#84cc16', transform: 'translateX(-100px)' }}>
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.23,113.87,145.6,121.38,210,105.69,273.81,90,298,60,321.39,56.44Z"></path>
                    </svg>
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%', opacity: 0.2, fill: '#f59e0b', position: 'absolute', top: 0, left: 0, transform: 'translateX(100px)' }}>
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.23,113.87,145.6,121.38,210,105.69,273.81,90,298,60,321.39,56.44Z"></path>
                    </svg>
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%', fill: 'white', position: 'absolute', top: '15px', left: 0 }}>
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.23,113.87,145.6,121.38,210,105.69,273.81,90,298,60,321.39,56.44Z"></path>
                    </svg>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 10 }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'white', backdropFilter: 'blur(4px)'
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'white', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>EMPATI</h2>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', margin: 0, fontWeight: 500 }}>Edukasi Mewujudkan Persalinan Aman & Tenang</p>
                    </div>
                </div>
            </div>

            {/* Video Player */}
            {/* 
              Analisa: Google Drive /preview menambahkan toolbar bawaan 
              (timeline di atas + kontrol di bawah) di dalam iframe.
              Ini menyebabkan video terlihat lebih kecil dari container, 
              menghasilkan area hitam di sekitar video.
              
              Solusi: Scale iframe 20% lebih besar dari container, sehingga
              toolbar GDrive terpotong oleh overflow:hidden pada container.
              Hasilnya: yang terlihat hanya konten video saja.
            */}
            <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%', /* 16:9 */
                marginBottom: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                background: '#e2e8f0',
            }}>
                {/* Loading overlay */}
                {isLoading && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        zIndex: 5, borderRadius: '16px'
                    }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            border: '3px solid #0ea5e9', borderTopColor: 'transparent',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <p style={{ fontSize: '0.8rem', color: '#0ea5e9', fontWeight: 600, marginTop: '12px' }}>
                            Memuat video...
                        </p>
                    </div>
                )}
                <iframe
                    key={selectedVideo.id}
                    src={`https://drive.google.com/file/d/${selectedVideo.videoSrc}/preview`}
                    style={{
                        border: 'none',
                        position: 'absolute',
                        top: '-10%',
                        left: '-10%',
                        width: '120%',
                        height: '120%',
                    }}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    title={selectedVideo.title}
                    onLoad={() => setIsLoading(false)}
                />
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
                        onClick={() => handleSelectVideo(topic)}
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
                        {selectedVideo.id === topic.id && <div style={{ fontSize: '0.7rem', color: topic.color, fontWeight: 700 }}>Sedang Diputar</div>}
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
