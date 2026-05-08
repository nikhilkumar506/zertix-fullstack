console.log("🎨 Dynamic Templates Loaded");

/* ================= ELEMENTS ================= */

const templateCards =
document.querySelectorAll(
  ".template-card"
);

const resumePreview =
document.querySelector(
  ".resume-preview"
);

/* ================= TEMPLATE HTML ================= */

const templates = {

  modern: `
    <div class="modern-template">
      <h1>John Anderson</h1>
      <p>Full Stack Developer</p>

      <div class="template-section">
        <h3>Skills</h3>
        <div class="skill-row">
          <span>React</span>
          <span>Node.js</span>
          <span>MongoDB</span>
        </div>
      </div>
    </div>
  `,

  minimal: `
    <div class="minimal-template">
      <h1>Emma Watson</h1>
      <p>UI/UX Designer</p>

      <div class="template-section">
        <h3>About</h3>
        <p>
          Creative designer focused on
          modern user experiences.
        </p>
      </div>
    </div>
  `,

  dark: `
    <div class="dark-template">
      <h1>Alex Carter</h1>
      <p>Software Engineer</p>

      <div class="template-section">
        <h3>Tech Stack</h3>
        <div class="skill-row">
          <span>React</span>
          <span>AWS</span>
          <span>Docker</span>
        </div>
      </div>
    </div>
  `,

  corporate: `
    <div class="corporate-template">
      <h1>Michael Brown</h1>
      <p>Business Analyst</p>

      <div class="template-section">
        <h3>Summary</h3>
        <p>
          Strategic enterprise consultant.
        </p>
      </div>
    </div>
  `,

  developer: `
    <div class="developer-template">
      <h1>David Miller</h1>
      <p>MERN Developer</p>

      <div class="template-section">
        <h3>Projects</h3>
        <p>
          Built scalable SaaS platforms.
        </p>
      </div>
    </div>
  `
};

/* ================= SWITCH ================= */

templateCards.forEach(card => {

  card.addEventListener(
    "click",
    () => {

      // Remove active

      templateCards.forEach(c => {

        c.classList.remove(
          "active-template"
        );

      });

      // Add active

      card.classList.add(
        "active-template"
      );

      // Template

      const template =
      card.dataset.template;

      // Save

      localStorage.setItem(
        "zertixTemplate",
        template
      );

      // Render

      renderTemplate(template);

    }
  );

});

/* ================= RENDER ================= */

function renderTemplate(name){

  const html =
  templates[name];

  if(!html) return;

  // Animation

  resumePreview.style.opacity = 0;

  setTimeout(() => {

    resumePreview.innerHTML =
    html;

    resumePreview.style.opacity = 1;

  },150);

}

/* ================= LOAD SAVED ================= */

function loadSaved(){

  const saved =
  localStorage.getItem(
    "zertixTemplate"
  ) || "modern";

  renderTemplate(saved);

  templateCards.forEach(card => {

    if(
      card.dataset.template === saved
    ){

      card.classList.add(
        "active-template"
      );

    }

  });

}

/* ================= INIT ================= */

loadSaved();

console.log(
  "✅ Templates Working"
);