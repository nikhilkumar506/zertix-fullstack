console.log("📄 PDF Download Loaded");

/* ================= ELEMENTS ================= */

const downloadBtn =
document.querySelector(
  ".primary-btn"
);

const resume =
document.querySelector(
  ".resume-preview"
);

/* ================= DOWNLOAD ================= */

downloadBtn.addEventListener(
  "click",
  async () => {

    try{

      startLoading();

      // Render canvas

      const canvas =
      await html2canvas(
        resume,
        {

          scale:2,

          useCORS:true,

          backgroundColor:"#ffffff"
        }
      );

      // Convert image

      const imgData =
      canvas.toDataURL(
        "image/png"
      );

      // PDF

      const {
        jsPDF
      } = window.jspdf;

      const pdf =
      new jsPDF(
        "p",
        "mm",
        "a4"
      );

      // Dimensions

      const pdfWidth =
      pdf.internal.pageSize.getWidth();

      const pdfHeight =
      (canvas.height * pdfWidth)
      / canvas.width;

      // Add image

      pdf.addImage(

        imgData,

        "PNG",

        0,

        0,

        pdfWidth,

        pdfHeight
      );

      // Filename

      const name =
      document.getElementById(
        "fullName"
      )?.value ||
      "Resume";

      // Save

      pdf.save(
        `${name}-Zertix-Resume.pdf`
      );

      stopLoading();

      showToast(
        "✅ Resume Downloaded"
      );

    }

    catch(err){

      console.error(err);

      stopLoading();

      showToast(
        "❌ PDF generation failed"
      );
    }

  }
);

/* ================= LOADING ================= */

function startLoading(){

  downloadBtn.innerHTML = `

    <i class="fa-solid fa-spinner fa-spin"></i>

    Generating PDF...

  `;

  downloadBtn.disabled = true;
}

function stopLoading(){

  downloadBtn.innerHTML = `

    <i class="fa-solid fa-download"></i>

    Download PDF

  `;

  downloadBtn.disabled = false;
}

/* ================= TOAST ================= */

function showToast(message){

  // Remove old

  const old =
  document.querySelector(
    ".zertix-toast"
  );

  if(old){

    old.remove();
  }

  // Create

  const toast =
  document.createElement("div");

  toast.className =
  "zertix-toast";

  toast.innerText =
  message;

  document.body.appendChild(
    toast
  );

  // Style

  Object.assign(
    toast.style,
    {

      position:"fixed",

      bottom:"30px",

      right:"30px",

      background:"#111827",

      color:"#fff",

      padding:"16px 24px",

      borderRadius:"14px",

      zIndex:"9999",

      fontWeight:"600",

      boxShadow:
      "0 10px 30px rgba(0,0,0,0.15)",

      animation:
      "toastIn 0.3s ease"
    }
  );

  // Remove

  setTimeout(() => {

    toast.remove();

  },2500);

}

/* ================= PRINT SUPPORT ================= */

function printResume(){

  const content =
  resume.innerHTML;

  const frame =
  window.open(
    "",
    "",
    "width=900,height=650"
  );

  frame.document.write(`

    <html>

    <head>

      <title>
        Resume
      </title>

      <style>

        body{

          font-family:
          Arial,sans-serif;

          padding:40px;
        }

      </style>

    </head>

    <body>

      ${content}

    </body>

    </html>

  `);

  frame.document.close();

  frame.focus();

  frame.print();

}

/* ================= OPTIONAL HOTKEY ================= */

document.addEventListener(
  "keydown",
  e => {

    if(
      (e.ctrlKey || e.metaKey)
      &&
      e.key === "p"
    ){

      e.preventDefault();

      printResume();
    }

  }
);

console.log(
  "✅ PDF Export Ready"
);