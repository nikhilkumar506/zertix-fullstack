exports.formatResume = (resume) => {

  return {
    ...resume,
    formattedAt: new Date()
  };
};