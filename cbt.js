const questionSets = {
  Science: [
    ["Which gas do plants absorb during photosynthesis?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], 1],
    ["What is the chemical symbol for water?", ["CO2", "O2", "H2O", "NaCl"], 2],
    ["Which organ pumps blood around the body?", ["Lungs", "Brain", "Heart", "Liver"], 2],
    ["What force pulls objects toward Earth?", ["Friction", "Gravity", "Magnetism", "Pressure"], 1],
    ["At sea level, water boils at what temperature?", ["50°C", "75°C", "100°C", "150°C"], 2]
  ],
  Mathematics: [
    ["What is 12 × 8?", ["84", "92", "96", "108"], 2],
    ["What is the perimeter of a square with sides of 5 cm?", ["10 cm", "20 cm", "25 cm", "30 cm"], 1],
    ["Which fraction is equal to 0.5?", ["1/4", "1/3", "1/2", "2/3"], 2],
    ["Solve: 3x = 21.", ["6", "7", "8", "9"], 1],
    ["What is the area of a 4 cm by 6 cm rectangle?", ["10 cm²", "20 cm²", "24 cm²", "28 cm²"], 2]
  ],
  English: [
    ["Choose the correctly spelled word.", ["Neccessary", "Necessary", "Necesary", "Necassary"], 1],
    ["What is the plural of “child”?", ["Childs", "Childes", "Children", "Childrens"], 2],
    ["Which word is a verb?", ["Quickly", "Bright", "Write", "Blue"], 2],
    ["Choose the opposite of “ancient”.", ["Old", "Historic", "Modern", "Past"], 2],
    ["Which sentence uses the correct punctuation?", ["Where are you.", "Where are you?", "Where are you!", "Where are you,"], 1]
  ],
  Geography: [
    ["Which is the largest ocean on Earth?", ["Atlantic", "Indian", "Arctic", "Pacific"], 3],
    ["What is the capital of France?", ["Rome", "Paris", "Madrid", "Lisbon"], 1],
    ["Which imaginary line divides Earth into north and south?", ["Equator", "Prime Meridian", "Tropic of Cancer", "Date Line"], 0],
    ["The Sahara Desert is in which continent?", ["Asia", "Africa", "Australia", "South America"], 1],
    ["Which direction is opposite to east?", ["North", "South", "West", "Northeast"], 2]
  ],
  Accounting: [
    ["Which equation is the basis of accounting?", ["Assets = Liabilities + Equity", "Assets = Income − Expenses", "Equity = Assets + Liabilities", "Income = Assets + Equity"], 0],
    ["Money a business owes is called what?", ["Assets", "Liabilities", "Revenue", "Capital"], 1],
    ["Which book first records a transaction?", ["Ledger", "Balance sheet", "Journal", "Invoice"], 2],
    ["A cash sale increases which account?", ["Cash", "Drawings", "Payables", "Loan"], 0],
    ["What does a trial balance help check?", ["Profit only", "Arithmetical equality of debit and credit totals", "Cash in hand", "Stock quantity"], 1]
  ],
  Art: [
    ["Which are the traditional primary colours in painting?", ["Red, yellow, blue", "Green, orange, purple", "Black, white, grey", "Red, green, blue"], 0],
    ["What is a drawing made quickly to plan an artwork called?", ["Portrait", "Sketch", "Mosaic", "Relief"], 1],
    ["Which tool is commonly used to apply paint?", ["Chisel", "Brush", "Compass", "Needle"], 1],
    ["What do we call the lightness or darkness of a colour?", ["Texture", "Value", "Shape", "Pattern"], 1],
    ["A sculpture is usually a form of which art?", ["Performing", "Literary", "Three-dimensional visual", "Digital sound"], 2]
  ],
  Government: [
    ["What is a constitution?", ["A country's fundamental laws and principles", "A tax receipt", "A campaign poster", "A court building"], 0],
    ["In a democracy, citizens commonly choose leaders through what?", ["Inheritance", "Elections", "Appointment for life", "Lottery"], 1],
    ["Which arm of government interprets laws?", ["Executive", "Legislature", "Judiciary", "Civil service"], 2],
    ["What is the main role of a legislature?", ["Make laws", "Enforce court orders", "Conduct trade", "Print newspapers"], 0],
    ["Local government mainly serves which area?", ["A local community", "The whole world", "Foreign governments", "Only the armed forces"], 0]
  ],
  Commerce: [
    ["What is the exchange of goods and services called?", ["Trade", "Budgeting", "Production", "Taxation"], 0],
    ["A person who starts and runs a business is an…", ["Auditor", "Entrepreneur", "Consumer", "Clerk"], 1],
    ["What does a retailer sell directly to?", ["Manufacturers", "Wholesalers", "Consumers", "Exporters"], 2],
    ["Which document lists goods sold and the amount owed?", ["Invoice", "Receipt", "Cheque", "Catalogue"], 0],
    ["When demand rises and supply stays the same, price usually…", ["Falls", "Rises", "Disappears", "Stays zero"], 1]
  ]
};

const selector = document.querySelector("#subject-select");
const quizContent = document.querySelector("#quiz-content");
const progress = document.querySelector(".quiz-progress");

let questionIndex = 0;
let score = 0;
let answered = false;

function renderQuestion() {
  const questions = questionSets[selector.value];
  const [prompt, options, correctIndex] = questions[questionIndex];
  answered = false;

  progress.firstElementChild.style.width = `${questionIndex / questions.length * 100}%`;
  progress.setAttribute("aria-valuenow", questionIndex);
  quizContent.innerHTML = `
    <p class="question-meta">QUESTION ${questionIndex + 1} OF ${questions.length}</p>
    <h3 class="question">${prompt}</h3>
    <div class="answers">${options.map((option, index) =>
      `<button class="answer" type="button" data-answer="${index}">${option}</button>`).join("")}</div>
    <div class="quiz-bottom">
      <span class="feedback" role="status"></span>
      <button class="quiz-next" type="button" disabled>${questionIndex === questions.length - 1 ? "See score" : "Next question"}</button>
    </div>`;

  const buttons = quizContent.querySelectorAll(".answer");
  const feedback = quizContent.querySelector(".feedback");
  const next = quizContent.querySelector(".quiz-next");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (answered) return;
      answered = true;
      const isCorrect = Number(button.dataset.answer) === correctIndex;

      if (isCorrect) {
        score++;
        button.classList.add("correct");
        feedback.textContent = "Correct — nice work!";
        feedback.classList.add("good");
      } else {
        button.classList.add("incorrect");
        buttons[correctIndex].classList.add("correct");
        feedback.textContent = "Not quite. The correct answer is highlighted.";
        feedback.classList.add("bad");
      }

      buttons.forEach((answerButton) => {
        answerButton.disabled = true;
      });
      next.disabled = false;
    });
  });

  next.addEventListener("click", () => {
    questionIndex++;
    if (questionIndex < questions.length) {
      renderQuestion();
    } else {
      renderResult();
    }
  });
}

function renderResult() {
  const totalQuestions = questionSets[selector.value].length;
  progress.firstElementChild.style.width = "100%";
  progress.setAttribute("aria-valuenow", totalQuestions);
  quizContent.innerHTML = `
    <div class="quiz-result" role="status">
      <strong>${score} / ${totalQuestions} correct</strong>
      <p>${score === totalQuestions ? "Excellent work!" : "Good practice. Try again and see if you can improve your score."}</p>
      <button type="button">Try again</button>
    </div>`;
  quizContent.querySelector("button").addEventListener("click", startQuiz);
}

function startQuiz() {
  if (!questionSets[selector.value]) return;

  questionIndex = 0;
  score = 0;
  renderQuestion();
}

selector.addEventListener("change", () => {
  if (selector.value) startQuiz();
});
const accountGreeting = document.querySelector("#account-greeting");
const signOutButton = document.querySelector("#signout-button");
const accountName = sessionStorage.getItem("mindquest-name");
accountGreeting.textContent = accountName ? `Hi, ${accountName}` : "Welcome";

signOutButton.addEventListener("click", () => {
  sessionStorage.removeItem("mindquest-session");
  sessionStorage.removeItem("mindquest-name");
  location.replace("signup.html?mode=login");
});
