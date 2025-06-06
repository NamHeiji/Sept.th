// App State
let appState = {
    noClickCount: 0,
    selectedPlace: '',
    selectedTime: '',
    isMobile: window.innerWidth <= 768
};

// Sad messages for "No" responses
const sadMessages = [
    "Huhu... Em chắc chắn không? 😢",
    "Anh sẽ buồn lắm đó... 🥺",
    "Thôi được, anh đợi em suy nghĩ lại! 💔",
    "Anh chỉ muốn dành thời gian với em thôi mà... 😔",
    "Okay... Nhưng anh vẫn sẽ đợi em! 💕"
];

// Show main question
function showQuestion() {
    const landingPage = document.getElementById('landingPage');
    const questionPage = document.getElementById('questionPage');
    
    landingPage.classList.add('hidden');
    questionPage.classList.remove('hidden');
    
    // Create floating hearts
    createFloatingHearts();
}

// Handle answer selection
function selectAnswer(answer) {
    if (answer === 'yes') {
        showSuccessPage();
    } else {
        handleNoResponse();
    }
}

// Handle "No" response with cute effects
function handleNoResponse() {
    const noBtn = document.getElementById('noBtn');
    const sadResponse = document.getElementById('sadResponse');
    const sadMessage = document.getElementById('sadMessage');
    const rainContainer = document.getElementById('rainContainer');
    
    appState.noClickCount++;
    
    if (appState.isMobile) {
        // Mobile effects
        if (appState.noClickCount === 1) {
            noBtn.classList.add('dodge');
            setTimeout(() => noBtn.classList.remove('dodge'), 500);
            sadMessage.textContent = sadMessages[0];
            
        } else if (appState.noClickCount === 2) {
            noBtn.classList.add('shrink');
            sadMessage.textContent = sadMessages[1];
            
        } else if (appState.noClickCount >= 3) {
            noBtn.classList.add('hide');
            sadMessage.textContent = sadMessages[2];
            
            // Show rain effect
            rainContainer.classList.remove('hidden');
            createRainEffect();
        }
    } else {
        // Desktop - show sad response immediately
        sadMessage.textContent = sadMessages[Math.min(appState.noClickCount - 1, sadMessages.length - 1)];
        rainContainer.classList.remove('hidden');
        createRainEffect();
    }
    
    // Show sad response
    document.querySelector('.answer-buttons').style.display = 'none';
    sadResponse.classList.remove('hidden');
}

// Try again function
function tryAgain() {
    const sadResponse = document.getElementById('sadResponse');
    const noBtn = document.getElementById('noBtn');
    const rainContainer = document.getElementById('rainContainer');
    
    // Reset everything
    sadResponse.classList.add('hidden');
    document.querySelector('.answer-buttons').style.display = 'flex';
    rainContainer.classList.add('hidden');
    
    // Reset no button
    noBtn.classList.remove('dodge', 'shrink', 'hide');
    appState.noClickCount = 0;
    
    // Clear rain
    rainContainer.innerHTML = '';
}

// Show success page with celebration
function showSuccessPage() {
    const questionPage = document.getElementById('questionPage');
    const successPage = document.getElementById('successPage');
    
    questionPage.classList.add('hidden');
    successPage.classList.remove('hidden');
    
    // Create celebration effects
    createConfetti();
    createCelebrationHearts();
}

