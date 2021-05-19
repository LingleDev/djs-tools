const fetch = require('node-fetch')
const { MessageEmbed } = require("discord.js")

class WebhookClient {
    constructor() {
        this.id = ""
        this.token = ""
    }

    /**
     * Initializes the WebhookClient
     * @param {Object} options
     * @param {String} options.id
     * @param {String} options.token 
     * @returns {Boolean}
     */
    init(options) {
        this.id = options.id
        this.token = options.token

        return true
    }

    /**
     * Sends a message on Discord via the WebhookClient
     * @param {Object|Array|String|MessageEmbed} message 
     * @returns {Promise<Response>}
     */
    send(message) {
        return new Promise((res, rej) => {

            var body = {
                content: "",
                embeds: [],
                tts: false
            }

            if (typeof message == "string") {
                body.content = message
            } else if (typeof message == 'object' && !(message instanceof MessageEmbed) && !(message instanceof Array)) {
                body = message
            } else if (message instanceof MessageEmbed) {
                console.log("embed")

                body.embeds.push(message.toJSON())
            } else if (message instanceof Array) {
                for (const msg of message) {
                    if (msg instanceof MessageEmbed) {
                        body.embeds.push(msg.toJSON())
                    } else if (typeof msg == "string") {
                        body.content = message.join(", ")
                    }
                }
            }

            console.log(body)

            fetch(`https://discord.com/api/webhooks/${this.id}/${this.token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "djs-tools",
                },

                body: JSON.stringify(body),
            })
                .then(requestCheck)
                .then(r => res(r))
                .catch(err => rej(err))
        })
    }
}

module.exports = WebhookClient

/**
 * 
 * @param {Response} res 
 */
function requestCheck(res) {
    if (res.ok) {
        return res;
    } else {
        throw new Error(res.statusText);
    }
}