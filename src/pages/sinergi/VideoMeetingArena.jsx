import React, { useState, useEffect, useRef } from 'react';
import {
    Mic, MicOff, Video, VideoOff, MessageSquare, Hand,
    Users, Settings, LogOut, Shield, Crown, Maximize2, Minimize2,
    ArrowLeft, HelpCircle, CheckCircle2, User, Heart, Activity
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';

const VideoMeetingArena = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, profile } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [jitsiApi, setJitsiApi] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [isMuted, setIsMuted] = useState(true);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [handRaised, setHandRaised] = useState(false);
    const [raisedHands, setRaisedHands] = useState([]);
    const [isEnding, setIsEnding] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Get sessionId and type from query params
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('sessionId');
    const sessionType = queryParams.get('type') || 'group'; // Default to group for backward compatibility
    const isNarasumber = profile?.role === 'admin' || profile?.role === 'narasumber';

    useEffect(() => {
        if (!sessionId) {
            navigate('/');
            return;
        }
        fetchSessionDetails();

        // Subscription for session updates (to detect "Completed" status)
        const targetTable = sessionType === 'manual' ? 'sinergi_requests' : 'sinergi_sessions';
        const sessionChannel = supabase.channel(`session_updates_${sessionId}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: targetTable,
                filter: `id=eq.${sessionId}`
            }, (payload) => {
                if (payload.new.status === 'Completed') {
                    setIsEnding(true);
                    setTimeout(() => {
                        navigate('/');
                    }, 5000);
                }
                setSession(payload.new);
            })
            .subscribe();

        // Subscription for hand raising
        const handChannel = supabase.channel(`session_hands_${sessionId}`)
            .on('broadcast', { event: 'raise_hand' }, ({ payload }) => {
                setRaisedHands(prev => {
                    if (prev.find(h => h.userId === payload.userId)) return prev;
                    return [...prev, payload];
                });
            })
            .on('broadcast', { event: 'lower_hand' }, ({ payload }) => {
                setRaisedHands(prev => prev.filter(h => h.userId !== payload.userId));
            })
            .subscribe();

        // Listen for hardware/browser fullscreen changes
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            supabase.removeChannel(sessionChannel);
            supabase.removeChannel(handChannel);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [sessionId]);

    const fetchSessionDetails = async () => {
        try {
            const table = sessionType === 'manual' ? 'sinergi_requests' : 'sinergi_sessions';
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .eq('id', sessionId)
                .single();

            if (data) {
                if (data.status === 'Completed') {
                    setIsEnding(true);
                    setTimeout(() => navigate('/'), 3000);
                    return;
                }
                // Normalize some fields if manual
                const normalizedData = {
                    ...data,
                    title: sessionType === 'manual' ? `Konsultasi: ${data.name}` : data.title,
                    narasumber_name: sessionType === 'manual' ? (data.narasumber_name || 'Ahli Gizi RSUD Bendan') : data.narasumber_name,
                    jitsi_room: data.jitsi_room || data.jitsi_link || `sahabatbunda-sinergi-${data.id}`
                };
                setSession(normalizedData);
                initJitsi(normalizedData);
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Error fetching session:', error);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const initJitsi = (sessionData) => {
        const domain = "meet.jit.si";
        const roomName = sessionData.jitsi_room || `sahabatbunda-sinergi-${sessionData.id}`;

        const options = {
            roomName: roomName,
            width: '100%',
            height: '100%',
            parentNode: document.querySelector('#jitsi-arena'),
            userInfo: {
                displayName: queryParams.get('expertName') || profile?.full_name || user?.email?.split('@')[0] || 'Peserta'
            },
            configOverwrite: {
                startWithAudioMuted: true,
                startWithVideoMuted: false,
                prejoinPageEnabled: false,
                disableThirdPartyRequests: true,
                enableWelcomePage: false,
                disableDeepLinking: true,
                remoteVideoMenu: {
                    disableKick: !isNarasumber,
                    disableGrantModerator: !isNarasumber
                },
                lobbyModeEnabled: true,
                enableLobby: true,
                disableModeratorIndicator: false,
                requireDisplayName: true
            },
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: isNarasumber ? [
                    'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                    'fodeviceselection', 'hangup', 'profile', 'chat', 'settings', 'raisehand',
                    'videoquality', 'tileview', 'videobackgroundblur'
                ] : [
                    'microphone', 'camera', 'closedcaptions', 'fullscreen', 'hangup', 'chat', 'settings', 'raisehand', 'tileview'
                ],
                SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile'],
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
                DISPLAY_WELCOME_PAGE_CONTENT: false,
                ENABLE_LOBBY_BY_DEFAULT: true
            }
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);
        setJitsiApi(api);

        api.addEventListeners({
            videoConferenceJoined: () => {
                if (!isNarasumber) {
                    setIsMuted(true);
                }
            },
            participantJoined: (data) => {
                setParticipants(prev => [...prev, data]);
            },
            participantLeft: (data) => {
                setParticipants(prev => prev.filter(p => p.id !== data.id));
            },
            audioMuteStatusChanged: (data) => {
                setIsMuted(data.muted);
            },
            videoMuteStatusChanged: (data) => {
                setIsVideoOff(data.muted);
            }
        });
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const handleRaiseHand = () => {
        const event = handRaised ? 'lower_hand' : 'raise_hand';
        const payload = {
            userId: user.id,
            userName: profile?.full_name || 'Peserta',
            timestamp: new Date().toISOString()
        };

        supabase.channel(`session_hands_${sessionId}`).send({
            type: 'broadcast',
            event: event,
            payload: payload
        });

        setHandRaised(!handRaised);
        // We use toggleRaiseHand internally in Jitsi just in case 
        jitsiApi?.executeCommand('toggleRaiseHand');
    };

    const handleMicToggle = () => {
        if (!isNarasumber && isMuted && !handRaised) {
            alert('Silakan memencet tombol "MULAI BICARA" (Angkat Tangan) terlebih dahulu agar narasumber dapat mempersilakan Anda berbicara.');
            return;
        }
        jitsiApi?.executeCommand('toggleAudio');
    };

    const handleVideoToggle = () => {
        jitsiApi?.executeCommand('toggleVideo');
    };

    const handleEndSession = async () => {
        if (!isNarasumber) return;
        if (window.confirm('Akhiri sesi konsultasi ini untuk semua peserta?')) {
            const { error } = await supabase
                .from('sinergi_sessions')
                .update({ status: 'Completed', ended_at: new Date().toISOString() })
                .eq('id', sessionId);

            if (error) {
                console.error('Error ending session:', error);
            } else {
                navigate('/');
            }
        }
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, border: '4px solid rgba(59,130,246,0.1)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                    <p style={{ color: 'white', fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>Menyiapkan Arena SINERGI...</p>
                </div>
            </div>
        );
    }

    if (isEnding) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', padding: '24px' }}>
                <div style={{
                    textAlign: 'center', background: 'white', padding: '48px', borderRadius: '32px',
                    maxWidth: '400px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                    animation: 'modalIn 0.5s ease-out'
                }}>
                    <div style={{ width: '80px', height: '80px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#16a34a' }}>
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b', margin: '0 0 12px', fontFamily: "'Outfit', sans-serif" }}>Sesi Selesai</h2>
                    <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                        Terima kasih telah mengikuti sesi Konsultasi SINERGI RSUD Bendan. Sehat selalu, Bunda!
                    </p>
                    <p style={{ marginTop: '24px', fontSize: '0.8rem', color: '#94a3b8' }}>Mengarahkan ke beranda dalam 5 detik...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            height: '100vh', background: '#020617', display: 'flex', flexDirection: 'column',
            overflow: 'hidden', fontFamily: "'Outfit', sans-serif"
        }}>
            {/* ═══ PREMIUM TOP NAVIGATION ═══ */}
            <div style={{
                height: '75px', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '14px', width: '44px', height: '44px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <h1 style={{ margin: 0, fontSize: '1.2rem', color: 'white', fontWeight: 800 }}>{session?.title || 'Konsultasi Online'}</h1>
                            <div style={{
                                background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444',
                                fontSize: '0.65rem', padding: '3px 10px', borderRadius: '100px',
                                border: '1px solid rgba(239, 68, 68, 0.3)', fontWeight: 800,
                                textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 4
                            }}>
                                <div style={{ width: 6, height: 6, background: '#ef4444', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                                LIVE
                            </div>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>SINERGI • RSUD BENDAN KOTA PEKALONGAN</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)',
                        padding: '8px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <Users size={18} color="rgba(255,255,255,0.6)" />
                        <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 700 }}>{participants.length + 1} Peserta</span>
                    </div>
                    {isNarasumber && (
                        <div style={{
                            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                            padding: '8px 16px', borderRadius: '14px', display: 'flex',
                            alignItems: 'center', gap: 8, boxShadow: '0 4px 15px rgba(217, 119, 6, 0.3)'
                        }}>
                            <Crown size={16} color="white" />
                            <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: 800 }}>HOST / AHLI GIZI</span>
                        </div>
                    )}
                    <button
                        onClick={toggleFullscreen}
                        style={{
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '14px', width: '44px', height: '44px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', cursor: 'pointer', transition: 'all 0.2s', marginLeft: '8px'
                        }}
                        title="Toggle Fullscreen"
                    >
                        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                </div>
            </div>

            {/* ═══ MAIN CONSULTATION ARENA (DUAL-FRAME) ═══ */}
            <div style={{ flex: 1, display: 'flex', background: '#000', padding: '12px', gap: '12px' }}>

                {/* Left Frame (Frame 1): Narasumber / Expert View Focus */}
                <div style={{
                    flex: 1, position: 'relative', borderRadius: '24px', overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.08)', background: '#020617',
                    boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column'
                }}>
                    {/* Inner Content Label */}
                    <div style={{
                        position: 'absolute', top: 16, left: 16, zIndex: 50,
                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                        padding: '6px 12px', borderRadius: '12px', color: 'white',
                        fontSize: '0.75rem', fontWeight: 800, border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'none'
                    }}>
                        <Video size={14} color="#3b82f6" /> VIDEO KONSULTASI
                    </div>

                    {/* Jitsi Engine mounts here */}
                    <div id="jitsi-arena" style={{ flex: 1, width: '100%', height: '100%' }}></div>
                </div>

                {/* Right Frame (Frame 2): Participant Info & Interaction Panel */}
                <div style={{
                    width: '380px', background: 'linear-gradient(180deg, #0F172A 0%, #020617 100%)',
                    borderRadius: '24px', display: 'flex', flexDirection: 'column',
                    border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                        <h3 style={{ margin: 0, color: 'white', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Shield size={20} color="#3b82f6" /> Panel Interaksi Peserta
                        </h3>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Medical Identity Card */}
                        <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '20px', padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' }}>
                                    <Activity size={24} color="white" />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#93C5FD', fontWeight: 800, textTransform: 'uppercase' }}>Host / Ahli Gizi</p>
                                    <p style={{ margin: 0, fontSize: '1rem', color: 'white', fontWeight: 700 }}>
                                        {session?.narasumber_name || 'Ahli Gizi RSUD Bendan'}
                                    </p>
                                </div>
                            </div>
                            <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(59,130,246,0.5), transparent)', margin: '12px 0' }}></div>
                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                                Layanan edukasi & konsultasi gizi untuk pemulihan Bunda pasca melahirkan. Silakan ikuti instruksi ahli gizi.
                            </p>
                        </div>

                        {/* Push to Talk Button for Participants */}
                        {!isNarasumber && (
                            <div style={{ marginTop: 'auto' }}>
                                <button
                                    onClick={handleRaiseHand}
                                    style={{
                                        width: '100%',
                                        background: handRaised ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'rgba(255,255,255,0.03)',
                                        border: handRaised ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                        color: 'white', padding: '24px', borderRadius: '24px',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                                        cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: handRaised ? '0 15px 30px rgba(245, 158, 11, 0.3)' : 'none',
                                        transform: handRaised ? 'scale(1.02)' : 'scale(1)'
                                    }}
                                >
                                    <div style={{
                                        width: '60px', height: '60px', borderRadius: '50%',
                                        background: handRaised ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: handRaised ? 'white' : '#94a3b8'
                                    }}>
                                        <Hand size={32} />
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ display: 'block', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
                                            {handRaised ? 'BATALKAN APPS' : 'MULAI BICARA'}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: handRaised ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                                            {handRaised ? 'Menunggu Izin Narasumber...' : 'Minta izin untuk berbicara (Silakan Angkat Tangan)'}
                                        </span>
                                    </div>
                                </button>
                            </div>
                        )}

                        {/* Admin Notification Panel */}
                        {isNarasumber && raisedHands.length > 0 && (
                            <div style={{
                                background: 'rgba(245, 158, 11, 0.1)',
                                border: '1px solid rgba(245, 158, 11, 0.2)',
                                borderRadius: '20px', padding: '20px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                    <Hand size={18} color="#F59E0B" />
                                    <h4 style={{ margin: 0, color: 'white', fontSize: '0.9rem', fontWeight: 800 }}>ANTREAN BICARA</h4>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {raisedHands.map(hand => (
                                        <div key={hand.userId} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px'
                                        }}>
                                            <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700 }}>{hand.userName}</span>
                                            <button
                                                style={{ border: 'none', background: '#3b82f6', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}
                                                onClick={() => alert(`Silakan beri instruksi lisan kepada ${hand.userName} untuk menekan tombol Mic di bawah.`)}
                                            >Persilakan</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {isNarasumber && raisedHands.length === 0 && (
                            <div style={{
                                border: '1px dashed rgba(255, 255, 255, 0.1)',
                                borderRadius: '20px', padding: '20px', textAlign: 'center'
                            }}>
                                <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 600 }}>
                                    Belum ada peserta yang mengantre bicara.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══ PREMIUM CONTROL BAR ═══ */}
            <div style={{
                height: '100px', background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(24px)',
                borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', padding: '0 32px', zIndex: 100, gap: 24, position: 'relative'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button
                            onClick={handleMicToggle}
                            style={{
                                width: '64px', height: '64px', borderRadius: '20px',
                                background: isMuted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                                border: `2px solid ${isMuted ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                                color: isMuted ? '#ef4444' : '#22c55e',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'all 0.2s', boxShadow: isMuted ? 'none' : '0 10px 20px rgba(34, 197, 94, 0.2)',
                                position: 'relative'
                            }}
                            title={isMuted ? "Nyalakan Mik" : "Matikan Mik"}
                        >
                            {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
                        </button>

                        <button
                            onClick={handleVideoToggle}
                            style={{
                                width: '64px', height: '64px', borderRadius: '20px',
                                background: isVideoOff ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                                border: `2px solid ${isVideoOff ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                                color: isVideoOff ? '#ef4444' : '#3b82f6',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'all 0.2s', boxShadow: isVideoOff ? 'none' : '0 10px 20px rgba(59, 130, 246, 0.2)'
                            }}
                            title={isVideoOff ? "Nyalakan Kamera" : "Matikan Kamera"}
                        >
                            {isVideoOff ? <VideoOff size={28} /> : <Video size={28} />}
                        </button>
                    </div>

                    <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)', margin: '0 8px' }}></div>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <button
                            onClick={() => jitsiApi?.executeCommand('toggleChat')}
                            style={{
                                width: '64px', height: '64px', borderRadius: '20px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            title="Buka Chat"
                        >
                            <MessageSquare size={26} />
                        </button>
                    </div>

                    <button
                        onClick={isNarasumber ? handleEndSession : () => navigate('/')}
                        style={{
                            background: '#ef4444', color: 'white', height: '64px', padding: '0 32px',
                            borderRadius: '20px', border: 'none', fontWeight: 900,
                            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)', transition: 'all 0.2s',
                            marginLeft: '12px'
                        }}
                    >
                        <LogOut size={24} />
                        <span>{isNarasumber ? 'AKHIRI SESI' : 'KELUAR SESI'}</span>
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
                @keyframes modalIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                #jitsi-arena iframe { border: none !important; border-radius: 24px; }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
                ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
                
                /* Custom overrides to make the arena look premium */
                body {
                    background: #020617;
                }
            `}</style>
        </div>
    );
};

export default VideoMeetingArena;
