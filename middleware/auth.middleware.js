export function requireAuth(req, res, next) {
    if (!req.session.sso) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
}