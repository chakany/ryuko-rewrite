import { Intents } from "discord.js";
import {
	Client as HandlerClient,
	ListenerHandler,
	CommandHandler,
} from "@ryuko/handler";
import path from "path";
import config from "../../../config.json";
import Listener from "./Listener";
import Command from "./Command";

declare module "@ryuko/handler" {
	interface Client {
		config: typeof config;
		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
	}
}

export default class Client extends HandlerClient {
	public config: typeof config;

	public commandHandler: CommandHandler;
	public listenerHandler: ListenerHandler;

	constructor() {
		super({
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
		});

		this.config = config;

		this.commandHandler = new CommandHandler(
			path.resolve(__dirname, "../commands"),
			{
				client: this,
				classToHandle: Command,
			}
		);

		this.listenerHandler = new ListenerHandler(
			path.resolve(__dirname, "../listeners"),
			{
				client: this,
				classToHandle: Listener,
			}
		);

		this.listenerHandler.attach("commandHandler", this.commandHandler);

		this.commandHandler.loadAll();
		this.listenerHandler.loadAll();
	}

	start() {
		super.login(config.token);
	}
}
