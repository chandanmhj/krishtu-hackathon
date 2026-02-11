from flask import Flask, render_template, jsonify, request, send_from_directory  # FIXED LINE
import os
import json
from datetime import datetime
import uuid
import random
import re
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = 'emergency_secret_key'

# Configure Gemini AI
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY and GEMINI_API_KEY != 'your_gemini_api_key_here':
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-pro')
        print("✅ Gemini AI configured successfully")
    except Exception as e:
        print(f"⚠️  Gemini AI configuration error: {e}")
        model = None
else:
    print("⚠️  GEMINI_API_KEY not configured. Using emergency protocols only.")
    model = None

# Store chat history
chat_sessions = {}

# Emergency detection keywords
EMERGENCY_KEYWORDS = {
    'choking': ['choking', 'choke', 'cant breathe', 'airway', 'heimlich', 'throat', 'suffocating'],
    'cardiac': ['heart', 'cardiac', 'chest pain', 'heart attack', 'no pulse', 'arrest', 'cpr', 'chest'],
    'bleeding': ['bleeding', 'blood', 'cut', 'wound', 'hemorrhage', 'arterial', 'bleed', 'injured'],
    'unconscious': ['unconscious', 'passed out', 'fainted', 'not responding', 'collapsed', 'unresponsive'],
    'snake': ['snake', 'bite', 'venom', 'snake bite', 'fang', 'reptile'],
    'burn': ['burn', 'fire', 'hot', 'scald', 'heat injury', 'flame', 'burned'],
    'fracture': ['fracture', 'broken', 'bone', 'break', 'fractured', 'snapped', 'limb'],
    'drowning': ['drowning', 'water', 'swimming', 'pool', 'lake', 'river', 'underwater'],
    'road_accident': ['road accident', 'car accident', 'traffic accident', 'vehicle crash', 'car crash', 'road crash', 'motor accident', 'collision', 'hit and run', 'vehicular'],
    'emergency': ['help', 'emergency', 'urgent', 'assist', 'accident', 'injured', '911', '108', '112', 'ambulance']
}

# Emergency protocols
# In app.py, update the EMERGENCY_PROTOCOLS dictionary:

