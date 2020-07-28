const Discord = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs');
let data = {};
module.exports.run = async (Bot, msg, args, settings) => {
if(!msg.author.id == settings.ownerID) return;
    let tokens = JSON.parse(fs.readFileSync('./data/keys/tokens.json', 'utf8'));
   fetch('https://api.brawlstars.com/v1/players/%238YRLYG0',{
        method: 'GET',
        headers: {'content-Type': 'application/json',
                 'authorization': tokens.playerToken
        }
    })
    .then((res) => {
     const status = res.status
    return res.json();
    })
.then((json) => {
   data = json
console.log(data);
return data;
})
}
module.exports.help = {
    name: "test"
}