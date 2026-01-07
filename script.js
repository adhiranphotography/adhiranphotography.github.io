// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Chatbot Functionality
const chatbotContainer = document.getElementById('chatbotContainer');
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');

let conversationContext = {
    eventType: null,
    date: null,
    location: null,
    interested: false
};

// Open Chatbot
if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.add('active');
        chatbotToggle.style.display = 'none';
    });
}

// Close Chatbot
if (chatbotClose) {
    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
        chatbotToggle.style.display = 'flex';
    });
}

// Send Message
function sendMessage() {
    const userMessage = chatbotInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, 'user');
    chatbotInput.value = '';

    // Process message after a short delay for better UX
    setTimeout(() => {
        processMessage(userMessage);
    }, 500);
}

if (chatbotSend) {
    chatbotSend.addEventListener('click', sendMessage);
}

if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Add Message to Chat
function addMessage(text, type = 'bot', showQuickActions = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${type}-message`;
    
    let htmlContent = `<p>${text}</p>`;
    if (showQuickActions && type === 'bot') {
        htmlContent += `
            <div class="chatbot-quick-actions">
                <button class="quick-action-btn" data-action="wedding">Wedding</button>
                <button class="quick-action-btn" data-action="baby">Baby</button>
                <button class="quick-action-btn" data-action="event">Event</button>
                <button class="quick-action-btn" data-action="video">Video</button>
                <button class="quick-action-btn" data-action="booking">Booking</button>
            </div>
        `;
    }
    
    messageDiv.innerHTML = htmlContent;
    chatbotMessages.appendChild(messageDiv);
    
    // Add event listeners to quick action buttons if they exist
    if (showQuickActions) {
        messageDiv.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                handleQuickAction(action);
            });
        });
    }
    
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Handle Quick Action Buttons
function handleQuickAction(action) {
    // Add user message showing their selection
    addMessage(action.charAt(0).toUpperCase() + action.slice(1), 'user');
    
    switch(action) {
        case 'wedding':
            conversationContext.eventType = 'Wedding Photography';
            addMessage("Excellent choice! We offer complete wedding photography coverage from pre-wedding to reception. We capture every emotion and moment beautifully. What's your wedding date and location?");
            break;
        case 'baby':
            conversationContext.eventType = 'Baby Photography';
            addMessage("Wonderful! We offer Baby Photography, Baby Shower, and Maternity photography services. We capture adorable baby moments and milestones. What type of baby photography are you looking for?", true);
            break;
        case 'event':
            conversationContext.eventType = 'Event Photography';
            addMessage("Great! We cover all types of events - Birthday, Engagement, Puberty Ceremony, Corporate Events, and more. What's your event type and date?", true);
            break;
        case 'video':
            conversationContext.eventType = 'Video Services';
            addMessage("Perfect! We offer professional video services for weddings, events, and special occasions. Would you like to know more about our video packages? You can WhatsApp us for detailed information and pricing.");
            break;
        case 'booking':
            conversationContext.interested = true;
            addMessage("Great! I'd love to help you book a session. What type of photography service are you interested in? You can also WhatsApp us directly for instant booking!", true);
            break;
        default:
            addMessage("How can I help you with that? Feel free to WhatsApp us for more details!", true);
    }
}

// Process User Message
function processMessage(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    // Greeting
    if (isGreeting(lowerMessage)) {
        handleGreeting();
        return;
    }

    // Video service
    if (lowerMessage.includes('video') || lowerMessage.includes('videography')) {
        conversationContext.eventType = 'Video Services';
        addMessage("Perfect! We offer professional video services for weddings, events, and special occasions. Would you like to know more about our video packages? You can WhatsApp us for detailed information and pricing.");
        return;
    }

    // Service enquiry
    if (isServiceEnquiry(lowerMessage)) {
        handleServiceEnquiry(lowerMessage);
        return;
    }

    // Price enquiry
    if (isPriceEnquiry(lowerMessage)) {
        handlePriceEnquiry();
        return;
    }

    // Availability enquiry
    if (isAvailabilityEnquiry(lowerMessage)) {
        handleAvailabilityEnquiry();
        return;
    }

    // Booking interest
    if (isBookingInterest(lowerMessage)) {
        handleBookingInterest();
        return;
    }

    // Confused or unclear
    if (isUnclear(lowerMessage)) {
        handleUnclear();
        return;
    }

    // Date mentioned
    if (containsDate(lowerMessage)) {
        conversationContext.date = extractDate(lowerMessage);
        addMessage("Great! I've noted your date. Would you like to book via WhatsApp for instant confirmation?");
        return;
    }

    // Default response
    handleDefault(lowerMessage);
}

// Check for greetings
function isGreeting(message) {
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste', 'namaskar'];
    return greetings.some(greeting => message.includes(greeting));
}

function handleGreeting() {
    addMessage("Hi 👋 Welcome to AdhiranPhotography.<br>How can I help you today?", 'bot', true);
}

// Check for service enquiries
function isServiceEnquiry(message) {
    const services = ['wedding', 'engagement', 'baby shower', 'birthday', 'puberty', 'nikkah', 'maternity', 'pre-wedding', 'post-wedding', 'modeling', 'product', 'photography', 'event', 'service', 'services'];
    return services.some(service => message.includes(service));
}

function handleServiceEnquiry(message) {
    const serviceMap = {
        'wedding': 'Wedding Photography',
        'engagement': 'Engagement Photography',
        'baby shower': 'Baby Shower Photography',
        'birthday': 'Birthday Photography',
        'puberty': 'Puberty Ceremony Photography',
        'nikkah': 'Nikkah Photography',
        'maternity': 'Maternity Photography',
        'pre-wedding': 'Pre/Post Wedding Photography',
        'post-wedding': 'Pre/Post Wedding Photography',
        'modeling': 'Modeling Photography',
        'product': 'Product Photography',
        'baby': 'Baby Photography',
        'event': 'Outdoor & Events Photography',
        'video': 'Video Services',
        'videography': 'Video Services'
    };

    let serviceType = null;
    for (const [key, value] of Object.entries(serviceMap)) {
        if (message.includes(key)) {
            serviceType = value;
            conversationContext.eventType = value;
            break;
        }
    }

    if (serviceType) {
        if (serviceType === 'Video Services') {
            addMessage(`Great! We offer ${serviceType}. We provide professional videography for weddings, events, and special occasions. Would you like to know more about our video packages? You can WhatsApp us for detailed information and pricing.`);
        } else {
            addMessage(`Great! We offer ${serviceType}. We capture every special moment with professional excellence. What's your event date and location?`);
        }
    } else {
        addMessage("We offer Wedding, Engagement, Baby Shower, Birthday, Puberty Ceremony, Nikkah, Maternity, Pre/Post Wedding, Modeling, Product, Baby Photography, and Video Services. Which service are you interested in?", 'bot', true);
    }
}