EMERGENCY_PROTOCOLS = {
    # ... existing protocols ...
    
    'burn': [
        "🚨 **BURN INJURY - ACT NOW** 🚨",
        "**📞 STEP 1: CALL 108/112 for serious burns**",
        "**STEP 2: Remove person from heat source immediately.**",
        "**STEP 3: Cool burn with cool running water for 20 minutes.**",
        "**STEP 4: Remove jewelry and tight clothing near burn.**",
        "**STEP 5: Cover with sterile non-stick dressing.**",
        "**STEP 6: DO NOT apply ointments, butter, toothpaste or ice.**",
        "**STEP 7: DO NOT break blisters.**",
        "**STEP 8: Keep victim warm and monitor for shock.**",
        "**STEP 9: For chemical burns, remove contaminated clothing and rinse with water.**"
    ],
    
    'pain': [
        "🚨 **SEVERE PAIN/DISTRESS - ACT NOW** 🚨",
        "**📞 STEP 1: CALL 108/112 if pain is severe or sudden**",
        "**STEP 2: Assess the source of pain.**",
        "**STEP 3: Help person into comfortable position.**",
        "**STEP 4: Apply cold pack for injuries (20 minutes on, 20 off)**",
        "**STEP 5: For chest pain, help person sit up and rest.**",
        "**STEP 6: For abdominal pain, do NOT give food or drink.**",
        "**STEP 7: Monitor breathing and consciousness.**",
        "**STEP 8: Keep person calm and reassure them.**",
        "**STEP 9: Be prepared to provide CPR if needed.**"
    ],
    
    'choking': [
        "🚨 **CHOKING EMERGENCY - ACT NOW** 🚨",
        "**📞 STEP 1: CALL 108/112 IMMEDIATELY**",
        "**STEP 2: Ask 'Are you choking?' If they can cough, encourage coughing.**",
        "**STEP 3: Perform 5 back blows:**",
        "   - Stand behind and slightly to the side",
        "   - Support chest with one hand",
        "   - Lean person forward",
        "   - Give 5 firm blows between shoulder blades",
        "**STEP 4: Perform Heimlich Maneuver:**",
        "   - Stand behind, wrap arms around waist",
        "   - Make fist, place thumb side above navel",
        "   - Grasp fist with other hand",
        "   - Give quick upward thrusts",
        "**STEP 5: Alternate 5 back blows and 5 abdominal thrusts.**",
        "**STEP 6: If person becomes unconscious, begin CPR.**"
    ],
    
    'cardiac': [
        "🚨 **CARDIAC SYMPTOMS - ACT NOW** 🚨",
        "**📞 STEP 1: CALL 108/112 IMMEDIATELY**",
        "**STEP 2: Check for chest pain, pressure, or discomfort.**",
        "**STEP 3: Check for pain in arms, back, neck, jaw, or stomach.**",
        "**STEP 4: Look for shortness of breath, cold sweat, nausea.**",
        "**STEP 5: Help person sit in comfortable position.**",
        "**STEP 6: Loosen tight clothing.**",
        "**STEP 7: If prescribed, help with nitroglycerin.**",
        "**STEP 8: Do NOT give aspirin unless directed by medical professional.**",
        "**STEP 9: Monitor closely and be prepared for CPR.**",
        "**STEP 10: Use AED if available and person becomes unconscious.**"
    ],
    
    'head_injury': [
        "🚨 **HEAD INJURY SUSPECTED - ACT NOW** 🚨",
        "**📞 STEP 1: CALL 108/112 IMMEDIATELY**",
        "**STEP 2: DO NOT move person unless absolutely necessary.**",
        "**STEP 3: Stabilize head and neck in position found.**",
        "**STEP 4: Check for consciousness and breathing.**",
        "**STEP 5: Control any bleeding with gentle pressure.**",
        "**STEP 6: Watch for:**",
        "   - Confusion or disorientation",
        "   - Unequal pupil size",
        "   - Clear fluid from nose or ears",
        "   - Seizures or convulsions",
        "**STEP 7: Keep person still and calm.**",
        "**STEP 8: Do NOT remove helmet if present.**",
        "**STEP 9: Monitor closely until help arrives.**"
    ],
    
    'unconscious': [
        "🚨 **UNCONSCIOUS PERSON - ACT NOW** 🚨",
        "**📞 STEP 1: CALL 108/112 IMMEDIATELY**",
        "**STEP 2: Check responsiveness - tap shoulders and shout.**",
        "**STEP 3: Open airway - tilt head back, lift chin.**",
        "**STEP 4: Check breathing - look, listen, feel for 10 seconds.**",
        "**STEP 5: If breathing normally, place in recovery position.**",
        "**STEP 6: If NOT breathing, begin CPR immediately:**",
        "   - 30 chest compressions (5-6 cm deep)",
        "   - 2 rescue breaths",
        "   - Continue 30:2 ratio",
        "**STEP 7: Use AED if available.**",
        "**STEP 8: Monitor breathing until help arrives.**"
    ]
    
    # ... rest of protocols ...
}

def detect_emergency_type(message):
    """Detect emergency type from user message"""
    message_lower = message.lower()
    
    for emergency_type, keywords in EMERGENCY_KEYWORDS.items():
        for keyword in keywords:
            if keyword in message_lower:
                return emergency_type
    
    return None

