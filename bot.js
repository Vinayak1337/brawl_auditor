const settings = require('./data/keys/settings');
const tokens = require('./data/keys/tokens');
const Discord = require('discord.js');
const Bot = client = new Discord.Client({
    shards:"auto",
    messageCacheMaxSize: Infinity,
    messageCacheLifetime: 604800,
    messageSweepInterval: 60,
    fetchAllMembers: true,
    retryLimit: 3,
    
});
const fs = require('fs');
const errEm = new Discord.MessageEmbed()
                  .setColor('RED');
                  
Bot.commands = new Discord.Collection();
Bot.aliases = new Discord.Collection();
Bot.limits = new Map();
Bot.settings = settings;
Bot.tokens = tokens;
Bot.errEm = errEm;
Bot.apiInt = 1;

const commands = require('./data/structures/command');
commands.run(Bot);

const events = require("./data/structures/event");
events.run(Bot);


Bot.login(settings.tokenFirst);