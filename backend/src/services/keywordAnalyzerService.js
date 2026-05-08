exports.keywordAnalyzer = (skills = []) => {

  const importantKeywords = [
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
    "Express"
  ];

  const missingKeywords = importantKeywords.filter(
    keyword => !skills.includes(keyword)
  );

  return {
    missingKeywords
  };
};