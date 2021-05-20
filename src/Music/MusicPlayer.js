const { Client, VoiceChannel, VoiceConnection, StreamDispatcher } = require("discord.js");

const YouTube = require('./YouTube')
const SoundCloud = require('./SoundCloud')

const ReadableStream = require('stream').Readable;
const { Response } = require("node-fetch");
const fetch = require('node-fetch')

/**
 * Handles music playing in djs-tools
 */
class MusicPlayer {
    /**
     * 
     * @param {Client} client A Discord.js Client
     * @param {Object} options An object containing API keys for YouTube and SoundCloud
     * @param {String} options.clientId SoundCloud Client ID
     * @param {String} options.apiKey YouTube API Key
     */
    constructor(client, options) {
        client.music = this

        /**
         * @type {Client}
         * @private
         */
        this.client = client

        this.streamPlaying;
        this.urlPlaying;

        this.youtube = new YouTube(client)
        this.soundcloud = new SoundCloud(client)

        this.youtube.init(options.apiKey)
        this.soundcloud.init(options.clientId)
    }

    /**
     * Plays music on a given Discord.js VoiceConnection.
     * @param {VoiceConnection} voiceConnection A Discord.js VoiceConnection
     * @param {String} source Which source to pull from - defaults to YouTube - Can be one of three strings: 'youtube', 'soundcloud', or 'other'. 'other' can only be a link to an mp3 file or an MPEG stream.
     * @param {Boolean} search Boolean indicating whether or not to search with the params
     * @param {String|ReadableStream} params Params to search for or a ReadableStream of audio data
     * @param {Object} options Options to pass to the Discord.js VoiceConnection.play function
     * @param {Number} options.bitrate Bitrate of played audio - defaults to 128kbps
     * @param {String} options.type Encoding of audio played - defaults to 'unknown' for universal compatibility
     * @returns {Promise<StreamDispatcher>} The Discord.js StreamDispatcher audio is playing on
    */
    playMusic(voiceConnection, source="youtube", search=true, params, options={bitrate: 128000, type: "unknown"}) {
        return new Promise((res,rej) => {
            if (search) {
                if (source == "youtube") {
                    this.youtube.search(params)
                    .then(results => {
                        var result = results[0]
                        
                        this.youtube.getStream(`https://youtube.com/watch?v=${result}`)
                        .then(stream => {
                            var dispatcher = voiceConnection.play(stream, options)

                            return res(dispatcher)
                        })
                        .catch(rej)
                    })
                    .catch(rej)
                } else if (source == "soundcloud") {
                    this.soundcloud.search(params)
                    .then(results => {
                        var result = results[0]

                        this.soundcloud.getStream(result.url)
                        .then(stream => {
                            var dispatcher = voiceConnection.play(stream, options)

                            return res(dispatcher)
                        })
                    })
                } else if (source == "other") {
                    if (params.endsWith('.mp3')) { // .mp3 file
                        var dispatcher = voiceConnection.play(params, options)

                        return res(dispatcher)
                    }

                    getContentType(params)
                    .then(type => {
                        if (type !== "audio/mpeg") return rej(new Error(`${params} does not lead to an mpeg stream.`))

                        var dispatcher = voiceConnection.play(params, options)

                        return res(dispatcher)
                    })
                    .catch(rej)
                }
            }
        })
    }
}

function getContentType(url) {
    return new Promise((res,rej) => {
        fetch(url)
        .then(r => res(r.headers.get('content-type')))
        .catch(rej)
    })
}

module.exports = MusicPlayer