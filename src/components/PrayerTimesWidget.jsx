import React, { useState, useEffect, useMemo } from 'react';
import { Clock, ChevronRight } from 'lucide-react';

const PrayerTimesWidget = () => {
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const fetchPrayerTimes = async () => {
            try {
                const d = new Date();
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/1431/${year}/${month}/${day}`);
                const data = await response.json();
                if (data.status) setPrayerTimes(data.data.jadwal);
            } catch (error) {
                console.error('Error fetching prayer times:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPrayerTimes();
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const nextPrayer = useMemo(() => {
        if (!prayerTimes) return null;
        const prayers = [
            { name: 'Subuh', time: prayerTimes.subuh },
            { name: 'Dzuhur', time: prayerTimes.dzuhur },
            { name: 'Ashar', time: prayerTimes.ashar },
            { name: 'Maghrib', time: prayerTimes.maghrib },
            { name: 'Isya', time: prayerTimes.isya },
        ];
        for (const prayer of prayers) {
            const [h, m] = prayer.time.split(':').map(Number);
            const prayerDate = new Date(now);
            prayerDate.setHours(h, m, 0, 0);
            if (prayerDate > now) {
                const diff = prayerDate - now;
                const hours = Math.floor(diff / 3600000);
                const mins = Math.floor((diff % 3600000) / 60000);
                const secs = Math.floor((diff % 60000) / 1000);
                return {
                    name: prayer.name,
                    time: prayer.time,
                    countdown: `${hours > 0 ? hours + 'j ' : ''}${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`
                };
            }
        }
        return { name: 'Subuh', time: prayers[0].time, countdown: 'Besok' };
    }, [prayerTimes, now]);

    if (loading) return (
        <div style={{ margin: '0 16px', marginTop: '12px', height: '56px', background: 'rgba(255,255,255,0.4)', borderRadius: '16px' }} />
    );
    if (!prayerTimes || !nextPrayer) return null;

    const allPrayers = [
        { name: 'Subuh', time: prayerTimes.subuh },
        { name: 'Dzuhur', time: prayerTimes.dzuhur },
        { name: 'Ashar', time: prayerTimes.ashar },
        { name: 'Maghrib', time: prayerTimes.maghrib },
        { name: 'Isya', time: prayerTimes.isya },
    ];

    return (
        <div style={{ margin: '0 16px', marginTop: '12px' }}>
            <div style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                borderRadius: '16px',
                padding: '12px 14px',
                boxShadow: '0 8px 24px rgba(249, 115, 22, 0.25)',
            }}>
                {/* Main row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '36px', height: '36px',
                            background: 'rgba(255,255,255,0.25)',
                            borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Clock size={16} color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.9)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                                Sholat Berikutnya
                            </p>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                <span style={{ color: 'white', fontWeight: 800, fontSize: '16px', fontFamily: 'Outfit, sans-serif' }}>{nextPrayer.name}</span>
                                <span style={{ color: 'white', fontSize: '12px', fontWeight: 600, opacity: 0.9 }}>{nextPrayer.time}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        textAlign: 'right',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.9)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                            Hitung Mundur
                        </p>
                        <p style={{ color: 'white', fontWeight: 800, fontSize: '14px', fontFamily: 'monospace', letterSpacing: '0.05em', margin: 0 }}>
                            {nextPrayer.countdown}
                        </p>
                    </div>
                </div>

                {/* Inline times row */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginTop: '10px', paddingTop: '10px',
                    borderTop: '1px solid rgba(255,255,255,0.15)',
                }}>
                    {allPrayers.map((p, i) => {
                        const isNext = p.name === nextPrayer.name;
                        return (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: isNext ? 1 : 0.7 }}>
                                <span style={{
                                    fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em',
                                    color: isNext ? '#ffffff' : 'rgba(255,255,255,0.8)',
                                }}>{p.name}</span>
                                <span style={{
                                    fontSize: '12px', fontWeight: 800,
                                    color: 'white',
                                }}>{p.time}</span>
                                {isNext && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'white', marginTop: '2px' }} />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PrayerTimesWidget;
