const Discord = require('discord.js');
const ms = require('ms');
const youtubeApi = require("../apis/youtube/youtubeApi")
const { italianCodersChannelId: channelId } = require("../settings.json")

const execute = async (message, args, client) => {

    const searchParams = {
        part: "snippet",
        channelId,
        eventType: "upcoming",
        // q: "ItalianCoders",
        type: "video"
    }


    try {
        var upcoming = await youtubeApi.search(searchParams)
    } catch (e) {
        console.log(e)
        return message.channel.send("Whoops, I can't get to the youtube api right now!");
    }

    if (!upcoming.items.length) {
        return message.channel.send("Sembra che non ci siano live in programma!")
    }

    const upcomingIds = upcoming.items.map(item => item.id.videoId)


    const videosParams = {
        part: "snippet, liveStreamingDetails",
        id: upcomingIds.join()
    }

    let videos = await youtubeApi.listVideos(videosParams)

    videos = videos.items.filter(item => !item.liveStreamingDetails.actualEndTime)

    // console.log(videos)

    let upcomingLives = [];

    for (item of videos) {
        upcomingLives.push({
            id: item.id,
            startTime: Date.parse(item.liveStreamingDetails.scheduledStartTime),
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url
        })
    }

    upcomingLives = upcomingLives.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1)


    let numLive = upcomingLives.length

    if (args[0]) {
        const userArg = parseInt(args[0])
        if (!isNaN(userArg)) {
            numLive = userArg < 1 ? 1 : userArg // if argument is less than 1 make it 1
            numLive = numLive > upcomingLives.length ? upcomingLives.length : numLive // if argument is more than found lives make it equal to found lives
        } else {
            return message.channel.send(`:x: You have to enter a valid number of upcoming lives! Currently from 1 to ${numLive}`);
        }
    }

    const fields = [];

    const now = Date.now()

    for (live of upcomingLives.slice(0, numLive)) {
        const startsIn = ms(live.startTime - now, { long: true })
        fields.push({
            name: live.title,
            value: `*Comincia fra ${startsIn}!*\nhttps://www.youtube.com/watch?v=${live.id}\n`,
        })
    }

    const embed = new Discord.MessageEmbed()
        .setTitle('Le prossime live in programma!')
        .setColor('##FF0000')
        .addFields(
            ...fields
        )
        .setImage(upcomingLives[0].thumbnail)

    message.channel.send(embed);
}

module.exports = {
    name: 'youtube-live',
    description: 'Lists the upcoming lives',
    arguments: "numLives(optional)",
    execute
};