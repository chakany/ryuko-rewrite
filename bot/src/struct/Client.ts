import { Intents } from "discord.js";
import { Client as HandlerClient, ListenerHandler } from "@ryuko/handler";
import path from "path";
import config from "../../../config.json";

export default class Client extends HandlerClient {
	public config: typeof config;

	public listenerHandler: ListenerHandler;

	constructor() {
		super({
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
		});

		this.config = config;

		this.listenerHandler = new ListenerHandler(
			path.resolve(__dirname, "../listeners"),
			{
				client: this,
			}
		);

		this.listenerHandler.loadAll();
	}

	start() {
		super.login(config.token);
	}
}
