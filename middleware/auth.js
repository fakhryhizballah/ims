const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const SECRET_KEY = process.env.JWT_SECRET_KEY || "supersecret";


const csrfToken = (req, res, next) => {
    res.csrfToken = generateOneTimeToken();
    next();
};


// Membuat one time token
async function generateOneTimeToken() {
    const jti = uuidv4(); // unique id token
    const token = jwt.sign({ payload }, SECRET_KEY, { expiresIn: "10m" });

    // simpan ke redis dengan ttl sesuai expire
    await redis.set(`token:${jti}`, "valid", "EX", 600);

    return token;
}
async function verifyOneTimeToken(token) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const status = await redis.get(`token:${decoded.jti}`);

        if (status === "valid") {
            // sekali pakai → hapus atau tandai used
            await redis.del(`token:${decoded.jti}`);
            return decoded;
        } else {
            throw new Error("Token sudah dipakai atau tidak valid");
        }
    } catch (err) {
        throw new Error("Token tidak valid / expired");
    }
}


module.exports = {
    csrfToken,

};