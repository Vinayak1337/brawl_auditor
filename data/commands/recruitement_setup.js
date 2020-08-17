const Discord = require('discord.js');
const fs = require('fs');
const fetcher = require('../functionsBS/brawlAPI');

module.exports.run = (Bot, msg, args) => {
    if(!msg.author.id == Bot.settings.ownerID) return msg.channel.send('Nothing to show');

    if(msg.channel.type == 'dm') return;
    const errEmbed = new Discord.MessageEmbed().setColor('#ff0000');
    const successEmbed = new Discord.MessageEmbed().setColor('#00ff59').setAuthor(msg.guild.name).setThumbnail(msg.guild.iconURL({format: 'png', dynamic: true,size: 1024})).setTimestamp();
    const quesEmbed = new Discord.MessageEmbed().setColor('#ffc400').setFooter('Type cancel to cancel the setup anytime!').setTimestamp().setAuthor(msg.guild.name).setThumbnail(msg.guild.iconURL({format: 'png', dynamic: true,size: 1024}));
    if(!args[0]) args[0] = 'none';
    //__________________________________________________________________________________________________
    //saving all arguments in arg
    const arg = args;
    arg.Bot = Bot;
    arg.msg = msg;
    arg.settings = Bot.settings;
    arg.tokens = Bot.tokens;
    arg.eEM = errEmbed;
    arg.sEM = successEmbed;
    arg.qEM = quesEmbed;
    arg.prefix = Bot.prefix;
    arg.fetcher = fetcher;
    arg.fetch = fetch;
    
    //__________________________________________________________________________________________________
    //check the call for server or user!
    if(args[0] == 'server'){
        Server(arg);
    }
    else if(args[0] == 'user'){
        User(arg);
    }
    else{
        return msg.channel.send(errEmbed.setDescription(`Entered arguement **${args[0]}** is incorrect!\nTry again with correct arguements!\n\nUsage:\n\n**${prefix}setup server**\nTo setup the server for recruitment module!\n\n**${prefix}setup user**\nTo setup your data to find a club`))
    }

    //Check call end!
    //__________________________________________________________________________________________________
    //server setup start, asking the club tag!
    function Server(arg){
        if(!msg.member.hasPermission('MANAGE_SERVER')) return arg.msg.channel.send('<a:noo:738828172736331827> __Access denied__ \nMust have permission **MANAGE SERVER**');
        arg.msg.channel.send(arg.qEM.setDescription('Please enter the club tag you want to advertise for!')).then(msg2 => {
            arg.msg2 = msg2;
            awaitMSGgetTag(arg);
        })
    }

    //Await message to get club tag
    function awaitMSGgetTag(arg){
        arg.msg.channel.awaitMessages(m => m.content.length > 0, {max: 1, time:60000, errors: ['time']})
        .then(collected => {
            let tag = collected.first().content;
            collected.first().delete();
            if(tag.toLowerCase() == 'cancel') return arg.msg2.edit(arg.sEM.setDescription('Alright, Setup has been succesfully cancelled! <a:Tick:738827960773115965>'));
            else if(tag.startsWith('#')){
                tag = tag.slice(1);
            }
            arg.tag = tag.toUpperCase();
            brawlRequest(arg);
        })
        .catch(err => {
            let e = JSON.stringify(err)
            if(e.length == 2){
                return arg.msg2.edit(arg.eEM.setDescription('Timeout! please try again later.'));
            }
            else
            {
                console.log(e+' #69th line setup new');
            }
        })
    }

    //Making API request from brawl stars end point!
    function brawlRequest(arg){
        function wait(arg){
            const option = 'clubs'
            const obj = arg.fetcher.toFetch(arg.Bot,option,arg.tag);
            obj.then(res => {
                let status = res.status;
                if(status == 200){
                    return res.json();
                }
                else {
                return status;
                }
            })
            .then(json => {
                //If wrong status codes
                if(json == 503) return arg.msg2.edit(arg.eEM.setDescription('Brawl stars servers are under maintenance. Please try again later!').setFooter(`Status code ${json}`));
                    else if(json == 500) return arg.msg2.edit(arg.eEM.setDescription(`Something wrong happened while fetching the tag ${arg.tag}. Please try again!`).setFooter(`Status code ${json}`));
                    else if(json == 429) return arg.msg2.edit(arg.eEM.setDescription(`Something wrong happened while fetching the tag ${arg.tag}.\n Please report this code **${json}** to our [support server](https://discord.gg/t2N9yt5,'Support server for Brawl Auditor').`));
                    else if(json == 404) return arg.msg2.edit(arg.eEM.setDescription(`Club with given tag ${arg.tag} not found or doesn't exist anymore! Try again with a correct tag.`).setFooter(`Status code ${json}`));
                    else if(json == 403) return arg.msg2.edit(arg.eEM.setDescription(`Something wrong happened while fetching the tag ${arg.tag}.\nPlease report this code **${json}** to our [support server](https://discord.gg/t2N9yt5, 'Support server for Brawl Auditor').`));
                    arg.msg2.edit(arg.qEM.setDescription(`Alright, the club tag is **${arg.tag}** & club name **${json.name}**\n\nNow enter the description:\n**What description or a message you want to put in your advertisement?**`));
                    arg.json = json;
                    awaitMSGgetDesc(arg);
            })
            .catch(error => {
                console.log(error);
            });
        }

        setTimeout(wait(arg),100,'To prevent (code: 429)')
    }

    //Await to get the description!
    function awaitMSGgetDesc(arg){
        arg.msg.channel.awaitMessages(m => m.content.length > 0, {max: 1, time:60000, errors: ['time']})
        .then(collected => {
            let desc = collected.first().content;
            collected.first().delete();
            if(desc.toLowerCase() == 'cancel') return arg.msg2.edit(arg.sEM.setDescription('Alright, setup has been successfully cancelled! <a:Tick:738827960773115965>'));
            arg.msg2.edit(arg.qEM.setDescription('Your given description has been set! <a:Tick:738827960773115965>\n\nNow mention the channel where you want the club feeds (Other advertised clubs)\n[This is required to advertise your club in other servers.]'));
            arg.desc = desc;
            awaitMSGchannel(arg);
        })
        .catch(err => {
            let e = JSON.stringify(err)
            if(e.length == 2){
                return arg.msg2.edit(arg.eEM.setDescription('Timeout! please try again later.'));
            }
            else
            {
                console.log(e+' #130th line setup new');
            }
        })
    }

    //Await to get channel - mentioned!
    function awaitMSGchannel(arg){
        arg.msg.channel.awaitMessages(m => m.mentions.channels.size > 0, {max: 1, time:60000, errors: ['time']})
        .then(collected => {
            let ch = collected.first();
            collected.first().delete();
            if(ch.content.toLowerCase() == 'cancel') return arg.msg2.edit(arg.sEM.setDescription('Alright, setup has been successfully cancelled! <a:Tick:738827960773115965>'));
            let channel = ch.mentions.channels.first();
            if(!arg.msg.guild.members.cache.get(arg.Bot.user.id).permissionsIn(arg.msg.guild.channels.cache.get(channel.id)).has('VIEW_CHANNEL')) return arg.msg2.edit(arg.eEM.setDescription(`Please give me following permissions in ${channel} :\n\n**SEND_MESSAGES\nREAD_MESSAGES\nMANAGE_WEBHOOKS**\n\nand try again!`));
            else if(!arg.msg.guild.members.cache.get(arg.Bot.user.id).permissionsIn(arg.msg.guild.channels.cache.get(channel.id)).has('SEND_MESSAGES')) return arg.msg2.edit(arg.eEM.setDescription(`Please give me following permissions in ${channel} :\n\n**SEND_MESSAGES\nMANAGE_WEBHOOKS**\n\nand try again!`));
            else if(!arg.msg.guild.members.cache.get(arg.Bot.user.id).permissionsIn(arg.msg.guild.channels.cache.get(channel.id)).has('SEND_MESSAGES')) return arg.msg2.edit(arg.eEM.setDescription(`Please give me following permissions in ${channel} :\n\n**MANAGE_WEBHOOKS**\n\nand try again!`));
            arg.msg2.edit(arg.qEM.setDescription(`The feed channel ${channel} has been set <a:Tick:738827960773115965>!\n\nNow enter the requirement you want to put for the users to join your club!\nFor e.g. Accepting only ladder warriors!\nWhats your requirement?`));
            arg.channel = channel;
            awaitRequirement(arg);
        })
        .catch(err => {
            let e = JSON.stringify(err)
            if(e.length == 2){
                return arg.msg2.edit(arg.eEM.setDescription('Timeout! please try again later.'));
            }
            else
            {
                console.log(e+' #157th line setup new');
            }
        })
    }

    //Await to get the requirement for club!
    function awaitRequirement(arg){
        arg.msg.channel.awaitMessages(m => m.content.length > 0,{max: 1, time:60000, errors: ['time']})
        .then(collected => {
            let req = collected.first().content;
            collected.first().delete();
            if(req.toLowerCase() == 'cancel') return arg.msg2.edit(arg.sEM.setDescription('Alright, setup has been successfully cancelled! <a:Tick:738827960773115965>'));
            arg.msg2.edit(arg.qEM.setDescription(`Your description  has been set! <a:Tick:738827960773115965>\n\nNow last setup-\nGive your club banner you want to attach with the advertisement!\nType **default** to use current server's icon as your recruitment banner!\nOr send an image url or post an image!`));
            arg.req = req;
            awaitBanner(arg);
        })
        .catch(err => {
            let e = JSON.stringify(err)
            if(e.length == 2){
                return arg.msg2.edit(arg.eEM.setDescription('Timeout! please try again later.'));
            }
            else
            {
                console.log(e+' #180th line setup new');
            }
        })
    }

    //Await to get recruitment banner!
    function awaitBanner(arg){
        arg.msg.channel.awaitMessages(m => ['.png', '.gif', '.webp', '.jpg', '.jpeg', 'default'].some(e => m.content.toLowerCase().includes(e)) || m.attachments.size > 0,{max: 1, time:60000, errors: ['time']})
        .then(collected => {
            let attach = collected.first();
            collected.first().delete();
            if(attach.content.toLowerCase() == 'cancel') return arg.msg2.edit(arg.sEM.setDescription('Alright, setup has been successfully cancelled! <a:Tick:738827960773115965>'));
            else if(attach.content.toLowerCase() == 'default'){
                arg.banner = 'default';
            }
            else if(attach.attachments.size > 0){
                let attach = attach.attachments.first().url;
                if(!['.png', '.gif', '.webp', '.jpg', '.jpeg'].some(e => attach.includes(e))) return arg.msg2.edit(arg.eEM(`This isn't an image, please try again!`));
            }
            else if(['.png', '.gif', '.webp', '.jpg', '.jpeg'].some(e => attach.content.includes(e))){
                        arg.banner = attach.content;
            }
            arg.msg2.edit(arg.sEM.setDescription('Your setup has been succesfully completed! Please wait, while i am sending the configuration and saving the given details!'));
            let data = JSON.parse(fs.readFileSync('./data/database/serverAdData.csv','utf8'));
            if(!data[arg.msg.guild.id]){
                data[arg.msg.guild.id] = {
                    premium: false
                }
            }
            data[arg.msg.guild.id].adClubTag = arg.tag;
            data[arg.msg.guild.id].adClubDescription = arg.desc;
            data[arg.msg.guild.id].adClubChannel = arg.channel.id;
            data[arg.msg.guild.id].adClubRequirement = arg.req;
            data[arg.msg.guild.id].adClubBannerURL = arg.banner;
            console.log(arg.banner);
            fs.writeFile('./data/database/serverAdData.csv', JSON.stringify(data),(err) => {
                if(err){
                    console.log(err);
                }
            })
            config(arg);
        })
        .catch(err => {
            let e = JSON.stringify(err)
            if(e.length == 2){
                return arg.msg2.edit(arg.eEM.setDescription('Timeout! please try again later.'));
            }
            else
            {
                console.log(e+' #229th line setup new');
            }
        })


        //Sending the setup
        function config(arg){
           let trophiesEmote, requiredTrophiesEmote;
           let emotes = ['<:Wood:704338525663002719>','<:Bronze:704338571225727066>','<:Silver:704338593833025571>','<:Gold:704338611314884691>','<:Diamond:704338628184113202>','<:Crystal:704338650888142939>','<:Master:741353024093421709>','<:Legend:704338670571880478>','<:T_~1:741137124287578112>','<:T_:741134640366092319>','<:T_~2:741139984022634559>'];
           let range = [0,1000,2000,3000,4000,6000,8000,1000,16000,30000,50000];
           range.reverse();
           emotes.reverse();
           let trophies = arg.json.trophies;
           let requiredTrophies = arg.json.requiredTrophies;
           for(let x=0;x<11;x++){
               if(!trophiesEmote){
               if(trophies >= range[x]){
                   trophiesEmote = emotes[x];
               }}
               if(!requiredTrophiesEmote){
                if(requiredTrophies >= range[x]){
                    requiredTrophiesEmote = emotes[x];
                } 
               }
           }
           arg.msg.channel.send(arg.msg.member,arg.sEM.setAuthor(arg.msg.guild.name,arg.msg.guild
                .iconURL({format:'png',dynamic:true}),arg.channel
                .createInvite({maxAge:0,unique:true,reason:'For club advertisement.'}))
                .setTitle('<:Club:704361710462697533> '+arg.json.name+ '\n<:Hastag:706544026941128705> ' + arg.tag)
                .setURL('https://www.starlist.pro/stats/club'+arg.tag)
                .addField(trophiesEmote + 'Trophies',arg.json.trophies,true)
                .addField(requiredTrophiesEmote + 'Required Trophies',requiredTrophies,true)
                .addField()
                )
        }
    }
    // server setup end
    //__________________________________________________________________________________________________
    //user setup start
    function User(arg){
        return arg.msg.channel.send('Nothing to show');
    }
    // user setup end
    //__________________________________________________________________________________________________

}

module.exports.help = {
    name: 'setup',
    description: 'Setup your club data or your data to advertise in multiple servers!',
    usage: `setup server\nTo setup your club data & connect your server with your club data!\n\nsetup user\nTo setup your data, to search clubs, then someone will reach you soon according to your given data!`,
    aliases: []
    //command name identifier
}

module.exports.requirements = {
    userPerms: [],
    BotPerms: ['MANAGE_GUILD','MANAGE_CHANNELS'],
    ownerOnly: true,
    adminOnly: false
}

module.exports.serverLimits = {
    rateLimit: 5, 
    cooldown:  6e4
}