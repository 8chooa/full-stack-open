const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if(error.name === 'ValidationError') {
    response.status(400).send({error: error.message});
  }
}

module.exports = { errorHandler };