// ===== HYBRID EMERGENCY RESPONDER =====
console.log('🚑 Emergency Responder loading...');

class EmergencyResponder {
    constructor() {
        console.log('🏥 Initializing Emergency Responder...');
        
        // DOM Elements
        this.messageInput = document.getElementById('message-input');
        this.sendBtn = document.getElementById('send-btn');
        this.handsfreeBtn = document.getElementById('handsfree-btn');
        this.chatHistoryEl = document.getElementById('chat-history');
        this.closeCameraBtn = document.getElementById('close-camera');
        this.guideContent = document.getElementById('guide-content');
        
        // App State
        this.sessionId = null;
        this.chatHistory = [];
        this.isHandsfreeMode = false;
        this.isListening = false;
        this.recognition = null;
        this.isProcessing = false;
        this.currentEmergencyType = null;
        this.isCasualMode = true;
        this.synthesis = window.speechSynthesis;
        this.lastVoiceCommand = '';
        
        // Initialize
        this.initializeSession();
        this.initializeVoiceRecognition();
        this.loadInitialMessages();
        this.setupEventListeners();
        this.addAnimationsCSS();
        
        console.log('✅ Emergency Responder initialized');
    }
    
    // ===== INITIALIZATION =====
    initializeSession() {
        this.sessionId = localStorage.getItem('emergency_session_id');
        if (!this.sessionId) {
            this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('emergency_session_id', this.sessionId);
        }
        console.log('Emergency Session ID:', this.sessionId);
    }
    
    initializeVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateHandsfreeUI(true);
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.lastVoiceCommand = transcript;
                this.processVoiceCommand(transcript);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Voice recognition error:', event.error);
                this.isListening = false;
                this.updateHandsfreeUI(false);
                
                if (this.isHandsfreeMode) {
                    this.showHandsfreeFeedback('Voice input failed. Try again.', 'error');
                    setTimeout(() => this.startListening(), 1000);
                }
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                this.updateHandsfreeUI(false);
                
