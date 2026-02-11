// voice.js - Voice command system for emergency response

class VoiceSystem {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.finalTranscript = '';
        this.commands = {
            'emergency': this.handleEmergencyCommand,
            'help': this.handleHelpCommand,
            'choking': () => this.handleSpecificEmergency('choking'),
            'bleeding': () => this.handleSpecificEmergency('bleeding'),
            'unconscious': () => this.handleSpecificEmergency('unconscious'),
            'snake bite': () => this.handleSpecificEmergency('snake'),
            'call ambulance': this.handleCallAmbulance,
            'my location': this.handleLocation,
            'stop': this.handleStop,
            'next step': this.handleNextStep,
            'repeat': this.handleRepeat
        };
        
        this.init();
    }

    // Initialize voice recognition
    init() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.error('Speech recognition not supported in this browser');
            this.showVoiceNotSupported();
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateVoiceUI(true);
            console.log('Voice recognition started');
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    this.finalTranscript += transcript + ' ';
                    this.processCommand(this.finalTranscript.trim());
                } else {
                    interimTranscript += transcript;
                }
            }
            
            this.updateVoiceText(interimTranscript);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.handleRecognitionError(event.error);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateVoiceUI(false);
            console.log('Voice recognition ended');
        };
    }

    // Start listening for voice commands
    startListening() {
        if (!this.recognition) {
            this.showVoiceNotSupported();
            return;
        }

        try {
            this.finalTranscript = '';
            this.recognition.start();
            this.showVoiceListeningIndicator();
        } catch (error) {
            console.error('Error starting voice recognition:', error);
            this.showError('Could not start voice recognition. Please check microphone permissions.');
        }
    }

    // Stop listening
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.hideVoiceListeningIndicator();
        }
    }

    // Process voice command
    processCommand(command) {
        console.log('Voice command received:', command);
        
        const commandLower = command.toLowerCase().trim();
        
        // Check for specific commands
        for (const [key, handler] of Object.entries(this.commands)) {
            if (commandLower.includes(key)) {
                handler.call(this);
                this.showCommandFeedback(`Executing: ${key}`);
                return;
            }
        }
        
        // If no specific command, treat as emergency description
        if (commandLower.length > 3) {
            this.handleGenericEmergency(command);
        } else {
            this.showCommandFeedback('Please describe the emergency situation.');
        }
    }

    // Handle emergency command
    handleEmergencyCommand() {
        this.speak("Emergency mode activated. Please describe the situation.");
        this.showEmergencyPrompt();
    }

    // Handle help command
    handleHelpCommand() {
        const helpText = "Available voice commands: Emergency, Help, Choking, Bleeding, Unconscious, Snake bite, Call ambulance, My location, Next step, Repeat, Stop";
        this.speak(helpText);
        this.showCommandFeedback(helpText);
    }

    // Handle specific emergency
    handleSpecificEmergency(type) {
        const emergencies = {
            'choking': 'Choking emergency detected. Follow choking protocol.',
            'bleeding': 'Severe bleeding emergency. Apply direct pressure.',
            'unconscious': 'Unconscious person. Check breathing immediately.',
            'snake': 'Snake bite emergency. Keep the victim still.'
        };
        
        if (emergencies[type]) {
            this.speak(emergencies[type]);
            
            // Trigger emergency protocol
            if (window.EmergencySystem) {
                window.EmergencySystem.handleQuickEmergency({ 
                    target: { dataset: { emergency: type } } 
                });
            }
        }
    }

    // Handle call ambulance
    handleCallAmbulance() {
        this.speak("Calling emergency services. Please confirm.");
        
        if (window.EmergencySystem) {
            window.EmergencySystem.makeEmergencyCall();
        }
    }

    // Handle location sharing
    handleLocation() {
        this.speak("Sharing your location with emergency services.");
        
        if (window.EmergencySystem) {
            window.EmergencySystem.shareLocation();
        }
    }

    // Handle stop command
    handleStop() {
        this.speak("Stopping voice commands.");
        this.stopListening();
    }

    // Handle next step command
    handleNextStep() {
        this.speak("Moving to next step.");
        // Implement step navigation logic
        this.showCommandFeedback("Next step in protocol");
    }

    // Handle repeat command
    handleRepeat() {
        this.speak("Repeating the last instruction.");
        // Implement repeat logic
        this.showCommandFeedback("Repeating last instruction");
    }

    // Handle generic emergency description
    handleGenericEmergency(description) {
        this.speak(`Emergency situation detected: ${description}. Processing protocol.`);
        
        // Send to chat system
        if (window.sendMessage) {
            // Simulate sending to chat
            const input = document.getElementById('message-input');
            if (input) {
                input.value = description;
                window.sendMessage();
            }
        }
    }

    // Text-to-speech function
    speak(text, rate = 1.0) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = rate;
            utterance.pitch = 1;
            utterance.volume = 1;
            utterance.lang = 'en-US';
            
            // Stop any ongoing speech
            speechSynthesis.cancel();
            
            // Speak the text
            speechSynthesis.speak(utterance);
        }
    }

    // Update voice UI
    updateVoiceUI(isListening) {
        const voiceBtn = document.getElementById('voice-command-btn');
        const voiceIndicator = document.getElementById('voice-indicator');
        
        if (voiceBtn) {
            voiceBtn.classList.toggle('active', isListening);
            voiceBtn.innerHTML = isListening ? 
                '<i class="fas fa-microphone-slash"></i> Stop Listening' : 
                '<i class="fas fa-microphone"></i> Voice Command';
        }
        
        if (voiceIndicator) {
            voiceIndicator.classList.toggle('active', isListening);
        }
    }

    // Update voice text display
    updateVoiceText(text) {
        const voiceText = document.getElementById('voice-text-display');
        if (voiceText) {
            voiceText.textContent = text;
            voiceText.style.display = text ? 'block' : 'none';
        }
    }

    // Show voice listening indicator
    showVoiceListeningIndicator() {
        let indicator = document.getElementById('voice-listening-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'voice-listening-indicator';
            indicator.className = 'voice-listening-indicator';
            indicator.innerHTML = `
                <div class="voice-indicator-content">
                    <div class="pulse-animation"></div>
                    <div class="voice-text">Listening... Speak now</div>
                    <button class="close-voice-indicator">×</button>
                </div>
            `;
            document.body.appendChild(indicator);
            
            // Close button
            indicator.querySelector('.close-voice-indicator').addEventListener('click', () => {
                this.stopListening();
                indicator.remove();
            });
        }
        
        indicator.classList.add('active');
    }

    // Hide voice listening indicator
    hideVoiceListeningIndicator() {
        const indicator = document.getElementById('voice-listening-indicator');
        if (indicator) {
            indicator.classList.remove('active');
            setTimeout(() => indicator.remove(), 300);
        }
    }

    // Show command feedback
    showCommandFeedback(text) {
        const feedback = document.createElement('div');
        feedback.className = 'voice-feedback';
        feedback.textContent = `🎤 ${text}`;
        
        // Remove existing feedback
        const existing = document.querySelector('.voice-feedback');
        if (existing) existing.remove();
        
        document.body.appendChild(feedback);
        
        // Auto-remove
        setTimeout(() => {
            feedback.classList.add('fade-out');
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }

    // Show voice not supported message
    showVoiceNotSupported() {
        this.showError('Voice recognition is not supported in your browser. Try Chrome or Edge.');
    }

    // Handle recognition error
    handleRecognitionError(error) {
        const errorMessages = {
            'no-speech': 'No speech detected. Please try again.',
            'audio-capture': 'No microphone found. Please check your microphone.',
            'not-allowed': 'Microphone access denied. Please allow microphone access.',
            'network': 'Network error. Please check your connection.',
            'aborted': 'Voice recognition aborted.',
            'service-not-allowed': 'Voice service not allowed.'
        };
        
        const message = errorMessages[error] || 'Voice recognition error. Please try again.';
        this.showError(message);
    }

    // Show error message
    showError(message) {
        if (window.EmergencySystem) {
            window.EmergencySystem.showError(message);
        } else {
            alert(`Voice System Error: ${message}`);
        }
    }
}

// Initialize Voice System
window.VoiceSystem = new VoiceSystem();

// Voice system styles (injected dynamically)
const voiceStyles = `
.voice-listening-indicator {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(52, 152, 219, 0.95);
    color: white;
    padding: 15px;
    border-radius: 10px;
    z-index: 1000;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    transform: translateY(-100px);
    transition: transform 0.3s ease;
    max-width: 300px;
}

.voice-listening-indicator.active {
    transform: translateY(0);
}

.voice-indicator-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.pulse-animation {
    width: 20px;
    height: 20px;
    background-color: #e74c3c;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { transform: scale(0.8); opacity: 0.7; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(0.8); opacity: 0.7; }
}

.voice-text {
    font-weight: bold;
}

.close-voice-indicator {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    margin-left: auto;
}

.voice-feedback {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(46, 204, 113, 0.95);
    color: white;
    padding: 10px 20px;
    border-radius: 25px;
    z-index: 1000;
    font-weight: bold;
    animation: slideUp 0.3s ease;
}

.voice-feedback.fade-out {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
    transition: all 0.3s ease;
}

@keyframes slideUp {
    from { transform: translateX(-50%) translateY(20px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
}

#voice-command-btn.active {
    background-color: #e74c3c !important;
    animation: pulse-btn 1s infinite;
}

@keyframes pulse-btn {
    0% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
    100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = voiceStyles;
document.head.appendChild(styleSheet);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceSystem;
}

