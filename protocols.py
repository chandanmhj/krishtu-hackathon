"""
BCLS (Basic Cardiac Life Support) Emergency Protocols
Comprehensive emergency response protocols for various medical emergencies
"""

class BCLSProtocols:
    """
    Basic Cardiac Life Support Protocol System
    Provides step-by-step guidance for common medical emergencies
    """
    
    @staticmethod
    def universal_assessment():
        """
        Universal assessment steps for ANY emergency situation
        Always perform these steps first
        """
        return [
            "SCENE SAFETY CHECK: Is the area safe for you and the victim? Look for dangers like fire, traffic, or electrical hazards.",
            "EMERGENCY CALL: Have you called 108/112? This is MANDATORY before proceeding with any treatment.",
            "ASSESS RESPONSIVENESS: Gently tap the person's shoulder and shout 'Are you OK?'",
            "CHECK BREATHING: Look for chest movement, listen for breathing sounds, feel for air on your cheek for 10 seconds.",
            "CHECK FOR SEVERE BLEEDING: Quickly scan the body for any life-threatening bleeding.",
            "CHECK PULSE: If trained, check carotid pulse in the neck for no more than 10 seconds.",
            "IDENTIFY THE PROBLEM: Determine what happened and gather information from bystanders if available."
        ]
    
    @staticmethod
    def choking_protocol(age_group="adult"):
        """
        Choking emergency protocol for different age groups
        """
        steps = [
            "RECOGNIZE CHOKING: Look for universal choking sign (hands clutching throat), inability to speak or cough effectively.",
            "ASK PERMISSION: Ask 'Are you choking?' If they can cough or speak, encourage continued coughing."
        ]
        
        if age_group == "adult" or age_group == "child":
            steps.extend([
                "POSITION YOURSELF: Stand behind the person with your feet shoulder-width apart for stability.",
                "BACK BLOWS: Give 5 firm back blows between the shoulder blades using the heel of your hand.",
                "ABDOMINAL THRUSTS (Heimlich maneuver): Make a fist with one hand, place thumb side against middle of abdomen just above navel.",
                "GRASP AND THRUST: Grasp your fist with other hand and give quick, upward thrusts into the abdomen.",
                "ALTERNATE: Continue alternating 5 back blows and 5 abdominal thrusts until object is expelled.",
                "IF BECOMES UNCONSCIOUS: Lower person to ground gently and begin CPR starting with chest compressions."
            ])
        elif age_group == "infant":
            steps.extend([
                "HOLD INFANT: Place infant face down along your forearm, supporting the head and jaw with your hand.",
                "BACK BLOWS: Give 5 firm back blows between the shoulder blades using heel of hand.",
                "TURN INFANT OVER: Carefully turn infant face up, keeping head lower than chest.",
                "CHEST THRUSTS: Place 2 fingers on breastbone just below nipple line, give 5 chest thrusts.",
                "CHECK MOUTH: Look for object in mouth, remove ONLY if clearly visible (no blind finger sweeps).",
                "CONTINUE: Repeat back blows and chest thrusts until object is expelled or infant becomes unconscious.",
                "IF UNCONSCIOUS: Begin infant CPR with 30 chest compressions followed by 2 rescue breaths."
            ])
        elif age_group == "pregnant":
            steps.extend([
                "CHEST THRUSTS (Not abdominal): Place hands at center of chest (breastbone) for thrusts.",
                "PERFORM THRUSTS: Give quick chest compressions instead of abdominal thrusts.",
                "CONTINUE: Repeat until object is expelled or person becomes unconscious.",
                "IF UNCONSCIOUS: Begin CPR with chest compressions only (Hands-only CPR)."
            ])
        
        steps.append("AFTERCARE: Even if object is expelled, seek medical attention as internal injuries may have occurred.")
        return steps
    
    @staticmethod
    def severe_bleeding_protocol():
        """
        Protocol for controlling severe, life-threatening bleeding
        """
        return [
            "ASSESS THE BLEEDING: Determine if blood is spurting, flowing steadily, or soaking through clothing.",
            "PROTECT YOURSELF: Put on gloves if available. Use plastic bags or cloth as barrier if no gloves.",
            "APPLY DIRECT PRESSURE: Use clean cloth, gauze, or clothing to apply firm, direct pressure on the wound.",
            "ELEVATE THE INJURY: Raise the injured area above heart level if no fractures are suspected.",
            "ADD MORE DRESSING: If blood soaks through, add more dressing on top - DO NOT remove existing dressing.",
            "APPLY PRESSURE DRESSING: Use elastic bandage to maintain pressure if bleeding continues.",
            "TOURNIQUET APPLICATION (For limb injuries only, as last resort):",
            "  - Place 2-3 inches above wound (not over joint)",
            "  - Tighten until bleeding stops completely",
            "  - Note exact time of application",
            "  - Write 'TK' and time on victim's forehead if possible",
            "  - DO NOT remove until at hospital",
            "POSITION THE VICTIM: Lay victim down, elevate legs 8-12 inches if no spinal injury suspected.",
            "MONITOR FOR SHOCK: Keep victim warm, monitor breathing and consciousness level.",
            "TRANSPORT: Keep pressure maintained during transport to medical facility."
        ]
    
    @staticmethod
    def snake_bite_protocol():
        """
        Protocol for snake bite emergencies
        Emphasizes what NOT to do
        """
        return [
            "STAY CALM: Keep victim calm and still. Anxiety increases heart rate and venom spread.",
            "IMMOBILIZE THE LIMB: Keep bitten limb still using splint or sling. Position at or below heart level.",
            "REMOVE CONSTRICTIVE ITEMS: Take off rings, watches, bracelets, and tight clothing from affected area.",
            "MARK THE BITE: Circle the bite site and note time of bite if possible.",
            "DO NOT CUT THE WOUND: Cutting can cause more damage and increase infection risk.",
            "DO NOT SUCK THE VENOM: Mouth suction is ineffective and dangerous.",
            "DO NOT APPLY TOURNIQUET: Can cause more tissue damage.",
            "DO NOT APPLY ICE: Can worsen tissue damage.",
            "DO NOT GIVE ALCOHOL OR PAIN MEDICATION: Can thin blood and worsen symptoms.",
            "DO NOT TRY TO CATCH THE SNAKE: This risks additional bites.",
            "NOTE SYMPTOMS: Watch for swelling, pain, nausea, breathing difficulty, changes in heart rate.",
            "TRANSPORT IMMEDIATELY: Take to hospital without delay. Call ahead if possible.",
            "TELL MEDICAL PERSONNEL: Provide description of snake if seen, time of bite, and symptoms.",
            "BE PREPARED FOR ANTIVENOM: Some bites may require specific antivenom treatment."
        ]
    
    @staticmethod
    def unconscious_protocol(is_breathing=True):
        """
        Protocol for unconscious victims
        Different approach based on breathing status
        """
        if is_breathing:
            return [
                "CHECK RESPONSE: Tap shoulder and shout 'Are you OK?' If no response, proceed.",
                "CHECK BREATHING: Look, listen, feel for normal breathing for 10 seconds.",
                "CALL FOR HELP: If alone, call 108/112 before proceeding.",
                "OPEN AIRWAY: Use head-tilt chin-lift maneuver (if no spinal injury suspected).",
                "RECOVERY POSITION (If breathing normally):",
                "  - Kneel beside victim",
                "  - Place nearest arm at right angle to body",
                "  - Bend far knee, grasp far shoulder and hip",
                "  - Roll toward you onto side",
                "  - Ensure head is supported and airway open",
                "  - Bend top knee to stabilize position",
                "MONITOR BREATHING: Check breathing every 2 minutes until help arrives.",
                "CHECK FOR INJURIES: Look for signs of trauma, bleeding, or medical alert jewelry.",
                "KEEP WARM: Cover with blanket or clothing to prevent hypothermia.",
                "DO NOT GIVE ANYTHING BY MOUTH: No food, drink, or medication."
            ]
        else:
            return [
                "CALL FOR HELP: Shout for someone to call 108/112 and get AED if available.",
                "BEGIN CPR IMMEDIATELY: Start with 30 chest compressions.",
                "CHEST COMPRESSIONS:",
                "  - Position: Center of chest, between nipples",
                "  - Depth: 5-6 cm (2-2.5 inches) for adults",
                "  - Rate: 100-120 compressions per minute",
                "  - Technique: Push hard and fast, allow full chest recoil",
                "RESCUE BREATHS (If trained and willing):",
                "  - After 30 compressions, give 2 breaths",
                "  - Open airway using head-tilt chin-lift",
                "  - Pinch nose, seal your mouth over theirs",
                "  - Give breath over 1 second, watch chest rise",
                "AED USE: When AED arrives:",
                "  - Turn on AED and follow voice prompts",
                "  - Attach pads to bare chest as shown",
                "  - Ensure no one touches victim during analysis",
                "  - If shock advised, ensure clear and deliver shock",
                "  - Resume CPR immediately after shock",
                "CONTINUE CPR:",
                "  - Continue 30:2 ratio (compressions:breaths)",
                "  - Switch with another rescuer every 2 minutes if possible",
                "  - Minimize interruptions in compressions",
                "  - Continue until help arrives or signs of life return"
            ]
    
    @staticmethod
    def cardiac_arrest_protocol():
        """
        Specific protocol for cardiac arrest
        """
        return [
            "RECOGNIZE CARDIAC ARREST:",
            "  - Unresponsive",
            "  - Not breathing or only gasping",
            "  - No pulse (if trained to check)",
            "ACTIVATE EMERGENCY RESPONSE:",
            "  - Call 108/112 immediately",
            "  - Send someone to get AED",
            "  - If alone, call first then begin CPR",
            "BEGIN HIGH-QUALITY CPR:",
            "  - Start compressions within 10 seconds of recognition",
            "  - Push hard and fast in center of chest",
            "  - Compress at least 5-6 cm (2-2.5 inches)",
            "  - Rate: 100-120 compressions per minute",
            "  - Allow full chest recoil between compressions",
            "  - Minimize interruptions (less than 10 seconds)",
            "USE AED AS SOON AS AVAILABLE:",
            "  - Power on AED",
            "  - Attach pads to bare, dry chest",
            "  - Follow voice/visual prompts",
            "  - Clear during analysis and shock delivery",
            "  - Resume CPR immediately after shock",
            "ADVANCED TECHNIQUES (If trained and equipment available):",
            "  - Bag-mask ventilation",
            "  - Advanced airway placement",
            "  - Intravenous/Intraosseous access",
            "  - Medication administration",
            "CONTINUE UNTIL:",
            "  - ROSC (Return of Spontaneous Circulation)",
            "  - Advanced life support takes over",
            "  - Rescuer exhaustion",
            "  - Obvious signs of death"
        ]
    
    @staticmethod
    def burn_protocol(severity="minor"):
        """
        Protocol for burn injuries of different severities
        """
        if severity == "minor":
            return [
                "COOL THE BURN:",
                "  - Run cool (not cold) water over burn for 10-20 minutes",
                "  - Use clean running water if available",
                "  - Avoid ice or very cold water",
                "REMOVE CONSTRICTIVE ITEMS:",
                "  - Gently remove jewelry, belts, tight clothing",
                "  - Do not remove clothing stuck to burn",
                "PROTECT THE BURN:",
                "  - Cover with sterile non-stick dressing",
                "  - Use clean cloth if no dressing available",
                "  - Do not apply ointments, butter, or home remedies",
                "PAIN MANAGEMENT:",
                "  - Over-the-counter pain relievers if appropriate",
                "  - Elevate burned area if possible",
                "MONITOR FOR INFECTION:",
                "  - Watch for increased redness, swelling, or pus",
                "  - Seek medical attention if signs of infection develop"
            ]
        else:  # Major burns
            return [
                "ENSURE SCENE SAFETY:",
                "  - Remove victim from source of burn",
                "  - Stop the burning process (stop, drop, roll)",
                "  - Ensure no electrical hazards present",
                "CALL FOR HELP:",
                "  - Call 108/112 immediately for major burns",
                "  - Provide details: extent, cause, location",
                "PROTECT AIRWAY:",
                "  - Check for breathing difficulties",
                "  - Monitor for signs of inhalation injury",
                "  - Do not place pillow under head if airway at risk",
                "COOL THE BURN:",
                "  - Cool with room temperature water for no more than 10 minutes",
                "  - Avoid cooling large body surface areas (risk of hypothermia)",
                "REMOVE SMOLDERING CLOTHING:",
                "  - Cut away clothing around burn",
                "  - Do not remove clothing stuck to burn",
                "  - Remove jewelry and constrictive items",
                "COVER THE BURN:",
                "  - Use sterile burn sheet or clean cloth",
                "  - Do not wrap tightly",
                "  - Keep victim warm with blanket (not over burn)",
                "TREAT FOR SHOCK:",
                "  - Lay victim flat if no spinal injury suspected",
                "  - Elevate feet 8-12 inches",
                "  - Keep warm",
                "DO NOT:",
                "  - Apply ointments, creams, or home remedies",
                "  - Break blisters",
                "  - Give anything by mouth",
                "TRANSPORT:",
                "  - Await EMS for transport",
                "  - Keep burn elevated if possible during transport"
            ]
    
    @staticmethod
    def fracture_protocol():
        """
        Protocol for suspected bone fractures
        """
        return [
            "ASSESS THE INJURY:",
            "  - Look for deformity, swelling, bruising",
            "  - Ask about pain, numbness, tingling",
            "  - Check circulation beyond injury (pulse, color, temperature)",
            "CALL FOR HELP:",
            "  - Call 108/112 for major fractures or if unsure",
            "  - Describe location and severity",
            "IMMOBILIZE THE INJURY:",
            "  - Support injured area in position found",
            "  - Use splint if available and trained",
            "  - Do not try to realign bones",
            "APPLY COLD:",
            "  - Apply ice pack wrapped in cloth",
            "  - Apply for 20 minutes every 1-2 hours",
            "  - Keep ice off skin directly",
            "ELEVATE:",
            "  - Raise injured limb above heart level if possible",
            "  - Helps reduce swelling",
            "MONITOR CIRCULATION:",
            "  - Check pulse, color, temperature beyond injury",
            "  - Watch for increased pain, numbness, or tingling",
            "TRANSPORT:",
            "  - Keep immobilized during transport",
            "  - Support injured area",
            "SPECIAL CONSIDERATIONS:",
            "  - Open fractures: Cover wound with sterile dressing",
            "  - Spinal injuries: Do not move unless absolutely necessary",
            "  - Pelvic fractures: Keep legs together, do not move"
        ]
    
    @staticmethod
    def stroke_protocol():
        """
        Protocol for suspected stroke using FAST assessment
        """
        return [
            "RECOGNIZE STROKE SYMPTOMS (FAST):",
            "  - F: Face drooping (ask to smile)",
            "  - A: Arm weakness (ask to raise both arms)",
            "  - S: Speech difficulty (ask to repeat simple phrase)",
            "  - T: Time to call emergency services",
            "ADDITIONAL SYMPTOMS:",
            "  - Sudden numbness or weakness, especially on one side",
            "  - Confusion, trouble speaking or understanding",
            "  - Vision problems in one or both eyes",
            "  - Trouble walking, dizziness, loss of balance",
            "  - Severe headache with no known cause",
            "IMMEDIATE ACTION:",
            "  - Call 108/112 IMMEDIATELY",
            "  - Note time when symptoms first appeared",
            "  - Do not give food, drink, or medication",
            "POSITIONING:",
            "  - If conscious, position on side with head slightly elevated",
            "  - If unconscious, place in recovery position",
            "  - Loosen tight clothing",
            "MONITOR:",
            "  - Check breathing and pulse regularly",
            "  - Be prepared to perform CPR if needed",
            "  - Keep calm and reassure the person",
            "INFORMATION FOR EMS:",
            "  - Time symptoms started",
            "  - What symptoms you observed",
            "  - Person's medical history if known",
            "  - Any medications they take"
        ]
    
    @staticmethod
    def seizure_protocol():
        """
        Protocol for seizure emergencies
        """
        return [
            "KEEP CALM AND TIME THE SEIZURE:",
            "  - Note start time of seizure",
            "  - Most seizures stop within 2-3 minutes",
            "PROTECT FROM INJURY:",
            "  - Move hard or sharp objects away",
            "  - Place something soft under head",
            "  - Do not restrain movement",
            "POSITION SAFELY:",
            "  - If on floor, turn on side to keep airway clear",
            "  - Loosen tight clothing around neck",
            "  - Remove glasses if worn",
            "DO NOT:",
            "  - Put anything in the mouth",
            "  - Hold the person down",
            "  - Give food, drink, or medication during seizure",
            "  - Try to stop the seizure",
            "WHEN TO CALL FOR HELP:",
            "  - Seizure lasts more than 5 minutes",
            "  - Second seizure starts without recovery",
            "  - Difficulty breathing after seizure",
            "  - Injury during seizure",
            "  - First-time seizure",
            "  - Seizure occurs in water",
            "  - Person is pregnant, diabetic, or has other medical condition",
            "AFTER THE SEIZURE:",
            "  - Stay with person until fully alert",
            "  - Be reassuring and calm",
            "  - Explain what happened",
            "  - Offer to call family or friend"
        ]
    
    @staticmethod
    def diabetic_emergency_protocol():
        """
        Protocol for diabetic emergencies (high/low blood sugar)
        """
        return [
            "RECOGNIZE SYMPTOMS:",
            "  - Low blood sugar (Hypoglycemia):",
            "    * Confusion, irritability",
            "    * Shaking, sweating",
            "    * Pale skin",
            "    * Rapid heartbeat",
            "    * Hunger",
            "    * Weakness, fatigue",
            "  - High blood sugar (Hyperglycemia):",
            "    * Extreme thirst",
            "    * Frequent urination",
            "    * Dry skin",
            "    * Fruity breath odor",
            "    * Nausea, vomiting",
            "    * Confusion",
            "IF CONSCIOUS AND ABLE TO SWALLOW:",
            "  - Give 15-20 grams fast-acting sugar:",
            "    * Glucose tablets/gel",
            "    * 4 oz fruit juice",
            "    * Regular soda (not diet)",
            "    * 1 tablespoon sugar or honey",
            "  - Wait 15 minutes, check symptoms",
            "  - Repeat if no improvement",
            "IF UNCONSCIOUS OR UNABLE TO SWALLOW:",
            "  - Do NOT give anything by mouth",
            "  - Place in recovery position",
            "  - Call 108/112 immediately",
            "  - Monitor breathing and pulse",
            "  - Be prepared to perform CPR",
            "IF PERSON HAS GLUCAGON KIT AND TRAINED:",
            "  - Administer as directed",
            "  - Turn on side after administration",
            "  - Call 108/112",
            "AFTER RECOVERY:",
            "  - Give complex carbohydrate/protein snack",
            "  - Encourage to check blood sugar",
            "  - Advise to contact healthcare provider"
        ]
    
    @staticmethod
    def allergic_reaction_protocol():
        """
        Protocol for severe allergic reactions (Anaphylaxis)
        """
        return [
            "RECOGNIZE ANAPHYLAXIS:",
            "  - Difficulty breathing or wheezing",
            "  - Swelling of face, lips, tongue, throat",
            "  - Hives or rash",
            "  - Rapid heartbeat",
            "  - Dizziness or fainting",
            "  - Nausea, vomiting, diarrhea",
            "IMMEDIATE ACTION:",
            "  - Call 108/112 immediately",
            "  - Ask if person has epinephrine auto-injector",
            "  - Help them use it if unable to self-administer",
            "EPINEPHRINE ADMINISTRATION:",
            "  - Remove safety cap",
            "  - Hold against outer thigh",
            "  - Push firmly until click is heard",
            "  - Hold in place for 3-10 seconds",
            "  - Massage injection area for 10 seconds",
            "  - Note time of administration",
            "POSITIONING:",
            "  - If breathing difficulty: sitting position",
            "  - If feeling faint: lying down with legs elevated",
            "  - If vomiting: recovery position",
            "  - Do not allow to stand or walk",
            "ADDITIONAL MEASURES:",
            "  - Loosen tight clothing",
            "  - Cover with blanket if cold",
            "  - Do not give food or drink",
            "SECOND DOSE:",
            "  - Symptoms may return after 10-20 minutes",
            "  - Second dose may be needed if symptoms return",
            "  - Wait at least 5 minutes between doses",
            "MONITOR CLOSELY:",
            "  - Check breathing and pulse continuously",
            "  - Be prepared to perform CPR",
            "  - Stay with person until EMS arrives"
        ]
    
    @staticmethod
    def heat_emergency_protocol():
        """
        Protocol for heat-related illnesses
        """
        return [
            "HEAT EXHAUSTION:",
            "  - Heavy sweating",
            "  - Cold, pale, clammy skin",
            "  - Fast, weak pulse",
            "  - Nausea or vomiting",
            "  - Muscle cramps",
            "  - Tiredness, weakness",
            "  - Dizziness, headache",
            "  - Fainting",
            "TREATMENT FOR HEAT EXHAUSTION:",
            "  - Move to cool place",
            "  - Loosen clothing",
            "  - Apply cool, wet cloths",
            "  - Sip water",
            "  - If vomiting, worsens, or lasts >1 hour: seek medical help",
            "HEAT STROKE (MEDICAL EMERGENCY):",
            "  - High body temperature (104°F/40°C or higher)",
            "  - Hot, red, dry or damp skin",
            "  - Fast, strong pulse",
            "  - Confusion, altered mental state",
            "  - Loss of consciousness",
            "  - Seizures",
            "TREATMENT FOR HEAT STROKE:",
            "  - Call 108/112 immediately",
            "  - Move to cool place",
            "  - Remove excess clothing",
            "  - Cool with whatever means available:",
            "    * Immerse in cool water",
            "    * Spray with garden hose",
            "    * Sponge with cool water",
            "    * Place ice packs/wet towels on neck, armpits, groin",
            "  - Do not give anything to drink if unconscious",
            "  - Monitor breathing",
            "PREVENTION:",
            "  - Drink plenty of fluids",
            "  - Wear loose, lightweight clothing",
            "  - Avoid strenuous activity during hottest parts of day",
            "  - Never leave anyone in parked car"
        ]
    
    @staticmethod
    def hypothermia_protocol():
        """
        Protocol for cold exposure and hypothermia
        """
        return [
            "RECOGNIZE HYPOTHERMIA:",
            "  - Shivering (may stop in severe cases)",
            "  - Cold, pale skin",
            "  - Slurred speech",
            "  - Slow breathing",
            "  - Weak pulse",
            "  - Clumsiness, lack of coordination",
            "  - Confusion, drowsiness",
            "  - Loss of consciousness",
            "IMMEDIATE ACTION:",
            "  - Call 108/112 for severe hypothermia",
            "  - Move to warm, dry place if possible",
            "  - Remove wet clothing",
            "  - Cover with dry blankets/coats",
            "WARMING METHODS:",
            "  - Warm the center of body first (chest, neck, head, groin)",
            "  - Use skin-to-skin contact under loose, dry layers",
            "  - Warm, dry compresses to chest, neck, groin",
            "  - If conscious and able to swallow: warm, sweet non-alcoholic drinks",
            "DO NOT:",
            "  - Apply direct heat (heating pads, hot water, lamps)",
            "  - Massage or rub the person",
            "  - Give alcohol",
            "  - Allow person to walk if severe hypothermia",
            "  - Remove clothing in the field if no dry replacement",
            "IF UNCONSCIOUS:",
            "  - Check breathing",
            "  - Begin CPR if no breathing or pulse",
            "  - Handle gently - rough handling can cause cardiac arrest",
            "  - Continue warming efforts during CPR",
            "TRANSPORT:",
            "  - Keep horizontal if possible",
            "  - Continue warming during transport",
            "  - Monitor breathing and pulse"
        ]
    
    @staticmethod
    def drowning_protocol():
        """
        Protocol for drowning and near-drowning incidents
        """
        return [
            "SAFETY FIRST:",
            "  - Do not enter water unless trained and safe to do so",
            "  - Reach, throw, row, go (in that order)",
            "  - Use flotation device if entering water",
            "IMMEDIATE ACTION:",
            "  - Call 108/112 immediately",
            "  - Remove from water quickly and safely",
            "  - Begin resuscitation if not breathing",
            "  - Do not waste time trying to drain water from lungs",
            "RESUSCITATION:",
            "  - Open airway",
            "  - Check breathing for 10 seconds",
            "  - If not breathing, give 2 rescue breaths",
            "  - If breaths go in, check pulse",
            "  - If no pulse, begin CPR with 30 chest compressions",
            "  - Continue 30:2 ratio",
            "  - Use AED when available",
            "SPECIAL CONSIDERATIONS:",
            "  - Vomiting is common - be prepared",
            "  - Turn head to side if vomiting occurs",
            "  - Clear mouth of debris",
            "  - Remove wet clothing and keep warm",
            "  - Handle gently if spinal injury suspected",
            "  - Stabilize neck if trauma suspected",
            "AFTER ROSC (RETURN OF SPONTANEOUS CIRCULATION):",
            "  - Place in recovery position",
            "  - Keep warm",
            "  - Monitor breathing and pulse",
            "  - Do not give food or drink",
            "  - Await EMS arrival",
            "SECONDARY DROWNING AWARENESS:",
            "  - Symptoms can develop hours after incident",
            "  - Watch for: coughing, chest pain, difficulty breathing",
            "  - Seek medical attention even if person seems fine"
        ]

