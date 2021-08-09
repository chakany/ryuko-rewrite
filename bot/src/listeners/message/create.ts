import Listener from "../../struct/Listener";
import { Message, MessageEmbed } from "discord.js";

export default class MessageCreateListener extends Listener {
	constructor() {
		super("messageCreate", {
			emitter: "client",
			event: "messageCreate",
		});
	}

	async exec(message: Message) {
		if (message.channel.type == "DM") return;

		// Put content through filter
		if (this.client.guildSettings.get(message.guild!.id, "filter", false)) {
			const filteredPhrases = await this.client.db.getFilteredPhrases(
				message.guild!.id
			);

			const phrases = filteredPhrases.map((col: any) => col.phrase);

			if (phrases.length) {
				const regex = new RegExp(
					`^(.*?(${phrases.join("|")})[^$]*)$`,
					"gim"
				);

				if (regex.test(message.content)) {
					message.delete();
					message.author.send(
						`Please do not use filtered words in **${
							message.guild!.name
						}**!`
					);
				}
			}
		}

		if (
			!message.content.startsWith(
				this.client!.guildSettings.get(
					message.guild!.id,
					"prefix",
					this.client!.config.prefix
				)
			)
		)
			return;

		message.reply({
			embeds: [
				new MessageEmbed({
					author: {
						name: "❌ Error",
					},
					title: "Invalid Usage",
					description:
						"All commands are now invoked with Discord's built in slash commands.",
					color: message.guild!.me?.displayHexColor,
					footer: {
						text: message.author.tag,
						iconURL: message.author.displayAvatarURL({
							dynamic: true,
						}),
					},
				}),
			],
		});
	}
}
