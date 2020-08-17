const Discord = require('discord.js');
const { inspect } = require('util');
const escapeRegex = require('escape-string-regexp');
const tags = require('common-tags');
const fs = require('fs');

module.exports.run = (Bot,msg,args) => {
const query = args.join(' ');
const nl = '!!NL!!';
const nlPattern = new RegExp(nl, 'g');

let lastResult;
let hrStart;
let hrDiff;

function evald() {
	
	try {
		const hrStart = process.hrtime();
		if(!query.includes("msg.author.id =") || !query.includes("msg.author =") || !query.includes("msg =")) lastResult = eval(query);

		hrDiff = process.hrtime(hrStart);
	} catch(err) {
		return msg.channel.send(`${msg.author} Error while evaluating: \`${err}\``);
	}

	hrStart = process.hrtime();

	formatsend(lastResult);
}

function formatsend(result) {
	const inspected = inspect(result, { depth: 0 })
		.replace(nlPattern, '\n')
		.replace("eval", 'You cant eval while evaluating... come on, ' + msg.author.tag);
	const split = inspected.split('\n');
	const last = inspected.length - 1;
	const prependPart = inspected[0] !== '{' && inspected[0] !== '[' && inspected[0] !== "'" ? split[0] : inspected[0];
	const appendPart = inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== "'" ?
		split[split.length - 1] :
		inspected[last];

	msg.channel.send(tags.stripIndents`
        ${msg.author}
        *Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}ms ` : ''}${hrDiff[1] / 1000000}s.*
        \`\`\`javascript
        ${inspected}
        \`\`\`
    `,
		{ split: {
        maxLength: 1900,
        char: '\n',
        prepend: `\`\`\`javascript\n${prependPart}\n`,
        append: `\n${appendPart}\n\`\`\``
	} });
}

function sensitivePattern() {
	if(!this._sensitivePattern) {
		let pattern = '';
		if(client.token) pattern += escapeRegex(client.token);
		Object.defineProperty(this, '_sensitivePattern', { value: new RegExp(pattern, 'gi') });
	}
	return this._sensitivePattern;
}

evald();
}

module.exports.help = {
	name: 'compile',
	aliases: ['eval','exec']
}

module.exports.requirements = {
    userPerms: [],
    BotPerms: [],
    ownerOnly: true,
    adminOnly: false
}
module.exports.userLimits ={
    rateLimit: 1,
    cooldown: 6e2
}