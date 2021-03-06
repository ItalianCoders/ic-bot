const Discord = require('discord.js');
const { prefixProd, embedColor } = require("../settings.json");

const execute = (message, args, client) => {

    let str = "```"
    for ([key, command] of client.commands) {
        str += `\n${command.name} - ${command.description}\n`
        if (command.arguments) {
            str += `args: ${command.arguments}\n`
        }
    }

    str += "```"

    const embed = new Discord.MessageEmbed()
        .setTitle('Help')
        .setColor(embedColor)
        .setDescription(`**Prefix every command with ${prefixProd}**`)
        .addFields(
            {
                name: 'Commands list',
                value: str
            }
        )
    message.channel.send(embed);
}

module.exports = {
    name: 'help',
    description: 'Lists the available commands',
    execute
};