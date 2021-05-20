import { VoiceChannel, MessageEmbed, Client, VoiceConnection, StreamDispatcher } from "discord.js";
import { Response } from "node-fetch";
import { Readable } from "stream"

declare module "djs-tools" {
    class WebhookClient {
        public id: string;
        public token: string;

        send(options: object|string|MessageEmbed|Array<string|MessageEmbed>): Response;
        init(options: object): Boolean;
    }

    class MusicClient {
        public soundcloud: SoundCloudClient;
        public youtube: YouTubeClient;
        public guilds: Array<Guild>;
    
        getSong(source: string, search: boolean, params: string): Object;
        getMusicStream(url: string): Readable | Error;

        getMusicPlayer(guildId: string): MusicPlayer;
    }

    interface Guild {
        queue: Array<String>;
        paused: Boolean;
        nowplaying: String;
        playing: Boolean;

        getMusicPlayer(): MusicPlayer;
    }

    class MusicPlayer {
        constructor(client: Client);

        streamPlaying: Readable;
        urlPlaying: string;


        playMusic(voiceChannel: VoiceChannel, source: string, search: boolean, params: string|Readable, options: object): StreamDispatcher;
    }

    class YouTubeClient {
        constructor(client: Client);
        private client: Client;
        public key: string;

        init(key: string): Boolean;

        getStream(url: string): Promise<Readable>;
        search(params: string): Promise<Array<string>>;
    }

    class SoundCloudClient {
        constructor(client: Client);
        private client: Client;

        init(id: string): Boolean;

        getStream(url: string): Readable;
        search(params: string): string;
    }
}