fetch('data/questions.json')
  .then(res => res.json())
  .then(data => {
    allQuestions = data;
    document.getElementById('loading-msg').classList.add('hidden');
    document.getElementById('mode-cards').classList.remove('hidden');
  })
  .catch(err => {
    document.getElementById('loading-msg').textContent = 'Erro ao carregar questions.json. Verifique se o arquivo está na pasta data/ e se está servindo via servidor local.';
    console.error(err);
  });

function selectNormalQuestions() {
  const easy = shuffle(allQuestions.filter(q => q.dificuldade === 'facil'));
  const medium = shuffle(allQuestions.filter(q => q.dificuldade === 'intermediario'));
  const hard = shuffle(allQuestions.filter(q => q.dificuldade === 'dificil'));

  const selected = [
    ...easy.slice(0, 7),
    ...medium.slice(0, 10),
    ...hard.slice(0, 13),
  ];

  return shuffle(selected);
}

function buildAlternatives(question) {
  const options = [
    { text: question.alternativa_correta, isCorrect: true },
    ...question.alternativas_incorretas.map(t => ({ text: t, isCorrect: false }))
  ];
  return shuffle(options);
}
