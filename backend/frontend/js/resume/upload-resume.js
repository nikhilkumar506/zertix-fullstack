console.log("📤 Resume Upload Loaded");

/* ================= ELEMENTS ================= */

const uploadInput =
document.getElementById(
  "resumeUpload"
);

const scoreSection =
document.getElementById(
  "scoreSection"
);

const resumeBuilder =
document.getElementById(
  "resumeBuilder"
);

/* ================= UPLOAD ================= */

uploadInput.addEventListener(
  "change",
  async (e) => {

    const file =
    e.target.files[0];

    if(!file) return;

    const formData =
    new FormData();

    formData.append(
      "resume",
      file
    );

    try {

      const response =
      await fetch(
        "/api/resume/upload",
        {
          method:"POST",
          body:formData
        }
      );

      const data =
      await response.json();

      if(data.success){

        scoreSection.style.display =
        "grid";

        resumeBuilder.style.display =
        "block";

        /* ================= AUTO FILL ================= */

        document.getElementById(
          "fullName"
        ).value =
        data.parsedData.name;

        document.getElementById(
          "email"
        ).value =
        data.parsedData.email;

        document.getElementById(
          "phone"
        ).value =
        data.parsedData.phone;

        document.getElementById(
          "skills"
        ).value =
        data.parsedData.skills;

        document.getElementById(
          "projects"
        ).value =
        data.parsedData.projects;

        document.getElementById(
          "experience"
        ).value =
        data.parsedData.experience;

        alert(
          "Resume Parsed Successfully"
        );

      }

    }

    catch(err){

      console.log(err);

      alert(
        "Resume Upload Failed"
      );

    }

});