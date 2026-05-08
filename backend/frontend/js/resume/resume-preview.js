console.log("🖥 Resume Preview Loaded");

/* ================= INPUTS ================= */

const inputs = {

  fullName:
  document.getElementById(
    "fullName"
  ),

  email:
  document.getElementById(
    "email"
  ),

  phone:
  document.getElementById(
    "phone"
  ),

  location:
  document.getElementById(
    "location"
  ),

  summary:
  document.getElementById(
    "summary"
  ),

  skills:
  document.getElementById(
    "skills"
  )

};

/* ================= PREVIEW ================= */

const preview = {

  name:
  document.getElementById(
    "previewName"
  ),

  summary:
  document.getElementById(
    "previewSummary"
  ),

  skills:
  document.getElementById(
    "previewSkills"
  ),

  contact:
  document.querySelector(
    ".preview-contact"
  )

};

/* ================= UPDATE ================= */

function updatePreview(){

  updateName();

  updateSummary();

  updateSkills();

  updateContact();

  animatePreview();

}

/* ================= NAME ================= */

function updateName(){

  const value =
  inputs.fullName.value.trim();

  preview.name.innerText =

    value ||

    "Your Name";
}

/* ================= SUMMARY ================= */

function updateSummary(){

  const value =
  inputs.summary.value.trim();

  preview.summary.innerText =

    value ||

    "Professional summary will appear here.";
}

/* ================= SKILLS ================= */

function updateSkills(){

  const value =
  inputs.skills.value.trim();

  if(!value){

    preview.skills.innerHTML = `
      <span class="skill-pill">
        Skills will appear here
      </span>
    `;

    return;
  }

  const skills =
  value
  .split(",")

  .map(skill => skill.trim())

  .filter(Boolean);

  preview.skills.innerHTML = "";

  skills.forEach(skill => {

    const pill =
    document.createElement("span");

    pill.className =
    "skill-pill";

    pill.innerText =
    skill;

    preview.skills.appendChild(
      pill
    );

  });

}

/* ================= CONTACT ================= */

function updateContact(){

  preview.contact.innerHTML = `

    ${
      inputs.email.value
      ?
      `
      <span>
        <i class="fa-solid fa-envelope"></i>
        ${inputs.email.value}
      </span>
      `
      :
      ""
    }

    ${
      inputs.phone.value
      ?
      `
      <span>
        <i class="fa-solid fa-phone"></i>
        ${inputs.phone.value}
      </span>
      `
      :
      ""
    }

    ${
      inputs.location.value
      ?
      `
      <span>
        <i class="fa-solid fa-location-dot"></i>
        ${inputs.location.value}
      </span>
      `
      :
      ""
    }

  `;
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
          opacity:0.85,
          transform:"translateY(5px)"
        },

        {
          opacity:1,
          transform:"translateY(0px)"
        }

      ],

      {

        duration:250,

        easing:"ease"
      }

    );

  });

}

/* ================= AUTO HEIGHT ================= */

function autoResize(){

  document.querySelectorAll(
    "textarea"
  )

  .forEach(textarea => {

    textarea.style.height =
    "auto";

    textarea.style.height =
    textarea.scrollHeight + "px";

  });

}

/* ================= LISTENERS ================= */

Object.values(inputs)

.forEach(input => {

  if(!input) return;

  input.addEventListener(
    "input",
    () => {

      updatePreview();

      autoResize();

    }
  );

});

/* ================= CUSTOM EVENT ================= */

document.addEventListener(
  "resumeUpdated",
  () => {

    updatePreview();

  }
);

/* ================= INITIAL ================= */

updatePreview();

autoResize();

console.log(
  "✅ Live Preview Ready"
);