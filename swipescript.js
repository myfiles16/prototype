let flashcards = Array.from(document.querySelectorAll('.flashcard'));
let currentCardIndex = flashcards.length - 1;
let movements = []; // Array to track movements
const totalFlashcards = flashcards.length;

// Create and hide the download button initially
let downloadButton = document.getElementById('download-button');

// Download movements data as a text file
downloadButton.addEventListener('click', () => {
    const data = JSON.stringify(movements, null, 2); // Convert movements array to a JSON string
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'movements.json'; // Download as movements.json
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

function checkAllFlashcardsSwiped() {
    if (currentCardIndex < 0) {
        // Show the download button and hide swipe buttons when all flashcards have been swiped
        document.querySelector('.download-container').style.display = 'flex';
        document.querySelector('.buttons').style.display = 'none';
    }
}

function swipeCard(direction) {
    if (currentCardIndex < 0) return; // No more cards to swipe

    let currentCard = flashcards[currentCardIndex];
    const transformValue = direction === 'left' ? '-400px' : '400px';
    const rotateValue = direction === 'left' ? '-60deg' : '60deg';

    // Apply 2D tumbling effect with rotation
    currentCard.style.transform = `translateX(${transformValue}) rotate(${rotateValue})`;
    currentCard.style.opacity = '0';

    // Log movement
    movements.push({
        flashcard: currentCard.innerText,
        direction: direction
    });

    currentCardIndex--;

    // Update button states
    checkAllFlashcardsSwiped();
}

document.getElementById('left-button').addEventListener('click', () => swipeCard('left'));
document.getElementById('right-button').addEventListener('click', () => swipeCard('right'));

// Improved touch event handling for swipe gestures
let touchstartX = 0;
let touchendX = 0;

function handleSwipe() {
    const swipeThreshold = 50; // Minimum swipe distance in pixels
    const distance = touchendX - touchstartX;
    
    if (Math.abs(distance) > swipeThreshold) {
        const direction = distance < 0 ? 'left' : 'right';
        swipeCard(direction);
    }
}

document.querySelector('.flashcard-container').addEventListener('touchstart', (event) => {
    touchstartX = event.changedTouches[0].screenX;
});

document.querySelector('.flashcard-container').addEventListener('touchend', (event) => {
    touchendX = event.changedTouches[0].screenX;
    handleSwipe();
});

// Chatbot and flashcard handling
const chatbot = document.getElementById('chatbot');

// Utility to simulate chatbot messages
function chatbotMessage(message, isBot = true) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');
    messageDiv.classList.add(isBot ? 'bot' : 'user');
    messageDiv.innerText = message;
    chatbot.appendChild(messageDiv);
    chatbot.scrollTop = chatbot.scrollHeight; // Auto scroll to the bottom
}

// Utility to add input fields and buttons dynamically
function addInputField(placeholder, callback) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholder;
    chatbot.appendChild(input);
    input.focus();

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const userInput = input.value.trim();
            if (userInput !== '') {
                chatbotMessage(userInput, false); // Simulate user message
                chatbot.removeChild(input);
                callback(userInput);
            }
        }
    });
}

function addButton(label, callback) {
    const button = document.createElement('button');
    button.innerText = label;
    chatbot.appendChild(button);

    button.addEventListener('click', () => {
        callback();
        chatbot.removeChild(button);
    });
}

// Simulate chatbot conversation and input flow
let userName = '';
let userRole = '';

function startChat() {
    chatbotMessage('Hello! Welcome to the Career Advisor Bot.');
    setTimeout(() => {
        chatbotMessage('What is your name?');
        addInputField('Enter your name', (name) => {
            userName = name;
            chatbotMessage(`Nice to meet you, ${userName}.`);

            setTimeout(() => {
                chatbotMessage('What job role are you interested in?');
                addInputField('e.g., Software Developer', (role) => {
                    userRole = role;
                    chatbotMessage(`You are interested in ${userRole}.`);

                    setTimeout(() => {
                        chatbotMessage('Are you ready to know which career option suits you best?');
                        addButton('Proceed', startFlashcards);
                    }, 1000);
                });
            }, 1000);
        });
    }, 1000);
}

// Start flashcards section
function startFlashcards() {
    chatbotMessage('Great! Let\'s begin.');

    // Hide chatbot and show flashcards
    chatbot.style.display = 'none';
    document.querySelector('.flashcard-container').style.display = 'block';
    document.querySelector('.buttons').style.display = 'flex'; // Show swipe buttons
    document.querySelector('.download-container').style.display = 'none'; // Hide download button
}

// Start the chatbot conversation when the page loads
window.onload = startChat;