                if (this.isHandsfreeMode && !this.isProcessing) {
                    setTimeout(() => this.startListening(), 500);
                }
            };
        } else {
            console.warn('Speech recognition not supported');
            this.handsfreeBtn.disabled = true;
            this.handsfreeBtn.title = 'Voice not supported in this browser';
        }
    }
    
    setupEventListeners() {
        // Send button
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Enter key in input
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Handsfree toggle
        this.handsfreeBtn.addEventListener('click', () => this.toggleHandsfreeMode());
        
        // Camera toggle
        if (this.closeCameraBtn) {
            this.closeCameraBtn.addEventListener('click', () => {
                if (window.CameraSystem && window.CameraSystem.stopCamera) {
                    window.CameraSystem.stopCamera();
                }
            });
        }
        
        // Focus on input after load
        setTimeout(() => {
            if (!this.isHandsfreeMode && this.messageInput) {
                this.messageInput.focus();
            }
        }, 1000);
    }
    
    // ===== HANDSFREE MODE =====
    toggleHandsfreeMode() {
        if (!this.recognition && !this.isHandsfreeMode) {
            this.addMessageToChat('system', 'Voice recognition not supported. Please use text input.');
            return;
        }
        
        this.isHandsfreeMode = !this.isHandsfreeMode;
        
        if (this.isHandsfreeMode) {
            this.enterHandsfreeMode();
        } else {
            this.exitHandsfreeMode();
        }
    }
    
    enterHandsfreeMode() {
        document.body.classList.add('handsfree-mode');
        this.handsfreeBtn.classList.add('handsfree-active');
        this.handsfreeBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        this.handsfreeBtn.title = 'Exit Handsfree Mode';
        
        this.messageInput.style.display = 'none';
        this.sendBtn.style.display = 'none';
        
        this.showHandsfreeOverlay();
        this.startListening();
        
        this.speak('Handsfree mode activated. I\'m listening. Describe your emergency.');
        this.addMessageToChat('system', '🎤 <strong>Handsfree Mode Activated</strong><br>Speak your emergency or say "help" for commands.');
    }
    
    exitHandsfreeMode() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
        
        document.body.classList.remove('handsfree-mode');
        this.handsfreeBtn.classList.remove('handsfree-active');
        this.handsfreeBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        this.handsfreeBtn.title = 'Enter Handsfree Mode';
        
        this.messageInput.style.display = 'block';
        this.sendBtn.style.display = 'flex';
        
        this.hideHandsfreeOverlay();
        
        setTimeout(() => {
            if (this.messageInput) this.messageInput.focus();
        }, 100);
        
        this.addMessageToChat('system', '📝 <strong>Text Mode Activated</strong><br>You can now type your messages.');
        this.speak('Exiting handsfree mode. You can now type your messages.');
    }
    
    startListening() {
        if (!this.recognition || this.isListening || !this.isHandsfreeMode) return;
        
        try {
            this.recognition.start();
        } catch (error) {
            console.error('Error starting recognition:', error);
            setTimeout(() => {
                if (this.isHandsfreeMode) this.startListening();
            }, 1000);
        }
    }
    
    processVoiceCommand(transcript) {
        if (!transcript.trim()) return;
        
        this.addMessageToChat('user', transcript);
        this.showHandsfreeFeedback(`Heard: "${transcript}"`, 'success');
        
        const lowerTranscript = transcript.toLowerCase();
        
        // Voice commands
        if (lowerTranscript.includes('exit') || lowerTranscript.includes('stop') || lowerTranscript.includes('quit')) {
            this.speak('Exiting handsfree mode.');
            this.exitHandsfreeMode();
            return;
        }
        
        if (lowerTranscript.includes('help') || lowerTranscript.includes('commands')) {
            this.showVoiceCommandsHelp();
            return;
        }
        
        if (lowerTranscript.includes('repeat') || lowerTranscript.includes('say again')) {
            this.repeatLastMessage();
            return;
        }
        
        if (lowerTranscript.includes('next') || lowerTranscript.includes('continue')) {
            this.processNextStep();
            return;
        }
        
        // Process as regular message
        this.processMessage(transcript, true);
    }
    
    showVoiceCommandsHelp() {
        const helpText = `
            <strong>Voice Commands Available:</strong><br><br>
            • <strong>"Emergency"</strong> - Activate emergency protocol<br>
            • <strong>"Help"</strong> - Show voice commands<br>
            • <strong>"Repeat"</strong> - Repeat last instruction<br>
            • <strong>"Next"</strong> - Move to next step<br>
            • <strong>"Stop" or "Exit"</strong> - Exit handsfree mode
        `;
        
        this.addMessageToChat('system', helpText);
        
        this.speak('Voice commands available. Say Emergency for emergency protocol, Help for commands, Repeat to hear last instruction, Next for next step, or Exit to leave handsfree mode.');
    }
    
    repeatLastMessage() {
        const systemMessages = this.chatHistory.filter(msg => msg.sender === 'system');
        if (systemMessages.length > 0) {
            const lastMessage = systemMessages[systemMessages.length - 1].message;
            const cleanMessage = lastMessage.replace(/<[^>]*>/g, ' ').trim();
            this.speak(cleanMessage);
            this.showHandsfreeFeedback('Repeating last message', 'info');
        } else {
            this.speak('No previous message to repeat.');
        }
    }
    
    processNextStep() {
        if (this.currentEmergencyType) {
            this.addMessageToChat('user', 'Next step');
            this.processMessage('next step', true);
        } else {
            this.speak('No active emergency protocol. Please describe the situation first.');
        }
    }
    
    // ===== SPEECH FUNCTIONS =====
    speak(text, rate = 1.0) {
        if (!this.synthesis || !text) return;
        
        this.synthesis.cancel();
        
        const cleanText = text
            .replace(/<[^>]*>/g, ' ')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\n/g, '. ')
            .trim();
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = rate;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.lang = 'en-US';
        
        const voices = this.synthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang === 'en-US') || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
        
        utterance.onstart = () => {
            this.updateSpeakingUI(true);
        };
        
        utterance.onend = () => {
            this.updateSpeakingUI(false);
        };
        
        this.synthesis.speak(utterance);
    }
    
    // ===== QUICK RESPONSE BUTTONS =====
    addQuickResponseButtons(buttons) {
        const messageContainer = this.chatHistoryEl.querySelector('.message-container');
        if (!messageContainer) return;
        
        // Remove existing quick buttons
        const existingButtons = document.querySelectorAll('.quick-response-buttons');
        existingButtons.forEach(btn => btn.remove());
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'quick-response-buttons';
        buttonsContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
            margin-bottom: 15px;
            animation: fadeIn 0.3s ease;
        `;
        
        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.className = 'quick-response-btn';
            btn.innerHTML = button.icon ? `<i class="${button.icon}"></i> ${button.text}` : button.text;
            btn.style.cssText = `
                padding: 8px 15px;
                background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
                color: white;
                border: none;
                border-radius: 20px;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 6px;
            `;
            
            btn.addEventListener('mouseover', () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            });
            
            btn.addEventListener('mouseout', () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = 'none';
            });
            
            btn.addEventListener('click', () => {
                if (this.messageInput) {
                    this.messageInput.value = button.value;
                    this.sendMessage();
                }
            });
            
            buttonsContainer.appendChild(btn);
        });
        
        messageContainer.appendChild(buttonsContainer);
        
        // Scroll to show buttons
        setTimeout(() => {
            this.chatHistoryEl.scrollTo({
                top: this.chatHistoryEl.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    }
    
    // ===== UI UPDATES =====
    updateHandsfreeUI(isListening) {
        if (!this.isHandsfreeMode) return;
        
        const pulseElement = document.querySelector('.handsfree-pulse-inner');
        if (pulseElement) {
            pulseElement.innerHTML = isListening ? 
                '<i class="fas fa-microphone"></i>' : 
                '<i class="fas fa-headphones"></i>';
        }
        
        const statusElement = document.querySelector('.handsfree-status');
        if (statusElement) {
            statusElement.textContent = isListening ? 'Listening... Speak now' : 'Processing...';
        }
    }
    
    updateSpeakingUI(isSpeaking) {
        if (!this.isHandsfreeMode) return;
        
        const pulseElement = document.querySelector('.handsfree-pulse-inner');
        if (pulseElement) {
            if (isSpeaking) {
                pulseElement.innerHTML = '<i class="fas fa-volume-up"></i>';
                pulseElement.parentElement.style.background = 'rgba(59, 130, 246, 0.3)';
                pulseElement.style.background = '#3b82f6';
            } else {
                pulseElement.innerHTML = '<i class="fas fa-microphone"></i>';
                pulseElement.parentElement.style.background = 'rgba(16, 185, 129, 0.3)';
                pulseElement.style.background = '#10b981';
            }
        }
    }
    
    showHandsfreeOverlay() {
        this.hideHandsfreeOverlay();
        
        const overlay = document.createElement('div');
        overlay.className = 'handsfree-overlay';
        overlay.id = 'handsfree-overlay';
        
        overlay.innerHTML = `
            <button class="close-handsfree" title="Exit Handsfree Mode">
                <i class="fas fa-times"></i>
            </button>
            <div class="handsfree-listening">
                <div class="handsfree-pulse">
                    <div class="handsfree-pulse-inner">
                        <i class="fas fa-microphone"></i>
                    </div>
                </div>
                <h3>🎤 Handsfree Mode Active</h3>
                <p class="handsfree-status">Listening... Speak your emergency</p>
                <div class="handsfree-feedback"></div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        overlay.querySelector('.close-handsfree').addEventListener('click', () => {
            this.exitHandsfreeMode();
        });
    }
    
    hideHandsfreeOverlay() {
        const overlay = document.getElementById('handsfree-overlay');
        if (overlay) overlay.remove();
    }
    
    showHandsfreeFeedback(message, type = 'info') {
        if (!this.isHandsfreeMode) return;
        
        const feedbackEl = document.querySelector('.handsfree-feedback');
        if (!feedbackEl) return;
        
        feedbackEl.textContent = message;
        feedbackEl.className = `handsfree-feedback ${type}`;
        
        setTimeout(() => {
            feedbackEl.textContent = '';
            feedbackEl.className = 'handsfree-feedback';
        }, 3000);
    }
    
    // ===== MESSAGE PROCESSING =====
    async processMessage(message, fromVoice = false) {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        
        if (!fromVoice) {
            this.showTypingIndicator();
        }
        
        try {
            const response = await fetch('/send_message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: message,
                    session_id: this.sessionId 
                })
            });
            
            const data = await response.json();
            
            this.removeTypingIndicator();
            
            if (data.status === 'success') {
                this.addMessageToChat('system', data.response);
                
                if (data.emergency_type && data.emergency_type !== 'casual') {
                    this.currentEmergencyType = data.emergency_type;
                    this.isCasualMode = false;
                    await this.updateVisualGuide(data.emergency_type);
                } else if (this.isCasualMode) {
                    this.showCasualVisualGuide();
                }
                
                if (this.isHandsfreeMode && fromVoice) {
                    const cleanResponse = data.response
                        .replace(/<[^>]*>/g, ' ')
                        .replace(/\*\*(.*?)\*\*/g, '$1')
                        .replace(/\n/g, '. ')
                        .trim();
                    
                    if (cleanResponse.length > 200) {
                        const sentences = cleanResponse.match(/[^.!?]+[.!?]+/g) || [cleanResponse];
                        for (let sentence of sentences) {
                            this.speak(sentence);
                        }
                    } else {
                        this.speak(cleanResponse);
                    }
                }
                
                if (data.session_id && data.session_id !== this.sessionId) {
                    this.sessionId = data.session_id;
                    localStorage.setItem('emergency_session_id', this.sessionId);
                }
                
                this.saveChatHistory();
            } else {
                this.addMessageToChat('system', 'Error. Please try again.');
                if (this.isHandsfreeMode && fromVoice) {
                    this.speak('Sorry, there was an error. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            this.removeTypingIndicator();
            this.addMessageToChat('system', 'Connection error. Please check your internet.');
            if (this.isHandsfreeMode && fromVoice) {
                this.speak('Network error. Please check your connection.');
            }
        }
        
        this.isProcessing = false;
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        this.processMessage(message, false);
        this.messageInput.value = '';
    }
    
    // ===== VISUAL GUIDE FUNCTIONS =====
    async updateVisualGuide(emergencyType) {
        if (!this.guideContent) return;
        
        try {
            const response = await fetch(`/get_emergency_images/${emergencyType}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                this.displayEmergencyImages(data.images, emergencyType);
            } else {
                this.displayDefaultImages();
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            this.displayDefaultImages();
        }
    }
    
    showCasualVisualGuide() {
        if (!this.guideContent) return;
        
        const casualImages = [
            { filename: 'person calling emergencyy.jpg', title: 'Emergency Ready', description: 'Always call 108/112 for emergencies' },
            { filename: 'cpr being performed.jpg', title: 'First Aid Knowledge', description: 'Basic first aid saves lives' },
            { filename: 'recovery position.jpg', title: 'Safety First', description: 'Be prepared for emergencies' }
        ];
        
        let html = '<div class="guide-title">Safety & Emergency Info</div>';
        
        casualImages.forEach((image, index) => {
            html += `
                <div class="guide-step">
                    <div class="step-header">
                        <span class="step-number">${index + 1}</span>
                        <span class="step-title">${image.title}</span>
                    </div>
                    <img src="/static/images/${image.filename}" alt="${image.title}" 
                         class="step-image" 
                         onerror="this.onerror=null; this.src='/static/images/person calling emergencyy.jpg';">
                    <div class="step-description">${image.description}</div>
                </div>
            `;
        });
        
        this.guideContent.innerHTML = html;
    }
    
    displayEmergencyImages(images, emergencyType) {
        this.guideContent.innerHTML = '';
        
        let title = '';
        if (emergencyType === 'road_accident') {
            title = '🚗 ROAD ACCIDENT - Visual Guide';
        } else {
            title = `${emergencyType.toUpperCase()} - Visual Guide`;
        }
        
        let html = `<div class="guide-title">${title}</div>`;
        
        images.forEach((image, index) => {
            html += `
                <div class="guide-step">
                    <div class="step-header">
                        <span class="step-number">${index + 1}</span>
                        <span class="step-title">${image.title}</span>
                    </div>
                    <img src="/static/images/${image.filename}" alt="${image.title}" 
                         class="step-image" 
                         onerror="this.onerror=null; this.src='/static/images/person calling emergencyy.jpg';">
                    <div class="step-description">${image.description}</div>
                </div>
            `;
        });
        
        this.guideContent.innerHTML = html;
    }
    
    displayDefaultImages() {
        this.guideContent.innerHTML = '';
        
        const defaultImages = [
            { filename: 'person calling emergencyy.jpg', title: 'Call Emergency', description: 'Always call 108/112 first' },
            { filename: 'cpr being performed.jpg', title: 'Check Responsiveness', description: 'Tap shoulders, shout for response' },
            { filename: 'recovery position.jpg', title: 'Recovery Position', description: 'For unconscious breathing person' }
        ];
        
        let html = '<div class="guide-title">Emergency Visual Guide</div>';
        
        defaultImages.forEach((image, index) => {
            html += `
                <div class="guide-step">
                    <div class="step-header">
                        <span class="step-number">${index + 1}</span>
                        <span class="step-title">${image.title}</span>
                    </div>
                    <img src="/static/images/${image.filename}" alt="${image.title}" 
                         class="step-image" 
                         onerror="this.onerror=null; this.style.display='none'">
                    <div class="step-description">${image.description}</div>
                </div>
            `;
        });
        
        this.guideContent.innerHTML = html;
    }
    
    // ===== CHAT FUNCTIONS =====
    addMessageToChat(sender, message) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const messageId = Date.now();
        
        const messageObj = {
            id: messageId,
            sender: sender,
            message: message,
            timestamp: timestamp
        };
        
        this.chatHistory.push(messageObj);
        this.displayMessage(messageObj);
    }
    
    displayMessage(messageObj) {
        const messageContainer = this.chatHistoryEl.querySelector('.message-container');
        if (!messageContainer) {
            const container = document.createElement('div');
            container.className = 'message-container';
            this.chatHistoryEl.appendChild(container);
            this.displayMessage(messageObj);
            return;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `${messageObj.sender}-message`;
        messageDiv.id = `msg-${messageObj.id}`;
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${messageObj.sender === 'system' ? 'Assistant' : 'You'}</span>
                <span class="message-time">${messageObj.timestamp}</span>
            </div>
            <div class="message-content">${this.formatMessage(messageObj.message)}</div>
        `;
        
        messageContainer.appendChild(messageDiv);
        
        setTimeout(() => {
            this.chatHistoryEl.scrollTo({
                top: this.chatHistoryEl.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    }
    
    formatMessage(text) {
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        
        formatted = formatted.replace(/(STEP\s*\d+[:.]?)/gi, '<strong>$1</strong>');
        formatted = formatted.replace(/(Step\s*\d+:)/gi, '<strong>$1</strong>');
        
        return formatted;
    }
    
    showTypingIndicator() {
        const messageContainer = this.chatHistoryEl.querySelector('.message-container');
        if (!messageContainer) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'system-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-header">
                <span class="message-sender">Assistant</span>
            </div>
            <div class="message-content">Thinking<span class="typing-dots">...</span></div>
        `;
        
        messageContainer.appendChild(typingDiv);
        
        setTimeout(() => {
            this.chatHistoryEl.scrollTo({
                top: this.chatHistoryEl.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    }
    
    removeTypingIndicator() {
        const typingEl = document.getElementById('typing-indicator');
        if (typingEl) typingEl.remove();
    }
    
    // ===== UTILITY FUNCTIONS =====
    loadInitialMessages() {
        const container = document.createElement('div');
        container.className = 'message-container';
        this.chatHistoryEl.appendChild(container);
        
        const savedHistory = localStorage.getItem('emergencyChatHistory');
        if (savedHistory) {
            try {
                this.chatHistory = JSON.parse(savedHistory);
                this.chatHistory.forEach(msg => this.displayMessage(msg));
            } catch (e) {
                console.error('Error loading chat history:', e);
                this.showWelcomeMessages();
            }
        } else {
            this.showWelcomeMessages();
        }
        
        this.showCasualVisualGuide();
    }
    
    showWelcomeMessages() {
        this.addMessageToChat('system', '👋 <strong>Hello! I\'m your Neonexus First Responder</strong>');
        this.addMessageToChat('system', '💬 <strong>You can:</strong>');
        this.addMessageToChat('system', '• Type your messages (normal mode)');
        this.addMessageToChat('system', '• Click the 🎤 button for handsfree voice mode');
        this.addMessageToChat('system', '• Get emergency guidance and first aid help');
        this.addMessageToChat('system', '⚠️ <strong>Remember:</strong> Always call 108/112 for real emergencies!');
    }
    
    saveChatHistory() {
        const recentHistory = this.chatHistory.slice(-50);
        localStorage.setItem('emergencyChatHistory', JSON.stringify(recentHistory));
    }
    
    addAnimationsCSS() {
        if (!document.querySelector('#animations-style')) {
            const style = document.createElement('style');
            style.id = 'animations-style';
            style.textContent = `
                @keyframes typing {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
                .typing-dots {
                    display: inline-block;
                    animation: typing 1.5s infinite;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .quick-response-buttons {
                    animation: fadeIn 0.3s ease;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.emergencyApp = new EmergencyResponder();
        console.log('✅ Emergency Responder initialized successfully');
        
        // Check microphone permissions
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    console.log('✅ Microphone permission granted');
                    stream.getTracks().forEach(track => track.stop());
                })
                .catch(err => {
                    console.log('⚠️ Microphone permission not granted:', err);
                    const handsfreeBtn = document.getElementById('handsfree-btn');
                    if (handsfreeBtn) {
                        handsfreeBtn.disabled = true;
                        handsfreeBtn.title = 'Microphone permission required';
                    }
                });
        }
        
    } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        
        // Show fallback message
        const chatHistory = document.getElementById('chat-history');
        if (chatHistory) {
            const container = document.createElement('div');
            container.className = 'message-container';
            container.innerHTML = `
                <div class="system-message">
                    <div class="message-header">
                        <span class="message-sender">Assistant</span>
                    </div>
                    <div class="message-content">
                        <strong>Emergency Assistant Loaded</strong><br>
                        For real emergencies, call 108/112 immediately.
                    </div>
                </div>
            `;
            chatHistory.appendChild(container);
        }
    }
});

console.log('🚑 Emergency Responder module ready');