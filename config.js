var config = {
    // You'll need to find your own SteamID64 URL using https://steamrep.com
    // Note: This also allows custom URLs like https://steamcommunity.com/id/crementif but they require providing a valid web key.
    steam_profile_url: "https://steamcommunity.com/profiles/76561198034348102",

    // ONLY needs to be replaced if you use a custom URL in the steamProfileURL variable above. There's no real benefit!
    // You can get one from https://steamcommunity.com/dev/apikey. Use localhost as the domain name.
    steam_web_key: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",

    // Poll Steam Rich Presence every n seconds. You should keep this at or above 20 seconds.
    poll_rate: 20*1000,

    //This is the default client ID of SteamRPC. You don't usually have to change this.
    default_client_id: "433731243516100629"
};

export default config;