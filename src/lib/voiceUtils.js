/**
 * Voice Utilities for Sahabat Bunda
 * Handles Text-to-Speech using Web Speech API
 * Suara: ramah, ceria, santai, menyenangkan
 */

let hasSpoken = {};  // Track which pages have already spoken

export const speakGreeting = (text) => {
    if (!('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;

    const performSpeak = () => {
        // Cancel any ongoing speech
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';

        // Find the best Indonesian female voice
        const voices = synth.getVoices();

        // Filter Indonesian voices
        const idVoices = voices.filter(v =>
            v.lang.includes('id') || v.lang.includes('ID')
        );

        if (idVoices.length > 0) {
            // Search for female Indonesian voice with expanded keywords
            // Google Bahasa Indonesia is usually the best/friendliest one in Chrome
            const femaleKeywords = [
                'google bahasa indonesia', 'gadis', 'damayanti',
                'risma', 'siti', 'ayu', 'wanita', 'perempuan', 'female'
            ];

            // Try to find the absolute best match first (Google Bahasa Indonesia)
            const bestVoice = idVoices.find(v =>
                v.name.toLowerCase().includes('google bahasa indonesia')
            ) || idVoices.find(v =>
                femaleKeywords.some(key => v.name.toLowerCase().includes(key))
            ) || idVoices[0];

            utterance.voice = bestVoice;
        }

        // === TUNING: Ramah, Ceria, dan Bersemangat ===
        utterance.pitch = 1.25;   // Lebih tinggi sedikit dari 1.15 untuk kesan lebih ceria (cheerful)
        utterance.rate = 1.05;    // Sedikit lebih cepat (tidak kaku) tapi tetap santai
        utterance.volume = 1.0;   // Volume penuh

        synth.speak(utterance);
    };

    // Wait for voices to load
    if (synth.getVoices().length > 0) {
        performSpeak();
    } else {
        synth.onvoiceschanged = () => {
            performSpeak();
        };
    }
};

/**
 * Reset tracking for a specific page (used when navigating away)
 */
export const resetSpokenPage = (path) => {
    delete hasSpoken[path];
};
