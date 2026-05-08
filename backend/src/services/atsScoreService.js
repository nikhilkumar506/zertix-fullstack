exports.calculateATSScore = (resumeData) => {

  let score = 50;

  // Skills
  if (resumeData.skills?.length >= 5) {
    score += 15;
  }

  // Summary
  if (resumeData.summary?.length > 100) {
    score += 10;
  }

  // Projects
  if (resumeData.projects?.length >= 2) {
    score += 15;
  }

  // Experience
  if (resumeData.experience?.length >= 1) {
    score += 10;
  }

  // Cap at 100
  if (score > 100) {
    score = 100;
  }

  return score;
};