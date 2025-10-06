require('dotenv').config();
const axios = require("axios");
const WA_HOST = process.env.WA_HOST;
const WA_TOKEN = process.env.WA_TOKEN;

async function sendWa(data) {
    try {
        let response = await axios.post(WA_HOST, data, {
            headers: {
                Authorization: "Bearer " + WA_TOKEN,
                "Content-Type": "application/json",
                timeout: 2000 // only wait for 2s
            }
        });
        console.log(JSON.stringify(response.data));
        return response.data;
    }
    catch (error) {
        if (error.code === 'ECONNABORTED') {
            console.log('Request timed out');
        } else {
            console.log(error.message);
        }
    }
}
function trimText(text) {
    let trimmed = text.trim()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .toLowerCase();
    return trimmed;
}
function slugText(text) {
    let trimmed = text.trim()
        .replace(/[^a-zA-Z]/g, '')  // hanya biarkan huruf
        .toLowerCase();
    return trimmed;
}
// sendWa({
//     "message": "Sayyangg",
//     "telp": "0895321701798"
// });

module.exports = {
    sendWa,
    trimText,
    slugText
}