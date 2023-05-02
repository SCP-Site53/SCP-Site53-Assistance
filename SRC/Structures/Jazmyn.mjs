export class Jazmyn {
    /**
     * Only for a post directly to the Discord API.
     * @since v2023.3.20
     */
    static DiscordAPIPost = 'discord_api_post';
    /**
     * For all discord.js events except `ClientReady`.
     * @since v2023.3.20
     */
    static DiscordJSEvent = 'discord_js_event'
    /**
     * @deprecated Use `Jazmyn.DiscordJSEvent`.
     * @since v2023.3.20
     */
    static DiscordJSInteraction = 'discord_js_event';
    /**
     * Only for discord.js's `ClientReady` event.
     * @since v2023.3.20
     */
    static DiscordJSClient = 'discord_js_client';
};