// Check for price enquiries
function isPriceEnquiry(message) {
    const priceKeywords = ['price', 'cost', 'charge', 'fee', 'pricing', 'rate', 'rates', 'how much', 'expensive', 'affordable', 'budget'];
    return priceKeywords.some(keyword => message.includes(keyword));
}

function handlePriceEnquiry() {
    conversationContext.interested = true;
    addMessage("Our pricing depends on your specific requirements like event type, duration, and location. For an exact quote, would you like to connect via WhatsApp? We can provide detailed pricing there.");
}

// Check for availability enquiries
function isAvailabilityEnquiry(message) {
    const availabilityKeywords = ['available', 'availability', 'free', 'book', 'booking', 'date', 'schedule', 'free on', 'can you'];
    return availabilityKeywords.some(keyword => message.includes(keyword));
}

function handleAvailabilityEnquiry() {
    addMessage("I'd love to check availability for you! What date and event type are you looking for? You can also call or WhatsApp us for instant response.");
}

// Check for booking interest
function isBookingInterest(message) {
    const bookingKeywords = ['yes', 'sure', 'okay', 'ok', 'book', 'booking', 'interested', 'want to book', 'i want', 'i need'];
    return bookingKeywords.some(keyword => message.includes(keyword));
}

function handleBookingInterest() {
    conversationContext.interested = true;
    addMessage("Excellent! We're excited to capture your special moments. Would you like to book via WhatsApp for quick confirmation? You can also call us directly.");
}

// Check for unclear messages
function isUnclear(message) {
    const unclearIndicators = message.length < 3 || 
                             (!isServiceEnquiry(message) && !isPriceEnquiry(message) && !isAvailabilityEnquiry(message) && !isBookingInterest(message));
    return unclearIndicators;
}

function handleUnclear() {
    addMessage("Are you looking for Wedding, Baby, or Event photography? I can help you with bookings and enquiries. Feel free to ask me anything!", 'bot', true);
}

// Handle default responses
function handleDefault(message) {
    if (message.includes('thank')) {
        addMessage("You're welcome! 😊 Would you like to book via WhatsApp or call us for more details?", 'bot', true);
    } else if (message.includes('bye') || message.includes('goodbye')) {
        addMessage("Thank you for contacting AdhiranPhotography! Feel free to reach out anytime. You can also WhatsApp or call us directly. Have a wonderful day! 🌟");
    } else {
        addMessage("I understand! Would you like to know more about our services, or shall I connect you to our WhatsApp for quick details?", 'bot', true);
    }
}

// Check if message contains a date
function containsDate(message) {
    const datePatterns = [
        /\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/, // DD-MM-YYYY or DD/MM/YYYY
        /\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i,
        /(tomorrow|today|next week|next month|next year)/i,
        /\d{1,2}(st|nd|rd|th)/i
    ];
    return datePatterns.some(pattern => pattern.test(message));
}

function extractDate(message) {
    // Simple date extraction - in a real scenario, you'd want more sophisticated parsing
    const match = message.match(/\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i);
    return match ? match[0] : message;
}

// Handle idle users (show helpful message after inactivity)
let idleTimer;
function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        if (chatbotWindow.classList.contains('active')) {
            addMessage("Hi! Are you still there? If you need help with bookings, pricing, or any questions, feel free to ask! Or you can WhatsApp us for instant response.");
        }
    }, 60000); // 60 seconds
}

if (chatbotInput) {
    chatbotInput.addEventListener('input', resetIdleTimer);
}

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Add WhatsApp click tracking (you can integrate with analytics)
document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(link => {
    link.addEventListener('click', () => {
        // Track WhatsApp clicks (integrate with your analytics if needed)
        console.log('WhatsApp link clicked');
    });
});

// Initialize chatbot on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize quick action buttons in the initial welcome message
    const initialQuickActions = chatbotMessages.querySelectorAll('.quick-action-btn');
    initialQuickActions.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            handleQuickAction(action);
        });
    });
    
    // Add welcome message after a short delay
    setTimeout(() => {
        // Optional: Auto-open chatbot after a few seconds (commented out by default)
        // chatbotWindow.classList.add('active');
        // chatbotToggle.style.display = 'none';
    }, 2000);
});


// Prevent chatbot from closing when clicking inside
if (chatbotWindow) {
    chatbotWindow.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}
