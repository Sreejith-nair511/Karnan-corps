from app.models.schemas import ChatRequest, ChatResponse
from app.core.database import get_db
from app.models.models import ChatMessage

async def process_chat_message(request: ChatRequest) -> ChatResponse:
    """
    Process a chat message.
    This is a mock implementation for demonstration.
    """
    # Mock responses based on intent
    intent_responses = {
        "eligibility_check": {
            "en": "To check your eligibility for PM Surya Ghar, you need to be a resident of India with a suitable rooftop. The roof should have adequate space and structural integrity for solar panel installation.",
            "hi": "पीएम सूर्य घर के लिए पात्रता की जांच करने के लिए, आपको भारत का निवासी होना चाहिए जिसके पास सौर पैनल स्थापना के लिए पर्याप्त स्थान और संरचनात्मक अखंडता वाली एक उपयुक्त छत हो।",
            "ml": "പിഎം സൂര്യ ഘർ എന്നതിന് പാത്രത പരിശോധിക്കാൻ, നിങ്ങൾ സൗര പാനൽ ഇൻസ്റ്റാളേഷന് ആവശ്യമായ മതിയായ സ്ഥലവും ഘടനാപരമായ അഖണ്ഡതയുള്ള ഒരു ഉചിതമായ മേൽക്കൂരയുള്ള ഇന്ത്യയിലെ ഒരു താമസക്കാരനായിരിക്കണം.",
            "ta": "பிஎம் சூரியா காட்டிற்கு தகுதி சோதிக்க, நீங்கள் சோலார் பேனல் நிறுவலுக்கு போதுமான இடம் மற்றும் கட்டுமான நேர்மையைக் கொண்ட ஏற்ற வகையிலான கூரையைக் கொண்ட இந்தியாவின் குடிமகனாக இருக்க வேண்டும்."
        },
        "application_steps": {
            "en": "To apply for PM Surya Ghar: 1) Register on the official portal, 2) Submit required documents, 3) Get your rooftop assessed, 4) Receive approval and subsidy details, 5) Install solar panels through empaneled vendors.",
            "hi": "पीएम सूर्य घर के लिए आवेदन करने के लिए: 1) आधिकारिक पोर्टल पर पंजीकरण करें, 2) आवश्यक दस्तावेज जमा करें, 3) अपनी छत का आकलन करवाएं, 4) अनुमोदन और सब्सिडी विवरण प्राप्त करें, 5) सूचीबद्ध विक्रेताओं के माध्यम से सौर पैनल स्थापित करें।",
            "ml": "പിഎം സൂര്യഘർ എന്നതിന് അപേക്ഷിക്കാൻ: 1) ഔദ്യോഗിക പോർട്ടലിൽ രജിസ്റ്റർ ചെയ്യുക, 2) ആവശ്യമായ പ്രമാണങ്ങൾ സമർപ്പിക്കുക, 3) നിങ്ങളുടെ മേൽക്കൂര വിലയിരുത്താൻ നൽകുക, 4) അംഗീകാരവും സബ്സിഡി വിശദാംശങ്ങളും സ്വീകരിക്കുക, 5) എംപനൽ ചെയ്ത വിൽപ്പനക്കാരന്മാർ വഴി സൗര പാനൽ ഇൻസ്റ്റാൾ ചെയ്യുക.",
            "ta": "பிஎம் சூரியா காட்டிற்கு விண்ணப்பிக்க: 1) அதிகாரபூர்வ வலைத்தளத்தில் பதிவு செய்யவும், 2) தேவையான ஆவணங்களை சமர்ப்பிக்கவும், 3) உங்கள் கூரையை மதிப்பீடு செய்ய வைக்கவும், 4) அங்கீகாரம் மற்றும் மானிய விவரங்களைப் பெறுங்கள், 5) பட்டியலிடப்பட்ட விற்பனையாளர்கள் மூலம் சோலார் பேனல்களை நிறுவவும்."
        },
        "required_documents": {
            "en": "Required documents for PM Surya Ghar: 1) Aadhaar card, 2) Electricity bill, 3) Property ownership proof, 4) Bank account details, 5) Passport size photo.",
            "hi": "पीएम सूर्य घर के लिए आवश्यक दस्तावेज: 1) आधार कार्ड, 2) बिजली बिल, 3) संपत्ति स्वामित्व प्रमाण, 4) बैंक खाता विवरण, 5) पासपोर्ट आकार की तस्वीर।",
            "ml": "പിഎം സൂര്യഘർ എന്നതിന് ആവശ്യമായ പ്രമാണങ്ങൾ: 1) ആധാർ കാർഡ്, 2) വൈദ്യുതി ബിൽ, 3) സ്വത്തിന്റെ ഉടമസ്ഥാവകാശ തെളിവ്, 4) ബാങ്ക് അക്കൗണ്ട് വിശദാംശങ്ങൾ, 5) പാസ്പോർട്ട് വലിപ്പ ഫോട്ടോ.",
            "ta": "பிஎம் சூரியா காட்டிற்கு தேவையான ஆவணங்கள்: 1) ஆதார் கார்டு, 2) மின்சார பில், 3) சொத்து உரிமை சான்று, 4) வங்கி கணக்கு விவரங்கள், 5) கடமை அளவு புகைப்படம்."
        },
        "grievance_procedure": {
            "en": "For grievances related to PM Surya Ghar: Contact the helpline number 1800-123-4567 or email support@pmsuryaghar.gov.in. You can also visit the nearest district office with your application number and details of the issue.",
            "hi": "पीएम सूर्य घर से संबंधित शिकायतों के लिए: हेल्पलाइन नंबर 1800-123-4567 पर संपर्क करें या support@pmsuryaghar.gov.in पर ईमेल करें। आप अपने आवेदन संख्या और समस्या के विवरण के साथ निकटतम जिला कार्यालय भी जा सकते हैं।",
            "ml": "പിഎം സൂര്യഘർ എന്നതുമായി ബന്ധപ്പെട്ട പരാതികൾക്ക്: ഹെൽപ്പ് ലൈൻ നമ്പർ 1800-123-4567 എന്നതിൽ ബന്ധപ്പെടുക അല്ലെങ്കിൽ support@pmsuryaghar.gov.in എന്നതിലേക്ക് ഇമെയിൽ ചെയ്യുക. നിങ്ങളുടെ അപേക്ഷണ നമ്പറും പ്രശ്നത്തിന്റെ വിശദാംശങ്ങളും കൊണ്ട് ഏറ്റവും അടുത്തുള്ള ജില്ലാ ഓഫീസിലേക്ക് ചെന്ന് സന്ദർശിക്കാം.",
            "ta": "பிஎம் சூரியா காட்டுடன் தொடர்புடைய மனநிலைகளுக்கு: உதவி எண் 1800-123-4567 ஐ தொடர்பு கொள்ளவும் அல்லது support@pmsuryaghar.gov.in க்கு மின்னஞ்சல் அனுப்பவும். உங்கள் விண்ணப்ப எண் மற்றும் சிக்கலின் விவரங்களுடன் அருகிலுள்ள மாவட்ட அலுவலகத்தை நீங்கள் பார்வையிடலாம்."
        }
    }
    
    # Determine intent from message (simplified)
    message_lower = request.message.lower()
    intent = "general"
    if "eligibility" in message_lower or "eligible" in message_lower:
        intent = "eligibility_check"
    elif "apply" in message_lower or "application" in message_lower or "step" in message_lower:
        intent = "application_steps"
    elif "document" in message_lower or "paper" in message_lower:
        intent = "required_documents"
    elif "complaint" in message_lower or "issue" in message_lower or "problem" in message_lower:
        intent = "grievance_procedure"
    
    # Get response based on intent and language
    response_text = intent_responses.get(intent, {}).get(request.lang, "I'm sorry, I didn't understand your question. Please try rephrasing or ask about eligibility, application steps, required documents, or grievance procedures.")
    
    # If no specific intent found, provide a general response
    if intent == "general":
        response_text = "I'm here to help with PM Surya Ghar information. You can ask about eligibility, application steps, required documents, or grievance procedures."
        if request.lang != "en":
            # Add translation for non-English languages
            translations = {
                "hi": "मैं पीएम सूर्य घर की जानकारी में मदद करने के लिए यहां हूं। आप पात्रता, आवेदन चरणों, आवश्यक दस्तावेजों या शिकायत प्रक्रिया के बारे में पूछ सकते हैं।",
                "ml": "പിഎം സൂര്യഘർ വിവരങ്ങളിൽ ഞാൻ സഹായിക്കാൻ ഇവിടെയുണ്ട്. പാത്രത, അപേക്ഷണ ഘട്ടങ്ങൾ, ആവശ്യമായ പ്രമാണങ്ങൾ അല്ലെങ്കിൽ പരാതി നടപടികൾ എന്നിവയെക്കുറിച്ച് നിങ്ങൾക്ക് ചോദിക്കാം.",
                "ta": "பிஎம் சூரியா காட்டு தகவல்களில் உதவ நான் இங்கே உள்ளேன். தகுதி, விண்ணப்ப படிகள், தேவையான ஆவணங்கள் அல்லது மனநிலை நடபடிகள் பற்றி நீங்கள் கேட்கலாம்."
            }
            response_text = translations.get(request.lang, response_text)
    
    # Save chat message to database
    async with get_db() as db:
        chat_message = ChatMessage(
            lang=request.lang,
            message=request.message,
            response=response_text,
            context=request.context
        )
        db.add(chat_message)
        await db.commit()
    
    return ChatResponse(
        response=response_text,
        lang=request.lang,
        context=request.context
    )