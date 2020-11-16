const errorHandler = (err, req, res, next) => {
  console.error(err)
  console.log(req);
  res.status(504).send('Something broken!')
}

module.exports = {
  errorHandler
}