// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status);
  try { return res.render('error', { message, status }); }
  catch (e) { return res.json({ error: message, status }); }
};
