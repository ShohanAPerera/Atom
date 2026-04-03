/* --- CONFIGURATION --- */
const MY_NAME = "Shohan"; // Change this to your actual name
const HER_NAME = "Anuri"; // Change this to her name
const CORRECT_NUMBER = 1; // Change this to her favorite number (1-10)
const BUS_ROUTE = 138 // Change this to her favorite number (1-10) 

/* Countdown Lock (Set to a future date to lock the app) */
const UNLOCK_DATE = "2026-04-06T00:00:00"; // format: YYYY-MM-DDTHH:mm:ss

/* Optional: Add image URLs or local paths to these stages if you want a picture to appear! */
const STAGE_IMAGES = {
    1: "A1.jpeg", // example: "images/pic1.jpg"
    2: "A2.jpeg",
    3: "A3.jpeg", // Stage 3 unlocks a memory
    4: "A4.jpeg",
    5: "A5.jpeg",
    6: "A6.jpeg",
    7: "A7.jpeg",
    8: "A8.jpeg",
    9: "A9.jpeg"
};

/* Optional: Add longer phrases, memories, or stories to appear when she completes a stage */
const STAGE_PHRASES = {
    1: ["I still remember", "the first time we met near the college washrooms — an unlikely start to something beautiful."],
    2: ["Thank you", "for being that wonderfully annoying, irreplaceable friend for the past two months."],
    3: ["Thank you", "for every effort you've poured into this friendship of ours."],
    4: ["Thank you", "just for being you — raw, real, and enough."],
    5: ["Thank you", "for understanding that you matter not just to me, but to this world too."],
    6: ["Thank you", "for being that perfectly imperfect friend who drives me crazy in the best way."],
    7: ["Thank you", "for every unsolicited but needed advice that somehow always makes sense."],
    8: ["Thank you", "for being that amazing and annoying friend I never knew I needed."],
    9: ["In a sky full of stars,", "shine brightly —the world needs your light."]
};

const LONG_LETTER = `Dear ${HER_NAME}, <br><br>
Happy Birthday. <br><br>
Some friendships begin with a spark. Ours began near the college washrooms — and isn't that just so perfectly us? <br><br>
In just two short months, you've managed to become the chaos in my calm, the laughter in my silence, and the voice that tells me things I don't want to hear — but desperately need to. <br><br>
You are the kind of friend who doesn't just walk beside you — you pull us forward when we forget how to move. You care in ways that go unnoticed, guide in ways that feel effortless, and annoy in ways that somehow feel like love. <br><br>
So today, I don't just wish you happiness. I wish you the world — because you've given a piece of yours to all of us. <br><br>
Thank you for being the annoying, amazing, beautifully broken star that you are. <br><br>
Keep shining, <br>
${MY_NAME}`;
/* --------------------- */

// State
let currentStage = parseInt(localStorage.getItem('birthday_stage') || 1);
let isStageUnlocked = false;
let interactionsTotal = 0;

// Elements
const stageIndicator = document.getElementById('stage-indicator');
const progressBar = document.getElementById('progressBar') || document.querySelector('.progress-bar');
const instructionEl = document.getElementById('instruction');
const interactiveArea = document.getElementById('interactive-area');
const feedbackText = document.getElementById('feedback-text');
const btnNext = document.getElementById('btn-next');
const btnBack = document.getElementById('btn-back');
const mainCard = document.getElementById('main-card');
const bgMusic = document.getElementById('bg-music');
const modalOverlay = document.getElementById('wish-modal');
const bgAnimContainer = document.getElementById('bg-anim');

// Stages Data
const stages = [
    { id: 1, type: 'tapHeart', instruction: 'Tap the floating Atom to begin', successMsg: 'The Biththaraya. 🤍' },
    { id: 2, type: 'guessNumber', instruction: `Type your favorite number.`, successMsg: 'I know you well homie !. ✨' },
    { id: 3, type: 'typeName', instruction: 'Type the bus route number that we took together first', successMsg: 'Memory unlocked! 🔒🔓' },
    { id: 4, type: 'holdButton', instruction: 'Press and hold for 3 seconds... like waiting for your reply', successMsg: 'Worth the wait. ⏳' },
    { id: 5, type: 'findDifference', instruction: 'Find what\'s different... just like how you stand out to me', successMsg: 'You notice everything huh? ' },
    { id: 6, type: 'slideUnlock', instruction: 'Slide to reveal the truth →', successMsg: 'Im taller than you, but you still scare me sometimes. 😅' },
    { id: 7, type: 'matchVibe', instruction: 'Match the emoji to how I feel about you', successMsg: 'Meka boruwata damme !!!!!!!!' },
    { id: 8, type: 'shakeOrTap', instruction: 'Shake your phone gently OR click fast (10 times)', successMsg: 'Hi Batch top !' },
    { id: 9, type: 'drawStar', instruction: 'Draw a star anywhere on this box (or tap 5 points)', successMsg: 'You\'re a star my friend. ⭐' },
    { id: 10, type: 'final', instruction: '', successMsg: '' }
];

