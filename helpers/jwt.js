const { expressjwt: expressJwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.jwtSecret;

  const isRevoked = async (req, token) => {
    if (!token.isAdmin) {
      console.log("not admin");
      return true;
    }
    console.log("admin");
    return false;
  };

  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,

  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/\/product(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/\/category(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/\/orders(.*)/, methods: ["GET", "OPTIONS", "POST"] },
      "/user/login",
      "/user",
      // { url: /(.*)/ },
    ],
  });
}

/*const isRevoked = async (req, token) => {
  if (!token.payload.isAdmin) {
    console.log("not admin");
    return true;
  }
  console.log("admin");
  return false;
};*/

module.exports = authJwt;
