console.log("📤 Upload Resume Loaded");

/* ================= ELEMENTS ================= */

const uploadInput =
document.getElementById(
  "resumeUpload"
);

const uploadCard =
document.querySelector(
  ".upload-card"
);

const uploadBtn =
document.querySelector(
  ".upload-btn"
);

/* ================= STATE ================= */

let uploadedFile = null;

/* ================= FILE TYPES ================= */

const allowedTypes = [

  "application/pdf",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  "application/msword"
];

/* ================= FILE UPLOAD ================= */

uploadInput.addEventListener(
  "change",
  e => {

    const file =
    e.target.files[0];

    if(!file) return;

    validateFile(file);

  }
);

/* ================= VALIDATION ================= */

function validateFile(file){

  // File type

  if(
    !allowedTypes.includes(
      file.type
    )
  ){

    showToast(
      "❌ Only PDF or DOCX allowed"
    );

    return;
  }

  // File size

  const sizeMB =
  file.size / (1024 * 1024);

  if(sizeMB > 5){

    showToast(
      "❌ Max file size is 5MB"
    );

    return;
  }

  uploadedFile = file;

  showUploaded(file);

  simulateParsing();

}

/* ================= SHOW FILE ================= */

function showUploaded(file){

  uploadCard.innerHTML = `

    <div class="uploaded-preview">

      <div class="uploaded-icon">

        <i class="fa-solid fa-file-lines"></i>

      </div>

      <h2>
        ${file.name}
      </h2>

      <p>
        ${(file.size / 1024).toFixed(1)}
        KB Uploaded Successfully
      </p>

      <div class="upload-actions">

        <button
          class="replace-btn"
        >
          Replace File
        </button>

        <button
          class="remove-btn"
        >
          Remove
        </button>

      </div>

    </div>

  `;

  attachButtons();

}

/* ================= BUTTONS ================= */

function attachButtons(){

  const replaceBtn =
  document.querySelector(
    ".replace-btn"
  );

  const removeBtn =
  document.querySelector(
    ".remove-btn"
  );

  replaceBtn.addEventListener(
    "click",
    () => {

      uploadInput.click();

    }
  );

  removeBtn.addEventListener(
    "click",
    () => {

      resetUpload();

    }
  );

}

/* ================= RESET ================= */

function resetUpload(){

  uploadedFile = null;

  uploadInput.value = "";

  uploadCard.innerHTML = `

    <div class="upload-icon">

      <i class="fa-solid fa-file-arrow-up"></i>

    </div>

    <h2>
      Upload Resume
    </h2>

    <p>
      Upload your resume in PDF or DOCX format.
    </p>

    <button
      class="upload-btn"
    >
      Upload Resume
    </button>

  `;

  document.querySelector(
    ".upload-btn"
  )

  .addEventListener(
    "click",
    () => {

      uploadInput.click();

    }
  );

}

/* ================= DRAG DROP ================= */

uploadCard.addEventListener(
  "dragover",
  e => {

    e.preventDefault();

    uploadCard.classList.add(
      "drag-active"
    );

  }
);

uploadCard.addEventListener(
  "dragleave",
  () => {

    uploadCard.classList.remove(
      "drag-active"
    );

  }
);

uploadCard.addEventListener(
  "drop",
  e => {

    e.preventDefault();

    uploadCard.classList.remove(
      "drag-active"
    );

    const file =
    e.dataTransfer.files[0];

    if(file){

      validateFile(file);
    }

  }
);

/* ================= AI PARSE ================= */

function simulateParsing(){

  const parsing =
  document.createElement("div");

  parsing.className =
  "parsing-toast";

  parsing.innerHTML = `

    <i class="fa-solid fa-spinner fa-spin"></i>

    AI Parsing Resume...

  `;

  document.body.appendChild(
    parsing
  );

  Object.assign(
    parsing.style,
    {

      position:"fixed",

      bottom:"30px",

      right:"30px",

      background:"#111827",

      color:"#fff",

      padding:"16px 20px",

      borderRadius:"14px",

      zIndex:"9999",

      fontWeight:"600",

      display:"flex",

      alignItems:"center",

      gap:"12px",

      boxShadow:
      "0 10px 30px rgba(0,0,0,0.15)"
    }
  );

  setTimeout(() => {

    parsing.innerHTML = `

      <i class="fa-solid fa-circle-check"></i>

      Resume Parsed Successfully

    `;

  },1800);

  setTimeout(() => {

    parsing.remove();

  },3500);

}

/* ================= TOAST ================= */

function showToast(message){

  const old =
  document.querySelector(
    ".upload-toast"
  );

  if(old){

    old.remove();
  }

  const toast =
  document.createElement("div");

  toast.className =
  "upload-toast";

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

console.log(
  "✅ Resume Upload Ready"
);