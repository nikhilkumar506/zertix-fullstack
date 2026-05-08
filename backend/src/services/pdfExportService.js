const fs = require("fs");
const path = require("path");

exports.generatePDF = async (resumeData) => {

  // Temporary placeholder
  // Later use puppeteer / pdfkit

  const fileName = `resume-${Date.now()}.pdf`;

  const filePath = path.join(
    __dirname,
    "../uploads/resumes",
    fileName
  );

  fs.writeFileSync(
    filePath,
    "PDF generation coming soon"
  );

  return filePath;
};