// Initialize Background Animations
function createFloatingIcons() {
    const icons = ['🌸', '🐚', '🫧', '🦀', '✨'];
    setInterval(() => {
        const el = document.createElement('div');
        el.innerText = icons[Math.floor(Math.random() * icons.length)];
        el.className = 'floating-bg-item';
        el.style.left = Math.random() * 100 + 'vw';
        el.style.fontSize = (15 + Math.random() * 20) + 'px';
        el.style.animationDuration = (8 + Math.random() * 7) + 's';
        bgAnimContainer.appendChild(el);
        setTimeout(() => el.remove(), 15000);
    }, 1500);

    // Light glowing orbs/sun rays
    setInterval(() => {
        const el = document.createElement('div');
        el.className = 'floating-star';
        el.style.background = 'rgba(255,255,255,0.8)';
        el.style.left = Math.random() * 100 + 'vw';
        const size = Math.random() * 4 + 2;
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        el.style.animationDuration = (6 + Math.random() * 10) + 's';
        bgAnimContainer.appendChild(el);
        setTimeout(() => el.remove(), 15000);
    }, 400);
}

window.onload = () => {
    init();
    initCursorTrail();
};

function init() {
    createFloatingIcons();

    // Check if the app is currently locked by date
    if (UNLOCK_DATE) {
        const targetTime = new Date(UNLOCK_DATE).getTime();
        const now = new Date().getTime();

        if (targetTime > now) {
            document.getElementById('app-container').style.display = 'none';
            document.getElementById('countdown-card').style.display = 'flex';
            startCountdown(targetTime);
            return;
        }
    }

    // If no lock or past date, flow cleanly into the application
    startApp();
}

function startCountdown(targetTime) {
    const timerEl = document.getElementById('countdown-timer');

    const updateCountdown = () => {
        const now = new Date().getTime();
        const diff = targetTime - now;

        if (diff <= 0) {
            clearInterval(window.countdownInterval);
            document.getElementById('countdown-card').style.display = 'none';
            document.getElementById('app-container').style.display = 'flex';
            startApp();
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        timerEl.innerHTML = `
            <div class="time-box"><span class="time-val">${d}</span><span class="time-label">Days</span></div>
            <div class="time-box"><span class="time-val">${h}</span><span class="time-label">Hrs</span></div>
            <div class="time-box"><span class="time-val">${m}</span><span class="time-label">Min</span></div>
            <div class="time-box"><span class="time-val">${s}</span><span class="time-label">Sec</span></div>
        `;
    };

    updateCountdown();
    window.countdownInterval = setInterval(updateCountdown, 1000);
}

function startApp() {
    loadStage(currentStage);

    btnNext.addEventListener('click', () => {
        if (isStageUnlocked && currentStage < 10) {
            currentStage++;
            localStorage.setItem('birthday_stage', currentStage);
            animateCardTransition(() => loadStage(currentStage));
        }
    });

    btnBack.addEventListener('click', () => {
        if (currentStage > 1) {
            currentStage--;
            localStorage.setItem('birthday_stage', currentStage);
            animateCardTransition(() => loadStage(currentStage));
        }
    });

    modalOverlay.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });

    const phraseModal = document.getElementById('phrase-modal');
    const btnPhraseClose = document.getElementById('btn-phrase-close');
    if (phraseModal && btnPhraseClose) {
        btnPhraseClose.addEventListener('click', () => {
            phraseModal.classList.remove('active');
        });
        phraseModal.addEventListener('click', (e) => {
            if (e.target === phraseModal) {
                phraseModal.classList.remove('active');
            }
        });
    }
}

