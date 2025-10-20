// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Server error';

  if (req.accepts('html')) {
    return res.status(status).render('error', {
      title: status === 404 ? 'Not Found' : 'Error',
      message
    });
  }

  res.status(status).json({ message });
};
