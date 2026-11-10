import { useState, useEffect } from 'react';

export function useAppLogo() {
    const [logoUrl, setLogoUrl] = useState(() => {
        try {
            const saved = localStorage.getItem('sahabatbunda_app_settings');
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.logoUrl || null;
            }
        } catch (e) {
            console.error('Failed to get logo:', e);
        }
        return null;
    });

    useEffect(() => {
        const handleUpdate = (e) => {
            if (e?.detail?.logoUrl !== undefined) {
                setLogoUrl(e.detail.logoUrl || null);
            } else {
                try {
                    const saved = localStorage.getItem('sahabatbunda_app_settings');
                    if (saved) {
                        const parsed = JSON.parse(saved);
                        setLogoUrl(parsed.logoUrl || null);
                    } else {
                        setLogoUrl(null);
                    }
                } catch {
                    setLogoUrl(null);
                }
            }
        };

        window.addEventListener('sahabatbunda_settings_updated', handleUpdate);
        window.addEventListener('storage', handleUpdate);
        return () => {
            window.removeEventListener('sahabatbunda_settings_updated', handleUpdate);
            window.removeEventListener('storage', handleUpdate);
        };
    }, []);

    return logoUrl;
}

