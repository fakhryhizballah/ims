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
// sendWa({
//     "message": "Sayyangg",
//     "telp": "0895321701798"
// });

module.exports = {
    sendWa
}