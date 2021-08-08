import Command from "../../struct/Command";
import { CommandInteraction, version } from "discord.js";
import ms from "ms";

export default class StatsCommand extends Command {
	constructor() {
		super("stats", {
			name: "stats",
			description: "See bot statistics",
			category: "info",
		});
	}

	async exec(interaction: CommandInteraction) {
		interaction.editReply({
			embeds: [
				this.embed(
					{
						title: `${this.client!.user?.username}'s Stats`,
						thumbnail: {
							url: this.client!.user?.displayAvatarURL({
								dynamic: true,
							}),
						},
						fields: [
							{
								name: "Guilds",
								value: `\`${(
									await this.client!.shard!.fetchClientValues(
										"guilds.cache.size"
									)
								).reduce(
									(acc: any, guildCount) => acc + guildCount,
									0
								)}\``,
								inline: true,
							},
							{
								name: "Users",
								value: `\`${(
									await this.client!.shard!.fetchClientValues(
										"users.cache.size"
									)
								).reduce(
									(acc: any, guildCount) => acc + guildCount,
									0
								)}\``,
								inline: true,
							},
							{
								name: "Shards",
								value: `\`${this.client!.shard?.count}\``,
								inline: true,
							},
							{
								name: "Uptime",
								value: `${ms(this.client!.uptime!, {
									long: true,
								})}`,
								inline: true,
							},
							{
								name: "Version",
								value: `\`v${
									require("../../../package.json").version
								}\``,
								inline: true,
							},
							{
								name: "Handler Version",
								value: `\`v${
									require("../../../../handler/package.json")
										.version
								}\``,
								inline: true,
							},
							{
								name: "Discord.js Version",
								value: `\`v${version}\``,
								inline: true,
							},
							{
								name: "Node.js Version",
								value: `\`${process.version}\``,
								inline: true,
							},
						],
					},
					interaction.user,
					interaction.guild!
				),
			],
		});
	}
}
