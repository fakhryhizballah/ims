const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const SECRET_KEY = process.env.JWT_SECRET_KEY || "supersecret";


const csrfToken = (req, res, next) => {
    req.csrfToken = generateOneTimeToken();
    req.cache.set('csrfToken:' + req.csrfToken, "valid", {
        EX: 120
    });
    next();
};

const verifyCsrfToken = (req, res, next) => {
    const token = req.body._csrf;
    const isValid = verifyOneTimeToken(token);
    if (!isValid) {
        return res.redirect('/login');
    }
    req.cache.del('csrfToken:' + token);
    next();
};


// Membuat one time token
function generateOneTimeToken() {
    const jti = uuidv4(); // unique id token
    const token = jwt.sign({ jti }, SECRET_KEY, { expiresIn: "2m" });
    return token;
}
generateOneTimeToken()

function verifyOneTimeToken(token) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return true
    } catch (err) {
        return false;
    }
}

module.exports = {
    csrfToken,
    verifyCsrfToken

};