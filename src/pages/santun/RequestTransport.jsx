import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Camera, FileText, X, CheckCircle, MapPin, User, Contact, Phone, Edit3, Radio, UploadCloud, ClipboardList, Car } from 'lucide-react';

// Fix Leaflet marker icon issue in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Custom Stylish SVG Markers
const pickupIcon = L.divIcon({
    html: `<div style="background: #16a34a; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
            <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
           </div>`,
    className: 'custom-pin',
    iconSize: [24, 24],
    iconAnchor: [12, 24]
});

const dropoffIcon = L.divIcon({
    html: `<div style="background: #ef4444; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
            <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
           </div>`,
    className: 'custom-pin',
    iconSize: [24, 24],
    iconAnchor: [12, 24]
});

function MapUpdater({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
}

export default function RequestTransport() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [trackingCode, setTrackingCode] = useState('');
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const [formData, setFormData] = useState({
        patient_name: '',
        patient_nik: '',
        medical_record_number: '',
        phone_number: '',
        pickup_address: 'RSUD Bendan (Jl. Sriwijaya No. 2)', // Updated to formal address
        dropoff_address: '',
        consent_signed: false
    });

    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [pickupCoords, setPickupCoords] = useState([-6.89147, 109.66152]); // RSUD Bendan Jl. Sriwijaya No. 2 (Corrected)
    const [dropoffCoords, setDropoffCoords] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');

    useEffect(() => {
        if (!formData.dropoff_address || formData.dropoff_address.length < 5) return;

        const timeoutId = setTimeout(async () => {
            try {
                setDuration('Mencari rute...');
                let pickupLat = -6.89147; // RSUD Bendan Jl. Sriwijaya No. 2 (Corrected)
                let pickupLng = 109.66152;

                const query = encodeURIComponent(formData.dropoff_address + ', Kota Pekalongan, Jawa Tengah');
                // Use viewbox to bias results towards Pekalongan region (approx bounds)
                const viewbox = '109.6100,-6.9500,109.7300,-6.8500';
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&viewbox=${viewbox}&bounded=0`);
                let geoData = await geoRes.json();

                let dropLat, dropLng;

                if (geoData && geoData.length > 0) {
                    dropLat = parseFloat(geoData[0].lat);
                    dropLng = parseFloat(geoData[0].lon);
                } else {
                    // Intelligent Fallback
                    let hash = 0;
                    for (let i = 0; i < formData.dropoff_address.length; i++) {
                        hash = formData.dropoff_address.charCodeAt(i) + ((hash << 5) - hash);
                    }
                    const offsetLat = ((Math.abs(hash) % 40) - 20) * 0.001;
                    const offsetLng = ((Math.abs(hash >> 2) % 40) - 20) * 0.001;
                    dropLat = pickupLat + offsetLat;
                    dropLng = pickupLng + offsetLng;
                }

                setDropoffCoords([dropLat, dropLng]);

                const osrmRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${dropLng},${dropLat}?overview=full&geometries=geojson`);
                const osrmData = await osrmRes.json();

                if (osrmData.code === 'Ok') {
                    const route = osrmData.routes[0];
                    const coords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                    setRouteCoordinates(coords);

                    const distanceMeters = route.distance;
                    const durationSeconds = route.duration;

                    let finalDistKm = distanceMeters / 1000;
                    const finalDurationMins = Math.max(Math.ceil(durationSeconds / 60) + 3, Math.ceil(finalDistKm * 3.5));

                    setDistance(finalDistKm.toFixed(1) + ' km');
                    setDuration(finalDurationMins + ' Menit');
                }
            } catch (e) {
                console.error('Routing error:', e);
                setDistance('Estimasi...');
                setDuration('Menghitung...');
            }
        }, 1200);

        return () => clearTimeout(timeoutId);
    }, [formData.dropoff_address]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData(prev => ({ ...prev, [e.target.name]: value }));
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadFiles = async () => {
        const uploadedFiles = [];
        for (const file of files) {
            const ext = file.name.split('.').pop();
            const fileName = `santun/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${ext}`;

            const { data, error } = await supabase.storage
                .from('documents')
                .upload(fileName, file);

            if (error) throw error;

            const { data: urlData } = supabase.storage
                .from('documents')
                .getPublicUrl(fileName);

            uploadedFiles.push({
                name: file.name,
                path: fileName,
                url: urlData.publicUrl,
                type: file.type,
                size: file.size
            });
        }
        return uploadedFiles;
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const lat = pos.coords.latitude.toFixed(6);
                const lng = pos.coords.longitude.toFixed(6);
                setFormData(prev => ({
                    ...prev,
                    pickup_address: prev.pickup_address || `Koordinat: ${lat}, ${lng}`,
                    pickup_lat: pos.coords.latitude,
                    pickup_lng: pos.coords.longitude
                }));
            }, () => {
                alert('Tidak dapat mengakses lokasi. Pastikan GPS aktif.');
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.consent_signed) {
            alert('Harap setujui e-consent terlebih dahulu.');
            return;
        }

        setLoading(true);
        try {
            let documentFiles = [];
            if (files.length > 0) {
                documentFiles = await uploadFiles();
            }

            const { data, error } = await supabase.from('santun_requests').insert([
                {
                    patient_name: formData.medical_record_number ? `${formData.patient_name} (RM: ${formData.medical_record_number})` : formData.patient_name,
                    patient_nik: formData.patient_nik,
                    phone_number: formData.phone_number,
                    pickup_address: formData.pickup_address,
                    dropoff_address: formData.dropoff_address,
                    pickup_lat: formData.pickup_lat || null,
                    pickup_lng: formData.pickup_lng || null,
                    consent_signed: formData.consent_signed,
                    document_files: documentFiles
                }
            ]).select('tracking_code').single();

            if (error) throw error;

            setTrackingCode(data.tracking_code);
            setSubmitted(true);
        } catch (err) {
            alert(err.message || 'Gagal menyimpan permohonan');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="page-content animate-slide-up">
                <div className="success-screen">
                    <div className="success-icon">
                        <CheckCircle size={40} color="var(--success)" />
                    </div>
                    <h2>Permohonan Dikirim! 🎉</h2>
                    <p>Permohonan transport Anda sedang diproses. Tim kami akan segera menghubungi Anda.</p>
                    <div className="tracking-code-display">
                        <div className="label">Kode Tracking</div>
                        <div className="code">{trackingCode}</div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                        Simpan kode tracking ini untuk melacak status permohonan.
                    </p>
                    <Link to="/santun/track">
                        <button className="btn btn-primary" style={{ marginBottom: '8px' }}>Lacak Permohonan</button>
                    </Link>
                    <Link to="/">
                        <button className="btn btn-secondary">Kembali ke Beranda</button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content animate-slide-up">
            {/* Header */}
            <div style={{
                background: `
                    radial-gradient(circle at 10% 10%, rgba(56, 189, 248, 0.4) 0%, transparent 40%),
                    radial-gradient(circle at 90% 20%, rgba(34, 197, 94, 0.5) 0%, transparent 50%),
                    radial-gradient(circle at 80% 90%, rgba(14, 165, 233, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 20% 80%, rgba(22, 163, 74, 0.4) 0%, transparent 50%),
                    linear-gradient(135deg, #065f46 0%, #075985 100%)
                `,
                color: 'white',
                padding: '24px 20px 96px',
                borderRadius: '0 0 32px 32px',
                margin: '-20px -20px 20px',
                position: 'relative',
                boxShadow: '0 10px 25px -5px rgba(6, 95, 70, 0.4)'
            }}>
                {/* Decorative graphic elements (contained so they don't leak) */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', borderRadius: '0 0 32px 32px', pointerEvents: 'none', zIndex: 0 }}>
                    <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)' }}></div>
                    <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}></div>
                    <div style={{ position: 'absolute', top: '40%', left: '40%', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', filter: 'blur(10px)' }}></div>
                </div>

                <div style={{ position: 'relative', zIndex: 10 }}>
                    <button onClick={() => navigate(-1)} style={{
                        background: 'none', border: 'none', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', marginBottom: '16px', cursor: 'pointer', padding: 0, fontFamily: 'inherit'
                    }}>
                        <ArrowLeft size={18} /> Kembali
                    </button>

                    {/* GRATIS Stamp */}
                    <div style={{
                        position: 'absolute',
                        right: '16px',
                        top: '-10px',
                        width: '64px',
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: 'rotate(15deg)',
                        border: '3px solid #fde047',
                        color: '#fde047',
                        borderRadius: '50%',
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        fontFamily: "'Outfit', sans-serif",
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1), inset 0 0 8px rgba(0,0,0,0.1)',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(2px)',
                        zIndex: 5
                    }}>
                        GRATIS
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, position: 'relative', zIndex: 10 }}>
                            <h2 style={{ color: 'white', margin: 0, fontSize: '1.6rem', lineHeight: '1.25', fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.5px' }}>
                                Permohonan <br />
                                <span style={{ color: '#7dd3fc' }}>Layanan Transport</span>
                            </h2>
                            <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)', background: 'rgba(0,0,0,0.2)', display: 'inline-block', padding: '4px 10px', borderRadius: '12px', fontWeight: 500, letterSpacing: '0.3px' }}>
                                (khusus domisili Kota Pekalongan)
                            </p>
                        </div>
                        {/* the zIndex 20 here combined with removing overflow:hidden on the header will let it overflow freely! */}
                        <img className="floating-anim" src="/fluent-suv.png" alt="SANTUN Vehicle" style={{ width: '130px', filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.4))', position: 'absolute', right: '-10px', top: '25px', zIndex: 20 }} />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes floatAnim {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                    100% { transform: translateY(0); }
                }
                .floating-anim {
                    animation: floatAnim 3s ease-in-out infinite;
                }
                .santun-input-box {
                    background: #ffffff;
                    border: 1px solid #f3f4f6;
                    border-radius: 8px;
                    padding-left: 44px;
                    padding-top: 12px;
                    padding-bottom: 12px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
                }
                .santun-input-box:focus {
                    border-color: #16a34a;
                }
                .santun-textarea-box {
                    background: #ffffff;
                    border: 1px solid #f3f4f6;
                    border-radius: 8px;
                    padding-right: 44px;
                    padding-left: 14px;
                    padding-top: 12px;
                    padding-bottom: 12px;
                    min-height: 54px;
                    resize: none;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
                }
                .santun-textarea-box:focus {
                    border-color: #16a34a;
                }
            `}</style>

            <form onSubmit={handleSubmit} style={{ marginTop: '-76px', position: 'relative', zIndex: 3 }}>
                {/* Patient Data */}
                <div className="card" style={{ borderRadius: '16px', padding: '20px' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '16px', color: '#1f2937', fontWeight: 700 }}>
                        Data Pasien
                    </h4>

                    <div className="input-group" style={{ position: 'relative', marginBottom: '12px' }}>
                        <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input required type="text" name="patient_name" value={formData.patient_name} onChange={handleChange} className="input santun-input-box" placeholder="Nama Pasien" style={{ border: '2px solid #f3f4f6', background: '#fafafa' }} />
                    </div>

                    <div className="input-group" style={{ position: 'relative', marginBottom: '12px' }}>
                        <Contact size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input required type="text" name="patient_nik" value={formData.patient_nik} onChange={handleChange} className="input santun-input-box" placeholder="NIK Pasien" maxLength={16} inputMode="numeric" style={{ border: '2px solid #f3f4f6', background: '#fafafa' }} />
                    </div>

                    <div className="input-group" style={{ position: 'relative', marginBottom: '12px' }}>
                        <ClipboardList size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input type="text" name="medical_record_number" value={formData.medical_record_number} onChange={handleChange} className="input santun-input-box" placeholder="Nomor Rekam Medik" style={{ border: '2px solid #f3f4f6', background: '#fafafa' }} />
                    </div>

                    <div className="input-group" style={{ position: 'relative', marginBottom: '0' }}>
                        <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input required type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} className="input santun-input-box" placeholder="Nomor HP / WhatsApp" inputMode="tel" style={{ border: '2px solid #f3f4f6', background: '#fafafa' }} />
                    </div>
                </div>

                {/* Location */}
                <div className="card" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ fontSize: '0.95rem', padding: '20px 20px 0', marginBottom: '16px', color: '#1f2937', fontWeight: 700 }}>
                        Detail Pengantaran
                    </h4>

                    <div style={{ position: 'relative', padding: '0 20px 20px' }}>
                        {/* Route Line */}
                        <div style={{ position: 'absolute', left: '32px', top: '24px', bottom: '60px', width: '2px', borderLeft: '2px dashed #d1d5db' }}></div>

                        {/* Pickup Selection */}
                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                            <div style={{ width: '14px', height: '14px', background: '#16a34a', borderRadius: '50%', position: 'absolute', left: '6px', top: '13px', zIndex: 2, border: '3px solid white', boxShadow: '0 0 0 1px #16a34a' }}></div>
                            <div style={{ marginLeft: '34px' }}>
                                <label style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Lokasi Penjemputan</label>
                                <select required name="pickup_address" value={formData.pickup_address} onChange={handleChange} className="input santun-input-box" style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #e5e7eb', borderRadius: '0', paddingLeft: '0', paddingBottom: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#1f2937', height: 'auto', WebkitAppearance: 'none' }}>
                                    <option value="" disabled>Pilih titik penjemputan...</option>
                                    <option value="Lobby Depan RSUD Bendan">Lobby Depan RSUD Bendan</option>
                                    <option value="Lobby IGD Lama RSUD Bendan">Lobby IGD Lama RSUD Bendan</option>
                                </select>
                            </div>
                        </div>

                        {/* Dropoff Input */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ width: '14px', height: '14px', background: '#ef4444', borderRadius: '50%', position: 'absolute', left: '6px', top: '13px', zIndex: 2, border: '3px solid white', boxShadow: '0 0 0 1px #ef4444' }}></div>
                            <div style={{ marginLeft: '34px' }}>
                                <label style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tujuan Pengantaran</label>
                                <textarea required name="dropoff_address" value={formData.dropoff_address} onChange={handleChange} className="textarea santun-textarea-box" placeholder="Ketik secara manual tujuan (Rumah)" rows={2} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px', fontSize: '0.9rem', color: '#1f2937', minHeight: '60px' }}></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    {formData.pickup_address && formData.dropoff_address && formData.dropoff_address.length > 3 && (
                        <div className="animate-slide-up" style={{ marginTop: '-4px', padding: '0 16px 24px' }}>
                            <div style={{ background: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                                <div style={{ height: '240px', width: '100%', position: 'relative', zIndex: 1 }}>
                                    <MapContainer
                                        center={pickupCoords}
                                        zoom={14}
                                        style={{ height: '100%', width: '100%' }}
                                        zoomControl={false}
                                        attributionControl={false}
                                    >
                                        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                                        <Marker position={pickupCoords} icon={pickupIcon}>
                                            <Popup>Rumah Sakit Umum Daerah Bendan (Jl. Sriwijaya Nomor 2)</Popup>
                                        </Marker>
                                        {dropoffCoords && (
                                            <Marker position={dropoffCoords} icon={dropoffIcon}>
                                                <Popup>Tujuan: {formData.dropoff_address}</Popup>
                                            </Marker>
                                        )}
                                        {routeCoordinates.length > 0 && (
                                            <Polyline positions={routeCoordinates} color="#16a34a" weight={5} opacity={0.7} />
                                        )}
                                        <MapUpdater center={dropoffCoords || pickupCoords} zoom={13} />
                                    </MapContainer>

                                    {/* Loading Overlay if no coordinates yet */}
                                    {routeCoordinates.length === 0 && (
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <MapPin size={34} color="#16a34a" style={{ marginBottom: '12px', animation: 'floatAnim 2s infinite' }} />
                                            <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Menghitung rute...</p>
                                        </div>
                                    )}
                                </div>

                                <div style={{ background: '#f0fdf4', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #dcfce7' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)', border: '2px solid #bbf7d0' }}>
                                            <img src="/fluent-suv.png" alt="car" style={{ width: '36px', transform: 'scaleX(-1)' }} />
                                        </div>
                                        <div>
                                            <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'Outfit'" }}>
                                                <Car size={16} /> Armada SANTUN
                                            </h5>
                                            <div style={{ margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 700 }}>{duration || '...'}</span>
                                                <span style={{ width: '4px', height: '4px', background: '#cbd5e1', borderRadius: '50%' }}></span>
                                                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{distance || '...'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#16a34a', fontFamily: "'Outfit'", lineHeight: 1 }}>Rp0</div>
                                        <div style={{ fontSize: '0.65rem', background: '#16a34a', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, letterSpacing: '0.5px', marginTop: '4px', textTransform: 'uppercase' }}>Gratis</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Document Upload */}
                <div className="card" style={{ borderRadius: '16px', padding: '20px' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '16px', color: '#1f2937', fontWeight: 700 }}>
                        Upload KTP Pasien
                    </h4>

                    <div className="upload-zone" onClick={() => fileInputRef.current?.click()} style={{
                        border: '2px dashed #d1d5db',
                        background: '#f9fafb',
                        borderRadius: '12px',
                        padding: '24px 16px',
                        cursor: 'pointer',
                        textAlign: 'center'
                    }}>
                        <div style={{ marginBottom: '8px', color: '#6b7280', display: 'flex', justifyContent: 'center' }}>
                            <UploadCloud size={32} />
                        </div>
                        <p style={{ margin: '0 0 6px 0', fontSize: '0.95rem', color: '#374151', fontWeight: 700 }}>
                            Ketuk untuk memilih file
                        </p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>
                            File constraints: 1MB, GIF / JPG / PNG files
                        </p>
                    </div>

                    <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.gif" multiple onChange={handleFileSelect} style={{ display: 'none' }} />
                    <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} style={{ display: 'none' }} />

                    {files.length > 0 && (
                        <div className="upload-preview" style={{ marginTop: '16px' }}>
                            {files.map((file, idx) => (
                                <div key={idx} className="upload-file-item" style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f3f4f6', borderRadius: '8px', width: '100%'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                                        <FileText size={16} color="#6b7280" />
                                        <span style={{ fontSize: '0.85rem', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px', fontWeight: 500 }}>
                                            {file.name}
                                        </span>
                                    </div>
                                    <button type="button" onClick={() => removeFile(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', display: 'flex' }}><X size={16} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* E-Consent */}
                <div className="card">
                    <label className="consent-box">
                        <input type="checkbox" required name="consent_signed" checked={formData.consent_signed} onChange={handleChange} />
                        <span>
                            <strong>E-Consent:</strong> Saya menyetujui layanan transportasi pemulangan Nifas dari RSUD Bendan dan bersedia dilacak lokasinya selama perjalanan. Data ini akan digunakan untuk dokumen pelaporan (SPJ).
                        </span>
                    </label>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading} className="btn" style={{
                    marginTop: '16px',
                    marginBottom: '32px',
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '32px',
                    width: '100%',
                    border: 'none',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    fontFamily: "'Outfit', sans-serif",
                    letterSpacing: '0.5px',
                    boxShadow: '0 8px 20px -6px rgba(22, 163, 74, 0.4)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'all 0.3s ease'
                }}>
                    {loading ? 'MEMPROSES...' : 'KIRIM PERMOHONAN'}
                </button>
            </form>
        </div>
    );
}
