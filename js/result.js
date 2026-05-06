const DIFFICULTY_COLORS = { facil: '#008000', intermediario: '#c0c000', dificil: '#800000' };
const DIFFICULTY_LABELS = { facil: 'Fácil', intermediario: 'Intermediário', dificil: 'Difícil' };

function formatTime(seconds) {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  }
  return `${seconds}s`;
}

function showResult() {
  stopTimer();

  const total = state.questions.length;
  const answered = state.currentIndex;
  const pct = total > 0 ? ((state.score / total) * 100).toFixed(1) : '0.0';

  if (state.mode === 'normal') {
    const approved = state.score >= 21;
    document.getElementById('result-icon').textContent = approved ? '🏆' : '📚';
    document.getElementById('result-title').textContent = approved ? 'Aprovada! 🎉' : 'Não foi dessa vez... 📚';
    document.getElementById('result-stat-label').textContent = 'Nota';
    document.getElementById('result-stat-value').textContent = `${state.score} / ${total}`;
    document.getElementById('result-percent').textContent = pct + '%';
    document.getElementById('result-message').textContent = approved
      ? 'Parabéns! Você está preparado(a)! 💙'
      : 'Continue praticando, você consegue! 💪';
    document.getElementById('btn-retry').textContent = '🔄 Tentar Novamente';
    document.getElementById('btn-retry').onclick = startNormalMode;
    document.getElementById('result-progress-container').classList.add('hidden');
    renderDifficultyStats();
    document.getElementById('btn-gabarito').classList.remove('hidden');
  } else if (state.mode === 'marathon') {
    const finished = state.currentIndex >= total;
    document.getElementById('result-icon').textContent = '🏁';
    document.getElementById('result-title').textContent = finished ? 'Maratona Concluída!' : 'Maratona Interrompida';
    document.getElementById('result-stat-label').textContent = 'Questões respondidas';
    document.getElementById('result-stat-value').textContent = `${answered} de ${total}`;
    document.getElementById('result-percent').textContent = pct + '%';
    document.getElementById('result-message').textContent = answered > 0
      ? `Você acertou ${state.score} de ${answered} questões respondidas.`
      : 'Nenhuma questão foi respondida.';
    document.getElementById('btn-retry').textContent = '🔄 Nova Maratona';
    document.getElementById('btn-retry').onclick = startMarathonMode;

    const pctBar = (answered / total) * 100;
    document.getElementById('result-progress-fill').style.width = pctBar + '%';
    document.getElementById('result-progress-text').textContent = `${answered}/${total}`;
    document.getElementById('result-progress-container').classList.remove('hidden');
    renderDifficultyStats();
    document.getElementById('btn-gabarito').classList.remove('hidden');
  } else {
    document.getElementById('result-icon').textContent = '🃏';
    document.getElementById('result-title').textContent = 'Flashcards';
    document.getElementById('result-stat-label').textContent = 'Modo de Estudo';
    document.getElementById('result-stat-value').textContent = 'Sem pontuação';
    document.getElementById('result-percent').textContent = '—';
    document.getElementById('result-message').textContent = 'O modo flashcard é para estudo livre. Tente o Modo Normal ou Maratona para testar seus conhecimentos!';
    document.getElementById('btn-retry').textContent = '🔄 Novos Flashcards';
    document.getElementById('btn-retry').onclick = startFlashcardMode;
    document.getElementById('result-progress-container').classList.add('hidden');
    document.getElementById('result-difficulty-stats').classList.add('hidden');
    document.getElementById('btn-gabarito').classList.add('hidden');
  }

  showScreen('screen-result');
  document.title = 'Resultado — Simulado DETRAN 98';
}

function renderDifficultyStats() {
  const container = document.getElementById('result-difficulty-stats');
  const stats = state.difficultyStats;

  if (stats.facil.total === 0 && stats.intermediario.total === 0 && stats.dificil.total === 0) {
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');

  let html = '<div class="difficulty-stats-title">Desempenho por Dificuldade</div>';

  ['facil', 'intermediario', 'dificil'].forEach(key => {
    const s = stats[key];
    if (s.total === 0) return;
    const pctVal = ((s.correct / s.total) * 100).toFixed(0);
    html += `
      <div class="difficulty-row">
        <span class="difficulty-label">${DIFFICULTY_LABELS[key]}</span>
        <div class="difficulty-bar-bg">
          <div class="difficulty-bar-fill" style="width:${pctVal}%;background:${DIFFICULTY_COLORS[key]}"></div>
        </div>
        <span class="difficulty-value">${s.correct}/${s.total} (${pctVal}%)</span>
      </div>
    `;
  });

  container.innerHTML = html;
}

function openGabarito() {
  if (state.answeredQuestions.length === 0) return;

  const listEl = document.getElementById('gabarito-list');
  let html = '';

  state.answeredQuestions.forEach((item, i) => {
    const q = item.question;
    const diffLabel = DIFFICULTY_LABELS[q.dificuldade];
    const statusIcon = item.isCorrect ? '✅' : '❌';

    html += `
      <div class="gabarito-item">
        <div class="gabarito-header" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='block'?'none':'block';this.querySelector('.gabarito-arrow').style.transform=this.nextElementSibling.style.display==='block'?'rotate(180deg)':''">
          <span class="gabarito-status">${statusIcon}</span>
          <span class="gabarito-num">#${i + 1}</span>
          <span class="gabarito-diff-tag tag-dificuldade-${q.dificuldade}">${diffLabel}</span>
          <span class="gabarito-enunciado-short">${q.enunciado.substring(0, 80)}${q.enunciado.length > 80 ? '...' : ''}</span>
          <span class="gabarito-arrow">▼</span>
        </div>
        <div class="gabarito-body">
          <div class="gabarito-enunciado-full">${q.enunciado}</div>
          <div class="gabarito-answer ${item.isCorrect ? 'correct' : 'wrong'}">
            <strong>Sua resposta:</strong> ${item.selectedText}
          </div>
          ${!item.isCorrect ? `<div class="gabarito-answer correct"><strong>Resposta correta:</strong> ${q.alternativa_correta}</div>` : ''}
          <div class="gabarito-comment"><strong>Comentário:</strong> ${q.comentario}</div>
            ${item.timeSpent !== undefined ? `<div class="gabarito-time">⏱ Tempo: ${formatTime(item.timeSpent)}</div>` : ''}
        </div>
      </div>
    `;
  });

  listEl.innerHTML = html;
  openModal('modal-gabarito');
}

function goHome() {
  stopTimer();
  resetState();
  showScreen('screen-home');
  document.title = 'Simulado DETRAN 98';
}

function confirmCloseApp() {
  const msgEl = document.getElementById('modal-close-app-msg');
  const leaveBtn = document.getElementById('btn-leave');

  if (state.mode === null) {
    msgEl.textContent = 'Obrigado por usar o Simulado DETRAN 98! Você pode fechar esta aba.';
    leaveBtn.textContent = 'Fechar';
    leaveBtn.onclick = () => closeModal('modal-confirm-close-app');
  } else {
    msgEl.textContent = 'Tem certeza que deseja sair?';
    leaveBtn.textContent = 'Sair';
    leaveBtn.onclick = () => { closeModal('modal-confirm-close-app'); showResult(); };
  }

  openModal('modal-confirm-close-app');
}