function animateCardTransition(callback) {
    mainCard.classList.add('fade-out');
    setTimeout(() => {
        callback();
        mainCard.classList.remove('fade-out');
        mainCard.classList.add('fade-in');
        setTimeout(() => mainCard.classList.remove('fade-in'), 400);
    }, 400);
}

function unlockStage(stage) {
    isStageUnlocked = true;
    interactionsTotal++;
    feedbackText.innerText = stage.successMsg;
    feedbackText.style.opacity = 1;
    btnNext.classList.remove('hidden');
    mainCard.classList.add('success-flash');
    setTimeout(() => mainCard.classList.remove('success-flash'), 500);

    // Show image as dynamic background if requested
    if (STAGE_IMAGES[stage.id]) {
        const bgImg = document.getElementById('dynamic-bg');
        if (bgImg) {
            bgImg.style.backgroundImage = `url('${STAGE_IMAGES[stage.id]}')`;
            bgImg.classList.add('active');
        }
    }

    // Show custom phrases in popup
    const phraseModal = document.getElementById('phrase-modal');
    const phraseText = document.getElementById('phrase-text');
    if (phraseModal && phraseText && STAGE_PHRASES[stage.id]) {
        if (Array.isArray(STAGE_PHRASES[stage.id])) {
            phraseText.innerHTML = (STAGE_PHRASES[stage.id][0] || "") + "<br><br>" + (STAGE_PHRASES[stage.id][1] || "");
        } else {
            phraseText.innerHTML = STAGE_PHRASES[stage.id];
        }
        phraseModal.classList.add('active');
    }
}

function shakeError() {
    mainCard.classList.add('shake');
    setTimeout(() => mainCard.classList.remove('shake'), 400);
    feedbackText.innerText = "Try again, 💕";
    feedbackText.style.opacity = 1;
    setTimeout(() => feedbackText.style.opacity = 0, 2000);
}

function loadStage(stageNum) {
    const stage = stages.find(s => s.id === stageNum);
    stageIndicator.innerText = `${stageNum} / 10`;
    progressBar.style.width = `${(stageNum / 10) * 100}%`;
    instructionEl.innerText = stage.instruction;
    interactiveArea.innerHTML = '';
    feedbackText.style.opacity = 0;

    // Ensure phrase modal is hidden
    const phraseModal = document.getElementById('phrase-modal');
    if (phraseModal) { phraseModal.classList.remove('active'); }

    // Fade out previous background image if showing
    const bgImg = document.getElementById('dynamic-bg');
    if (bgImg) {
        bgImg.classList.remove('active');
        // Let it fade out completely before changing src next time
        setTimeout(() => {
            if (!bgImg.classList.contains('active')) {
                bgImg.style.backgroundImage = '';
            }
        }, 1500);
    }

    isStageUnlocked = false;
    btnNext.classList.add('hidden');
    btnBack.disabled = stageNum === 1;

    switch (stage.type) {
        case 'tapHeart': initTapHeart(stage); break;
        case 'guessNumber': initGuessNumber(stage); break;
        case 'typeName': initTypeName(stage); break;
        case 'holdButton': initHoldButton(stage); break;
        case 'findDifference': initFindDifference(stage); break;
        case 'slideUnlock': initSlideUnlock(stage); break;
        case 'matchVibe': initMatchVibe(stage); break;
        case 'shakeOrTap': initShakeOrTap(stage); break;
        case 'drawStar': initDrawStar(stage); break;
        case 'final': initFinal(); break;
    }
}

// Stage 1
function initTapHeart(stage) {
    const heart = document.createElement('div');
    heart.className = 'heart-target';
    heart.innerHTML = '⚛️';
    heart.addEventListener('click', () => {
        unlockStage(stage);
        heart.style.animation = 'none';
        heart.style.transform = 'scale(1.2)';
    }, { once: true });
    interactiveArea.appendChild(heart);
}

// Stage 2
function initGuessNumber(stage) {
    const pad = document.createElement('div');
    pad.className = 'numpad';
    for (let i = 1; i <= 10; i++) {
        const num = i === 10 ? 0 : i;
        const btn = document.createElement('button');
        btn.className = 'num-btn';
        if (num === 0) btn.classList.add('zero');
        btn.innerText = num;
        btn.onclick = () => {
            if (isStageUnlocked) return;
            if (num === CORRECT_NUMBER || (i === 10 && CORRECT_NUMBER === 10)) {
                btn.style.background = 'var(--success)';
                btn.style.color = 'white';
                unlockStage(stage);
            } else {
                shakeError();
            }
        };
        pad.appendChild(btn);
    }
    interactiveArea.appendChild(pad);
}

