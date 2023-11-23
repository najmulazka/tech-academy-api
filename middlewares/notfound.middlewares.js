const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      status: 404,
      message: "Resource not found",
    },
  });
};

module.exports = notFoundHandler;