# Emergency type to protocol mapping
PROTOCOL_MAP = {
    'choking': BCLSProtocols.choking_protocol,
    'bleeding': BCLSProtocols.severe_bleeding_protocol,
    'cardiac': BCLSProtocols.cardiac_arrest_protocol,
    'unconscious': BCLSProtocols.unconscious_protocol,
    'snake': BCLSProtocols.snake_bite_protocol,
    'burn': BCLSProtocols.burn_protocol,
    'fracture': BCLSProtocols.fracture_protocol,
    'stroke': BCLSProtocols.stroke_protocol,
    'seizure': BCLSProtocols.seizure_protocol,
    'diabetic': BCLSProtocols.diabetic_emergency_protocol,
    'allergic': BCLSProtocols.allergic_reaction_protocol,
    'heat': BCLSProtocols.heat_emergency_protocol,
    'cold': BCLSProtocols.hypothermia_protocol,
    'drowning': BCLSProtocols.drowning_protocol,
    'universal': BCLSProtocols.universal_assessment
}

def get_protocol(protocol_name, **kwargs):
    """
    Get protocol steps by name with optional parameters
    """
    if protocol_name in PROTOCOL_MAP:
        protocol_func = PROTOCOL_MAP[protocol_name]
        return protocol_func(**kwargs) if kwargs else protocol_func()
    else:
        return ["Protocol not found. Please specify a valid emergency type."]

def list_all_protocols():
    """
    List all available protocols
    """
    return list(PROTOCOL_MAP.keys())

if __name__ == "__main__":
    # Test the protocol system
    print("Available Protocols:", list_all_protocols())
    print("\nUniversal Assessment Steps:")
    for i, step in enumerate(get_protocol('universal'), 1):
        print(f"{i}. {step}")