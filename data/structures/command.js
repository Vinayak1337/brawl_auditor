const { readdirSync } = require('fs');
const { join } = require('path');
const filePath = join(__dirname, '..','commands');

module.exports.run = (Bot) => {
    for (const cmd of readdirSync(filePath).filter(cmd => cmd.endsWith('.js'))){
        const prop = require(`${filePath}/${cmd}`);
        Bot.commands.set(prop.help.name, prop);
        
        if(prop.help.aliases){
            for(const alias of prop.help.aliases){
                Bot.aliases.set(alias, prop);
            }
        }
    }

    console.log(`${Bot.commands.size} commands as been successfully loaded!`);
}