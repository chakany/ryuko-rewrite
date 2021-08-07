import { Intents } from "discord.js";
import { Client as HandlerClient, Handler } from "@ryuko/handler";
import path from "path";
import config from "../../../config.json";

export default class Client extends HandlerClient {
	public config: typeof config;

	constructor() {
		super({
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
		});

		this.config = config;

		try {
			const handler = new Handler(path.join(__dirname, "../modules"), {
				client: this,
			});

			handler.loadAll();

			console.log(handler.modules);
		} catch (error) {
			console.error(error);
		}
	}

	start() {
		super.login(config.token);
	}
}
