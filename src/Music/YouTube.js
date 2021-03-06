const ytdl = require('ytdl-core');
const { Client } = require('discord.js');
const ReadableStream = require('stream').Readable
const request = require('node-fetch')

/**
 * A class used to carry out YouTube-based functions
 */
class YouTubeClient {
    constructor(client) {
        /**
         * A Discord.js Client
         * @private
         * @type {Client}
         */
        this.client = client

        /**
         * A YouTube Data API v3 API Key
         * @type {String}
         */
        this.key = null
    }

    /**
     * Initializes the YouTubeClient
     * @param {String} key YouTube Data API v3 API Key
     * @returns {Boolean} Returns true if the client initializes successfully
     */
    init(key) {
        this.key = key

        return true
    }

    /**
     * Gets a ReadableStream from a YouTube URL.
     * @param {String} url URL of the YouTube video to be downloaded
     * @returns {Promise<ReadableStream>} ReadableStream containing the YouTube video data
     */
    getStream(url) {
        return new Promise((res, rej) => {
            if (this.key == null) return rej(new Error("You must initialize the YouTubeClient before you can use it"))
            if (url.indexOf("youtube.com") < -1) return rej(new Error("You must provide a YouTube video URL to download."))

            var stream = ytdl(url, {
                quality: "highestaudio",
                filter: "audioonly",
                format: "mp4"
            })

            res(stream)
        })
    }

    /**
     * Searches the YouTube API with given parameters
     * @param {String} params Terms you want to search the API for
     * @returns {Promise<Array<String>>}
     */
    search(params) {
        return searchYouTube(params, this.key)
    }

}

function searchYouTube(params, key) {
    return new Promise((res,rej) => {
        request(`https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=${encodeURIComponent(params)}&key=${key}`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "User-Agent": "djs-tools"
            }
        })
        .then(rCheck)
        .then(r => r.json())
        .then(json => {
            var array = json.items

            var chosen = []

            for (const el of array) {
                chosen.push(el.id.videoId)
            }

            res(chosen.slice(0,5))

        })
        .catch(rej)
    })

    function rCheck(r) {
        if (r.ok) {
            return r;
        } else {
            throw new Error(r.statusText)
        }
    }
}

module.exports = YouTubeClient