def get_ai_response(message, session_id, conversation_history):
    """Get response from Gemini AI or fallback to emergency protocols"""
    
    # First check for emergencies
    emergency_type = detect_emergency_type(message)
    
    if emergency_type and emergency_type != 'emergency':
        # This is a specific emergency
        protocol = EMERGENCY_PROTOCOLS.get(emergency_type, [])
        return "\n".join(protocol), emergency_type
    
    elif emergency_type == 'emergency':
        # General emergency
        return "🚨 **EMERGENCY DETECTED** 🚨\n\n**📞 CALL 108/112 IMMEDIATELY**\n\nPlease describe the situation so I can provide specific guidance. Are you dealing with:\n• Cardiac emergency\n• Severe bleeding\n• Choking\n• Unconscious person\n• Burn injury\n• Snake bite\n• Fracture/broken bone\n• Road/vehicle accident", 'universal'
    
    # Casual conversation or non-emergency
    if model:
        try:
            # Use Gemini AI for casual conversation
            prompt = f"""You are Neonexus First Responder, an emergency medical assistant. 
            User message: {message}
            
            Respond in a helpful, professional manner. If it's a casual greeting or question, respond warmly.
            If it's asking about first aid or safety, provide helpful information.
            Always remind about calling 108/112 for real emergencies.
            
            Keep response concise and practical."""
            
            response = model.generate_content(prompt)
            return response.text, 'casual'
        except Exception as e:
            print(f"Gemini AI error: {e}")
    
    # Fallback responses
    message_lower = message.lower()
    
    # Greetings
    if any(word in message_lower for word in ['hi', 'hello', 'hey', 'good morning', 'good afternoon']):
        responses = [
            "Hello! I'm Neonexus First Responder. How can I help you today?",
            "Hi there! I'm here to help with emergencies or answer first aid questions.",
            "Hello! Ready to assist with medical emergencies or safety guidance."
        ]
        return random.choice(responses), 'casual'
    
    # How are you
    elif 'how are you' in message_lower:
        return "I'm always ready to help with emergencies! What do you need assistance with?", 'casual'
    
    # Help requests
    elif 'help' in message_lower:
        return "I can help with:\n🚨 **Emergency protocols** (describe the situation)\n🩹 **First aid guidance**\n📋 **Safety information**\n💬 **General questions**\n\nWhat do you need help with?", 'casual'
    
    # First aid questions
    elif any(word in message_lower for word in ['first aid', 'cpr', 'bandage', 'wound']):
        return "I can provide first aid guidance! Please describe the injury or situation. For example:\n• 'How to treat a cut?'\n• 'How to do CPR?'\n• 'What to do for a burn?'\n• 'Road accident response'", 'casual'
    
    # Safety questions
    elif 'safety' in message_lower:
        return "I can provide safety information! Are you interested in:\n• Road safety\n• Home safety\n• Workplace safety\n• Outdoor safety\n• Emergency preparedness", 'casual'
    
    # Thanks
    elif any(word in message_lower for word in ['thanks', 'thank you', 'thx']):
        return "You're welcome! Stay safe and remember to call 108/112 for real emergencies.", 'casual'
    
    # Default response
    default_responses = [
        "I'm Neonexus First Responder. I can help with emergency protocols, first aid, and safety information. Please describe what you need help with.",
        "How can I assist you? I provide emergency response guidance and first aid information.",
        "I'm here to help with medical emergencies and safety questions. What do you need assistance with?"
    ]
    return random.choice(default_responses), 'casual'

# ===== FLASK ROUTES =====
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/models/<path:filename>')
def serve_models(filename):
    """Serve face-api.js model files"""
    try:
        return send_from_directory('static/models', filename)
    except Exception as e:
        print(f"Error serving model file {filename}: {e}")
        return "File not found", 404

@app.route('/static/js/face-api.min.js')
def serve_face_api():
    """Serve face-api.js file"""
    return send_from_directory('static/js', 'face-api.min.js')

@app.route('/send_message', methods=['POST'])
def send_message():
    try:
        data = request.json
        user_message = data.get('message', '').strip()
        session_id = data.get('session_id')
        
        if not user_message:
            return jsonify({'status': 'error', 'response': 'Please type a message.'})
        
        # Initialize or get session
        if not session_id or session_id not in chat_sessions:
            session_id = str(uuid.uuid4())
            chat_sessions[session_id] = []
        
        # Get response from AI or emergency protocols
        response, emergency_type = get_ai_response(user_message, session_id, chat_sessions[session_id])
        
        # Store in session history
        chat_sessions[session_id].append({
            'sender': 'user',
            'message': user_message,
            'timestamp': datetime.now().isoformat()
        })
        
        chat_sessions[session_id].append({
            'sender': 'assistant',
            'message': response,
            'timestamp': datetime.now().isoformat()
        })
        
        # Limit history
        if len(chat_sessions[session_id]) > 20:
            chat_sessions[session_id] = chat_sessions[session_id][-20:]
        
        return jsonify({
            'status': 'success',
            'response': response,
            'session_id': session_id,
            'emergency_type': emergency_type if emergency_type != 'casual' else None
        })
        
    except Exception as e:
        print(f"Error in send_message: {e}")
        return jsonify({
            'status': 'error',
            'response': 'System error. Please try again or call 108/112 for emergencies.'
        })

