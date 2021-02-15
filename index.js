require('dotenv').config();
const fs = require("fs");
const Discord = require('discord.js');

const { prefixProd, prefixDev, giveawayCountdownFreq, developerRole } = require("./settings.json");

const prefix = process.env.NODE_ENV === "production" ? prefixProd : prefixDev

const token = process.env.NODE_ENV === "production" ? process.env.BOT_TOKEN : process.env.BOT_TOKEN_DEV;

const bot = new Discord.Client();

// Init discord giveaways https://github.com/Androz2091/giveaways-bot
const { GiveawaysManager } = require('discord-giveaways');
const { isPermitted } = require('./commands/utils/isPermitted');

bot.giveawaysManager = new GiveawaysManager(bot, {
    storage: "./giveaways.json",
    updateCountdownEvery: giveawayCountdownFreq,
    default: {
        botsCanWin: false,
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});


//load commands
bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
    console.log(`Command loaded: ${command.name}`);
}


//Events
bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});


bot.on('message', async (message) => {

    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    if (!bot.commands.has(command)) return

    try {
        await bot.commands.get(command).execute(message, args, bot);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }

})

//Giveaways events

bot.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

bot.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} unreact to giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

bot.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
    console.log(`Giveaway #${giveaway.messageID} ended! Winners: ${winners.map((member) => member.user.username).join(', ')}`);
});

bot.login(token);






