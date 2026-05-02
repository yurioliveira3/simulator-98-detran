const state = {
  mode: null,
  questions: [],
  currentIndex: 0,
  score: 0,
  wrongCount: 0,
  answered: false,
  selectedAlternative: null,
  currentAlternatives: [],
  secondsLeft: 1800,
  timerInterval: null,
  difficultyStats: {
    facil: { correct: 0, total: 0 },
    intermediario: { correct: 0, total: 0 },
    dificil: { correct: 0, total: 0 },
  },
  answeredQuestions: [],
  flashcardFlipped: false,
};

let allQuestions = [];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function resetState() {
  state.mode = null;
  state.questions = [];
  state.currentIndex = 0;
  state.score = 0;
  state.wrongCount = 0;
  state.answered = false;
  state.selectedAlternative = null;
  state.flashcardFlipped = false;
  state.difficultyStats = {
    facil: { correct: 0, total: 0 },
    intermediario: { correct: 0, total: 0 },
    dificil: { correct: 0, total: 0 },
  };
  state.answeredQuestions = [];
}

function showScreen(id) {
  ['screen-home', 'screen-quiz', 'screen-flashcard', 'screen-result'].forEach(s => {
    document.getElementById(s).classList.add('hidden');
  });
  document.getElementById(id).classList.remove('hidden');
}

function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const flashcardScreen = document.getElementById('screen-flashcard');
    if (!flashcardScreen.classList.contains('hidden')) {
      flipCard();
      return;
    }

    const quizScreen = document.getElementById('screen-quiz');
    if (quizScreen.classList.contains('hidden')) return;

    const modalTimeUp = document.getElementById('modal-time-up');
    const modalExitNormal = document.getElementById('modal-confirm-exit-normal');
    const modalExitMarathon = document.getElementById('modal-confirm-exit');
    const modalCloseApp = document.getElementById('modal-confirm-close-app');
    if (modalTimeUp.classList.contains('active') || modalExitNormal.classList.contains('active') || modalExitMarathon.classList.contains('active') || modalCloseApp.classList.contains('active')) return;

    if (state.answered) {
      nextQuestion();
    } else if (state.selectedAlternative !== null) {
      confirmAnswer();
    }
  }

  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    const quizScreen = document.getElementById('screen-quiz');
    if (quizScreen.classList.contains('hidden')) return;
    if (state.answered) return;

    const btns = document.querySelectorAll('.alternative-btn');
    if (btns.length === 0) return;

    const currentIdx = state.selectedAlternative !== null ? state.selectedAlternative : -1;
    let nextIdx;
    if (e.key === 'ArrowDown') {
      nextIdx = currentIdx < btns.length - 1 ? currentIdx + 1 : 0;
    } else {
      nextIdx = currentIdx > 0 ? currentIdx - 1 : btns.length - 1;
    }
    selectAlternative(nextIdx);
    btns[nextIdx].focus();
  }

  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    const flashcardScreen = document.getElementById('screen-flashcard');
    if (flashcardScreen.classList.contains('hidden')) return;
    if (e.key === 'ArrowRight') nextFlashcard();
    else prevFlashcard();
  }
});