// Stage 3
function initTypeName(stage) {
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'name-input';
    input.placeholder = 'Type bus route here';
    input.addEventListener('input', (e) => {
        // Convert both to number or both to string for comparison
        if (parseInt(e.target.value) === BUS_ROUTE) {
            input.disabled = true;
            input.style.borderColor = 'var(--success)';
            unlockStage(stage);
        }
    });
    interactiveArea.appendChild(input);
}

// Stage 4
function initHoldButton(stage) {
    const wrapper = document.createElement('div');
    wrapper.className = 'hold-circle';

    // SVG Progress
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'progress-ring');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('class', 'progress-ring__circle');
    circle.setAttribute('r', '60');
    circle.setAttribute('cx', '70');
    circle.setAttribute('cy', '70');
    svg.appendChild(circle);

    const btn = document.createElement('button');
    btn.className = 'hold-btn';
    btn.innerText = 'Hold me 🤍';

    wrapper.appendChild(svg);
    wrapper.appendChild(btn);
    interactiveArea.appendChild(wrapper);

    let holdTimer;
    let progress = 377; // dasharray full value
    const maxHold = 3000; // 3 seconds
    const intervalTime = 50;
    const step = 377 / (maxHold / intervalTime);

    const startHold = (e) => {
        if (isStageUnlocked) return;
        e.preventDefault();
        btn.style.transform = 'scale(0.95)';
        holdTimer = setInterval(() => {
            progress -= step;
            if (progress <= 0) progress = 0;
            circle.style.strokeDashoffset = progress;
            if (progress === 0) {
                clearInterval(holdTimer);
                btn.innerText = 'Released✨';
                btn.style.background = 'var(--success)';
                btn.style.color = 'white';
                unlockStage(stage);
            }
        }, intervalTime);
    };

    const stopHold = () => {
        if (isStageUnlocked) return;
        clearInterval(holdTimer);
        progress = 377;
        circle.style.strokeDashoffset = progress;
        btn.style.transform = 'scale(1)';
    };

    btn.addEventListener('mousedown', startHold);
    btn.addEventListener('touchstart', startHold);
    window.addEventListener('mouseup', stopHold);
    window.addEventListener('touchend', stopHold);
}

// Stage 5
function initFindDifference(stage) {
    const emojis = ['🐱', '🐱', '🐱', '🐱', '🐈', '🐱', '🐱', '🐱', '🐱'];
    // Shuffle
    emojis.sort(() => Math.random() - 0.5);

    const grid = document.createElement('div');
    grid.className = 'emoji-grid';

    emojis.forEach(e => {
        const item = document.createElement('div');
        item.className = 'emoji-item';
        item.innerText = e;
        item.onclick = () => {
            if (isStageUnlocked) return;
            if (e === '🐈') {
                item.style.background = 'rgba(46, 213, 115, 0.4)';
                unlockStage(stage);
            } else {
                shakeError();
            }
        };
        grid.appendChild(item);
    });
    interactiveArea.appendChild(grid);
}

// Stage 6
function initSlideUnlock(stage) {
    const container = document.createElement('div');
    container.className = 'slider-container';

    const txt = document.createElement('div');
    txt.className = 'slider-text';
    txt.innerText = 'Slide >>>';

    const fill = document.createElement('div');
    fill.className = 'slider-fill';

    const thumb = document.createElement('div');
    thumb.className = 'slider-thumb';
    thumb.innerHTML = '❤️';

    container.appendChild(fill);
    container.appendChild(txt);
    container.appendChild(thumb);
    interactiveArea.appendChild(container);

    let isDragging = false;
    let startX = 0;

    const startDrag = (e) => {
        if (isStageUnlocked) return;
        isDragging = true;
        startX = (e.clientX || e.touches[0].clientX) - thumb.offsetLeft;
    };

    const doDrag = (e) => {
        if (!isDragging || isStageUnlocked) return;
        let x = (e.clientX || e.touches[0].clientX) - startX;
        let maxW = container.offsetWidth - thumb.offsetWidth - 5;

        if (x < 5) x = 5;
        if (x > maxW) x = maxW;

        thumb.style.left = x + 'px';
        fill.style.width = (x + 30) + 'px'; // +30 to look native

        if (x >= maxW - 5) {
            isDragging = false;
            thumb.innerHTML = '🔓';
            unlockStage(stage);
        }
    };

    const stopDrag = () => {
        if (isDragging && !isStageUnlocked) {
            isDragging = false;
            thumb.style.transition = 'left 0.3s';
            fill.style.transition = 'width 0.3s';
            thumb.style.left = '5px';
            fill.style.width = '60px';
            setTimeout(() => {
                thumb.style.transition = '';
                fill.style.transition = '';
            }, 300);
        }
    };

    thumb.addEventListener('mousedown', startDrag);
    thumb.addEventListener('touchstart', startDrag);
    window.addEventListener('mousemove', doDrag);
    window.addEventListener('touchmove', doDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);
}

