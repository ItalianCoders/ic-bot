const Discord = require('discord.js');
const ms = require('ms');
const youtubeApi = require("../apis/youtube/youtubeApi")

const execute = async (message, args, client) => {

    const searchParams = {
        part: "snippet",
        eventType: "upcoming",
        q: "ItalianCoders",
        type: "video"
    }

    const upcoming = await youtubeApi.search(searchParams)

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

    // console.log(upcomingLives)
    // if(Number.isInteger(args[0])){
    //     var liveIdx
    // }

    const fields = [];

    const now = Date.now()

    for (live of upcomingLives) {
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
    execute
};