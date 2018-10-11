module.exports = function(req, res, next) {
    if(!req.user.isAdmin) return res.status(403).send('Access Denied.');

    next(); // Pass to the next route handler
}