const validateLessonInput = (req, res, next) => {
    const { title, learningMaterial, linkLearningMaterial, chapterId, classCode } = req.body;
  
    if (!title || !learningMaterial || !linkLearningMaterial || !chapterId || !classCode) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
        data: null,
      });
    }
  
    next();
  };
  
  module.exports = {
    validateLessonInput,
  };
  