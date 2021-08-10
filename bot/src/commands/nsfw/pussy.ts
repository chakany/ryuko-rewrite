import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";
import { get } from "reddit-grabber";

export default class PussyCommand extends Command {
	constructor() {
		super("pussy", {
			name: "pussy",
			description: "See Pussy",
			category: "nsfw",
			nsfw: true,
		});
	}

	async exec(interaction: CommandInteraction) {
		const request = await get("image", "pussy", true);

		return interaction.editReply({
			embeds: [
				this.embed(
					{
						title: "Pussy",
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
