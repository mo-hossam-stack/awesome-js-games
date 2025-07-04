const cards = document.querySelectorAll(".card");

let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;

let timerInterval = null;
let secondsElapsed = 0;
let moves = 0;
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');

const themes = {
  classic: [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8].map(n => `assets/images/img-${n}.png`),
  emoji: [
    '🍎','🐶','🚗','🌟','🎈','🍕','⚽','🎲',
    '🍎','🐶','🚗','🌟','🎈','🍕','⚽','🎲'
  ]
};
let currentTheme = 'classic';

const themeClassicBtn = document.getElementById('theme-classic');
const themeEmojiBtn = document.getElementById('theme-emoji');

function setTheme(theme) {
  currentTheme = theme;
  shuffleCard();
  if (theme === 'classic') {
    themeClassicBtn.classList.add('active');
    themeEmojiBtn.classList.remove('active');
  } else {
    themeClassicBtn.classList.remove('active');
    themeEmojiBtn.classList.add('active');
  }
}
themeClassicBtn.addEventListener('click', () => setTheme('classic'));
themeEmojiBtn.addEventListener('click', () => setTheme('emoji'));

const darkToggleBtn = document.getElementById('dark-toggle-btn');
function setDarkIcon() {
  if (document.body.classList.contains('dark')) {
    darkToggleBtn.textContent = '☀️';
    darkToggleBtn.setAttribute('aria-label', 'Switch to light mode');
  } else {
    darkToggleBtn.textContent = '🌙';
    darkToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
  }
}

if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
}
setDarkIcon();
darkToggleBtn.addEventListener('click', function() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('darkMode', isDark ? 'true' : 'false');
  setDarkIcon();
});

function setCardValue(card, value) {
  card.setAttribute('data-card-value', value);
  const imgTag = card.querySelector('.back-view img');
  let emojiSpan = card.querySelector('.back-view span');
  if (!emojiSpan) {
    emojiSpan = document.createElement('span');
    emojiSpan.style.fontSize = '2rem';
    emojiSpan.style.display = 'block';
    emojiSpan.style.textAlign = 'center';
    card.querySelector('.back-view').appendChild(emojiSpan);
  }
  if(currentTheme === 'classic') {
    imgTag.src = value;
    imgTag.alt = 'card-img';
    imgTag.style.display = '';
    emojiSpan.style.display = 'none';
  } else if(currentTheme === 'emoji') {
    imgTag.src = '';
    imgTag.alt = value;
    imgTag.style.display = 'none';
    emojiSpan.textContent = value;
    emojiSpan.style.display = 'block';
  }
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    secondsElapsed++;
    timerDisplay.textContent = `Time: ${secondsElapsed}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  stopTimer();
  secondsElapsed = 0;
  timerDisplay.textContent = 'Time: 0s';
}

function resetMoves() {
  moves = 0;
  movesDisplay.textContent = 'Moves: 0';
}

function shuffleCard() {
  matched = 0;
  disableDeck = false;
  cardOne = cardTwo = "";
  let arr = [...themes[currentTheme]];
  arr.sort(() => Math.random() > 0.5 ? 1 : -1);
  cards.forEach((card, i) => {
    card.classList.remove("flip");
    setCardValue(card, arr[i]);
    card.addEventListener("click", flipCard);
  });
  resetTimer();
  resetMoves();
}

function flipCard({target: clickedCard}) {
  if(clickedCard.classList.contains('flip') || disableDeck) return;
  clickedCard.classList.add("flip");
  if(!cardOne && moves === 0 && secondsElapsed === 0) {
    startTimer();
  }
  if(!cardOne) {
    cardOne = clickedCard;
    return;
  }
  cardTwo = clickedCard;
  disableDeck = true;
  moves++;
  movesDisplay.textContent = `Moves: ${moves}`;
  const cardOneValue = cardOne.getAttribute('data-card-value');
  const cardTwoValue = cardTwo.getAttribute('data-card-value');
  matchCards(cardOneValue, cardTwoValue);
}

function matchCards(val1, val2) {
  if(val1 === val2) {
    matched++;
    if(matched == 8) {
      setTimeout(() => {
        return shuffleCard();
      }, 1000);
    }
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    disableDeck = false;
    return;
  }
  setTimeout(() => {
    cardOne.classList.add("shake");
    cardTwo.classList.add("shake");
  }, 400);

  setTimeout(() => {
    cardOne.classList.remove("shake", "flip");
    cardTwo.classList.remove("shake", "flip");
    cardOne = cardTwo = "";
    disableDeck = false;
  }, 1200);
}

shuffleCard();

cards.forEach(card => {
  card.addEventListener("click", flipCard);
});