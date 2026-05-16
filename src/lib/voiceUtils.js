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

        // Prioritize Indonesian voices
        const idVoices = voices.filter(v =>
            v.lang.includes('id') || v.lang.includes('ID')
        );

        // Also collect all female-sounding voices as fallback
        const allFemaleVoices = voices.filter(v =>
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('woman') ||
            v.name.toLowerCase().includes('zira') ||    // Microsoft Zira (English female)
            v.name.toLowerCase().includes('hazel') ||   // Microsoft Hazel
            v.name.toLowerCase().includes('susan')      // Microsoft Susan
        );

        if (idVoices.length > 0) {
            // Search for female Indonesian voice with expanded keywords
            const femaleKeywords = [
                'female', 'google', 'gadis', 'damayanti',
                'risma', 'siti', 'ayu', 'wanita', 'perempuan'
            ];
            const bestVoice = idVoices.find(v =>
                femaleKeywords.some(key => v.name.toLowerCase().includes(key))
            ) || idVoices[0];

            utterance.voice = bestVoice;
        } else if (allFemaleVoices.length > 0) {
            // Fallback to any female voice
            utterance.voice = allFemaleVoices[0];
        }

        // === TUNING: Santai, Ceria, Tidak Kaku ===
        utterance.pitch = 1.15;   // Sedikit lebih tinggi -> kesan ceria & semangat
        utterance.rate = 1.0;     // Kecepatan normal -> tidak terburu-buru, santai
        utterance.volume = 0.9;   // Volume sedikit dikurangi -> tidak mengejutkan

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
