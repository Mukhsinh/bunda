/**
 * Voice Utilities for Sahabat Bunda
 * Handles Text-to-Speech using Web Speech API
 */

export const speakGreeting = (text) => {
    if (!('speechSynthesis' in window)) return;

    // Wait for voices to be loaded (sometimes they load async)
    const synth = window.speechSynthesis;

    const performSpeak = () => {
        // Cancel any ongoing speech
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';

        // Find a female voice if possible
        const voices = synth.getVoices();
        // Look for Indonesian voices
        const idVoices = voices.filter(v => v.lang.includes('id') || v.lang.includes('ID'));

        if (idVoices.length > 0) {
            const femaleKeywords = ['female', 'google', 'indonesia', 'gadis', 'damayanti', 'risma', 'siti', 'ayu'];
            const femaleVoice = idVoices.find(v =>
                femaleKeywords.some(key => v.name.toLowerCase().includes(key))
            ) || idVoices[0];

            utterance.voice = femaleVoice;
        }

        // Settings for "ramah" and "ceria"
        utterance.pitch = 1.1; // Slightly higher for cheerfulness
        utterance.rate = 0.95;  // Slightly slower for better articulation
        utterance.volume = 1.0;

        synth.speak(utterance);
    };

    if (synth.getVoices().length > 0) {
        performSpeak();
    } else {
        synth.onvoiceschanged = performSpeak;
    }
};
