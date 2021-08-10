import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";
import { get } from "reddit-grabber";

export default class CumslutCommand extends Command {
	constructor() {
		super("cumslut", {
			name: "cumslut",
			description: "See Cumsluts",
			category: "nsfw",
			nsfw: true,
		});
	}

	async exec(interaction: CommandInteraction) {
		const request = await get("image", "cumsluts", true);

		return interaction.editReply({
			embeds: [
				this.embed(
					{
						title: "Cumslut",
						image: {
							url: request.media,
						},
					},
					interaction.user,
					interaction.guild!
				),
			],
		});
	}
}
