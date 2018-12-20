const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

//middleware to check the token
const middleware = require('./middleware');

let app = express();
const port = process.env.PORT || 6020;

//Middleware to parse the content
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Routes & Handlers
app.get('/hello', middleware.checkToken, (req, res) => {
  res.json({
    success: true,
    message: `Hello ${req.decoded.username}`,
  });
});
if(process.env.ENV != 'TEST'){
  //init swagger
  const swaggerDocument = yaml.load('./swagger.yaml');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  //start server
  app.listen(port, () => console.log(`Server is listening on port: ${port}\n
  Visit /api-docs on how to use the API`));
}

//Export app mainly for testing
module.exports = app;
