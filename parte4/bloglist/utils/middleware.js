const jwt = require('jsonwebtoken');

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if(error.name === 'ValidationError') {
    response.status(400).send({error: error.message});
  }
}

const unknowEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknow endpoint' });
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  } else {
    request.token = null;
  }
  next();
};

const userExtractor = (request, response, next) => {
  if(!request.token) {
    request.user = null;
    return next();
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (decodedToken && decodedToken.id) {
    request.user = decodedToken;
  } else {
    request.user = null;
  }
  next();
}
module.exports = { errorHandler, unknowEndpoint, tokenExtractor, userExtractor };