console.log("🤖 AI Fix Loaded");

/* ================= BUTTON ================= */

const aiImproveBtn =
document.querySelector(
  ".glass-btn.large-btn"
);

/* ================= ELEMENTS ================= */

const summaryField =
document.getElementById(
  "summary"
);

const skillsField =
document.getElementById(
  "skills"
);

const previewSummary =
document.getElementById(
  "previewSummary"
);

const previewSkills =
document.getElementById(
  "previewSkills"
);

/* ================= AI DATABASE ================= */

const powerfulWords = [

  "Engineered",

  "Optimized",

  "Architected",

  "Developed",

  "Implemented",

  "Led",

  "Delivered",

  "Improved",

  "Built",

  "Designed",

  "Automated",

  "Enhanced"
];

const strongSkills = [

  "REST APIs",

  "Cloud Computing",

  "Microservices",

  "Scalable Architecture",

  "Problem Solving",

  "Team Leadership",

  "Agile Development",

  "Performance Optimization",

  "MongoDB",

  "Docker",

  "CI/CD",

  "System Design"
];

const aiSummaries = [

  "Passionate full stack developer experienced in building scalable modern web applications with optimized backend architecture and responsive frontend systems.",

  "Results-driven software developer with expertise in performance optimization, API development and user-focused scalable applications.",

  "Creative developer focused on delivering high-quality digital products with strong problem-solving and modern engineering practices.",

  "Innovative engineer skilled in designing efficient systems, cloud-ready applications and scalable software solutions."
];

/* ================= CLICK ================= */

if(aiImproveBtn){

  aiImproveBtn.addEventListener(
    "click",
    async () => {

      startAI();

      await fakeThinking();

      improveSummary();

      improveSkills();

      animatePreview();

      stopAI();

      showToast(
        "✅ AI Resume Improved"
      );

    }
  );

}

/* ================= START ================= */

function startAI(){

  aiImproveBtn.disabled = true;

  aiImproveBtn.innerHTML = `

    <i class="fa-solid fa-spinner fa-spin"></i>

    AI Optimizing...

  `;
}

/* ================= STOP ================= */

function stopAI(){

  aiImproveBtn.disabled = false;

  aiImproveBtn.innerHTML = `

    <i class="fa-solid fa-brain"></i>

    AI Improve Resume

  `;
}

/* ================= SUMMARY ================= */

function improveSummary(){

  const randomSummary =
  randomItem(aiSummaries);

  summaryField.value =
  randomSummary;

  if(previewSummary){

    previewSummary.innerText =
    randomSummary;
  }

}

/* ================= SKILLS ================= */

function improveSkills(){

  const shuffled =
  shuffle(strongSkills)
  .slice(0,8);

  const result =
  shuffled.join(", ");

  skillsField.value =
  result;

  if(previewSkills){

    previewSkills.innerText =
    result;
  }

}

/* ================= ANIMATION ================= */

function animatePreview(){

  const sections =
  document.querySelectorAll(
    ".preview-section"
  );

  sections.forEach(section => {

    section.animate(

      [

        {
          opacity:0.4,
          transform:"translateY(20px)"
        },

        {
          opacity:1,
          transform:"translateY(0px)"
        }

      ],

      {

        duration:600,

        easing:"ease"
      }

    );

  });

}

/* ================= THINKING ================= */

function fakeThinking(){

  return new Promise(resolve => {

    setTimeout(() => {

      resolve();

    },2200);

  });

}

/* ================= TOAST ================= */

function showToast(message){

  const old =
  document.querySelector(
    ".ai-toast"
  );

  if(old){

    old.remove();
  }

  const toast =
  document.createElement("div");

  toast.className =
  "ai-toast";

  toast.innerText =
  message;

  document.body.appendChild(
    toast
  );

  Object.assign(
    toast.style,
    {

      position:"fixed",

      top:"24px",

      right:"24px",

      background:"#111827",

      color:"#fff",

      padding:"16px 22px",

      borderRadius:"14px",

      zIndex:"9999",

      fontWeight:"600",

      boxShadow:
      "0 10px 30px rgba(0,0,0,0.15)"
    }
  );

  setTimeout(() => {

    toast.remove();

  },2500);

}

/* ================= HELPERS ================= */

function randomItem(arr){

  return arr[
    Math.floor(
      Math.random() * arr.length
    )
  ];
}

function shuffle(arr){

  return [...arr]
  .sort(() => Math.random()-0.5);
}

/* ================= KEYWORD BOOST ================= */

function boostKeywords(text){

  const word =
  randomItem(powerfulWords);

  return `${word} ${text}`;
}

console.log(
  "✅ AI Resume Enhancement Ready"
);