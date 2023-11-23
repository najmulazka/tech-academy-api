const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      status: false,
      message: "Resource not found",
    },
  });
};

module.exports = notFoundHandler;
