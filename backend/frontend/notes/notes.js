const container = document.getElementById("notesContainer");

for (let className in notesData) {

  const classDiv = document.createElement("div");
  classDiv.className = "class-box";

  classDiv.innerHTML = `<h2>${className}</h2>`;

  const subjectDiv = document.createElement("div");
  subjectDiv.className = "subjects";

  notesData[className].forEach(subject => {

    const slug = subject.toLowerCase().replace(/ /g, "-");

    const link = document.createElement("a");
    link.href = `/notes-pages/${className.replace(" ", "").toLowerCase()}-${slug}.html`;
    link.innerText = subject;

    subjectDiv.appendChild(link);
  });

  classDiv.appendChild(subjectDiv);
  container.appendChild(classDiv);
}