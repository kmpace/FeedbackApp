module.exports = (req, res, next) => { //next is a function to be called when middleware is complete
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });

  }

  next();

};
