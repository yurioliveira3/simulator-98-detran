function renderQuestion() {
  const q = state.questions[state.currentIndex];
  const total = state.questions.length;

  state.answered = false;
  state.selectedAlternative = null;
  state.currentAlternatives = buildAlternatives(q);

  document.getElementById('quiz-counter').textContent = `Questão ${state.currentIndex + 1} de ${total}`;

  const pct = (state.currentIndex / total) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-text').textContent = `${state.currentIndex}/${total}`;

  const tagsEl = document.getElementById('question-tags');
  const diffClass = `tag-dificuldade-${q.dificuldade}`;
  const diffLabel = q.dificuldade === 'facil' ? 'Fácil' : q.dificuldade === 'intermediario' ? 'Intermediário' : 'Difícil';
  tagsEl.innerHTML = `
    <span class="tag tag-modulo">📂 ${q.modulo_titulo}</span>
    <span class="tag ${diffClass}">${diffLabel}</span>
  `;

  const placaEl = document.getElementById('question-placa');
  if (q.codigo_placa) {
    placaEl.textContent = `Placa: ${q.codigo_placa}`;
    placaEl.classList.remove('hidden');
  } else {
    placaEl.classList.add('hidden');
  }

  document.getElementById('question-enunciado').textContent = q.enunciado;

  const letters = ['A', 'B', 'C', 'D'];
  const listEl = document.getElementById('alternatives-list');
  listEl.innerHTML = '';
  state.currentAlternatives.forEach((alt, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'alternative-btn';
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML = `<span class="alternative-letter">${letters[i]})</span>${alt.text}`;
    btn.onclick = () => selectAlternative(i);
    listEl.appendChild(btn);
  });

  document.getElementById('feedback-panel').classList.add('hidden');

  document.getElementById('btn-confirm').disabled = true;
  document.getElementById('btn-confirm').classList.remove('hidden');
  document.getElementById('btn-next').classList.add('hidden');

  document.title = `Questão ${state.currentIndex + 1}/${total} — Simulado DETRAN 98`;

  if (state.mode === 'marathon') {
    updateScoreDisplay();
  }
}

function selectAlternative(index) {
  if (state.answered) return;

  state.selectedAlternative = index;

  const btns = document.querySelectorAll('.alternative-btn');
  btns.forEach((btn, i) => {
    btn.classList.toggle('selected', i === index);
    btn.setAttribute('aria-pressed', i === index ? 'true' : 'false');
  });

  document.getElementById('btn-confirm').disabled = false;
}

function confirmAnswer() {
  if (state.selectedAlternative === null || state.answered) return;

  state.answered = true;
  const q = state.questions[state.currentIndex];
  const isCorrect = state.currentAlternatives[state.selectedAlternative].isCorrect;

  if (isCorrect) {
    state.score++;
  } else {
    state.wrongCount++;
  }

  state.difficultyStats[q.dificuldade].total++;
  if (isCorrect) {
    state.difficultyStats[q.dificuldade].correct++;
  }

  state.answeredQuestions.push({
    question: q,
    selectedText: state.currentAlternatives[state.selectedAlternative].text,
    isCorrect,
  });

  const btns = document.querySelectorAll('.alternative-btn');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    btn.classList.remove('selected');
    if (state.currentAlternatives[i].isCorrect) {
      btn.classList.add('correct');
    } else if (i === state.selectedAlternative && !isCorrect) {
      btn.classList.add('wrong');
    }
  });

  const panel = document.getElementById('feedback-panel');
  panel.classList.remove('hidden', 'correct', 'wrong');
  panel.classList.add(isCorrect ? 'correct' : 'wrong');
  document.getElementById('feedback-title').textContent = isCorrect ? '✅ Correto!' : '❌ Errado!';
  document.getElementById('feedback-comment').textContent = q.comentario;

  document.getElementById('btn-confirm').classList.add('hidden');
  const isLast = state.currentIndex >= state.questions.length - 1;
  document.getElementById('btn-next').classList.remove('hidden');
  document.getElementById('btn-next').textContent = isLast ? 'Ver Resultado →' : 'Próxima →';

  if (state.mode === 'marathon') {
    updateScoreDisplay();
  }
}

function nextQuestion() {
  state.currentIndex++;
  if (state.currentIndex >= state.questions.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

function updateScoreDisplay() {
  document.getElementById('quiz-score').textContent = `✅ ${state.score} acertos | ❌ ${state.wrongCount} erros`;
}