@app.route('/get_emergency_images/<emergency_type>')
def get_emergency_images(emergency_type):
    """Get images for specific emergency type"""
    
    image_map = {
        'choking': [
            {'filename': 'back blows.jpg', 'title': 'Back Blows', 'description': '5 firm blows between shoulder blades'},
            {'filename': 'heimlich maneuver.jpg', 'title': 'Heimlich Maneuver', 'description': 'Abdominal thrusts above navel'}
        ],
        'cardiac': [
            {'filename': 'cpr being performed.jpg', 'title': 'CPR Compressions', 'description': 'Center of chest, 5-6 cm depth'},
            {'filename': 'using AED device.jpg', 'title': 'AED Use', 'description': 'Attach pads, follow voice prompts'}
        ],
        'bleeding': [
            {'filename': 'applying pressure to wound.jpg', 'title': 'Direct Pressure', 'description': 'Apply firm pressure with clean cloth'},
            {'filename': 'person calling emergencyy.jpg', 'title': 'Call Emergency', 'description': 'Dial 108/112 immediately'}
        ],
        'unconscious': [
            {'filename': 'cpr being performed.jpg', 'title': 'Check Breathing', 'description': 'Look, listen, feel for 10 seconds'},
            {'filename': 'recovery position.jpg', 'title': 'Recovery Position', 'description': 'Place on side if breathing'}
        ],
        'snake': [
            {'filename': 'snake bite immobilzation.jpg', 'title': 'Immobilize Limb', 'description': 'Keep still, below heart level'},
            {'filename': 'person calling emergencyy.jpg', 'title': 'Call 108/112', 'description': 'Hospital transport needed'}
        ],
        'burn': [
            {'filename': 'cooling burn with water.jpg', 'title': 'Cool Burn', 'description': 'Run cool water for 20 minutes'},
            {'filename': 'person calling emergencyy.jpg', 'title': 'Call 108/112', 'description': 'For serious burns'}
        ],
        'fracture': [
            {'filename': 'splinting fracture.jpg', 'title': 'Immobilize Fracture', 'description': 'Support with splint'},
            {'filename': 'person calling emergencyy.jpg', 'title': 'Call 108/112', 'description': 'For major fractures'}
        ],
        'road_accident': [
            {'filename': 'person calling emergencyy.jpg', 'title': 'Call Emergency Immediately', 'description': 'Dial 108/112 with location details'},
            {'filename': 'cpr being performed.jpg', 'title': 'Assess & Provide First Aid', 'description': 'Check breathing, control bleeding'},
            {'filename': 'recovery position.jpg', 'title': 'Scene Safety First', 'description': 'Secure area, prevent further accidents'}
        ],
        'universal': [
            {'filename': 'person calling emergencyy.jpg', 'title': 'Call Emergency', 'description': 'Dial 108/112 first'},
            {'filename': 'cpr being performed.jpg', 'title': 'Check Responsiveness', 'description': 'Tap shoulders, shout for response'}
        ],
        'casual': [
            {'filename': 'person calling emergencyy.jpg', 'title': 'Emergency Ready', 'description': 'Always call 108/112 for emergencies'},
            {'filename': 'cpr being performed.jpg', 'title': 'First Aid Knowledge', 'description': 'Basic first aid saves lives'}
        ]
    }
    
    images = image_map.get(emergency_type, image_map['casual'])
    
    return jsonify({
        'status': 'success',
        'emergency_type': emergency_type,
        'images': images
    })

@app.route('/ai_detection', methods=['POST'])
def ai_detection():
    """Receive AI detection alerts"""
    try:
        data = request.json
        print(f"🤖 AI DETECTION: {data}")
        return jsonify({'status': 'success', 'ai': True})
    except Exception as e:
        print(f"Error processing AI detection: {e}")
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/reset_session', methods=['POST'])
def reset_session():
    session_id = request.json.get('session_id')
    if session_id in chat_sessions:
        chat_sessions[session_id] = []
    return jsonify({'status': 'success', 'message': 'Session reset'})

if __name__ == '__main__':
    print("=" * 60)
    print("🆘 NEONEXUS FIRST RESPONDER")
    print("=" * 60)
    if model:
        print("✅ Gemini AI: Connected")
    else:
        print("✅ Emergency Protocols: Ready")
    print("✅ Face API: Ready")
    print("✅ Chat System: Operational")
    print("\n🚑 Server running: http://localhost:5000")
    print("📞 Remember: Always call 108/112 for real emergencies!")
    print("=" * 60)
    app.run(debug=True, port=5000, host='0.0.0.0')