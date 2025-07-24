const createHTTPError = require("http-errors");


const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.LoggedIn_UserInfo;

      if (!user || !user.role) {
        throw createHTTPError.Unauthorized("You must be logged in to access this route.");
      }

      if (!allowedRoles.includes(user.role)) {
        throw createHTTPError.Forbidden(`Access denied for role: ${user.role}`);
      }

      next(); 
    } catch (err) {
      next(err);
    }
  };
};




module.exports = {
    checkRole
}