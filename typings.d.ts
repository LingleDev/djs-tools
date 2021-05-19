import { VoiceChannel, MessageEmbed, Client } from "discord.js";
import { Response } from "node-fetch";

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
        getMusicStream(url: string): ReadableStream | Error;

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

        streamPlaying: ReadableStream;
        urlPlaying: string;


        playMusic(voiceChannel: VoiceChannel, search: boolean, params: string|ReadableStream, options: object): VoiceChannel;
    }

    class YouTubeClient {
        constructor(client: Client);

        init(options: { key: string }): Boolean;

        getStream(url: string): ReadableStream;
        search(params: string): string;
    }

    class SoundCloudClient {
        constructor(client: Client);

        init(options: { id: string }): Boolean;

        getStream(url: string): ReadableStream;
        search(params: string): string;
    }
}