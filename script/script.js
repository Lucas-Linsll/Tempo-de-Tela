const questions = [
  {
    statement: "Ficar muito tempo olhando para telas sem pausas pode causar cansaço visual e desconforto.",
    answer: true,
    explanation: "Verdadeiro. Pausas regulares e momentos olhando para longe ajudam a descansar os olhos."
  },
  {
    statement: "Notificações frequentes podem atrapalhar a concentração, mesmo quando você não abre o celular.",
    answer: true,
    explanation: "Verdadeiro. A expectativa de uma notificação também pode interromper seu foco."
  },
  {
    statement: "Existe um limite diário de tela que é ideal e igual para todas as pessoas.",
    answer: false,
    explanation: "Falso. A rotina e as necessidades variam; observe como o uso afeta seu bem-estar."
  },
  {
    statement: "Fazer pausas, se movimentar e reservar momentos sem tela são formas de buscar equilíbrio.",
    answer: true,
    explanation: "Verdadeiro. Pequenas mudanças na rotina podem abrir espaço para descanso e movimento."
  },
  {
    statement: "Usar o celular até a hora de dormir nunca interfere na qualidade do sono.",
    answer: false,
    explanation: "Falso. Para algumas pessoas, o uso perto da hora de dormir pode dificultar desacelerar."
  }
];

const questionText = document.querySelector("#question-text");
const questionCount = document.querySelector("#quiz-count");
const progressTrack = document.querySelector(".progress-track");
const progressFill = document.querySelector("#progress-fill");
const quizContent = document.querySelector("#quiz-content");
const quizResult = document.querySelector("#quiz-result");
const feedback = document.querySelector("#quiz-feedback");
const nextButton = document.querySelector("#next-question");
const answerButtons = [...document.querySelectorAll(".answer-button")];
let currentQuestion = 0;
let score = 0;
let hasAnswered = false;

function renderQuestion() {
  const question = questions[currentQuestion];
  questionText.textContent = question.statement;
  questionCount.innerHTML = `PERGUNTA ${String(currentQuestion + 1).padStart(2, "0")} <i>/ ${String(questions.length).padStart(2, "0")}</i>`;
  progressFill.style.width = `${(currentQuestion / questions.length) * 100}%`;
  progressTrack.setAttribute("aria-valuenow", String(currentQuestion));
  feedback.textContent = "";
  feedback.className = "quiz-feedback";
  nextButton.hidden = true;
  hasAnswered = false;
  answerButtons.forEach((button) => {
    button.disabled = false;
    button.classList.remove("is-correct", "is-wrong");
  });
}

function submitAnswer(selectedAnswer, selectedButton) {
  if (hasAnswered) return;
  hasAnswered = true;
  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.answer;
  if (isCorrect) score += 1;
  answerButtons.forEach((button) => {
    button.disabled = true;
    if (button.dataset.answer === String(question.answer)) button.classList.add("is-correct");
  });
  if (!isCorrect) selectedButton.classList.add("is-wrong");
  feedback.textContent = `${isCorrect ? "Isso mesmo!" : "Quase!"} ${question.explanation}`;
  feedback.classList.add(isCorrect ? "correct" : "incorrect");
  nextButton.textContent = currentQuestion === questions.length - 1 ? "Ver resultado" : "Próxima pergunta";
  nextButton.hidden = false;
  nextButton.focus();
}

function showResult() {
  progressFill.style.width = "100%";
  progressTrack.setAttribute("aria-valuenow", String(questions.length));
  quizContent.hidden = true;
  quizResult.hidden = false;
  document.querySelector("#score-number").textContent = String(score);
  const title = document.querySelector("#result-title");
  const copy = document.querySelector("#result-copy");
  if (score === questions.length) {
    title.textContent = "Mandou muito bem!";
    copy.textContent = "Você está por dentro do assunto. Que tal compartilhar esse equilíbrio no seu dia?";
  } else if (score >= 3) {
    title.textContent = "Bom trabalho!";
    copy.textContent = "Você já sabe bastante. Continue buscando escolhas mais conscientes no seu dia a dia.";
  } else {
    title.textContent = "Todo aprendizado começa!";
    copy.textContent = "Agora você já conhece novas formas de cuidar da sua relação com as telas.";
  }
  document.querySelector("#restart-quiz").focus();
}

answerButtons.forEach((button) => {
  button.addEventListener("click", () => submitAnswer(button.dataset.answer === "true", button));
});

nextButton.addEventListener("click", () => {
  if (currentQuestion === questions.length - 1) {
    showResult();
    return;
  }
  currentQuestion += 1;
  renderQuestion();
  answerButtons[0].focus();
});

document.querySelector("#restart-quiz").addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  quizContent.hidden = false;
  quizResult.hidden = true;
  renderQuestion();
  answerButtons[0].focus();
});

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  navLinks.classList.toggle("is-open", !isOpen);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    navLinks.classList.remove("is-open");
  }
});

renderQuestion();
