const settings = require('./data/keys/settings.json')
const Discord = require('discord.js');
const Bot = new Discord.Client();
const fs = require('fs');
Bot.commands = new Discord.Collection();

fs.readdir("./data/commands/", (err, files) => {
    if(err) console.log(err);

    let jsFiles = files.filter(f => f.split('.').pop() === 'js')
    if(jsFiles.length <= 0){
        console.log("Couldn't find commands files!");
        return;
    }
    jsFiles.forEach((f, i) => {
        let props = require(`./data/commands/${f}`);
        console.log(`${f} loaded!`);
        Bot.commands.set(props.help.name, props);
    });
});

Bot.on('ready', () => {
    console.log(`logged in as ${Bot.user.tag} !`);
    Bot.user.setPresence({activity: {name: 'Under construction',type: 'WATCHING'}, status: 'online'})
});

Bot.on('message', async (msg) => {
    let prefix = settings.tag;

    if(msg.author.bot) return;
    if(!msg.content.startsWith(prefix)) return;

    let msgArray = msg.content.split(' ');
    let cmd = msgArray[0];
    let args = msgArray.slice(1);

    let cmdFile = Bot.commands.get(cmd.slice(prefix.length));
    if(cmdFile) cmdFile.run(Bot,msg,args,settings);

})
Bot.login(settings.tokenFirst);