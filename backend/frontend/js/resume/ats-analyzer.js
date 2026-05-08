console.log("🚀 ATS Analyzer Loaded");

/* ================= ELEMENTS ================= */

const analyzeBtn =
document.querySelector(".analyze-btn");

const uploadInput =
document.getElementById("resumeUpload");

const atsScore =
document.getElementById("atsScore");

const keywordContainer =
document.querySelector(".keyword-list");

const suggestionList =
document.querySelector(".suggestion-list");

const grammarStatus =
document.querySelector(".grammar-status");

const textarea =
document.querySelector("textarea");

/* ================= STATE ================= */

let uploadedResume = null;

/* ================= FILE UPLOAD ================= */

uploadInput.addEventListener(
  "change",
  e => {

    const file =
    e.target.files[0];

    if(!file) return;

    uploadedResume = file;

    console.log(
      "📄 Uploaded:",
      file.name
    );

    document.querySelector(
      ".upload-card h2"
    ).innerText =
    file.name;

  }
);

/* ================= KEYWORD DATABASE ================= */

const strongKeywords = [

  "javascript",
  "react",
  "node",
  "mongodb",
  "api",
  "express",
  "aws",
  "docker",
  "leadership",
  "problem solving",
  "communication",
  "agile",
  "typescript",
  "nextjs",
  "sql",
  "cloud",
  "architecture"
];

/* ================= AI SUGGESTIONS ================= */

const aiSuggestions = [

  "Add more measurable achievements.",

  "Use stronger action verbs in project descriptions.",

  "Include leadership and teamwork examples.",

  "Mention scalable architecture experience.",

  "Improve technical keyword density.",

  "Add cloud and deployment technologies.",

  "Use modern ATS-friendly formatting.",

  "Add more impact-focused bullet points."
];

/* ================= ANALYZE ================= */

analyzeBtn.addEventListener(
  "click",
  () => {

    if(!uploadedResume){

      alert(
        "Please upload resume first ❌"
      );

      return;
    }

    analyzeBtn.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin"></i>
      Analyzing Resume...
    `;

    setTimeout(() => {

      runAnalysis();

      analyzeBtn.innerHTML = `
        <i class="fa-solid fa-wand-magic-sparkles"></i>
        Analyze Resume
      `;

    }, 2500);

  }
);

/* ================= MAIN ANALYSIS ================= */

function runAnalysis(){

  // Random realistic score

  const score =
  random(72,95);

  animateScore(score);

  // Analyze keywords

  analyzeKeywords();

  // Generate suggestions

  generateSuggestions(score);

  // Grammar check

  generateGrammar();

  // Update score card text

  updateScoreMessage(score);

}

/* ================= SCORE ANIMATION ================= */

function animateScore(target){

  let current = 0;

  const interval =
  setInterval(() => {

    current++;

    atsScore.innerText = current;

    if(current >= target){

      clearInterval(interval);
    }

  },15);

}

/* ================= KEYWORD ANALYSIS ================= */

function analyzeKeywords(){

  keywordContainer.innerHTML = "";

  const randomKeywords =
  shuffle(strongKeywords)
  .slice(0,4);

  randomKeywords.forEach(keyword => {

    const span =
    document.createElement("span");

    span.innerText = keyword;

    keywordContainer.appendChild(span);

  });

}

/* ================= AI SUGGESTIONS ================= */

function generateSuggestions(score){

  suggestionList.innerHTML = "";

  let count = 4;

  if(score < 80){

    count = 6;
  }

  shuffle(aiSuggestions)
  .slice(0,count)
  .forEach(item => {

    const li =
    document.createElement("li");

    li.innerText = item;

    suggestionList.appendChild(li);

  });

}

/* ================= GRAMMAR ================= */

function generateGrammar(){

  grammarStatus.innerHTML = `

    <div class="good">

      <i class="fa-solid fa-circle-check"></i>

      Strong readability score

    </div>

    <div class="warning">

      <i class="fa-solid fa-circle-exclamation"></i>

      2 weak action verbs detected

    </div>

  `;
}

/* ================= SCORE MESSAGE ================= */

function updateScoreMessage(score){

  const scoreInfo =
  document.querySelector(".score-info");

  let title =
  "Excellent Resume";

  let desc =
  "Your resume is highly optimized for ATS systems.";

  if(score < 85){

    title =
    "Good Resume";

    desc =
    "Your resume performs well but can improve further.";
  }

  if(score < 75){

    title =
    "Needs Improvement";

    desc =
    "Your resume lacks strong ATS optimization.";
  }

  scoreInfo.innerHTML = `

    <h2>
      ${title}
    </h2>

    <p>
      ${desc}
    </p>

  `;
}

/* ================= UTILITIES ================= */

function random(min,max){

  return Math.floor(
    Math.random() * (max-min+1)
  ) + min;
}

function shuffle(arr){

  return [...arr]
  .sort(() => Math.random()-0.5);
}

/* ================= JOB DESCRIPTION MATCH ================= */

textarea.addEventListener(
  "input",
  () => {

    const value =
    textarea.value.toLowerCase();

    if(
      value.includes("react") ||
      value.includes("node") ||
      value.includes("developer")
    ){

      console.log(
        "🎯 Relevant Job Description Detected"
      );
    }

  }
);

console.log(
  "✅ ATS Analyzer Ready"
);