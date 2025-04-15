import jwt from 'jsonwebtoken';

const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      console.log("⛔ No token found in cookies");
      return res.status(400).json({
        message: "User doesn't have token"
      });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ Full decoded token:", verifyToken);

    if (!verifyToken || !verifyToken.userId) {
      console.log("⛔ Token is invalid or missing 'userId'");
      return res.status(400).json({
        message: "User doesn't have a valid token"
      });
    }

    req.userId = verifyToken.userId;
    console.log("✅ Decoded token (login user )userId:", verifyToken.userId);

    next();  //  // go to the next function: sendConnection

  } catch (error) {
    console.error("🔥 isAuth error:", error.message);
    return res.status(500).json({
      message: "isAuth error",
      error: error.message
    });
  }
};

export default isAuth;
