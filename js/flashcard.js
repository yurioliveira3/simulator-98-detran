function renderFlashcard() {
  const q = state.questions[state.currentIndex];

  state.flashcardFlipped = false;
  const card = document.getElementById('flashcard');
  card.classList.remove('flipped');

  document.getElementById('flashcard-front-content').textContent = q.enunciado;
  document.getElementById('flashcard-back-content').innerHTML = `<strong>${q.alternativa_correta}</strong><br><br>${q.comentario}`;

  document.title = `Flashcard ${state.currentIndex + 1} — Simulado DETRAN 98`;
}

function flipCard() {
  state.flashcardFlipped = !state.flashcardFlipped;
  document.getElementById('flashcard').classList.toggle('flipped');
}

function nextFlashcard() {
  if (state.currentIndex < state.questions.length - 1) {
    state.currentIndex++;
    renderFlashcard();
  }
}

function prevFlashcard() {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    renderFlashcard();
  }
}
