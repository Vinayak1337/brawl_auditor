const Discord = require('discord.js');
const { model } = require('mongoose');

module.exports.run = (Bot, msg, args) => {
    return msg.channel.send('Nothing');
}

module.exports.help = {
    name: 'exammple',
    description: 'Command file template!',
    aliases: []
    //command name identifier
}

module.exports.requirements = {
    userPerms: [],
    BotPerms: [],
    ownerOnly: true,
    adminOnly: false
    //Requirements
}

module.exports.userLimits ={
    rateLimit: Infinity, //If{limit exceeds within given cooldown} return try again in ${cooldown}
    cooldown: 0 //time in ms
}

module.exports.serverLimits = {
    rateLimit: Infinity,
    cooldown: 0
}