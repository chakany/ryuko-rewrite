import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";
import { get } from "reddit-grabber";

export default class BoobsCommand extends Command {
	constructor() {
		super("boobs", {
			name: "boobs",
			description: "See Boobs",
			category: "nsfw",
			nsfw: true,
		});
	}

	async exec(interaction: CommandInteraction) {
		const request = await get("image", "boobs", true);

		return interaction.editReply({
			embeds: [
				this.embed(
					{
						title: "Boobs",
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
