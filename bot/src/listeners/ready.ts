import Listener from "../struct/Listener";
import { ActivityType } from "discord.js";

export default class ReadyListener extends Listener {
	constructor() {
		super("ready", {
			emitter: "client",
			event: "ready",
		});
	}

	async exec() {
		const guilds = await this.client.shard!.fetchClientValues(
			"guilds.cache.size"
		);

		const totalGuilds = guilds.reduce(
			(acc: any, guildCount) => acc + guildCount,
			0
		);

		// Set Discord Status
		const statuses =
			process.env.NODE_ENV !== "production"
				? [
						{
							type: "PLAYING",
							text: `Visual Studio Code`,
						},
				  ]
				: [
						{
							type: "PLAYING",
							text: `${this.client.config.siteUrl}`,
						},
						{
							type: "PLAYING",
							text: `with slash commands`,
						},
				  ];
		let i = 0;
		setInterval(() => {
			if (i + 1 == statuses.length) i = 0;
			else i++;

			this.client.user!.setActivity(statuses[i].text, {
				type: <ActivityType>statuses[i].type,
			});
		}, 15000);

		this.client?.log.info(`[READY] Logged In; Activity Set`);
		this.client!.commandHandler.registerSlashCommands();
	}
}
