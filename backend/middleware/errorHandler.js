const errorHandler = (err, req, res, next) => {
  console.error('❌ Server Error:', err);

  const statusCode = err.statusCode || res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
