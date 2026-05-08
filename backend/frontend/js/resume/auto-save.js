console.log("💾 Auto Save Loaded");

/* ================= STORAGE KEY ================= */

const STORAGE_KEY =
"zertix_resume_draft";

/* ================= FORM ELEMENTS ================= */

const fields = [

  "fullName",

  "email",

  "phone",

  "location",

  "summary",

  "skills"

];

/* ================= SAVE ================= */

function saveDraft(){

  const data = {};

  fields.forEach(id => {

    const element =
    document.getElementById(id);

    if(element){

      data[id] =
      element.value;
    }

  });

  // Save timestamp

  data.updatedAt =
  new Date().toISOString();

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(data)

  );

  showAutoSaveStatus(
    "Saved"
  );

  console.log(
    "💾 Draft Saved"
  );

}

/* ================= LOAD ================= */

function loadDraft(){

  const draft =
  localStorage.getItem(
    STORAGE_KEY
  );

  if(!draft) return;

  try{

    const data =
    JSON.parse(draft);

    fields.forEach(id => {

      const element =
      document.getElementById(id);

      if(
        element &&
        data[id]
      ){

        element.value =
        data[id];
      }

    });

    // Trigger preview update

    document.dispatchEvent(
      new Event("resumeUpdated")
    );

    console.log(
      "📂 Draft Restored"
    );

    showRestoreMessage(
      data.updatedAt
    );

  }

  catch(err){

    console.error(
      "❌ Restore failed",
      err
    );

  }

}

/* ================= AUTO SAVE ================= */

let saveTimeout;

fields.forEach(id => {

  const input =
  document.getElementById(id);

  if(!input) return;

  input.addEventListener(
    "input",
    () => {

      clearTimeout(
        saveTimeout
      );

      showAutoSaveStatus(
        "Saving..."
      );

      saveTimeout =
      setTimeout(() => {

        saveDraft();

      },1000);

    }
  );

});

/* ================= STATUS ================= */

function showAutoSaveStatus(text){

  let status =
  document.querySelector(
    ".autosave-status"
  );

  if(!status){

    status =
    document.createElement("div");

    status.className =
    "autosave-status";

    document.body.appendChild(
      status
    );

    Object.assign(
      status.style,
      {

        position:"fixed",

        bottom:"24px",

        left:"24px",

        background:"#111827",

        color:"#fff",

        padding:"12px 18px",

        borderRadius:"12px",

        fontSize:"14px",

        fontWeight:"600",

        zIndex:"9999",

        boxShadow:
        "0 10px 30px rgba(0,0,0,0.15)"
      }
    );

  }

  status.innerText =
  text;

  clearTimeout(
    status.hideTimer
  );

  status.hideTimer =
  setTimeout(() => {

    status.style.opacity =
    "0";

    setTimeout(() => {

      status.remove();

    },300);

  },2000);

}

/* ================= RESTORE ================= */

function showRestoreMessage(date){

  if(!date) return;

  const time =
  new Date(date)
  .toLocaleTimeString();

  const restore =
  document.createElement("div");

  restore.className =
  "restore-toast";

  restore.innerHTML = `

    <strong>
      Draft Restored
    </strong>

    <br>

    Last saved at ${time}

  `;

  document.body.appendChild(
    restore
  );

  Object.assign(
    restore.style,
    {

      position:"fixed",

      top:"24px",

      right:"24px",

      background:"#ffffff",

      color:"#111827",

      padding:"18px 22px",

      borderRadius:"16px",

      border:"1px solid #e5e7eb",

      boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",

      zIndex:"9999",

      fontSize:"14px",

      lineHeight:"1.6"
    }
  );

  setTimeout(() => {

    restore.remove();

  },3500);

}

/* ================= BEFORE CLOSE ================= */

window.addEventListener(
  "beforeunload",
  e => {

    saveDraft();

  }
);

/* ================= CLEAR ================= */

function clearDraft(){

  localStorage.removeItem(
    STORAGE_KEY
  );

  console.log(
    "🗑 Draft Cleared"
  );

}

/* ================= OPTIONAL BUTTON ================= */

const clearBtn =
document.querySelector(
  ".clear-draft-btn"
);

if(clearBtn){

  clearBtn.addEventListener(
    "click",
    () => {

      clearDraft();

      location.reload();

    }
  );

}

/* ================= INIT ================= */

loadDraft();

console.log(
  "✅ Auto Save Ready"
);