// Stage 7
function initMatchVibe(stage) {
    const row = document.createElement('div');
    row.className = 'vibe-row';
    const emojis = ['😊', '🥰', '😍', '💀'];

    emojis.forEach(e => {
        const item = document.createElement('div');
        item.className = 'vibe-emoji';
        item.innerText = e;
        item.onclick = () => {
            if (isStageUnlocked) return;
            if (e === '🥰' || e === '😍') {
                item.style.background = 'rgba(255, 126, 179, 0.4)';
                unlockStage(stage);
            } else {
                shakeError();
            }
        };
        row.appendChild(item);
    });
    interactiveArea.appendChild(row);
}

// Stage 8
function initShakeOrTap(stage) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';

    const btn = document.createElement('button');
    btn.className = 'rapid-btn';
    let taps = 0;

    if (isMobile) {
        // Show subtle icon for mobile
        const icon = document.createElement('div');
        icon.className = 'shake-icon';
        icon.innerText = '📱';
        wrapper.appendChild(icon);
        btn.innerText = 'TAP!';
        btn.style.width = '100px';
        btn.style.height = '100px';
        btn.style.fontSize = '20px';

        let lastX, lastY, lastZ;
        const shakeHandler = (e) => {
            if (isStageUnlocked) return;
            let acc = e.accelerationIncludingGravity;
            if (!acc) return;
            let aX = acc.x; let aY = acc.y; let aZ = acc.z;
            if (lastX !== undefined) {
                let speed = Math.abs(aX + aY + aZ - lastX - lastY - lastZ);
                if (speed > 25) { // Shake detected
                    window.removeEventListener('devicemotion', shakeHandler);
                    unlockStage(stage);
                }
            }
            lastX = aX; lastY = aY; lastZ = aZ;
        };

        // request permission for ios 13+
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            const permBtn = document.createElement('button');
            permBtn.innerText = 'Enable Sensors';
            permBtn.className = 'btn btn-secondary';
            permBtn.style.marginBottom = '10px';
            permBtn.onclick = () => {
                DeviceMotionEvent.requestPermission().then(res => {
                    if (res === 'granted') window.addEventListener('devicemotion', shakeHandler);
                    permBtn.remove();
                }).catch(console.error);
            };
            wrapper.prepend(permBtn);
        } else {
            window.addEventListener('devicemotion', shakeHandler);
        }
    } else {
        btn.innerText = '0';
    }

    btn.onclick = () => {
        if (isStageUnlocked) return;
        taps++;
        if (!isMobile) btn.innerText = taps;
        if (taps >= 10) {
            btn.style.background = 'var(--success)';
            btn.innerText = '✓';
            unlockStage(stage);
        }
    };

    wrapper.appendChild(btn);
    interactiveArea.appendChild(wrapper);
}

// Stage 9
function initDrawStar(stage) {
    const wrapper = document.createElement('div');
    wrapper.className = 'canvas-wrapper';
    const canvas = document.createElement('canvas');
    wrapper.appendChild(canvas);
    interactiveArea.appendChild(wrapper);

    // Setup canvas
    const ctx = canvas.getContext('2d');
    // We must wait for DOM to size it, or set explicit sizes
    setTimeout(() => {
        canvas.width = wrapper.offsetWidth;
        canvas.height = wrapper.offsetHeight;
    }, 50);

    let clicks = 0;
    let lastPoint = null;

    const clickPoint = (e) => {
        if (isStageUnlocked) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.fillStyle = '#ff7eb3';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        if (lastPoint) {
            ctx.beginPath();
            ctx.moveTo(lastPoint.x, lastPoint.y);
            ctx.lineTo(x, y);
            ctx.strokeStyle = '#ff7eb3';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        lastPoint = { x, y };
        clicks++;

        // Star needs 5 points
        if (clicks >= 5) {
            // Draw last line to first point to close shape
            ctx.beginPath();
            ctx.moveTo(x, y);
            // We just let it be, completing 5 clicks is enough for validation
            unlockStage(stage.successMsg);
        }
    };

    canvas.addEventListener('mousedown', clickPoint);
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        clickPoint(e);
    });
}

