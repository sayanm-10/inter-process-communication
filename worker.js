const redisPubSub = require('./redis_connection');
const axios = require('axios');

const dataUrl = "https://gist.githubusercontent.com/philbarresi/5cf15393d245b38a2d86ce8207d5076c/raw/d529fb474c1af347702ca4d7b992256237fa2819/lab5.json";
let userData;

const init = async () => {
    const userJson = await axios.get(dataUrl);
    userData = userJson.data;
    console.log(userData);
};

init();
