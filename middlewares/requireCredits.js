module.exports = (req, res, next) => { //next is a function to be called when middleware is complete
  if (req.user.credits < 1) {
    return res.status(403).send({ error: 'Not enough credits!' });

  }

  next();

};
