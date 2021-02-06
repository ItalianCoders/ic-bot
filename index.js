require('dotenv').config();
const fs = require("fs");
const Discord = require('discord.js');

const { prefix, giveawayCountdownFreq } = require("./settings.json");

const token = process.env.BOT_TOKEN;

const bot = new Discord.Client();

// Init discord giveaways https://github.com/Androz2091/giveaways-bot
const { GiveawaysManager } = require('discord-giveaways');

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

// const youtubeApi = require("./apis/youtube/youtubeApi")


// const getUpcomingLive = async () => {

//     const searchParams = {
//         part: "snippet",
//         eventType: "upcoming",
//         q: "ItalianCoders",
//         type: "video"
//     }

//     const upcoming = await youtubeApi.search(searchParams)

//     const upcomingIds = upcoming.items.map(item => item.id.videoId)


//     const videosParams = {
//         part: "liveStreamingDetails",
//         id: upcomingIds.join()
//     }

//     let videos = await youtubeApi.listVideos(videosParams)

//     videos = videos.items.filter(item => !item.liveStreamingDetails.actualEndTime)

//     // upcomingLives = upcomingLives.map(item => item.liveStreamingDetails.unix = new Date(item.liveStreamingDetails.scheduledStartTime))

//     let upcomingLives = [];

//     for (item of videos) {
//         upcomingLives.push({
//             id: item.id,
//             startTime: Date.parse(item.liveStreamingDetails.scheduledStartTime)
//         })
//     }

//     upcomingLives = upcomingLives.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1)

//     console.log(upcomingLives)
// }


// getUpcomingLive()

// const test = async () => {

//     params = {
//         part: "snippet, liveStreamingDetails",
//         id: "lUrO1cakShw"
//     }

//     const testReq = await youtubeApi.listVideos(params)

//     console.log(testReq)

// }

// test()





