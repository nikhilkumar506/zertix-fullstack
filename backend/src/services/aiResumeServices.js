exports.analyzeResumeAI = async (resumeData) => {

  const suggestions = [];

  // Summary check
  if (!resumeData.summary || resumeData.summary.length < 50) {
    suggestions.push(
      "Add a stronger professional summary"
    );
  }

  // Skills check
  if (!resumeData.skills || resumeData.skills.length < 5) {
    suggestions.push(
      "Add more technical skills"
    );
  }

  // Project check
  if (!resumeData.projects || resumeData.projects.length < 1) {
    suggestions.push(
      "Add at least one strong project"
    );
  }

  return {
    aiScore: 82,
    suggestions
  };
};