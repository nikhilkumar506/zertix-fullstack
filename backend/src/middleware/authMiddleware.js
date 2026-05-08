exports.protect = async (req, res, next) => {

  try {

    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    next();

  } catch (err) {
    console.error(err);

    res.status(401).json({
      success: false,
      message: "Auth failed"
    });
  }
};