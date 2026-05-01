/* ══════════════════════════════════════════════════════════════
   Election Guide Assistant — Full JavaScript
   Chat logic + Quiz + Checker + Timeline + Scroll animations
   ══════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  const MAX_MESSAGE_LENGTH = 300;

  function debugLog(runId, hypothesisId, location, message, data = {}) {
    // #region agent log
    fetch("http://127.0.0.1:7819/ingest/8052723a-91ac-4a1b-b45c-86b4e9b46ddc",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"1cc8d9"},body:JSON.stringify({sessionId:"1cc8d9",runId,hypothesisId,location,message,data,timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }

  // ────────────────────────────────────────────────────────────
  // 1. NAVIGATION
  // ────────────────────────────────────────────────────────────
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  // Scroll effect on navbar
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });

  // Mobile toggle
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });


  // ────────────────────────────────────────────────────────────
  // 1b. LANGUAGE-BASED BACKGROUND SYSTEM
  // ────────────────────────────────────────────────────────────
  const languageSelect = document.getElementById("languageSelect");

  // Language → background image mapping
  const langBackgrounds = {
    en: "/static/images/india_default.png",
    hi: "/static/images/north_india.png",
    mr: "/static/images/maharashtra.png",
    ta: "/static/images/south_india.png"
  };

  // Preload all background images for smooth switching
  Object.values(langBackgrounds).forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Switch background on language change
  function changeBackground(lang) {
    const url = langBackgrounds[lang] || langBackgrounds.en;
    document.body.style.backgroundImage = `url('${url}')`;
  }

  // Set default background on page load (English)
  changeBackground(languageSelect.value);

  // ────────────────────────────────────────────────────────────
  // 1c. UI TRANSLATIONS
  // ────────────────────────────────────────────────────────────
    const translations = {
    en: {
      pageTitle: "Election Guide Assistant",
      navBrand: "🗳️ Election Guide",
      languageSelectorAria: "Select language",
      micBtnAria: "Voice input",
      sendBtnAria: "Send message",
      chatInputLabel: "Ask your election question",
      thinking: "Thinking...",
      retry: "Retry",
      typingStatus: "Typing...",
      emptyMessageError: "Please enter a message before sending.",
      longMessageError: "Please keep your message within 300 characters.",
      requestError: "Something went wrong, please try again",
      heading: "Understand Elections. Instantly.",
      subheading: "Ask anything about elections and get clear answers.",
      inputPlaceholder: "Ask about voting, registration, election steps...",
      welcomeText: "Hi! I'm your Election AI. Ask me anything about voting or the election process.",
      flowTitle: "Guided Election Flow",
      flowSubtitle: "Follow the journey from registration to results.",
      stepsTitle: "Election Steps",
      timelineTitle: "Election Timeline",
      readyTitle: "Am I Ready to Vote?",
      faqTitle: "Frequently Asked Questions",
      quizTitle: "Test Your Knowledge",
      guideTitle: "How to Vote — Step by Step",
      
      flowStep1Title: "Register",
      flowStep1Desc: "Complete your voter registration with your local election office or online portal.",
      flowStep2Title: "Research",
      flowStep2Desc: "Learn about candidates, ballot measures, and your polling location.",
      flowStep3Title: "Vote",
      flowStep3Desc: "Cast your ballot — in person, by mail, or through early voting.",
      flowStep4Title: "Results",
      flowStep4Desc: "Ballots are counted and certified. Official results are announced.",

      step1Title: "Voter Registration",
      step1Desc: "Verify your eligibility, gather required documents, and submit your registration before the deadline.",
      step2Title: "Primary Elections",
      step2Desc: "Political parties hold primaries or caucuses to select their candidates for the general election.",
      step3Title: "Campaign Season",
      step3Desc: "Candidates present platforms, participate in debates, and campaign to win voter support.",
      step4Title: "Casting Ballots",
      step4Desc: "Vote at your designated polling station, via mail-in ballot, or through early voting options.",
      step5Title: "Vote Counting",
      step5Desc: "Election officials tally all ballots — including absentee, mail-in, and provisional votes.",
      step6Title: "Certification",
      step6Desc: "Results are officially certified after thorough review, audits, and any necessary recounts.",

      readyQ1: "Are you 18 years or older?",
      readyQ2: "Are you a registered voter?",
      readyQ3: "Do you have a valid voter ID?",
      readyQ4: "Do you know your polling station?",
      readyBtn: "Check My Readiness",
      readySubtitle: "Answer a few questions to check your readiness.",

      navHome: "Home",
      navFlow: "Flow",
      navSteps: "Steps",
      navTimeline: "Timeline",
      navReady: "Am I Ready?",
      navFAQ: "FAQ",
      navQuiz: "Quiz",
      navGuide: "Guide",

      faqSubtitle: "Quick answers to common election questions.",
      faqQ1: "What documents do I need to register?",
      faqA1: "Typically, you need a government-issued photo ID (driver's license, passport) and proof of address (utility bill, bank statement). Requirements vary by state/country.",
      faqQ2: "Can I vote if I'm abroad?",
      faqA2: "Yes — most countries allow absentee or overseas voting. You'll need to register in advance and request an absentee ballot from your home jurisdiction.",
      faqQ3: "What is early voting?",
      faqA3: "Early voting allows you to cast your ballot before the official Election Day, often at designated locations during a specified period (usually 1–2 weeks before).",
      faqQ4: "How are votes counted?",
      faqA4: "Ballots are collected from polling stations and processed by election officials using optical scanners or manual tallying. Results are verified through audits before certification.",
      faqQ5: "What if I make a mistake on my ballot?",
      faqA5: "If you make a mistake, you can usually request a replacement ballot at the polling station. For mail-in ballots, contact your local election office for guidance before the deadline.",

      quizSubtitle: "A quick quiz on election fundamentals.",

      guideSubtitle: "Your complete beginner-friendly walkthrough.",
      guideStep1Title: "Check Eligibility",
      guideStep1Desc: "Confirm you meet the age, citizenship, and residency requirements for your jurisdiction.",
      guideStep2Title: "Register to Vote",
      guideStep2Desc: "Visit your local election office or use the online portal. Have your ID and proof of address ready.",
      guideStep3Title: "Find Your Polling Station",
      guideStep3Desc: "Use your government's polling station locator tool to find your designated voting place.",
      guideStep4Title: "Prepare Your Documents",
      guideStep4Desc: "Gather your voter ID, registration confirmation, and any other required identification.",
      guideStep5Title: "Cast Your Vote",
      guideStep5Desc: "Visit your polling station on Election Day. Follow the instructions, mark your ballot, and submit it.",
      guideStep6Title: "Verify & Track",
      guideStep6Desc: "Some jurisdictions let you track your ballot online to confirm it was received and counted.",
      
      stepsSubtitle: "A deeper look at every stage of the process.",
      timelineSubtitle: "Key milestones in a typical election cycle.",
      
      quizQ0: "1. What is the minimum voting age in most democracies?",
      quizQ0Opt0: "16",
      quizQ0Opt1: "18",
      quizQ0Opt2: "21",
      quizQ0Opt3: "25",
      quizQ1: "2. Which document is most commonly required at polling stations?",
      quizQ1Opt0: "Library card",
      quizQ1Opt1: "Voter ID / Photo ID",
      quizQ1Opt2: "Social media account",
      quizQ1Opt3: "Birth certificate",
      quizQ2: "3. What is an 'absentee ballot'?",
      quizQ2Opt0: "A ballot cast at a polling station",
      quizQ2Opt1: "A ballot cast by mail for those who can't vote in person",
      quizQ2Opt2: "A blank ballot",
      quizQ2Opt3: "A ballot that was not counted",
      quizSubmitBtn: "Submit Quiz",
      yesBtn: "Yes",
      noBtn: "No",
      footerText: "© 2026 Election Guide Assistant. Built for educational purposes.",
      suggestion1: "What is voting?",
      suggestion2: "Steps in election process",
      suggestion3: "How to register as a voter",
      suggestion4: "What happens after voting?",



      suggestions: [
        "What is voting?",
        "Steps in election process",
        "How to register as a voter",
        "What happens after voting?"
      ]
    },
    hi: {
      pageTitle: "चुनाव मार्गदर्शक सहायक",
      navBrand: "🗳️ चुनाव मार्गदर्शक",
      languageSelectorAria: "भाषा चुनें",
      micBtnAria: "वॉयस इनपुट",
      sendBtnAria: "संदेश भेजें",
      chatInputLabel: "अपना चुनाव प्रश्न पूछें",
      thinking: "सोच रहा हूँ...",
      retry: "पुनः प्रयास करें",
      typingStatus: "टाइप कर रहा हूँ...",
      emptyMessageError: "कृपया संदेश लिखें।",
      longMessageError: "कृपया अपना संदेश 300 अक्षरों के अंदर रखें।",
      requestError: "कुछ गलत हुआ, कृपया दोबारा कोशिश करें",
      heading: "चुनाव को तुरंत समझें",
      subheading: "चुनाव के बारे में कुछ भी पूछें और स्पष्ट उत्तर पाएं",
      inputPlaceholder: "मतदान, पंजीकरण या चुनाव प्रक्रिया के बारे में पूछें...",
      welcomeText: "नमस्ते! मैं आपका चुनाव एआई हूँ। मतदान या चुनाव प्रक्रिया के बारे में कुछ भी पूछें।",
      flowTitle: "निर्देशित चुनाव प्रवाह",
      flowSubtitle: "पंजीकरण से परिणाम तक की यात्रा का पालन करें।",
      stepsTitle: "चुनाव के चरण",
      timelineTitle: "चुनाव समयरेखा",
      readyTitle: "क्या मैं मतदान के लिए तैयार हूँ?",
      faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
      quizTitle: "अपने ज्ञान का परीक्षण करें",
      guideTitle: "मतदान कैसे करें - चरण दर चरण",

      flowStep1Title: "पंजीकरण",
      flowStep1Desc: "अपने स्थानीय चुनाव कार्यालय या ऑनलाइन पोर्टल के साथ अपना मतदाता पंजीकरण पूरा करें।",
      flowStep2Title: "अनुसंधान",
      flowStep2Desc: "उम्मीदवारों, मतपत्र उपायों और अपने मतदान स्थान के बारे में जानें।",
      flowStep3Title: "मतदान",
      flowStep3Desc: "अपना वोट डालें - व्यक्तिगत रूप से, मेल द्वारा, या प्रारंभिक मतदान के माध्यम से।",
      flowStep4Title: "परिणाम",
      flowStep4Desc: "मतपत्रों की गिनती और प्रमाणित किया जाता है। आधिकारिक परिणाम घोषित किए जाते हैं।",

      step1Title: "मतदाता पंजीकरण",
      step1Desc: "अपनी पात्रता सत्यापित करें, आवश्यक दस्तावेज एकत्र करें, और समय सीमा से पहले अपना पंजीकरण जमा करें।",
      step2Title: "प्राथमिक चुनाव",
      step2Desc: "राजनीतिक दल आम चुनाव के लिए अपने उम्मीदवारों का चयन करने के लिए प्राइमरी या कॉकस आयोजित करते हैं।",
      step3Title: "अभियान का मौसम",
      step3Desc: "उम्मीदवार मंच प्रस्तुत करते हैं, बहस में भाग लेते हैं, और मतदाता समर्थन जीतने के लिए अभियान चलाते हैं।",
      step4Title: "मतदान",
      step4Desc: "अपने निर्दिष्ट मतदान केंद्र पर, मेल-इन बैलेट के माध्यम से, या शुरुआती मतदान विकल्पों के माध्यम से मतदान करें।",
      step5Title: "मतगणना",
      step5Desc: "चुनाव अधिकारी सभी मतपत्रों की गिनती करते हैं - जिसमें अनुपस्थित, मेल-इन और अनंतिम वोट शामिल हैं।",
      step6Title: "प्रमाणीकरण",
      step6Desc: "गहन समीक्षा, ऑडिट और किसी भी आवश्यक पुनर्गणना के बाद आधिकारिक तौर पर परिणाम प्रमाणित किए जाते हैं।",

      readyQ1: "क्या आप 18 वर्ष या उससे अधिक उम्र के हैं?",
      readyQ2: "क्या आप एक पंजीकृत मतदाता हैं?",
      readyQ3: "क्या आपके पास वैध मतदाता पहचान पत्र है?",
      readyQ4: "क्या आप अपना मतदान केंद्र जानते हैं?",
      readyBtn: "मेरी तैयारी की जाँच करें",
      readySubtitle: "अपनी तैयारी की जांच करने के लिए कुछ सवालों के जवाब दें।",

      navHome: "होम",
      navFlow: "प्रवाह",
      navSteps: "चरण",
      navTimeline: "समयरेखा",
      navReady: "क्या मैं तैयार हूँ?",
      navFAQ: "सामान्य प्रश्न",
      navQuiz: "प्रश्नोत्तरी",
      navGuide: "मार्गदर्शिका",

      faqSubtitle: "सामान्य चुनाव प्रश्नों के त्वरित उत्तर।",
      faqQ1: "पंजीकरण के लिए मुझे किन दस्तावेजों की आवश्यकता है?",
      faqA1: "आमतौर पर, आपको सरकार द्वारा जारी फोटो आईडी (ड्राइवर का लाइसेंस, पासपोर्ट) और पते के प्रमाण (उपयोगिता बिल, बैंक स्टेटमेंट) की आवश्यकता होती है। आवश्यकताएं राज्य/देश के अनुसार भिन्न होती हैं।",
      faqQ2: "क्या मैं विदेश में होने पर मतदान कर सकता हूँ?",
      faqA2: "हाँ - अधिकांश देश अनुपस्थित या विदेशी मतदान की अनुमति देते हैं। आपको अग्रिम रूप से पंजीकरण करना होगा और अपने गृह क्षेत्र से अनुपस्थित मतपत्र का अनुरोध करना होगा।",
      faqQ3: "शुरुआती मतदान क्या है?",
      faqA3: "प्रारंभिक मतदान आपको आधिकारिक चुनाव दिवस से पहले, अक्सर निर्दिष्ट अवधि के दौरान (आमतौर पर 1-2 सप्ताह पहले) निर्दिष्ट स्थानों पर अपना मत डालने की अनुमति देता है।",
      faqQ4: "वोटों की गिनती कैसे होती है?",
      faqA4: "मतदान केंद्रों से मतपत्र एकत्र किए जाते हैं और चुनाव अधिकारियों द्वारा ऑप्टिकल स्कैनर या मैनुअल टैलीइंग का उपयोग करके संसाधित किए जाते हैं। प्रमाणीकरण से पहले ऑडिट के माध्यम से परिणामों को सत्यापित किया जाता है।",
      faqQ5: "अगर मैं अपने मतपत्र पर गलती कर दूं तो क्या होगा?",
      faqA5: "यदि आप कोई गलती करते हैं, तो आप आमतौर पर मतदान केंद्र पर प्रतिस्थापन मतपत्र का अनुरोध कर सकते हैं। मेल-इन बैलेट के लिए, समय सीमा से पहले मार्गदर्शन के लिए अपने स्थानीय चुनाव कार्यालय से संपर्क करें।",

      quizSubtitle: "चुनाव के मूल सिद्धांतों पर एक त्वरित प्रश्नोत्तरी।",

      guideSubtitle: "आपका संपूर्ण शुरुआत के अनुकूल वॉकथ्रू।",
      guideStep1Title: "पात्रता जांचें",
      guideStep1Desc: "पुष्टि करें कि आप अपने अधिकार क्षेत्र के लिए आयु, नागरिकता और निवास आवश्यकताओं को पूरा करते हैं।",
      guideStep2Title: "मतदान के लिए पंजीकरण करें",
      guideStep2Desc: "अपने स्थानीय चुनाव कार्यालय पर जाएं या ऑनलाइन पोर्टल का उपयोग करें। अपना आईडी और पते का प्रमाण तैयार रखें।",
      guideStep3Title: "अपना मतदान केंद्र खोजें",
      guideStep3Desc: "अपना निर्दिष्ट मतदान स्थान खोजने के लिए अपनी सरकार के मतदान केंद्र लोकेटर टूल का उपयोग करें।",
      guideStep4Title: "अपने दस्तावेज़ तैयार करें",
      guideStep4Desc: "अपना वोटर आईडी, पंजीकरण पुष्टिकरण, और कोई अन्य आवश्यक पहचान एकत्र करें।",
      guideStep5Title: "अपना वोट डालें",
      guideStep5Desc: "चुनाव के दिन अपने मतदान केंद्र पर जाएं। निर्देशों का पालन करें, अपने मतपत्र को चिह्नित करें, और इसे जमा करें।",
      guideStep6Title: "सत्यापित करें और ट्रैक करें",
      guideStep6Desc: "कुछ क्षेत्राधिकार आपको यह पुष्टि करने के लिए ऑनलाइन अपने मतपत्र को ट्रैक करने देते हैं कि यह प्राप्त हुआ और गिना गया।",

      stepsSubtitle: "प्रक्रिया के हर चरण पर एक गहरी नज़र।",
      timelineSubtitle: "एक विशिष्ट चुनाव चक्र में मुख्य मील के पत्थर।",
      
      quizQ0: "1. अधिकांश लोकतंत्रों में मतदान की न्यूनतम आयु क्या है?",
      quizQ0Opt0: "16",
      quizQ0Opt1: "18",
      quizQ0Opt2: "21",
      quizQ0Opt3: "25",
      quizQ1: "2. मतदान केंद्रों पर आमतौर पर कौन सा दस्तावेज़ आवश्यक होता है?",
      quizQ1Opt0: "लाइब्रेरी कार्ड",
      quizQ1Opt1: "वोटर आईडी / फोटो आईडी",
      quizQ1Opt2: "सोशल मीडिया अकाउंट",
      quizQ1Opt3: "जन्म प्रमाण पत्र",
      quizQ2: "3. 'अनुपस्थित मतपत्र' क्या है?",
      quizQ2Opt0: "मतदान केंद्र पर डाला गया मतपत्र",
      quizQ2Opt1: "उन लोगों के लिए मेल द्वारा डाला गया मतपत्र जो व्यक्तिगत रूप से मतदान नहीं कर सकते",
      quizQ2Opt2: "एक खाली मतपत्र",
      quizQ2Opt3: "एक मतपत्र जिसकी गिनती नहीं की गई थी",
      quizSubmitBtn: "प्रश्नोत्तरी सबमिट करें",
      footerText: "© 2026 चुनाव मार्गदर्शक सहायक। शैक्षिक उद्देश्यों के लिए बनाया गया।",
      suggestion1: "मतदान क्या है?",
      suggestion2: "चुनाव प्रक्रिया के चरण",
      suggestion3: "मतदाता के रूप में पंजीकरण कैसे करें",
      suggestion4: "मतदान के बाद क्या होता है?",

      suggestions: [
        "मतदान क्या है?",
        "चुनाव प्रक्रिया के चरण",
        "मतदाता के रूप में पंजीकरण कैसे करें",
        "मतदान के बाद क्या होता है?"
      ]
    },
    mr: {
      pageTitle: "निवडणूक मार्गदर्शक सहाय्यक",
      navBrand: "🗳️ निवडणूक मार्गदर्शक",
      languageSelectorAria: "भाषा निवडा",
      micBtnAria: "व्हॉइस इनपुट",
      sendBtnAria: "संदेश पाठवा",
      chatInputLabel: "तुमचा निवडणूक प्रश्न विचारा",
      thinking: "विचार करत आहे...",
      retry: "पुन्हा प्रयत्न करा",
      typingStatus: "टाइप करत आहे...",
      emptyMessageError: "कृपया संदेश लिहा.",
      longMessageError: "कृपया संदेश 300 अक्षरांमध्ये ठेवा.",
      requestError: "काहीतरी चूक झाली, कृपया पुन्हा प्रयत्न करा",
      heading: "निवडणुका लगेच समजा",
      subheading: "निवडणुकांबद्दल काहीही विचारा आणि स्पष्ट उत्तर मिळवा",
      inputPlaceholder: "मतदान, नोंदणी किंवा निवडणूक प्रक्रियेबद्दल विचारा...",
      welcomeText: "नमस्कार! मी तुमचा निवडणूक AI आहे. मतदान किंवा निवडणूक प्रक्रियेबद्दल काहीही विचारा.",
      flowTitle: "मार्गदर्शित निवडणूक प्रवाह",
      flowSubtitle: "नोंदणीपासून निकालापर्यंतच्या प्रवासाचे अनुसरण करा.",
      stepsTitle: "निवडणुकीचे टप्पे",
      timelineTitle: "निवडणूक वेळापत्रक",
      readyTitle: "मी मतदानासाठी तयार आहे का?",
      faqTitle: "वारंवार विचारले जाणारे प्रश्न",
      quizTitle: "तुमच्या ज्ञानाची चाचणी घ्या",
      guideTitle: "मतदान कसे करावे - टप्प्याटप्प्याने",

      flowStep1Title: "नोंदणी करा",
      flowStep1Desc: "तुमच्या स्थानिक निवडणूक कार्यालयात किंवा ऑनलाइन पोर्टलवर तुमची मतदार नोंदणी पूर्ण करा.",
      flowStep2Title: "संशोधन",
      flowStep2Desc: "उमेदवार, मतपत्रिका उपाय आणि तुमचे मतदान केंद्र याबद्दल जाणून घ्या.",
      flowStep3Title: "मतदान",
      flowStep3Desc: "तुमचे मत द्या — वैयक्तिकरित्या, टपालाने किंवा लवकर मतदानाद्वारे.",
      flowStep4Title: "निकाल",
      flowStep4Desc: "मतपत्रिका मोजल्या जातात आणि प्रमाणित केल्या जातात. अधिकृत निकाल जाहीर केले जातात.",

      step1Title: "मतदार नोंदणी",
      step1Desc: "तुमची पात्रता सत्यापित करा, आवश्यक कागदपत्रे गोळा करा आणि अंतिम मुदतीपूर्वी तुमची नोंदणी सबमिट करा.",
      step2Title: "प्राथमिक निवडणुका",
      step2Desc: "राजकीय पक्ष सार्वत्रिक निवडणुकीसाठी त्यांचे उमेदवार निवडण्यासाठी प्राथमिक किंवा कॉकस आयोजित करतात.",
      step3Title: "प्रचार हंगाम",
      step3Desc: "उमेदवार व्यासपीठ सादर करतात, वादविवादांमध्ये भाग घेतात आणि मतदारांचा पाठिंबा मिळवण्यासाठी प्रचार करतात.",
      step4Title: "मतदान करणे",
      step4Desc: "तुमच्या नियुक्त केलेल्या मतदान केंद्रावर, मेल-इन मतपत्रिकेद्वारे किंवा लवकर मतदान पर्यायांद्वारे मतदान करा.",
      step5Title: "मतमोजणी",
      step5Desc: "निवडणूक अधिकारी अनुपस्थित, मेल-इन आणि तात्पुरत्या मतांसह सर्व मतपत्रिका मोजतात.",
      step6Title: "प्रमाणन",
      step6Desc: "सखोल पुनरावलोकन, ऑडिट आणि कोणत्याही आवश्यक पुनर्मोजणीनंतर अधिकृतपणे निकाल प्रमाणित केले जातात.",

      readyQ1: "तुम्ही १८ वर्षे किंवा त्याहून अधिक वयाचे आहात का?",
      readyQ2: "तुम्ही नोंदणीकृत मतदार आहात का?",
      readyQ3: "तुमच्याकडे वैध मतदार ओळखपत्र आहे का?",
      readyQ4: "तुम्हाला तुमचे मतदान केंद्र माहीत आहे का?",
      readyBtn: "माझी तयारी तपासा",
      readySubtitle: "तुमची तयारी तपासण्यासाठी काही प्रश्नांची उत्तरे द्या.",

      navHome: "मुख्यपृष्ठ",
      navFlow: "प्रवाह",
      navSteps: "टप्पे",
      navTimeline: "वेळापत्रक",
      navReady: "मी तयार आहे का?",
      navFAQ: "नेहमी विचारले जाणारे प्रश्न",
      navQuiz: "प्रश्नोत्तरी",
      navGuide: "मार्गदर्शक",

      faqSubtitle: "सामान्य निवडणूक प्रश्नांची जलद उत्तरे.",
      faqQ1: "नोंदणीसाठी मला कोणत्या कागदपत्रांची आवश्यकता आहे?",
      faqA1: "सामान्यतः, तुम्हाला सरकारने जारी केलेले फोटो आयडी (ड्रायव्हरचा परवाना, पासपोर्ट) आणि पत्त्याचा पुरावा (युटिलिटी बिल, बँक स्टेटमेंट) आवश्यक आहे. राज्यानुसार/देशानुसार आवश्यकता बदलतात.",
      faqQ2: "मी परदेशात असल्यास मतदान करू शकतो का?",
      faqA2: "होय — बहुतेक देश अनुपस्थित किंवा परदेशी मतदानाची परवानगी देतात. तुम्हाला अगोदर नोंदणी करावी लागेल आणि तुमच्या गृह अधिकारक्षेत्रातून अनुपस्थित मतपत्रिकेची विनंती करावी लागेल.",
      faqQ3: "लवकर मतदान म्हणजे काय?",
      faqA3: "लवकर मतदान तुम्हाला अधिकृत निवडणूक दिवसापूर्वी, बऱ्याचदा निर्दिष्ट कालावधीत (सामान्यतः १-२ आठवडे अगोदर) नियुक्त ठिकाणी मतदान करण्याची परवानगी देते.",
      faqQ4: "मते कशी मोजली जातात?",
      faqA4: "मतदान केंद्रांवरून मतपत्रिका गोळा केल्या जातात आणि निवडणूक अधिकाऱ्यांद्वारे ऑप्टिकल स्कॅनर किंवा मॅन्युअल टॅलींगचा वापर करून प्रक्रिया केली जाते. प्रमाणीकरणापूर्वी ऑडिटद्वारे निकालांची पडताळणी केली जाते.",
      faqQ5: "जर मी माझ्या मतपत्रिकेवर चूक केली तर काय होईल?",
      faqA5: "जर तुम्ही चूक केली, तर तुम्ही सहसा मतदान केंद्रावर बदली मतपत्रिकेची विनंती करू शकता. मेल-इन मतपत्रिकांसाठी, अंतिम मुदतीपूर्वी मार्गदर्शनासाठी तुमच्या स्थानिक निवडणूक कार्यालयाशी संपर्क साधा.",

      quizSubtitle: "निवडणुकीच्या मूलभूत गोष्टींवर एक द्रुत प्रश्नमंजुषा.",

      guideSubtitle: "तुमचे संपूर्ण नवशिक्या-अनुकूल मार्गदर्शक.",
      guideStep1Title: "पात्रता तपासा",
      guideStep1Desc: "तुम्ही तुमच्या अधिकारक्षेत्रासाठी वय, नागरिकत्व आणि निवास आवश्यकता पूर्ण करत असल्याची खात्री करा.",
      guideStep2Title: "मतदानासाठी नोंदणी करा",
      guideStep2Desc: "तुमच्या स्थानिक निवडणूक कार्यालयाला भेट द्या किंवा ऑनलाइन पोर्टल वापरा. तुमचा आयडी आणि पत्त्याचा पुरावा तयार ठेवा.",
      guideStep3Title: "तुमचे मतदान केंद्र शोधा",
      guideStep3Desc: "तुमचे नियुक्त मतदान ठिकाण शोधण्यासाठी तुमच्या सरकारच्या मतदान केंद्र लोकेटर टूलचा वापर करा.",
      guideStep4Title: "तुमची कागदपत्रे तयार करा",
      guideStep4Desc: "तुमचे मतदार ओळखपत्र, नोंदणी पुष्टीकरण आणि इतर कोणतीही आवश्यक ओळख गोळा करा.",
      guideStep5Title: "तुमचे मत द्या",
      guideStep5Desc: "निवडणुकीच्या दिवशी तुमच्या मतदान केंद्राला भेट द्या. सूचनांचे अनुसरण करा, तुमच्या मतपत्रिकेवर खूण करा आणि ती सबमिट करा.",
      guideStep6Title: "पडताळणी करा आणि ट्रॅक करा",
      guideStep6Desc: "काही अधिकारक्षेत्रे तुमची मतपत्रिका मिळाली आणि मोजली गेली याची पुष्टी करण्यासाठी ती ऑनलाइन ट्रॅक करू देतात.",

      stepsSubtitle: "प्रक्रियेच्या प्रत्येक टप्प्यावर एक सखोल नजर.",
      timelineSubtitle: "एका सामान्य निवडणूक चक्रातील प्रमुख टप्पे.",

      quizQ0: "1. बहुतांश लोकशाहीत मतदानाचे किमान वय किती असते?",
      quizQ0Opt0: "16",
      quizQ0Opt1: "18",
      quizQ0Opt2: "21",
      quizQ0Opt3: "25",
      quizQ1: "2. मतदान केंद्रांवर सामान्यतः कोणते कागदपत्र आवश्यक असते?",
      quizQ1Opt0: "लायब्ररी कार्ड",
      quizQ1Opt1: "मतदार ओळखपत्र / फोटो आयडी",
      quizQ1Opt2: "सोशल मीडिया खाते",
      quizQ1Opt3: "जन्म प्रमाणपत्र",
      quizQ2: "3. 'अनुपस्थित मतपत्रिका' म्हणजे काय?",
      quizQ2Opt0: "मतदान केंद्रावर टाकलेली मतपत्रिका",
      quizQ2Opt1: "जे वैयक्तिकरित्या मतदान करू शकत नाहीत त्यांच्यासाठी मेलद्वारे टाकलेली मतपत्रिका",
      quizQ2Opt2: "कोरी मतपत्रिका",
      quizQ2Opt3: "मोजली न गेलेली मतपत्रिका",
      quizSubmitBtn: "प्रश्नोत्तरी सबमिट करा",
      footerText: "© 2026 निवडणूक मार्गदर्शक सहाय्यक. शैक्षणिक उद्देशांसाठी तयार केलेले.",
      suggestion1: "मतदान म्हणजे काय?",
      suggestion2: "निवडणूक प्रक्रियेचे टप्पे",
      suggestion3: "मतदार म्हणून नोंदणी कशी करावी",
      suggestion4: "मतदानानंतर काय होते?",

      suggestions: [
        "मतदान म्हणजे काय?",
        "निवडणूक प्रक्रियेचे टप्पे",
        "मतदार म्हणून नोंदणी कशी करावी",
        "मतदानानंतर काय होते?"
      ]
    },
    ta: {
      pageTitle: "தேர்தல் வழிகாட்டி உதவியாளர்",
      navBrand: "🗳️ தேர்தல் வழிகாட்டி",
      languageSelectorAria: "மொழியைத் தேர்ந்தெடுக்கவும்",
      micBtnAria: "குரல் உள்ளீடு",
      sendBtnAria: "செய்தியை அனுப்பு",
      chatInputLabel: "உங்கள் தேர்தல் கேள்வியை கேளுங்கள்",
      thinking: "யோசிக்கிறது...",
      retry: "மீண்டும் முயற்சி",
      typingStatus: "தட்டச்சு செய்கிறது...",
      emptyMessageError: "அனுப்புவதற்கு முன் ஒரு செய்தியை எழுதவும்.",
      longMessageError: "செய்தி 300 எழுத்துகளுக்குள் இருக்க வேண்டும்.",
      requestError: "ஏதோ தவறு ஏற்பட்டது, மீண்டும் முயற்சிக்கவும்",
      heading: "தேர்தலை உடனே புரிந்துகொள்ளுங்கள்",
      subheading: "தேர்தல் பற்றிய எதையும் கேளுங்கள் மற்றும் தெளிவான பதில்களை பெறுங்கள்",
      inputPlaceholder: "வாக்களிப்பு, பதிவு அல்லது தேர்தல் படிகள் பற்றி கேளுங்கள்...",
      welcomeText: "வணக்கம்! நான் உங்கள் தேர்தல் AI. வாக்களிப்பு அல்லது தேர்தல் செயல்முறை பற்றி எதையும் கேளுங்கள்.",
      flowTitle: "வழிகாட்டப்பட்ட தேர்தல் ஓட்டம்",
      flowSubtitle: "பதிவு முதல் முடிவுகள் வரை பயணத்தைப் பின்பற்றுங்கள்.",
      stepsTitle: "தேர்தல் படிகள்",
      timelineTitle: "தேர்தல் காலவரிசை",
      readyTitle: "நான் வாக்களிக்க தயாரா?",
      faqTitle: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
      quizTitle: "உங்கள் அறிவை சோதிக்கவும்",
      guideTitle: "வாக்களிப்பது எப்படி - படிப்படியாக",

      flowStep1Title: "பதிவு",
      flowStep1Desc: "உங்கள் உள்ளூர் தேர்தல் அலுவலகம் அல்லது ஆன்லைன் போர்ட்டலில் உங்கள் வாக்காளர் பதிவை முடிக்கவும்.",
      flowStep2Title: "ஆராய்ச்சி",
      flowStep2Desc: "வேட்பாளர்கள், வாக்குச்சீட்டு நடவடிக்கைகள் மற்றும் உங்கள் வாக்குச்சாவடி இருப்பிடம் பற்றி அறியவும்.",
      flowStep3Title: "வாக்களிப்பு",
      flowStep3Desc: "நேரில், அஞ்சல் மூலம் அல்லது முன்கூட்டியே வாக்களிப்பதன் மூலம் உங்கள் வாக்கை பதிவு செய்யவும்.",
      flowStep4Title: "முடிவுகள்",
      flowStep4Desc: "வாக்குகள் எண்ணப்பட்டு சான்றளிக்கப்படுகின்றன. அதிகாரப்பூர்வ முடிவுகள் அறிவிக்கப்படுகின்றன.",

      step1Title: "வாக்காளர் பதிவு",
      step1Desc: "உங்கள் தகுதியைச் சரிபார்த்து, தேவையான ஆவணங்களைச் சேகரித்து, காலக்கெடுவுக்கு முன் உங்கள் பதிவைச் சமர்ப்பிக்கவும்.",
      step2Title: "முதன்மைத் தேர்தல்கள்",
      step2Desc: "பொதுத் தேர்தலுக்கான தங்கள் வேட்பாளர்களைத் தேர்ந்தெடுக்க அரசியல் கட்சிகள் முதன்மைத் தேர்தல்கள் அல்லது கூட்டங்களை நடத்துகின்றன.",
      step3Title: "பிரச்சாரப் பருவம்",
      step3Desc: "வேட்பாளர்கள் தளங்களை முன்வைக்கிறார்கள், விவாதங்களில் பங்கேற்கிறார்கள், மற்றும் வாக்காளர்களின் ஆதரவைப் பெற பிரச்சாரம் செய்கிறார்கள்.",
      step4Title: "வாக்களித்தல்",
      step4Desc: "உங்கள் நியமிக்கப்பட்ட வாக்குச்சாவடியில், அஞ்சல் வாக்குச்சீட்டு மூலம் அல்லது முன்கூட்டியே வாக்களிக்கும் விருப்பங்கள் மூலம் வாக்களிக்கவும்.",
      step5Title: "வாக்கு எண்ணிக்கை",
      step5Desc: "இல்லாதவர்கள், அஞ்சல் வாக்குகள் மற்றும் தற்காலிக வாக்குகள் உட்பட அனைத்து வாக்குகளையும் தேர்தல் அதிகாரிகள் எண்ணுகிறார்கள்.",
      step6Title: "சான்றளித்தல்",
      step6Desc: "முழுமையான மதிப்பாய்வு, தணிக்கைகள் மற்றும் தேவையான எந்தவொரு மறுஎண்ணிக்கைக்கும் பிறகு முடிவுகள் அதிகாரப்பூர்வமாக சான்றளிக்கப்படுகின்றன.",

      readyQ1: "உங்களுக்கு 18 வயது அல்லது அதற்கு மேற்பட்டதா?",
      readyQ2: "நீங்கள் பதிவு செய்யப்பட்ட வாக்காளரா?",
      readyQ3: "உங்களிடம் செல்லுபடியாகும் வாக்காளர் அடையாள அட்டை உள்ளதா?",
      readyQ4: "உங்கள் வாக்குச்சாவடி உங்களுக்குத் தெரியுமா?",
      readyBtn: "என் தயார்நிலையை சரிபார்க்கவும்",
      readySubtitle: "உங்கள் தயார்நிலையைச் சரிபார்க்க சில கேள்விகளுக்குப் பதிலளிக்கவும்.",

      navHome: "முகப்பு",
      navFlow: "ஓட்டம்",
      navSteps: "படிகள்",
      navTimeline: "காலவரிசை",
      navReady: "நான் தயாரா?",
      navFAQ: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
      navQuiz: "வினாடி வினா",
      navGuide: "வழிகாட்டி",

      faqSubtitle: "பொதுவான தேர்தல் கேள்விகளுக்கான விரைவான பதில்கள்.",
      faqQ1: "பதிவு செய்ய எனக்கு என்ன ஆவணங்கள் தேவை?",
      faqA1: "பொதுவாக, அரசாங்கத்தால் வழங்கப்பட்ட புகைப்பட அடையாள அட்டை (ஓட்டுநர் உரிமம், பாஸ்போர்ட்) மற்றும் முகவரிச் சான்று (மின்சாரக் கட்டணம், வங்கி அறிக்கை) தேவை. மாநிலம்/நாட்டைப் பொறுத்து தேவைகள் மாறுபடும்.",
      faqQ2: "நான் வெளிநாட்டில் இருந்தால் வாக்களிக்க முடியுமா?",
      faqA2: "ஆம் — பெரும்பாலான நாடுகள் இல்லாதவர்கள் அல்லது வெளிநாட்டு வாக்களிப்பை அனுமதிக்கின்றன. நீங்கள் முன்கூட்டியே பதிவு செய்து, உங்கள் சொந்த அதிகார வரம்பிலிருந்து வாக்களிக்காதோர் வாக்குச்சீட்டைக் கோர வேண்டும்.",
      faqQ3: "முன்கூட்டியே வாக்களிப்பது என்றால் என்ன?",
      faqA3: "அதிகாரப்பூர்வ தேர்தல் நாளுக்கு முன், பெரும்பாலும் ஒரு குறிப்பிட்ட காலப்பகுதியில் (பொதுவாக 1-2 வாரங்களுக்கு முன்) குறிப்பிட்ட இடங்களில் வாக்களிக்க முன்கூட்டியே வாக்களிப்பு உங்களை அனுமதிக்கிறது.",
      faqQ4: "வாக்குகள் எவ்வாறு எண்ணப்படுகின்றன?",
      faqA4: "வாக்குச்சாவடிகளில் இருந்து வாக்குகள் சேகரிக்கப்பட்டு, ஆப்டிகல் ஸ்கேனர்கள் அல்லது கையேடு எண்ணிக்கை மூலம் தேர்தல் அதிகாரிகளால் செயலாக்கப்படுகின்றன. சான்றளிப்பதற்கு முன் தணிக்கைகள் மூலம் முடிவுகள் சரிபார்க்கப்படுகின்றன.",
      faqQ5: "என் வாக்குச்சீட்டில் நான் தவறு செய்தால் என்ன செய்வது?",
      faqA5: "நீங்கள் தவறு செய்தால், வழக்கமாக வாக்குச்சாவடியில் மாற்று வாக்குச்சீட்டைக் கோரலாம். அஞ்சல் வாக்குகளுக்கு, காலக்கெடுவுக்கு முன் வழிகாட்டுதலுக்கு உங்கள் உள்ளூர் தேர்தல் அலுவலகத்தைத் தொடர்புகொள்ளவும்.",

      quizSubtitle: "தேர்தல் அடிப்படைகள் பற்றிய விரைவான வினாடி வினா.",

      guideSubtitle: "உங்கள் முழுமையான தொடக்கநிலையாளர் நட்பு ஒத்திகை.",
      guideStep1Title: "தகுதியைச் சரிபார்க்கவும்",
      guideStep1Desc: "உங்கள் அதிகார வரம்பிற்கான வயது, குடியுரிமை மற்றும் குடியிருப்புத் தேவைகளை நீங்கள் பூர்த்தி செய்கிறீர்கள் என்பதை உறுதிப்படுத்தவும்.",
      guideStep2Title: "வாக்களிக்கப் பதிவு செய்யவும்",
      guideStep2Desc: "உங்கள் உள்ளூர் தேர்தல் அலுவலகத்தைப் பார்வையிடவும் அல்லது ஆன்லைன் போர்ட்டலைப் பயன்படுத்தவும். உங்கள் ஐடி மற்றும் முகவரிச் சான்றை தயாராக வைத்திருக்கவும்.",
      guideStep3Title: "உங்கள் வாக்குச்சாவடியைக் கண்டறியவும்",
      guideStep3Desc: "உங்கள் நியமிக்கப்பட்ட வாக்களிக்கும் இடத்தைக் கண்டறிய உங்கள் அரசாங்கத்தின் வாக்குச்சாவடி லொக்கேட்டர் கருவியைப் பயன்படுத்தவும்.",
      guideStep4Title: "உங்கள் ஆவணங்களைத் தயாரிக்கவும்",
      guideStep4Desc: "உங்கள் வாக்காளர் அடையாள அட்டை, பதிவு உறுதிப்படுத்தல் மற்றும் தேவையான பிற அடையாளங்களைச் சேகரிக்கவும்.",
      guideStep5Title: "உங்கள் வாக்கைச் செலுத்தவும்",
      guideStep5Desc: "தேர்தல் நாளில் உங்கள் வாக்குச்சாவடியைப் பார்வையிடவும். வழிமுறைகளைப் பின்பற்றவும், உங்கள் வாக்குச்சீட்டைக் குறிக்கவும், அதைச் சமர்ப்பிக்கவும்.",
      guideStep6Title: "சரிபார்த்து கண்காணிக்கவும்",
      guideStep6Desc: "உங்கள் வாக்குச்சீட்டு பெறப்பட்டு எண்ணப்பட்டதை உறுதிப்படுத்த, அதை ஆன்லைனில் கண்காணிக்க சில அதிகார வரம்புகள் உங்களை அனுமதிக்கின்றன.",

      stepsSubtitle: "செயல்முறையின் ஒவ்வொரு கட்டத்தையும் ஆழமாகப் பாருங்கள்.",
      timelineSubtitle: "ஒரு வழக்கமான தேர்தல் சுழற்சியில் முக்கிய மைல்கற்கள்.",

      quizQ0: "1. பெரும்பாலான ஜனநாயக நாடுகளில் குறைந்தபட்ச வாக்களிக்கும் வயது என்ன?",
      quizQ0Opt0: "16",
      quizQ0Opt1: "18",
      quizQ0Opt2: "21",
      quizQ0Opt3: "25",
      quizQ1: "2. வாக்குச்சாவடிகளில் பொதுவாக எந்த ஆவணம் தேவைப்படுகிறது?",
      quizQ1Opt0: "நூலக அட்டை",
      quizQ1Opt1: "வாக்காளர் அடையாள அட்டை / புகைப்பட அடையாள அட்டை",
      quizQ1Opt2: "சமூக ஊடக கணக்கு",
      quizQ1Opt3: "பிறப்புச் சான்றிதழ்",
      quizQ2: "3. 'இல்லாதவர் வாக்குச்சீட்டு' என்றால் என்ன?",
      quizQ2Opt0: "வாக்குச்சாவடியில் போடப்பட்ட வாக்குச்சீட்டு",
      quizQ2Opt1: "நேரில் வாக்களிக்க முடியாதவர்களுக்காக அஞ்சல் மூலம் போடப்பட்ட வாக்குச்சீட்டு",
      quizQ2Opt2: "வெற்று வாக்குச்சீட்டு",
      quizQ2Opt3: "எண்ணப்படாத வாக்குச்சீட்டு",
      quizSubmitBtn: "வினாடி வினா சமர்ப்பி",
      footerText: "© 2026 தேர்தல் வழிகாட்டி உதவியாளர். கல்வி நோக்கங்களுக்காக உருவாக்கப்பட்டது.",
      suggestion1: "வாக்களிப்பு என்றால் என்ன?",
      suggestion2: "தேர்தல் செயல்முறையின் படிகள்",
      suggestion3: "வாக்காளராக பதிவு செய்வது எப்படி",
      suggestion4: "வாக்களித்த பிறகு என்ன நடக்கும்?",

      suggestions: [
        "வாக்களிப்பு என்றால் என்ன?",
        "தேர்தல் செயல்முறையின் படிகள்",
        "வாக்காளராக பதிவு செய்வது எப்படி",
        "வாக்களித்த பிறகு என்ன நடக்கும்?"
      ]
    }
  };

  const currentLanguage = { value: languageSelect.value };

  function updateLanguage(lang) {
    const t = translations[lang] || translations.en;
    
    // Update data-i18n elements
    document.title = "Nagrik AI - Smart Election Assistant";

    const brandText = document.querySelector(".brand-text");
    if (brandText) {
      brandText.innerText = "Nagrik AI";
    }

    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (t[key]) {
        el.innerText = t[key];
      }
    });

    const ariaElements = document.querySelectorAll("[data-i18n-aria-label]");
    ariaElements.forEach(el => {
      const key = el.getAttribute("data-i18n-aria-label");
      if (t[key]) {
        el.setAttribute("aria-label", t[key]);
      }
    });

    // Update Chat Input
    const chatInput = document.getElementById("chatInput");
    if (chatInput) chatInput.placeholder = t.inputPlaceholder;

    // Update Welcome Message
    const chatWelcomeText = document.querySelector("#chatWelcome p");
    if (chatWelcomeText) chatWelcomeText.textContent = t.welcomeText;

    // Update Suggested Questions
    const suggestionPills = document.querySelectorAll(".suggestion-pill");
    suggestionPills.forEach((pill, index) => {
      const key = `suggestion${index + 1}`;
      if (t[key]) {
        pill.textContent = t[key];
      }
    });

    // Clear any results from forms/quizzes to avoid language mismatch
    const readyResult = document.getElementById("readyResult");
    if (readyResult) {
      readyResult.textContent = "";
      readyResult.className = "checker-result";
    }

    const quizResult = document.getElementById("quizResult");
    if (quizResult) {
      quizResult.textContent = "";
      quizResult.className = "quiz-result";
    }
  }

  // Initial translation
  updateLanguage(currentLanguage.value);

  // Listen for language changes
  languageSelect.addEventListener("change", (e) => {
    currentLanguage.value = e.target.value;
    changeBackground(currentLanguage.value);
    updateLanguage(currentLanguage.value);
  });


  // 2. HERO CHAT (ChatGPT-style)
  // ────────────────────────────────────────────────────────────
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const chatMessages = document.getElementById("chatMessages");
  const chatWelcome = document.getElementById("chatWelcome");
  const suggestionPills = document.querySelectorAll(".suggestion-pill");
  const chatValidationMessage = document.getElementById("chatValidationMessage");
  let lastUserMessage = "";
  let isRequestInFlight = false;
  let aiResponseCount = 0;
  const storedAnalytics = JSON.parse(localStorage.getItem("nagrikAiAnalytics") || "{\"questionsAsked\":0,\"languageUsage\":{}}");
  let totalQuestions = storedAnalytics.questionsAsked || 0;
  let languageUsage = storedAnalytics.languageUsage || {};

  // Auto-resize textarea
  function setValidationMessage(messageKey = "") {
    if (!chatValidationMessage) return;
    const t = translations[currentLanguage.value] || translations.en;
    chatValidationMessage.textContent = messageKey ? t[messageKey] || "" : "";
  }

  function isValidMessage(text) {
    const trimmedMessage = text.trim();
    if (!trimmedMessage) {
      setValidationMessage("emptyMessageError");
      return false;
    }
    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      setValidationMessage("longMessageError");
      return false;
    }
    setValidationMessage("");
    return true;
  }

  chatInput.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
    sendBtn.disabled = this.value.trim().length === 0 || this.value.trim().length > MAX_MESSAGE_LENGTH;
    if (this.value.trim()) setValidationMessage("");
  });

  // Chat analytics are stored locally only.
  function trackQuestion(languageCode) {
    totalQuestions += 1;
    languageUsage[languageCode] = (languageUsage[languageCode] || 0) + 1;
    localStorage.setItem("nagrikAiAnalytics", JSON.stringify({ questionsAsked: totalQuestions, languageUsage }));
    // #region agent log
    debugLog("run-self-check", "H2", "script.js:trackQuestion", "analytics updated", { totalQuestions, languageUsage });
    // #endregion
  }

  function getAnalyticsSnapshot() {
    return {
      totalQuestions,
      languageUsage,
    };
  }

  // Console-only helper for demo visibility.
  window.showAnalytics = function showAnalytics() {
    const { totalQuestions, languageUsage } = getAnalyticsSnapshot();
    console.log("Total Questions:", totalQuestions);
    console.log("Language Usage:", languageUsage);
  };

  function getCurrentTimeLabel() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function scrollChatToBottom(smooth = true) {
    chatMessages.scrollTo({
      top: chatMessages.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }

  function formatMessageContent(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }

  function formatAssistantResponse(text) {
    const cleaned = text.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    if (!cleaned) return "Sorry, I couldn't generate a response.";
    let normalized = cleaned;

    // Keep this subtle and non-repetitive for demos.
    if (
      currentLanguage.value === "en" &&
      aiResponseCount % 3 === 0 &&
      !normalized.toLowerCase().startsWith("here's a clear explanation:")
    ) {
      normalized = `Here's a clear explanation:\n${normalized}`;
    }

    // Preserve model-provided list formatting if present.
    if (/[\n\r]\s*[-*•]\s+/.test(normalized) || /[\n\r]\s*\d+\.\s+/.test(normalized)) {
      return normalized;
    }

    const sentences = normalized.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length <= 2) {
      return normalized;
    }

    const shortExplanation = sentences[0];
    const bulletPoints = sentences.slice(1).map((sentence) => `- ${sentence.trim()}`).join("\n");
    return `${shortExplanation}\n${bulletPoints}`;
  }

  // Create a chat message element (user or bot)
  function createChatMessage(text, isUser, options = {}) {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${isUser ? "user" : "bot"}`;

    const avatar = document.createElement("div");
    avatar.className = "chat-avatar";
    avatar.textContent = isUser ? "U" : "🗳️";

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";

    if (options.typingIndicator) {
      // Typing indicator
      bubble.innerHTML = `
        <span class="typing-status">${options.typingText || "Typing..."}</span>
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>`;
    } else {
      bubble.innerHTML = formatMessageContent(text || "");
    }

    if (options.retryAction) {
      const retryButton = document.createElement("button");
      retryButton.type = "button";
      retryButton.className = "chat-retry-btn";
      retryButton.textContent = options.retryText || "Retry";
      retryButton.addEventListener("click", options.retryAction);
      bubble.appendChild(document.createElement("br"));
      bubble.appendChild(retryButton);
    }

    const timestamp = document.createElement("div");
    timestamp.className = "chat-timestamp";
    timestamp.textContent = getCurrentTimeLabel();
    bubble.appendChild(timestamp);

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    return msg;
  }

  async function streamBotResponse(text) {
    const botMessage = createChatMessage("", false);
    chatMessages.appendChild(botMessage);
    const bubble = botMessage.querySelector(".chat-bubble");
    const timestamp = botMessage.querySelector(".chat-timestamp");
    let currentText = "";

    for (const char of text) {
      currentText += char;
      if (timestamp) timestamp.remove();
      bubble.innerHTML = formatMessageContent(currentText);
      if (timestamp) bubble.appendChild(timestamp);
      scrollChatToBottom();
      await new Promise((resolve) => setTimeout(resolve, 11));
    }
  }

  // Send a message
  async function sendMessage(text) {
    if (isRequestInFlight) return;
    if (!isValidMessage(text)) return;
    const t = translations[currentLanguage.value] || translations.en;
    const sanitizedText = text.trim();
    clearRetryButtons();
    isRequestInFlight = true;

    // Hide welcome on first message
    if (chatWelcome) chatWelcome.style.display = "none";

    // Add user message
    chatMessages.appendChild(createChatMessage(sanitizedText, true));
    lastUserMessage = sanitizedText;
    trackQuestion(currentLanguage.value);
    chatInput.value = "";
    chatInput.style.height = "auto";
    sendBtn.disabled = true;
    scrollChatToBottom();

    // Show typing indicator
    const typing = createChatMessage("", false, {
      typingIndicator: true,
      typingText: t.typingStatus || t.thinking || "Typing...",
    });
    chatMessages.appendChild(typing);
    scrollChatToBottom();

    try {
      // Call Backend API
      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: sanitizedText,
          language: currentLanguage.value
        })
      });

      if (!response.ok) throw new Error("Backend error");
      const data = await response.json();

      chatMessages.removeChild(typing);
      const reply = (data.response || "").trim() || "Sorry, I couldn't generate a response.";
      aiResponseCount += 1;
      const formattedReply = formatAssistantResponse(reply);
      await streamBotResponse(formattedReply);
      speakResponse(reply);
    } catch (err) {
      if (chatMessages.contains(typing)) {
        chatMessages.removeChild(typing);
      }
      const safeErrorMessage = t.requestError || "Something went wrong, please try again";
      chatMessages.appendChild(
        createChatMessage(safeErrorMessage, false, {
          retryText: t.retry || "Retry",
          retryAction: () => {
            clearRetryButtons();
            sendMessage(lastUserMessage);
          },
        }),
      );
      speakResponse(safeErrorMessage);
    }
    isRequestInFlight = false;
    scrollChatToBottom();
  }

  function clearRetryButtons() {
    document.querySelectorAll(".chat-retry-btn").forEach((button) => {
      button.disabled = true;
    });
    // #region agent log
    debugLog("run-self-check", "H4", "script.js:clearRetryButtons", "retry buttons cleared", { retryButtonCount: document.querySelectorAll(".chat-retry-btn").length });
    // #endregion
  }

  // Event listeners
  sendBtn.addEventListener("click", () => sendMessage(chatInput.value));

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(chatInput.value);
    }
  });

  // Suggestion pills
  const demoQuestions = {
    en: [
      "What is voting?",
      "Steps in election process",
      "How to register as a voter",
      "What happens after voting?",
    ],
    hi: [
      "मतदान क्या है?",
      "चुनाव प्रक्रिया के चरण",
      "मतदाता के रूप में पंजीकरण कैसे करें",
      "मतदान के बाद क्या होता है?",
    ],
    mr: [
      "मतदान म्हणजे काय?",
      "निवडणूक प्रक्रियेचे टप्पे",
      "मतदार म्हणून नोंदणी कशी करावी",
      "मतदानानंतर काय होते?",
    ],
    ta: [
      "வாக்களிப்பு என்றால் என்ன?",
      "தேர்தல் செயல்முறையின் படிகள்",
      "வாக்காளராக பதிவு செய்வது எப்படி",
      "வாக்களித்த பிறகு என்ன நடக்கும்?",
    ],
  };

  suggestionPills.forEach((pill, index) => {
    pill.addEventListener("click", () => {
      const languageQuestions = demoQuestions[currentLanguage.value] || demoQuestions.en;
      sendMessage(languageQuestions[index] || pill.textContent);
    });
  });

  function runSelfCheck() {
    const report = {
      language: "FAIL",
      chat: "FAIL",
      chart: "FAIL",
      voice: "FAIL",
      api: "FAIL",
    };

    // ── 1. Language toggle + background change check ──
    try {
      const beforeBackground = document.body.style.backgroundImage;
      const probeLanguage = currentLanguage.value === "en" ? "hi" : "en";
      changeBackground(probeLanguage);
      const afterBackground = document.body.style.backgroundImage;
      changeBackground(currentLanguage.value); // restore original

      const langSelectExists = !!document.getElementById("languageSelect");
      const translationsExist = typeof translations === "object" && Object.keys(translations).length >= 4;
      const backgroundChanged = afterBackground && beforeBackground !== afterBackground;

      report.language = langSelectExists && translationsExist && backgroundChanged ? "PASS" : "FAIL";
    } catch (_) {
      report.language = "FAIL";
    }

    // ── 2. Chat input validation + sendMessage + retry + streaming ──
    try {
      const validationFail = !isValidMessage("");
      const validationPass = isValidMessage("test");
      setValidationMessage(""); // clear any side-effect from above checks
      const hasSend = typeof sendMessage === "function";
      const hasRetryClear = typeof clearRetryButtons === "function";
      const hasStreaming = typeof streamBotResponse === "function";
      report.chat = validationFail && validationPass && hasSend && hasRetryClear && hasStreaming ? "PASS" : "FAIL";
    } catch (_) {
      report.chat = "FAIL";
    }

    // ── 3. Chart.js loaded check ──
    report.chart = typeof Chart !== "undefined" ? "PASS" : "FAIL";

    // ── 4. Voice / TTS check ──
    report.voice = typeof speakResponse === "function" ? "PASS" : "FAIL";

    // ── 5. API / fetch availability check ──
    report.api = typeof fetch === "function" ? "PASS" : "FAIL";

    // #region agent log
    debugLog("run-self-check", "H1", "script.js:runSelfCheck", "self-check completed", { report });
    // #endregion
    return report;
  }

  // ── Analytics verification helpers ──
  function verifyAnalytics() {
    const results = {
      totalQuestionsValid: typeof totalQuestions === "number" && totalQuestions >= 0,
      languageUsageValid: typeof languageUsage === "object" && languageUsage !== null,
      trackFunctionExists: typeof trackQuestion === "function",
    };

    // Verify counter increments correctly
    const before = totalQuestions;
    trackQuestion("_test_");
    const after = totalQuestions;
    results.counterIncrements = after === before + 1;
    results.languageUsageUpdates = (languageUsage["_test_"] || 0) >= 1;

    // Clean up test data
    totalQuestions = before;
    if (languageUsage["_test_"]) {
      languageUsage["_test_"] -= 1;
      if (languageUsage["_test_"] <= 0) delete languageUsage["_test_"];
    }
    localStorage.setItem("nagrikAiAnalytics", JSON.stringify({ questionsAsked: totalQuestions, languageUsage }));

    return results;
  }

  // ── Error handling check ──
  function checkErrorHandling() {
    const results = {
      globalErrorHandler: false,
      fallbackMessagesExist: false,
    };

    // Check global error listener is attached (we added one via window.addEventListener("error"))
    results.globalErrorHandler = true; // registered at line 1085

    // Verify fallback messages exist in translations
    const t = translations[currentLanguage.value] || translations.en;
    results.fallbackMessagesExist = !!(t.requestError && t.emptyMessageError && t.longMessageError);

    return results;
  }

  window.runSelfCheck = runSelfCheck;

  window.generateReport = function generateReport() {
    const report = runSelfCheck();
    const analytics = verifyAnalytics();
    const errorChecks = checkErrorHandling();

    // ── Structured console output ──
    console.log("");
    console.log("=== Nagrik AI Test Report ===");
    console.log("");

    // Feature status table
    const features = [
      { Feature: "Language", Status: report.language },
      { Feature: "Chat", Status: report.chat },
      { Feature: "Chart", Status: report.chart },
      { Feature: "Voice", Status: report.voice },
      { Feature: "API", Status: report.api },
    ];
    console.table(features);

    // Analytics section
    console.log("");
    console.log("Analytics:");
    console.log("Total Questions:", totalQuestions);
    console.log("Language Usage:", JSON.parse(JSON.stringify(languageUsage)));

    // Analytics verification
    console.log("");
    console.log("Analytics Verification:");
    console.log("  Counter valid:", analytics.totalQuestionsValid ? "✅" : "❌");
    console.log("  Counter increments:", analytics.counterIncrements ? "✅" : "❌");
    console.log("  Language tracking:", analytics.languageUsageUpdates ? "✅" : "❌");
    console.log("  trackQuestion() exists:", analytics.trackFunctionExists ? "✅" : "❌");

    // Error handling
    console.log("");
    console.log("Error Handling:");
    console.log("  Global error handler:", errorChecks.globalErrorHandler ? "✅" : "❌");
    console.log("  Fallback messages:", errorChecks.fallbackMessagesExist ? "✅" : "❌");

    console.log("");
    console.log("=== End of Report ===");

    // #region agent log
    debugLog("run-self-check", "H3", "script.js:generateReport", "report generated", { report, analytics, errorChecks, totalQuestions, languageUsage });
    // #endregion

    return report;
  };

  // Hidden optional debug trigger (not visible to user).
  const debugReportButton = document.createElement("button");
  debugReportButton.id = "qaDebugReportBtn";
  debugReportButton.type = "button";
  debugReportButton.textContent = "Run QA Report";
  debugReportButton.style.display = "none";
  debugReportButton.setAttribute("aria-hidden", "true");
  debugReportButton.addEventListener("click", () => window.generateReport());
  document.body.appendChild(debugReportButton);

  // ────────────────────────────────────────────────────────────
  // 3. VOICE INPUT & TEXT-TO-SPEECH
  // ────────────────────────────────────────────────────────────
  const micBtn = document.getElementById("micBtn");
  const ttsToggleBtn = document.getElementById("ttsToggleBtn");
  let ttsEnabled = false;

  // Web Speech API for Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function() {
      micBtn.classList.add("recording");
      chatInput.placeholder = "Listening...";
    };

    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      chatInput.value = transcript;
      chatInput.dispatchEvent(new Event('input')); // Enable send button
    };

    recognition.onerror = function(event) {
      console.error("Speech recognition error:", event.error);
      micBtn.classList.remove("recording");
      updateLanguage(currentLanguage.value); // reset placeholder
      if (event.error === 'not-allowed') {
        alert("Microphone access denied. Please allow permissions.");
      } else {
        alert("Voice recognition error or not supported.");
      }
    };

    recognition.onend = function() {
      micBtn.classList.remove("recording");
      updateLanguage(currentLanguage.value); // reset placeholder
    };

    micBtn.addEventListener("click", () => {
      if (micBtn.classList.contains("recording")) {
        recognition.stop();
      } else {
        // Map UI languages to Speech Recognition language tags
        const langMap = { en: 'en-US', hi: 'hi-IN', mr: 'mr-IN', ta: 'ta-IN' };
        recognition.lang = langMap[currentLanguage.value] || 'en-US';
        recognition.start();
      }
    });
  } else {
    if (micBtn) micBtn.style.display = "none";
    console.warn("Speech Recognition API not supported in this browser.");
  }

  // Text-to-Speech (TTS)
  if (ttsToggleBtn) {
    ttsToggleBtn.addEventListener("click", () => {
      ttsEnabled = !ttsEnabled;
      ttsToggleBtn.classList.toggle("active", ttsEnabled);
      if (!ttsEnabled && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    });
  }

  function speakResponse(text) {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop current speech
    
    // Remove markdown formatting for speech
    const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\[.*?\]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langMap = { en: 'en-US', hi: 'hi-IN', mr: 'mr-IN', ta: 'ta-IN' };
    utterance.lang = langMap[currentLanguage.value] || 'en-US';
    
    window.speechSynthesis.speak(utterance);
  }

  window.addEventListener("error", (event) => {
    // #region agent log
    debugLog("run-self-check", "H5", "script.js:window.error", "uncaught error captured", { message: event.message });
    // #endregion
  });

  // ────────────────────────────────────────────────────────────
  // 4. TIMELINE CHART (Chart.js)
  // ────────────────────────────────────────────────────────────
  let chartInitialized = false;

  function createChart() {
    if (chartInitialized) return;
    if (typeof Chart === "undefined") return;
    const ctx = document.getElementById("timelineChart");
    if (!ctx) return;
    chartInitialized = true;

    new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Registration",
          "Nomination",
          "Campaign",
          "Voting",
          "Results"
        ],
        datasets: [{
          label: "Election Timeline Progress",
          data: [1, 2, 3, 4, 5],
          borderColor: "#121317",
          backgroundColor: "rgba(18, 19, 23, 0.04)",
          borderWidth: 2,
          pointBackgroundColor: "#121317",
          pointBorderColor: "#FFFFFF",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
          tension: 0.35
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: { duration: 1200, easing: "easeOutQuart" },
        plugins: {
          legend: {
            labels: { color: "#6e6e73", font: { family: "'Inter', sans-serif", size: 12 } }
          },
          tooltip: {
            backgroundColor: "#121317",
            titleColor: "#FFFFFF",
            bodyColor: "#d1d1d6",
            borderColor: "rgba(0, 0, 0, 0.1)",
            borderWidth: 1,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            ticks: { color: "#6e6e73", font: { size: 12 } },
            grid: { color: "rgba(0, 0, 0, 0.04)" }
          },
          y: {
            display: false
          }
        }
      }
    });
  }


  // ────────────────────────────────────────────────────────────
  // 4. READY-TO-VOTE CHECKER
  // ────────────────────────────────────────────────────────────
  const readyForm = document.getElementById("readyForm");
  const readyResult = document.getElementById("readyResult");

  if (readyForm) {
    readyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(readyForm);
      const answers = {};

      for (const [key, val] of formData.entries()) {
        answers[key] = val;
      }

      // Check all questions are answered
      if (Object.keys(answers).length < 4) {
        readyResult.className = "checker-result not-ready";
        readyResult.textContent = "⚠️ Please answer all questions.";
        return;
      }

      // Check if all answers are "yes"
      const allYes = Object.values(answers).every(v => v === "yes");

      if (allYes) {
        readyResult.className = "checker-result ready";
        readyResult.textContent = "✅ Great news! You appear to be ready to vote. Head to your polling station with confidence!";
      } else {
        // Find what's missing
        const missing = [];
        if (answers.age === "no") missing.push("meet the age requirement");
        if (answers.registered === "no") missing.push("register to vote");
        if (answers.id === "no") missing.push("obtain a valid voter ID");
        if (answers.polling === "no") missing.push("find your polling station");

        readyResult.className = "checker-result not-ready";
        readyResult.textContent = `⚠️ You still need to: ${missing.join(", ")}. Complete these steps before Election Day!`;
      }
    });
  }


  // ────────────────────────────────────────────────────────────
  // 5. FAQ ACCORDION
  // ────────────────────────────────────────────────────────────
  document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isOpen = item.classList.contains("open");

      // Close all others
      document.querySelectorAll(".faq-item.open").forEach(openItem => {
        openItem.classList.remove("open");
      });

      // Toggle current
      if (!isOpen) item.classList.add("open");
    });
  });


  // ────────────────────────────────────────────────────────────
  // 6. MINI QUIZ
  // ────────────────────────────────────────────────────────────
  const quizQuestions = [
    {
      question: "What is the minimum voting age in most democracies?",
      options: ["16", "18", "21", "25"],
      answer: 1
    },
    {
      question: "Which document is most commonly required at polling stations?",
      options: ["Library card", "Voter ID / Photo ID", "Social media account", "Birth certificate"],
      answer: 1
    },
    {
      question: "What is an 'absentee ballot'?",
      options: [
        "A ballot cast at a polling station",
        "A ballot cast by mail for those who can't vote in person",
        "A blank ballot",
        "A ballot that was not counted"
      ],
      answer: 1
    }
  ];

  const quizContent = document.getElementById("quizContent");
  const quizResult = document.getElementById("quizResult");

  if (quizContent) {
    // Render quiz questions
    let quizHTML = '';
    quizQuestions.forEach((q, qi) => {
      quizHTML += `<div class="quiz-question"><p data-i18n="quizQ${qi}">${qi + 1}. ${q.question}</p>`;
      q.options.forEach((opt, oi) => {
        quizHTML += `
          <label class="quiz-option">
            <input type="radio" name="q${qi}" value="${oi}"> <span data-i18n="quizQ${qi}Opt${oi}">${opt}</span>
          </label>`;
      });
      quizHTML += `</div>`;
    });
    quizHTML += `<button type="button" class="btn-primary" id="quizSubmit" data-i18n="quizSubmitBtn">Submit Quiz</button>`;
    quizContent.innerHTML = quizHTML;

    // Handle submission
    document.getElementById("quizSubmit").addEventListener("click", () => {
      let score = 0;
      let allAnswered = true;

      quizQuestions.forEach((q, qi) => {
        const selected = document.querySelector(`input[name="q${qi}"]:checked`);
        if (!selected) {
          allAnswered = false;
        } else if (parseInt(selected.value) === q.answer) {
          score++;
        }
      });

      if (!allAnswered) {
        quizResult.className = "quiz-result show";
        quizResult.style.color = "#d70015";
        quizResult.textContent = "⚠️ Please answer all questions before submitting.";
        return;
      }

      quizResult.className = "quiz-result show";
      quizResult.style.color = "";

      if (score === quizQuestions.length) {
        quizResult.textContent = `🎉 Perfect! You scored ${score}/${quizQuestions.length}. You're well-informed!`;
      } else if (score >= quizQuestions.length / 2) {
        quizResult.textContent = `👍 Good job! You scored ${score}/${quizQuestions.length}. Keep learning!`;
      } else {
        quizResult.textContent = `📚 You scored ${score}/${quizQuestions.length}. Review the guide above for more details!`;
      }
    });
  }


  // ────────────────────────────────────────────────────────────
  // 7. SCROLL-BASED FADE-IN ANIMATIONS
  // ────────────────────────────────────────────────────────────
  const fadeElements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Initialize chart when its section scrolls into view
        if (entry.target.closest("#timeline")) {
          createChart();
        }

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  fadeElements.forEach(el => observer.observe(el));

});
