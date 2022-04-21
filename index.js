//  The TwitchJS library requires that these variables be named "token" and channel"
//  You can generate a token here: https://twitchapps.com/tmi/
let token = (SETTINGS && SETTINGS.TWITCH_DATA && SETTINGS.TWITCH_DATA.TOKEN) ? SETTINGS.TWITCH_DATA.TOKEN : null;
let username = (SETTINGS && SETTINGS.TWITCH_DATA && SETTINGS.TWITCH_DATA.USERNAME) ? SETTINGS.TWITCH_DATA.USERNAME : null
let channel = (SETTINGS && SETTINGS.TWITCH_DATA && SETTINGS.TWITCH_DATA.CHANNEL) ? SETTINGS.TWITCH_DATA.CHANNEL : null;

let LoadSiteContent = async () => {
	loadTopicDisplay();
	attemptAutoLogin();
};

let SITE_TOPIC_DISPLAY = null;

let loadTopicDisplay = () => {
	//  The SiteTopicDisplay Will show a background banner and text over it
	SITE_TOPIC_DISPLAY = new SiteTopicDisplay({});
	document.body.appendChild(SITE_TOPIC_DISPLAY.content);
};

let attemptAutoLogin = async () => {
	if (!token || !channel) { return; }

	let connectResult = await TwitchController.Connect(channel, token);
	if (!connectResult) { console.warn("Failed to connect with given channel name and oauth token. Please try again."); return; }

	//  Move to the next program state
	TwitchController.SendChatMessage(channel, connectResult ? "Twitch Topics connected successfully" : "Twitch Topics connection failure. Please reload.")
};