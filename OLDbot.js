// const settings = require('./data/keys/settings.js');
// const tokens = require('./data/keys/tokens.js');
// const Discord = require('discord.js');
// const Bot = client = new Discord.Client({
//     shards:"auto",
//     messageCacheMaxSize: Infinity,
//     messageCacheLifetime: 604800,
//     messageSweepInterval: 60,
//     fetchAllMembers: true,
//     retryLimit: 3,
    
// });
// const fs = require('fs');
// Bot.commands = new Discord.Collection();

//_________________________________________________________________________________________
// //File control
// const Database = {};
// Database.players = JSON.parse(fs.readFileSync('./data/database/players.csv','utf8'));
// Database.servers = JSON.parse(fs.readFileSync('./data/database/servers.csv','utf8'));
// Database.globals = JSON.parse(fs.readFileSync('./data/database/globals.csv','utf8'));
// Database.clubs = JSON.parse(fs.readFileSync('./data/database/clubs.csv','utf8'));

// fs.readdir("./data/commands/", (err, files) => {
//     if(err) console.log(err);

//     let jsFiles = files.filter(f => f.split('.').pop() === 'js');
//     if(jsFiles.length <= 0){
//         console.log("Couldn't find commands files!");
//         return;
//     }
//     jsFiles.forEach((f, i) => {
//         let props = require(`./data/commands/${f}`);
//         console.log(`${f} loaded!`);
//         Bot.commands.set(props.help.name, props);
//     });
// });

// Bot.on('guildMemberAdd', member => {
//     console.log(member.user.username+' has joined');
// })

// Bot.on('guildCreate', guild => {
//     console.log(guild);
//     let data = JSON.parse(fs.readFileSync('./data/database/servers.csv','utf8'));
//     let pdata = JSON.parse(fs.readFileSync('./data/database/players.csv','utf8'));
//     if(!data[guild.id]){
//         data[guild.id] = {
//             premium: false
//         }
//     }
//     else{
//         if(!data[guild.id].premium){
//             data[guild.id].premium = false;
//         }
//     }
//     guild.members.cache.forEach(m => {
//         if(!pdata[m.id]){
//             pdata[m.id] = {
//                 premium: false
//             }
//         }
//         else{
//             if(!pdata[m.id].premium){
//                 pdata[m.id].premium = false;
//             }
//         }
//     })
//     fs.writeFile('./data/database/servers.csv',JSON.stringify(data), error =>{
//         if(error){
//             console.log(error);
//         }
//     })
//     fs.writeFile('./data/database/players.csv',JSON.stringify(pdata), error =>{
//         if(error){
//             console.log(error);
//         }
//     })
// })

// Bot.on('error', () => {
//     Bot.channels.cache.get('738392637299621970').send('```js\n'+error +'\n```').catch((e) => console.log(e));
// });

// Bot.on('ready', () => {
//     console.log(`logged in as ${Bot.user.tag} !`);
//     x = 0;
//     setInterval(function(){
//         switch(x){
//             case 0:{
//                 Bot.user.setPresence({status: 'online', activity:{name: 'Under construction', type: 'WATCHING'}})
//             }break;

//             case 1:{
//                 Bot.user.setPresence({status: 'idle', activity: {name: 'type =invite to invite me!', type: 'PLAYING'}})
//             }break;

//             default: {
//                 x = 0;
//             }
            
//         }
//         x++
//     },10000)
    
// });

//Message Event

// Bot.on('message', async (msg) => {
//     let prefix = settings.tag;

//     if(msg.author.bot) return;
//     if(!msg.content.startsWith(prefix)) return;

//     let msgArray = msg.content.split(' ');
//     let cmd = msgArray[0];
//     let args = msgArray.slice(1);

//     Bot.args = args;
//     Bot.msg = msg;
//     Bot.settings = settings;
//     Bot.tokens = tokens;

//     let cmdFile = Bot.commands.get(cmd.slice(prefix.length));
//     if(cmdFile) cmdFile.run(Bot);

// })
// Bot.login(settings.tokenFirst);