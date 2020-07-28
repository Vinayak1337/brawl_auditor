const Discord = require('discord.js');
const fs = require('fs');
module.exports.run = async (Bot, msg, args, settings) => {
if(!msg.author.id == settings.ownerID) return;
let data = JSON.parse(fs.readFileSync('./data/database/datatest.csv', 'utf8'));
data[msg.author.id].clubTagL = 'NEW_DATA';
fs.writeFile('./data/database/datatest.csv', JSON.stringify(data), (err) => {
    if(err){
        return console.log(err);
    }
    console.log(data);
})
}

module.exports.help = {
    name: "profile"
}