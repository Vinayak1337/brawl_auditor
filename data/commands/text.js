const Discord = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs');
let data, status;
module.exports.run = async (Bot, msg, args) => {
    let tokens = JSON.parse(fs.readFileSync('./data/keys/tokens.json', 'utf8'));
    
   fetch('https://api.brawlstars.com/v1/players/%238YRLYG0',{
        method: 'GET',
        headers: {'content-Type': 'application/json',
                 'authorization': tokens.playerToken
        },
        timeout: 20
    })
    .then((res) => {
        status = res.status
        console.log(status);
    })

}

module.exports.help = {
    name: "test"
}