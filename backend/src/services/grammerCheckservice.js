exports.checkGrammar = (text) => {

  const issues = [];

  if (!text) {
    issues.push("Text is empty");
  }

  if (text.length < 30) {
    issues.push(
      "Content is too short"
    );
  }

  return issues;
};