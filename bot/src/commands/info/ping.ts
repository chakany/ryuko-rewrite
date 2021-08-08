import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";

export default class PingCommand extends Command {
	constructor() {
		super("ping", {
			name: "ping",
			description: "Check bot latency",
			category: "info",
		});
	}

	async exec(interaction: CommandInteraction) {
		interaction.editReply({
			embeds: [
				this.embed(
					{
						title: "Pong!",
						thumbnail: {
							url: "https://media.giphy.com/media/fvA1ieS8rEV8Y/giphy.gif",
						},
						fields: [
							{
								name: "API Latency",
								value:
									"`" +
									`${Math.round(this.client!.ws.ping)}ms` +
									"`",
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
