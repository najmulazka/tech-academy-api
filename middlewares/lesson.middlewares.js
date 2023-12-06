const validateLessonInput = (req, res, next) => {
    const { title, learningMaterial, linkLearningMaterial, chapterId} = req.body;
  
    if (!title || !learningMaterial || !linkLearningMaterial || !chapterId) {
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
  