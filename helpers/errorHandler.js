export const errorHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(500).json({
      status: 'fail',
      message: 'User is unauthorized.',
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(500).json({
      status: 'fail',
      message: 'Validation error.',
    });
  }

  res.status(500).json({
    status: 'fail',
    message: err,
  });
  next();
};
