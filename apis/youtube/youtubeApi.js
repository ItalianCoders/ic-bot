require('dotenv').config();
const axios = require('axios');

const youtubeDataApiUrl = {

    baseUrl: "https://www.googleapis.com/youtube/v3",

    search: {
        method: "get",
        url: "/search",
    },

    listVideos: {
        method: "get",
        url: "/videos",
    }
}


axiosInstance = axios.create({
    baseURL: youtubeDataApiUrl.baseUrl,
});


const youtubeApi = {
    async call(resourceMethod, params) {
        params.key = process.env.YOUTUBEDATA_API_KEY

        const response = await axiosInstance.request({
            ...youtubeDataApiUrl[resourceMethod],
            params
        })

        return response.data
    },

    async search(params) {
        return await this.call("search", params)
    },

    async listVideos(params) {
        return await this.call("listVideos", params)
    }
}


module.exports = youtubeApi

