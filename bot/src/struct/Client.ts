import {
	Intents,
	MessageEmbed,
	Guild,
	TextChannel,
	Permissions,
	Snowflake,
	Collection,
	VoiceChannel,
} from "discord.js";
import {
	Client as HandlerClient,
	ListenerHandler,
	CommandHandler,
} from "@ryuko/handler";
import path from "path";
const config = require("../../config.json");
const emoji = require("../../emojis.json");
import Listener from "./Listener";
import Command from "./Command";
import Db from "../util/Db";
import Settings from "./Settings";
import Logger from "./Logger";

declare module "@ryuko/handler" {
	interface Client {
		config: typeof config;
		voiceLobbies: Collection<
			Snowflake,
			Collection<
				Snowflake,
				{
					channel: VoiceChannel;
					owner: Snowflake;
				}
			>
		>;
		db: Db;
		guildSettings: Settings;
		log: Logger;
		emoji: any;
		sendToLog(embed: MessageEmbed, guild: Guild): void;
		invite(): string;

		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
	}
}

export default class Client extends HandlerClient {
	public config: typeof config;
	public voiceLobbies: Collection<
		Snowflake,
		Collection<
			Snowflake,
			{
				channel: VoiceChannel;
				owner: Snowflake;
			}
		>
	>;
	public db: Db;
	public guildSettings: Settings;
	public log: Logger;
	public emoji: any;

	public commandHandler: CommandHandler;
	public listenerHandler: ListenerHandler;

	constructor() {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_VOICE_STATES,
			],
		});

		this.config = config;
		this.voiceLobbies = new Collection();
		this.db = new Db();
		this.guildSettings = new Settings(this.db.guilds);
		this.log = new Logger({
			name: "bot",
		});
		this.emoji = emoji;

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

	invite() {
		return this.generateInvite({
			permissions: Permissions.FLAGS.ADMINISTRATOR,
			scopes: ["bot", "applications.commands"],
		});
	}

	sendToLog(embed: MessageEmbed, guild: Guild): void {
		if (this.guildSettings.get(guild.id, "logging", false))
			(<TextChannel>(
				guild.channels.cache.get(
					this.guildSettings.get(guild.id, "loggingChannel", null)
				)
			))?.send({
				embeds: [embed],
			});
	}
}
