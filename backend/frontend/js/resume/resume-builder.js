console.log("🚀 Zertix Resume Builder Loaded");

/* ================= ELEMENTS ================= */

const fullName = document.getElementById("fullName");

const email = document.getElementById("email");

const phone = document.getElementById("phone");

const locationField = document.getElementById("location");

const summary = document.getElementById("summary");

const skills = document.getElementById("skills");

/* ================= PREVIEW ================= */

const previewName =
  document.getElementById("previewName");

const previewSummary =
  document.getElementById("previewSummary");

const previewSkills =
  document.getElementById("previewSkills");

const previewContact =
  document.querySelector(".preview-contact");

/* ================= LIVE PREVIEW ================= */

function updatePreview() {

  // Name
  previewName.innerText =
    fullName.value || "Your Name";

  // Summary
  previewSummary.innerText =
    summary.value ||
    "Your professional summary will appear here.";

  // Skills
  previewSkills.innerText =
    skills.value ||
    "Skills will appear here.";

  // Contact
  previewContact.innerHTML = `
    <span>${email.value || "Email"}</span>
    <span>${phone.value || "Phone"}</span>
    <span>${locationField.value || "Location"}</span>
  `;
}

/* ================= INPUT LISTENERS ================= */

[
  fullName,
  email,
  phone,
  locationField,
  summary,
  skills
].forEach(input => {

  input.addEventListener(
    "input",
    updatePreview
  );
});

/* ================= TEMPLATE SWITCH ================= */

const templateCards =
  document.querySelectorAll(".template-card");

const resumePreview =
  document.querySelector(".resume-preview");

templateCards.forEach(card => {

  card.addEventListener("click", () => {

    // Remove active
    templateCards.forEach(c => {
      c.classList.remove("active-template");
    });

    // Add active
    card.classList.add("active-template");

    // Get template type
    const title =
      card.querySelector("h3")
      .innerText
      .toLowerCase();

    // Remove old templates
    resumePreview.classList.remove(
      "modern-theme",
      "dark-theme",
      "minimal-theme"
    );

    // Apply template
    if (title.includes("dark")) {

      resumePreview.classList.add(
        "dark-theme"
      );

    } else if (
      title.includes("minimal")
    ) {

      resumePreview.classList.add(
        "minimal-theme"
      );

    } else {

      resumePreview.classList.add(
        "modern-theme"
      );
    }

  });

});

/* ================= AUTO SAVE ================= */

function saveDraft() {

  const resumeData = {

    fullName:
      fullName.value,

    email:
      email.value,

    phone:
      phone.value,

    location:
      locationField.value,

    summary:
      summary.value,

    skills:
      skills.value
  };

  localStorage.setItem(
    "zertixResumeDraft",
    JSON.stringify(resumeData)
  );

  console.log("💾 Draft Saved");
}

/* ================= LOAD DRAFT ================= */

function loadDraft() {

  const draft =
    localStorage.getItem(
      "zertixResumeDraft"
    );

  if (!draft) return;

  const data = JSON.parse(draft);

  fullName.value =
    data.fullName || "";

  email.value =
    data.email || "";

  phone.value =
    data.phone || "";

  locationField.value =
    data.location || "";

  summary.value =
    data.summary || "";

  skills.value =
    data.skills || "";

  updatePreview();

  console.log("📂 Draft Loaded");
}

/* ================= AUTO SAVE TIMER ================= */

setInterval(() => {

  saveDraft();

}, 3000);

/* ================= DOWNLOAD ================= */

const downloadBtn =
  document.querySelector(".primary-btn");

downloadBtn.addEventListener(
  "click",
  () => {

    alert(
      "🚀 PDF Download Coming Next"
    );

  }
);

/* ================= AI IMPROVE ================= */

const aiBtn =
  document.querySelector(".glass-btn.large-btn");

aiBtn.addEventListener(
  "click",
  () => {

    aiBtn.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin"></i>
      Analyzing Resume...
    `;

    setTimeout(() => {

      alert(
        "🤖 AI Suggestion:\\n\\nAdd more measurable achievements and modern keywords."
      );

      aiBtn.innerHTML = `
        <i class="fa-solid fa-brain"></i>
        AI Improve Resume
      `;

    }, 2200);

  }
);

/* ================= ANIMATED SCORE ================= */

function animateScore() {

  const scores =
    document.querySelectorAll(
      ".score-value"
    );

  scores.forEach(score => {

    let start = 0;

    const target = 82;

    const interval =
      setInterval(() => {

        start++;

        score.innerText =
          start + "%";

        if (start >= target) {

          clearInterval(interval);
        }

      }, 18);

  });

}



/* ================= INIT ================= */

loadDraft();

updatePreview();

animateScore();

console.log(
  "✅ Resume Builder Ready"
);