// Stage 10
function initFinal() {
    stageIndicator.innerText = "✨ Happy Birthday ✨";
    progressBar.style.width = '100%';
    instructionEl.style.display = 'none';
    btnBack.classList.add('hidden');

    const title = document.createElement('h2');
    title.className = 'celebration-title';
    title.innerText = `Happy Birthday, ${HER_NAME}!`;

    const letterBox = document.createElement('div');
    letterBox.className = 'letter-box';
    letterBox.innerHTML = LONG_LETTER;

    const wishBtn = document.createElement('button');
    wishBtn.className = 'btn btn-wish';
    wishBtn.innerText = 'Make a Wish 🎂';
    wishBtn.onclick = () => {
        modalOverlay.classList.add('active');
        fireConfetti();
    };

    const musicBtn = document.createElement('button');
    musicBtn.className = 'btn btn-play-music';
    musicBtn.innerText = '';
    musicBtn.onclick = () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicBtn.innerText = '🎵 Pause Song';
        } else {
            bgMusic.pause();
            musicBtn.innerText = '🎵 Play Song';
        }
    };

    const replayBtn = document.createElement('button');
    replayBtn.className = 'btn btn-secondary';
    replayBtn.style.width = '100%';
    replayBtn.innerText = 'Play Again';
    replayBtn.onclick = () => {
        localStorage.removeItem('birthday_stage');
        currentStage = 1;
        instructionEl.style.display = 'block';
        btnBack.classList.remove('hidden');
        animateCardTransition(() => loadStage(currentStage));
    };

    const stats = document.createElement('div');
    stats.className = 'stats-text';
    stats.innerText = `Total interactions: ${interactionsTotal}`;

    // Secret double tap on the title
    let taps = 0;
    title.addEventListener('click', () => {
        taps++;
        if (taps === 2) {
            alert('Secret unlocked: I wish you knew how your existence quietly rewired my world.How your laughter lingers like an echo I never want to stop hearing.I wish you knew that even on your worst days, youre still magic to someone. To me .I just wish you knew.');
            taps = 0;
        }
        setTimeout(() => taps = 0, 500);
    });

    interactiveArea.appendChild(title);
    interactiveArea.appendChild(letterBox);
    interactiveArea.appendChild(musicBtn);
    interactiveArea.appendChild(wishBtn);
    interactiveArea.appendChild(replayBtn);
    interactiveArea.appendChild(stats);

    fireConfetti();
}

function fireConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Add falling confetti keyframes dynamically
const style = document.createElement('style');
style.innerHTML = `
@keyframes fall {
    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}
`;
document.head.appendChild(style);

// Cursor Trail Effect
function initCursorTrail() {
    const chars = ['✨', '⭐', '✦', '·'];

    const spawnSparkle = (x, y) => {
        if (Math.random() > 0.4) return; // Moderate the spawn rate

        const el = document.createElement('div');
        el.className = 'cursor-sparkle';
        el.innerText = chars[Math.floor(Math.random() * chars.length)];

        // Slight random offset from the exact cursor coordinate
        const offsetX = (Math.random() - 0.5) * 25;
        const offsetY = (Math.random() - 0.5) * 25;

        el.style.left = (x + offsetX) + 'px';
        el.style.top = (y + offsetY) + 'px';

        // Mix between pure white and bright teal/yellow hues
        el.style.color = Math.random() > 0.5 ? 'white' : `hsl(${Math.random() * 40 + 180}, 100%, 80%)`;
        el.style.fontSize = (10 + Math.random() * 15) + 'px';

        document.body.appendChild(el);

        // Clean up node after animation ends
        setTimeout(() => el.remove(), 800);
    };

    document.addEventListener('mousemove', (e) => spawnSparkle(e.clientX, e.clientY));
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            spawnSparkle(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });
}
