function startTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    state.secondsLeft--;
    updateTimerDisplay();
    if (state.secondsLeft <= 0) {
      clearInterval(state.timerInterval);
      handleTimeUp();
    }
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function updateTimerDisplay() {
  const min = String(Math.floor(state.secondsLeft / 60)).padStart(2, '0');
  const sec = String(state.secondsLeft % 60).padStart(2, '0');
  const el = document.getElementById('timer-display');
  el.textContent = `${min}:${sec}`;

  el.classList.remove('warning', 'danger');
  if (state.secondsLeft <= 60) el.classList.add('danger');
  else if (state.secondsLeft <= 300) el.classList.add('warning');
}

function handleTimeUp() {
  const answered = state.currentIndex;
  const msg = `O tempo de 30 minutos foi encerrado.\n\nVocê respondeu ${answered} de ${state.questions.length} questões com ${state.score} acertos.`;
  document.getElementById('modal-time-up-msg').textContent = msg;
  openModal('modal-time-up');
}
