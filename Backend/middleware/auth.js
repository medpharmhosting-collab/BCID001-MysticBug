import admin from "firebase-admin";

/**
 * Verify Firebase ID token sent as "Authorization: Bearer <idToken>"
 * Sets req.firebase = decodedToken
 */
export const verifyFirebaseToken = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }
  const idToken = header.split(" ")[1];
  if (!idToken) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.firebase = decoded; // contains uid, email, etc.
    next();
  } catch (err) {
    console.error("Token verify error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
