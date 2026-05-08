exports.scoreResume = (resumeData) => {

  let score = 0;

  if (resumeData.skills?.length > 3) {
    score += 30;
  }

  if (resumeData.projects?.length > 1) {
    score += 30;
  }

  if (resumeData.summary?.length > 50) {
    score += 40;
  }

  return score;
};