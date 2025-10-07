module.exports = (req, res, next) => {
  res.status(404);
  try { return res.render('error', { message: 'Not Found', status: 404 }); }
  catch (e) { return res.json({ error: 'Not Found', status: 404 }); }
};
