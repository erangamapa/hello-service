let jwt = require('jsonwebtoken');
const TEST_SECRET = 'MYTESTSECRET';

module.exports = {
  checkToken: (req, res, next) => {
    try{
      //Extract token
      let token = req.headers['authorization']; // Express headers are auto converted to lowercase
      if (token && token.startsWith('Bearer ')) {
        //Remove Bearer from string
        token = token.slice(7, token.length);
        //Verify token with secret
        jwt.verify(token, process.env.SECRET || TEST_SECRET, (err, decoded) => {
          if (err) {
            return res.status(403).json({
              success: false,
              message: 'Token is not valid'
            });
          } else {
            req.decoded = decoded;
            next();
          }
        });
      } else {
        return res.status(403).json({
          success: false,
          message: 'Auth token is not supplied'
        });
    }
    } catch (e) {
      //catch any errors occur from the server return generic error responce
      return res.status(500).json({
        success: false,
        message: 'Error occoured from server'
      });
    }
  }
}
