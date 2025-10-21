import jwt from "jsonwebtoken";


export const authenticateAdmin = (req, res, next) => {

  const token = req.cookies.token; // read from cookie

  console.log("Token from cookie:", token);
  
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'admin') {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.userId = payload.id;
    req.userRole = payload.role;
    next();
  } catch (_error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
