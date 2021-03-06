const downloader = require('soundcloud-downloader').default
const ReadableStream = require("stream").Readable

/**
 * A class used to carry out SoundCloud-based functions
 */
class SoundCloudClient {
    constructor(client) {
        /**
         * @private
         */
        this.client = client

        this.id = null
    }
    
    /**
     * Initializes the SoundCloudClient
     * @param {String} id Your SoundCloud Client ID; Info on how to get that here: https://www.npmjs.com/package/soundcloud-downloader#client-id
     * @returns {Boolean} Returns true if the client initializes successfully
     */
    init(id) {
        this.id = id;

        downloader.setClientID(id)

        return true;
    }

    /**
     * Gets a ReadableStream from a SoundCloud URL.
     * @param {String} url A SoundCloud song URL
     * @returns {Promise<ReadableStream>}
     */
    getStream(url) {
        return new Promise((res,rej) => {
            downloader.download(url)
            .then(res)
            .catch(rej)
        })
    }
    
    /**
     * Searches the SoundCloud API with given parameters
     * @param {String} params Terms you want to search the API for
     * @returns {Promise<Array<Object>>}
     */
    search(params) {
        return new Promise((res,rej) => {
            downloader.search({
                resourceType: "tracks",
                query: params,
                limit: 10
            })
            .then(s => {
                if (s.collection.length >= 1) {
                    var array = []

                    for (const entry of s.collection) {
                        array.push({
                            url: entry.uri,
                            name: entry.title,
                            id: entry.id,
                            artist: entry.user,
                            description: entry.description
                        })
                    }

                    res(array)
                } else {
                    res(null)
                }
            })
            .catch(rej)
        })
    }
}

module.exports = SoundCloudClient