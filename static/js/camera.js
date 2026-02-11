// camera.js - FIXED VERSION (removes random hand gestures)
console.log('📹 AI Camera System Loading...');

class CameraSystem {
    constructor() {
        console.log('🎥 AI Camera Initializing...');
        this.isActive = false;
        this.faceApiLoaded = false;
        this.detectionInterval = null;
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.overlay = null;
        this.lastEmergencyTime = 0;
        this.emergencyCooldown = 10000; // 10 seconds
        this.healthyCounter = 0;
        this.isDetectingFace = false;
    }

    async startCamera() {
        try {
            console.log('🚀 Starting AI camera with face detection...');
            
            this.video = document.getElementById('live-camera');
            if (!this.video) {
                console.error('❌ Video element not found');
                return;
            }
            
            // Start camera
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: 640, 
                    height: 480, 
                    facingMode: 'user' 
                },
                audio: false
            });
            
            this.video.srcObject = stream;
            this.video.style.display = 'block';
            
            // Hide placeholder
            document.getElementById('camera-placeholder').style.display = 'none';
            document.getElementById('close-camera').innerHTML = '✕';
            
            // Setup canvas
            this.setupCanvas();
            
            // Load AI models
            await this.loadAIModels();
            
            if (this.faceApiLoaded) {
                this.startFaceDetection();
                this.showStatus('✅ AI Active - Face detection ON', 'success');
            } else {
                this.showStatus('❌ AI Models Failed to Load', 'danger');
            }
            
            this.isActive = true;
            
        } catch (error) {
            console.error('❌ Camera error:', error);
            this.showStatus('❌ Camera Error - Check permissions', 'danger');
        }
    }

    setupCanvas() {
        // Create canvas for processing
        this.canvas = document.createElement('canvas');
        this.canvas.style.display = 'none';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // Create overlay for drawing
        this.overlay = document.createElement('canvas');
        this.overlay.id = 'ai-overlay';
        this.overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
        `;
        document.querySelector('.camera-feed').appendChild(this.overlay);
    }

    async loadAIModels() {
        try {
            console.log('🤖 Loading face-api.js...');
            
            // Wait for face-api to load
            if (typeof faceapi === 'undefined') {
                console.error('❌ face-api.js not loaded yet');
                await this.waitForFaceAPI();
            }
            
            console.log('✅ face-api.js loaded, loading models...');
            
            // Load models
            const modelPath = '/static/models';
            console.log('📁 Loading from:', modelPath);
            
            await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
            console.log('✅ Face detector loaded');
            
            await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
            console.log('✅ Face landmarks loaded');
            
            await faceapi.nets.faceExpressionNet.loadFromUri(modelPath);
            console.log('✅ Face expressions loaded');
            
            this.faceApiLoaded = true;
            console.log('🎉 ALL AI MODELS LOADED SUCCESSFULLY!');
            
        } catch (error) {
            console.error('❌ AI loading failed:', error);
            console.error('Error details:', error.message);
            this.faceApiLoaded = false;
        }
    }

    waitForFaceAPI() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 30; // 3 seconds
            
            const checkFaceAPI = () => {
                attempts++;
                if (typeof faceapi !== 'undefined') {
                    console.log('✅ face-api.js loaded after', attempts, 'attempts');
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error('face-api.js never loaded'));
                } else {
                    setTimeout(checkFaceAPI, 100);
                }
            };
            
            checkFaceAPI();
        });
    }

    startFaceDetection() {
        if (!this.faceApiLoaded || !this.video) {
            console.error('❌ Cannot start detection: AI not loaded');
            return;
        }
        
        console.log('🔍 Starting AI face detection loop...');
        const overlayCtx = this.overlay.getContext('2d');
        
        this.detectionInterval = setInterval(async () => {
            try {
                if (!this.video.videoWidth) return;
                
                // Update canvas size
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
                
                // Detect faces
                const detections = await faceapi
                    .detectAllFaces(this.canvas, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceExpressions();
                
                // Update overlay size
                this.overlay.width = this.canvas.width;
                this.overlay.height = this.canvas.height;
                overlayCtx.clearRect(0, 0, this.overlay.width, this.overlay.height);
                
                if (detections.length > 0) {
                    this.isDetectingFace = true;
                    
                    // Draw boxes and analyze each face
                    detections.forEach(detection => {
                        const box = detection.detection.box;
                        const emotion = this.getDominantEmotion(detection.expressions);
                        
                        // Determine box color based on emotion
                        let boxColor = '#00ff00'; // Green for healthy
                        let statusType = 'healthy';
                        
                        if (emotion === 'happy' || emotion === 'neutral') {
                            boxColor = '#00ff00'; // Green
                            statusType = 'healthy';
                        } else if (emotion === 'shocked' || emotion === 'surprised' || emotion === 'fear') {
                            boxColor = '#ff9800'; // Orange for burn/pain
                            statusType = 'warning';
                        } else if (emotion === 'sad' || emotion === 'disgusted') {
                            boxColor = '#ff5252'; // Red for pain
                            statusType = 'warning';
                        } else if (emotion === 'angry') {
                            boxColor = '#ff0000'; // Bright red for distress
                            statusType = 'danger';
                        }
                        
                        // Draw colored box around face
                        overlayCtx.strokeStyle = boxColor;
                        overlayCtx.lineWidth = 3;
                        overlayCtx.strokeRect(box.x, box.y, box.width, box.height);
                        
                        // Draw emotion label
                        overlayCtx.fillStyle = boxColor;
                        overlayCtx.font = 'bold 16px Arial';
                        overlayCtx.fillText(emotion.toUpperCase(), box.x, box.y - 10);
                        
                        // Draw landmarks (dots)
                        overlayCtx.fillStyle = '#ff0000';
                        if (detection.landmarks && detection.landmarks.positions) {
                            detection.landmarks.positions.forEach(point => {
                                overlayCtx.beginPath();
                                overlayCtx.arc(point.x, point.y, 2, 0, Math.PI * 2);
                                overlayCtx.fill();
                            });
                        }
                        
                        // Analyze for emergencies
                        this.analyzeFaceForEmergencies(detection, emotion);
                    });
                    
                    // Show health status for first face
                    const firstFace = detections[0];
                    const firstEmotion = this.getDominantEmotion(firstFace.expressions);
                    
                    if (firstEmotion === 'happy' || firstEmotion === 'neutral') {
                        this.healthyCounter++;
                        if (this.healthyCounter >= 2) { // Show after 2 consistent detections
                            this.showStatus(`😊 Patient Healthy: ${firstEmotion} face detected`, 'healthy');
                        }
                    } else {
                        this.healthyCounter = 0;
                        this.showStatus(`🎭 ${firstEmotion.toUpperCase()} detected`, 
                            firstEmotion === 'happy' || firstEmotion === 'neutral' ? 'healthy' : 'info');
                    }
                    
                } else {
                    this.isDetectingFace = false;
                    this.healthyCounter = 0;
                    this.showStatus('👁️ Show your face - AI Ready', 'info');
                }
                
            } catch (error) {
                console.log('⚠️ Detection error:', error);
                this.isDetectingFace = false;
            }
        }, 1000); // Detect once per second (slower)
    }

    getDominantEmotion(expressions) {
        if (!expressions) return 'neutral';
        
        let maxScore = 0;
        let dominant = 'neutral';
        
        for (const [emotion, score] of Object.entries(expressions)) {
            if (score > maxScore) {
                maxScore = score;
                dominant = emotion;
            }
        }
        
        // Map to our emotion categories
        const emotionMap = {
            'happy': 'happy',
            'sad': 'sad',
            'angry': 'angry',
            'fear': 'fear',
            'disgusted': 'disgusted',
            'surprised': 'surprised',
            'neutral': 'neutral'
        };
        
        return emotionMap[dominant] || dominant;
    }

    analyzeFaceForEmergencies(face, emotion) {
        try {
            const now = Date.now();
            if (now - this.lastEmergencyTime < this.emergencyCooldown) return;
            
            const landmarks = face.landmarks;
            if (!landmarks) return;
            
            // Get facial features
            const mouth = landmarks.getMouth();
            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();
            
            // Calculate measurements
            let mouthOpen = false;
            let eyesClosed = false;
            
            if (mouth && mouth.length >= 20) {
                const mouthHeight = Math.abs(mouth[13].y - mouth[19].y);
                mouthOpen = mouthHeight > 20; // Threshold for open mouth
            }
            
            if (leftEye && leftEye.length >= 6 && rightEye && rightEye.length >= 6) {
                const leftEyeHeight = Math.abs(leftEye[1].y - leftEye[5].y);
                const rightEyeHeight = Math.abs(rightEye[1].y - rightEye[5].y);
                eyesClosed = leftEyeHeight < 5 && rightEyeHeight < 5;
            }
            
            // EMERGENCY DETECTION LOGIC - SIMPLIFIED
            let emergency = null;
            let message = '';
            
            // Health check - happy/neutral are healthy
            if (emotion === 'happy' || emotion === 'neutral') {
                // No emergency for happy/neutral
                return;
            }
            
            // Only trigger emergencies for STRONG indications
            if (eyesClosed) {
                emergency = 'unconscious';
                message = '😴 UNCONSCIOUS DETECTED: Eyes closed for extended period';
            } 
            else if (emotion === 'fear' && mouthOpen) {
                emergency = 'burn';
                message = '🔥 BURN/SHOCK DETECTED: Fear with open mouth';
            }
            else if (emotion === 'sad' && mouthOpen) {
                emergency = 'pain';
                message = '😣 PAIN DETECTED: Sad with open mouth';
            }
            else if (emotion === 'surprised' && mouthOpen) {
                emergency = 'shock';
                message = '😲 SHOCK DETECTED: Surprised with open mouth';
            }
            else if (emotion === 'angry' && mouthOpen) {
                emergency = 'distress';
                message = '😠 DISTRESS DETECTED: Angry expression';
            }
            
            // Trigger emergency if detected
            if (emergency) {
                console.log(`🚨 EMERGENCY DETECTED: ${emergency} - ${emotion} with mouthOpen:${mouthOpen}, eyesClosed:${eyesClosed}`);
                this.lastEmergencyTime = now;
                this.triggerEmergencyAlert(emergency, message, emotion);
            }
            
        } catch (error) {
            console.log('Emergency analysis error:', error);
        }
    }

    triggerEmergencyAlert(type, message, emotion) {
        console.log(`🚨 AI EMERGENCY DETECTED: ${type} - ${message}`);
        
        // Show visual alert
        this.showEmergencyAlert(message);
        
        // Update camera status
        const alertType = type === 'unconscious' ? 'danger' : 
                         type === 'burn' || type === 'pain' ? 'warning' : 'danger';
        this.showStatus(`🚨 ${message}`, alertType);
        
        // Send to chat system WITH CONFIRMATION BUTTONS
        if (window.emergencyApp && window.emergencyApp.addMessageToChat) {
            const chatMessage = `**🚨 AI EMERGENCY DETECTION**\n\n${message}\n\n**Emotion:** ${emotion}\n**Time:** ${new Date().toLocaleTimeString()}`;
            
            window.emergencyApp.addMessageToChat('system', chatMessage);
            
            // Add confirmation buttons after 1 second
            setTimeout(() => {
                if (window.emergencyApp.addQuickResponseButtons) {
                    window.emergencyApp.addQuickResponseButtons([
                        { 
                            text: '✅ Confirm Emergency', 
                            value: `Yes, I confirm this is a ${type} emergency`,
                            icon: 'fas fa-check-circle'
                        },
                        { 
                            text: '❌ False Alarm', 
                            value: `No, this is a false detection for ${type}`,
                            icon: 'fas fa-times-circle'
                        },
                        { 
                            text: '🆘 Need Help', 
                            value: `Help me with ${type} emergency procedures`,
                            icon: 'fas fa-first-aid'
                        },
                        { 
                            text: '📞 Call Emergency', 
                            value: 'Call 108/112 immediately',
                            icon: 'fas fa-phone'
                        }
                    ]);
                }
            }, 1000);
        }
    }

    showEmergencyAlert(message) {
        // Remove old alert
        const old = document.getElementById('emergency-alert');
        if (old) old.remove();
        
        // Create new alert
        const alert = document.createElement('div');
        alert.id = 'emergency-alert';
        alert.innerHTML = `
            <div style="font-size: 3em; margin-bottom: 15px;">🚨</div>
            <div style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">AI EMERGENCY DETECTED</div>
            <div style="margin-bottom: 15px;">${message}</div>
            <div style="font-size: 12px; opacity: 0.8; background: rgba(255,255,255,0.2); padding: 8px; border-radius: 5px;">
                Check chat for confirmation options • Click to dismiss
            </div>
        `;
        alert.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ff5252 0%, #c62828 100%);
            color: white;
            padding: 30px 40px;
            border-radius: 15px;
            font-size: 16px;
            z-index: 1000;
            text-align: center;
            animation: pulse 1s infinite;
            border: 4px solid white;
            box-shadow: 0 0 50px rgba(255, 82, 82, 0.8);
            backdrop-filter: blur(10px);
            cursor: pointer;
            max-width: 80%;
        `;
        
        // Add pulse animation
        if (!document.querySelector('#alert-pulse')) {
            const style = document.createElement('style');
            style.id = 'alert-pulse';
            style.textContent = `
                @keyframes pulse {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.9; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Click to dismiss
        alert.onclick = () => alert.remove();
        
        const cameraFeed = document.querySelector('.camera-feed');
        if (cameraFeed) cameraFeed.appendChild(alert);
        
        // Auto remove after 8 seconds
        setTimeout(() => alert.remove(), 8000);
    }

    showStatus(message, type) {
        const colors = {
            'success': '#4caf50',
            'danger': '#ff5252',
            'info': '#2196f3',
            'warning': '#ff9800',
            'healthy': '#10b981'
        };
        
        // Remove old status
        const old = document.getElementById('camera-status');
        if (old) old.remove();
        
        // Create new status
        const status = document.createElement('div');
        status.id = 'camera-status';
        status.textContent = message;
        status.style.cssText = `
            position: absolute;
            bottom: 10px;
            left: 10px;
            right: 10px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 15px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 100;
            text-align: center;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        
        const cameraFeed = document.querySelector('.camera-feed');
        if (cameraFeed) cameraFeed.appendChild(status);
    }

    stopCamera() {
        console.log('🛑 Stopping AI camera...');
        
        // Stop detection
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
            this.detectionInterval = null;
        }
        
        // Stop camera
        if (this.video && this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
            this.video.srcObject = null;
            this.video.style.display = 'none';
        }
        
        // Show placeholder
        document.getElementById('camera-placeholder').style.display = 'flex';
        document.getElementById('close-camera').innerHTML = '📷';
        
        // Clean up
        ['ai-overlay', 'emergency-alert', 'camera-status'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
        
        this.isActive = false;
        console.log('✅ AI Camera stopped');
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 Page loaded, starting AI camera in 3 seconds...');
    
    window.CameraSystem = new CameraSystem();
    
    // Start after 3 seconds (gives time for face-api to load)
    setTimeout(() => {
        if (window.CameraSystem && typeof window.CameraSystem.startCamera === 'function') {
            window.CameraSystem.startCamera();
        }
    }, 3000);
    
    // Setup close button
    const closeBtn = document.getElementById('close-camera');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (window.CameraSystem) {
                window.CameraSystem.stopCamera();
            }
        });
    }
});

console.log('✅ AI Camera System ready');