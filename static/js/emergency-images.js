// Enhanced Emergency image mapping with correct file names
const EMERGENCY_IMAGES = {
    // Step-based images with corrected file names
    'back_blows': 'back blows.jpg',
    'abdominal_thrusts': 'heimlich maneuver.jpg',
    'cpr': 'cpr being performed.jpg',
    'recovery_position': 'recovery position.jpg',
    'direct_pressure': 'applying pressure to wound.jpg',
    'snake_bite': 'snake bite immobilzation.jpg',
    'burn_care': 'cooling burn with water.jpg',
    'fracture': 'splinting fracture.jpg',
    'aed': 'using AED device.jpg',
    'emergency_call': 'person calling emergencyy.jpg',
    
    // Emergency type defaults with specific step mapping
    'choking': [
        { step: 1, image: 'back blows.jpg', title: 'Back Blows', description: '5 firm blows between shoulder blades' },
        { step: 2, image: 'heimlich maneuver.jpg', title: 'Heimlich Maneuver', description: 'Abdominal thrusts' }
    ],
    'bleeding': [
        { step: 1, image: 'applying pressure to wound.jpg', title: 'Direct Pressure', description: 'Apply firm pressure' },
        { step: 2, image: 'person calling emergencyy.jpg', title: 'Call Emergency', description: 'Dial 108/112' }
    ],
    'unconscious': [
        { step: 1, image: 'cpr being performed.jpg', title: 'CPR', description: 'Chest compressions & rescue breaths' },
        { step: 2, image: 'recovery position.jpg', title: 'Recovery Position', description: 'Place on side' }
    ],
    'cardiac': [
        { step: 1, image: 'cpr being performed.jpg', title: 'CPR for Cardiac Arrest', description: 'Begin immediately' },
        { step: 2, image: 'using AED device.jpg', title: 'AED Use', description: 'Automated defibrillator' }
    ],
    'snake': [
        { step: 1, image: 'snake bite immobilzation.jpg', title: 'Snake Bite Care', description: 'Immobilize limb, keep still' }
    ],
    'burn': [
        { step: 1, image: 'cooling burn with water.jpg', title: 'Burn Treatment', description: 'Cool with water 20 min' }
    ],
    'fracture': [
        { step: 1, image: 'splinting fracture.jpg', title: 'Fracture Care', description: 'Immobilize injury' }
    ],
    'road_accident': [
        { step: 1, image: 'person calling emergencyy.jpg', title: 'Call Emergency Services', description: 'Dial 108/112 immediately' },
        { step: 2, image: 'cpr being performed.jpg', title: 'Assess Victims', description: 'Check breathing, consciousness' },
        { step: 3, image: 'recovery position.jpg', title: 'Scene Safety', description: 'Secure area, prevent further accidents' }
    ],
    'pain': [
        { step: 1, image: 'person calling emergencyy.jpg', title: 'Assess Pain', description: 'Call emergency if severe' },
        { step: 2, image: 'recovery position.jpg', title: 'Comfort Position', description: 'Help into comfortable position' }
    ],
    'head_injury': [
        { step: 1, image: 'person calling emergencyy.jpg', title: 'Call 108/112', description: 'DO NOT move head/neck' },
        { step: 2, image: 'recovery position.jpg', title: 'Stabilize Position', description: 'Support head and neck' }
    ]
};

// Get image for specific emergency type and step
function getEmergencyImage(emergencyType, step = 1) {
    const mapping = EMERGENCY_IMAGES[emergencyType];
    
    if (Array.isArray(mapping)) {
        const stepData = mapping.find(item => item.step === step) || mapping[0];
        return {
            filename: stepData.image,
            title: stepData.title,
            description: stepData.description,
            fullPath: `/static/images/${stepData.image}`
        };
    } else if (typeof mapping === 'string') {
        return {
            filename: mapping,
            title: emergencyType.charAt(0).toUpperCase() + emergencyType.slice(1),
            description: 'Emergency procedure guidance',
            fullPath: `/static/images/${mapping}`
        };
    }
    
    // Default fallback
    return {
        filename: 'person calling emergencyy.jpg',
        title: 'Call Emergency',
        description: 'Dial 108/112 immediately',
        fullPath: '/static/images/person calling emergencyy.jpg'
    };
}

// Get all images for an emergency type
function getAllEmergencyImages(emergencyType) {
    const mapping = EMERGENCY_IMAGES[emergencyType];
    
    if (Array.isArray(mapping)) {
        return mapping.map(item => ({
            filename: item.image,
            title: item.title,
            description: item.description,
            step: item.step
        }));
    }
    
    return [];
}

// Get image path for emergency type or step
function getImagePath(key) {
    const imageName = EMERGENCY_IMAGES[key] || 'person calling emergencyy.jpg';
    if (typeof imageName === 'string') {
        return `/static/images/${imageName}`;
    }
    return `/static/images/person calling emergencyy.jpg`;
}

// Check if image exists
async function checkImageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// Get step-by-step images for emergency type
function getStepImages(emergencyType, totalSteps) {
    const images = [];
    const baseImages = EMERGENCY_IMAGES[emergencyType];
    
    if (Array.isArray(baseImages)) {
        for (let i = 1; i <= totalSteps; i++) {
            const stepImage = baseImages.find(img => img.step === i) || 
                             baseImages[Math.min(i - 1, baseImages.length - 1)];
            images.push({
                step: i,
                filename: stepImage.image,
                title: `${stepImage.title} (Step ${i})`,
                description: stepImage.description
            });
        }
    } else {
        for (let i = 1; i <= totalSteps; i++) {
            images.push({
                step: i,
                filename: 'person calling emergencyy.jpg',
                title: `Step ${i}: Emergency Response`,
                description: 'Follow step-by-step guidance'
            });
        }
    }
    
    return images;
}

// Export for use in other files
window.EmergencyImages = { 
    getEmergencyImage,
    getAllEmergencyImages,
    getImagePath,
    getStepImages,
    checkImageExists,
    EMERGENCY_IMAGES
};