const prisma = require("../utils/libs/prisma.libs");

const createRating = async (req, res, next) => {
  try {
    const { classCode, value } = req.body;

    let existingRating = await prisma.rating.findUnique({
      where: { classCode: { classCode } },
    });

    if (existingRating) {
      return res.status(400).json({
        status: false,
        message: "class not found",
        data: null,
      });
    }

    if (value < 1 || value > 5) {
      return res.status(400).json({
        status: false,
        message: "invalid rating. rating must be between 1 and 5.",
        data: null,
      });
    }

    let newRating = await prisma.rating.create({
      data: { userId: req.user.id, value, classCode },
    });

    let classRatings = await prisma.rating.findMany({
      where: { classCode },
    });

    if (classRatings.length === 0) {
      return 0; // tidak ada peringkat, kembalikan nilai default
    }

    let totalRating = classRatings.reduce(
      (sum, rating) => sum + rating.value,
      0
    );
    let averageRating = totalRating / classRatings.length;

    await prisma.class.update({
      where: { classCode },
      data: { averageRating },
    });

    res.status(200).json({
      status: true,
      message: "rating created successfully.",
      data: newRating,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRating,
};
