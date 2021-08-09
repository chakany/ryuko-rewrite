import { Intents } from "discord.js";
import {
	Client as HandlerClient,
	ListenerHandler,
	CommandHandler,
} from "@ryuko/handler";
import path from "path";
const config = require("../../config.json");
import Listener from "./Listener";
import Command from "./Command";
import Db from "../util/Db";
import Settings from "./Settings";
import Logger from "./Logger";

declare module "@ryuko/handler" {
	interface Client {
		config: typeof config;
		db: Db;
		guildSettings: Settings;
		log: Logger;

		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
	}
}

export default class Client extends HandlerClient {
	public config: typeof config;
	public db: Db;
	public guildSettings: Settings;
	public log: Logger;

	public commandHandler: CommandHandler;
	public listenerHandler: ListenerHandler;

	constructor() {
		super({
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
		});

		this.config = config;
		this.db = new Db();
		this.guildSettings = new Settings(this.db.guilds);
		this.log = new Logger({
			name: "bot",
		});

		this.commandHandler = new CommandHandler(
			path.resolve(__dirname, "../commands"),
			{
				client: this,
				classToHandle: Command,
				owner: this.config.owner,
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

	async start() {
		this.log.info("Starting...");

		await this.guildSettings.init();

		super.login(config.token);
	}
}
