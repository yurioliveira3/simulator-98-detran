function startNormalMode() {
  resetState();
  state.mode = 'normal';
  state.questions = selectNormalQuestions();
  state.secondsLeft = 1800;

  document.getElementById('quiz-score').classList.add('hidden');
  document.getElementById('btn-exit-marathon').classList.add('hidden');
  document.getElementById('timer-display').style.display = '';

  showScreen('screen-quiz');
  updateTimerDisplay();
  startTimer();
  renderQuestion();
}

function startMarathonMode() {
  resetState();
  state.mode = 'marathon';
  state.questions = shuffle(allQuestions);

  document.getElementById('quiz-score').classList.remove('hidden');
  document.getElementById('btn-exit-marathon').classList.remove('hidden');
  document.getElementById('timer-display').style.display = 'none';

  showScreen('screen-quiz');
  updateScoreDisplay();
  renderQuestion();
}

function startFlashcardMode() {
  state.mode = 'flashcard';
  state.questions = shuffle(allQuestions);
  state.currentIndex = 0;
  state.flashcardFlipped = false;

  showScreen('screen-flashcard');
  renderFlashcard();
}

function handleCloseQuiz() {
  if (state.mode === 'normal') {
    const answered = state.currentIndex;
    const msg = `Você respondeu ${answered} de ${state.questions.length} questões com ${state.score} acertos.\n\nDeseja encerrar e ver o resultado?`;
    document.getElementById('modal-exit-normal-msg').textContent = msg;
    openModal('modal-confirm-exit-normal');
  } else {
    confirmExitMarathon();
  }
}

function confirmExitMarathon() {
  const answered = state.currentIndex;
  const pct = answered > 0 ? ((state.score / answered) * 100).toFixed(1) : '0.0';
  const msg = `Você respondeu ${answered} questões com ${state.score} acertos (${pct}%).\n\nTem certeza que deseja sair?`;
  document.getElementById('modal-exit-msg').textContent = msg;
  openModal('modal-confirm-exit');
}
