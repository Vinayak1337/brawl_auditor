const { owners } = require('../keys/settings');
const fs = require('fs');

module.exports = (Bot, msg) => {
    if(msg.author == msg.guild.me) return;
    
    //________________________________________________________________________________________
    //Get the prefix
    let prefix, command, args;
    let prefixes = JSON.parse(fs.readFileSync('./data/database/serverPrefixes.csv','utf8'));
    if(!prefixes[msg.guild.id]){
        prefixes[msg.guild.id] = {
            prefix: Bot.settings.tag
        }
        prefix = prefixes[msg.guild.id].prefix;
    }
    else if(!prefixes[msg.guild.id].prefix){
        prefixes[msg.guild.id].prefix = Bot.settings.tag;
        prefix = prefixes[msg.guild.id].prefix;
    }
    else{
        prefix = prefixes[msg.guild.id].prefix;
    }
    fs.writeFileSync('./data/database/serverPrefixes.csv', JSON.stringify(prefixes), (err) => {
        if(err){
            console.log(err);
        }
    })

    Bot.prefix = prefix;

    //___________________________________________________________________________________________
    //Returning here if not prefix
    if(!msg.content.startsWith(prefix) && !msg.content.startsWith(Bot.settings.tag)) return;

    //Returning if Bot
    if(msg.author.bot) return;

    //Returning from DM
    if(msg.channel.type == 'dm') return;


    let msgArray = msg.content.split(' ');
    command = msgArray[0].slice(prefix.length);
    args = msgArray.slice(1);

    const cmd = Bot.commands.get(command) || Bot.aliases.get(command);

    if(!cmd) return;
    if(!msg.guild.me.permissions.has(['SEND_MESSAGES'])) return msg.author.send(Bot.errEmDear.setDescription(`user ${msg.author}, i don't have permission to send message in ${msg.channel}`));

    if(cmd.requirements.ownerOnly && !owners.includes(msg.author.id)) return;
    if(cmd.requirements.adminOnly && !msg.member.permissions.has(['ADMINISTRATOR'])) return msg.channel.send(Bot.errEmDear.setDescription('This command requires admin permission'));

    if(cmd.requirements.userPerms && !msg.member.permissions.has(cmd.requirements.userPerms)){
        return msg.channel.send(Bot.errEmDear.setDescription(`You must have the following permissions: ${missingPerms(msg.member, cmd.requirements.userPerms)}`));
    }

    if(cmd.requirements.BotPerms && !msg.guild.me.permissions.has(cmd.requirements.BotPerms)){
        return msg.channel.send(Bot.errEmDear.setDescription(`I am missing the following permissions: ${missingPerms(msg.guild.me, cmd.requirements.BotPerms)}`));
    }
    
    //Check user limit
    if(cmd.userLimits){
        const current = Bot.limits.get(`${command}-${msg.author.id}`);

        if(!current){
            let obj = {};
             obj.crr = 1;
             obj.time = Date.now()/1000;
            Bot.limits.set(`${command}-${msg.author.id}`, obj);

        }else{

         if(current.crr >= cmd.limits.rateLimit){
             const usedTime = current.time;
             const time = Date.now()/1000;
             const used = time - usedTime;
             const remain = cmd.limits.cooldown/1000 - used;
            return msg.channel.send(`Please wait ${Math.round(remain)} seconds to use this command again!`);

         }else{
             let obj = {};
             obj.crr = current.crr + 1;
             obj.time = Date.now()/1000;
             Bot.limits.set(`${command}-${msg.author.id}`,obj);
         }
        }

        setTimeout(() => {
            Bot.limits.delete(`${command}-${msg.author.id}`);
            Bot.limits.delete(`${command}-${msg.author.id}-Time`);
        },cmd.limits.cooldown);
    }

    //check if server limits
    else if(cmd.serverLimits){
        const current = Bot.limits.get(`${command}-${msg.guild.id}`);

        if(!current){
            let obj = {};
             obj.crr = 1;
             obj.time = Date.now()/1000;
            Bot.limits.set(`${command}-${msg.guild.id}`, obj);

        }else{

         if(current.crr >= cmd.limits.rateLimit){
             const usedTime = current.time;
             const time = Date.now()/1000;
             const used = time - usedTime;
             const remain = cmd.limits.cooldown/1000 - used;
            return msg.channel.send(`Please wait ${Math.round(remain)} seconds to use this command again!`);

         }else{
             let obj = {};
             obj.crr = current.crr + 1;
             obj.time = Date.now()/1000;
             Bot.limits.set(`${command}-${msg.guild.id}`,obj);
         }
        }

        setTimeout(() => {
            Bot.limits.delete(`${command}-${msg.guild.id}`);
            Bot.limits.delete(`${command}-${msg.guild.id}-Time`);
        },cmd.limits.cooldown);
    }

    cmd.run(Bot, msg, args);
}

const missingPerms = (member, perms) => {
    const missingPerms = member.permissions.missing(perms)
    .map(str => `\`${str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUppercase())}\``);

    return missingPerms.length > 1 ?
    `${missingPerms.slice(0, -1).join(', ')} and ${missingPerms.slice(-1[0])}`:
    missingPerms[0];
}