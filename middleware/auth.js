const jwt = require('jsonwebtoken'); // Ensure you have required the jwt library

const isAuthenticated = (req, res, next) => {
  // If it's a GET request, we allow it to pass without authentication
  if (req.method === 'GET') {
    return next(); // Allow GET requests to continue without authentication
  }

  // Get the token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token and decode the user info from it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    return next();
  } catch (error) {
    // If token is invalid or expired, respond with an error
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { isAuthenticated };
