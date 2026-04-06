const params = new URLSearchParams(window.location.search);
const subject = params.get("subject");

document.getElementById("title").innerText =
  subject.toUpperCase() + " MCQs";

fetch("/pages/mcqs/all.json")
  .then(res => res.json())
  .then(data => {

    const filtered = data.filter(q => q.subject === subject);

    if(filtered.length === 0){
      document.getElementById("quiz").innerHTML =
        "<h3>No MCQs found ❌</h3>";
      return;
    }

    const questions = filtered
      .sort(() => 0.5 - Math.random())
      .slice(0, 10000);

    loadQuiz(questions);
  });

function loadQuiz(questions){

  const quiz = document.getElementById("quiz");
  quiz.innerHTML = "";

  questions.forEach((q,i)=>{

    let optionsHTML = "";

    q.options.forEach((opt,index)=>{
      optionsHTML += `
      <label class="option" onclick="checkAnswer(${i}, ${index})">
        <input type="radio" name="q${i}">
        ${opt}
      </label>`;
    });

    quiz.innerHTML += `
    <div class="question" id="q${i}">
      <p>${i+1}. ${q.q}</p>
      ${optionsHTML}
      <div class="answer" id="ans${i}"></div>
    </div>`;
  });

  window.currentQuestions = questions;
}

function checkAnswer(qIndex, selected){

  const q = currentQuestions[qIndex];
  const correct = Number(q.answer);

  const options = document.querySelectorAll(`#q${qIndex} .option`);

  options.forEach((opt,i)=>{

    opt.onclick = null;
    opt.classList.remove("selected","correct","wrong");

    if(i === selected) opt.classList.add("selected");
    if(i === correct) opt.classList.add("correct");
    if(i === selected && i !== correct) opt.classList.add("wrong");

  });

  document.getElementById(`ans${qIndex}`).innerHTML =
    `<div class="explanation">✔ ${q.explanation}</div>`;
}

function submitQuiz(){
  alert("Submitted!");
}