// Select place
function selectPlace(place) {
    // Remove previous selection
    document.querySelectorAll('.suggestion-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    event.target.closest('.suggestion-card').classList.add('selected');
    appState.selectedPlace = place;
    
    // Show time selection if not visible
    document.querySelector('.time-selection').style.display = 'block';
}

// Select time
function selectTime(time) {
    // Remove previous selection
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked button
    event.target.classList.add('selected');
    appState.selectedTime = time;
    
    // Auto proceed to final page after selection
    setTimeout(() => {
        showFinalPage();
    }, 1000);
}

// Show final confirmation page
function showFinalPage() {
    const successPage = document.getElementById('successPage');
    const finalPage = document.getElementById('finalPage');
    const finalDetails = document.getElementById('finalDetails');
    
    // Prepare final details
    const placeNames = {
        cafe: 'Cafe chill ☕',
        cinema: 'Rạp chiếu phim 🎬',
        park: 'Công viên 🌳',
        restaurant: 'Nhà hàng 🍽️'
    };
    
    const timeNames = {
        morning: 'Sáng 🌅',
        afternoon: 'Chiều ☀️',
        evening: 'Tối 🌙',
        allday: 'Cả ngày 🌈'
    };
    
    finalDetails.innerHTML = `
        <div style="margin-bottom: 15px;">
            <strong>📍 Địa điểm:</strong> ${placeNames[appState.selectedPlace ? appState.selectedPlace : '...']}
        </div>
        <div>
            <strong>⏰ Thời gian:</strong> ${timeNames[appState.selectedTime]}
        </div>
    `;
    
    successPage.classList.add('hidden');
    finalPage.classList.remove('hidden');
    
    // Start countdown to Sunday
    startCountdown();
}

// Share date function
function shareDate() {
    const placeNames = {
        cafe: 'cafe',
        cinema: 'xem phim',
        park: 'công viên',
        restaurant: 'nhà hàng'
    };
    
    const timeNames = {
        morning: 'sáng',
        afternoon: 'chiều',
        evening: 'tối',
        allday: 'cả ngày'
    };
    
    const message = `Hẹn em đi ${placeNames[appState.selectedPlace]} vào chủ nhật ${timeNames[appState.selectedTime]} nha! 💕`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Kế hoạch hẹn hò',
            text: message
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(message).then(() => {
            alert('Đã copy kế hoạch! Gửi cho crush nào! 💕');
        });
    }
}

// Restart app
function restart() {
    // Reset state
    appState = {
        noClickCount: 0,
        selectedPlace: '',
        selectedTime: '',
        isMobile: window.innerWidth <= 768
    };
    
    // Hide all pages except landing
    document.getElementById('questionPage').classList.add('hidden');
    document.getElementById('successPage').classList.add('hidden');
    document.getElementById('finalPage').classList.add('hidden');
    document.getElementById('landingPage').classList.remove('hidden');
    
    // Reset UI elements
    document.getElementById('sadResponse').classList.add('hidden');
    document.querySelector('.answer-buttons').style.display = 'flex';
    document.getElementById('noBtn').classList.remove('dodge', 'shrink', 'hide');
    document.getElementById('rainContainer').classList.add('hidden');
    document.getElementById('rainContainer').innerHTML = '';
    
    // Clear selections
    document.querySelectorAll('.suggestion-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
}

// Create floating hearts effect
function createFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '💕';
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 3 + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        heart.style.animation = 'floatUp 4s linear infinite';
        
        container.appendChild(heart);
        
        // Remove after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 4000);
    }
}

// Create rain effect for sad response
function createRainEffect() {
    const container = document.getElementById('rainContainer');
    
    for (let i = 0; i < 50; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDelay = Math.random() * 2 + 's';
        drop.style.animationDuration = (Math.random() * 1 + 1) + 's';
        
        container.appendChild(drop);
    }
    
    // Clear rain after 5 seconds
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// Create confetti effect
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        container.appendChild(confetti);
    }
    
    // Clear confetti after 5 seconds
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// Create celebration hearts
function createCelebrationHearts() {
    const container = document.getElementById('confettiContainer');
    
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '💕';
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
        heart.style.animation = 'heartPop 2s ease-out forwards';
        heart.style.animationDelay = Math.random() * 1 + 's';
        
        container.appendChild(heart);
    }
}

// Countdown to Sunday
function startCountdown() {
    const countdownElement = document.getElementById('countdown');
    
    function updateCountdown() {
        const now = new Date();
        const nextSunday = new Date();
        
        // Calculate next Sunday
        const daysUntilSunday = (7 - now.getDay()) % 7;
        if (daysUntilSunday === 0 && now.getDay() === 0) {
            // If today is Sunday, show today
            nextSunday.setDate(now.getDate());
        } else {
            nextSunday.setDate(now.getDate() + (daysUntilSunday || 7));
        }
        
        nextSunday.setHours(10, 0, 0, 0); // 10 AM Sunday
        
        const timeDiff = nextSunday - now;
        
        if (timeDiff > 0) {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            
            countdownElement.innerHTML = `⏰ Còn ${days} ngày ${hours} giờ ${minutes} phút!`;
        } else {
            countdownElement.innerHTML = `🎉 Hôm nay là ngày hẹn hò!`;
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes heartPop {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Update mobile detection on resize
window.addEventListener('resize', () => {
    appState.isMobile = window.innerWidth <= 768;
});
