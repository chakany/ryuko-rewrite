import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";
import { get } from "reddit-grabber";

export default class AnalCommand extends Command {
	constructor() {
		super("anal", {
			name: "anal",
			description: "See Anal",
			category: "nsfw",
			nsfw: true,
		});
	}

	async exec(interaction: CommandInteraction) {
		const request = await get("image", "analporn", true);

		return interaction.editReply({
			embeds: [
				this.embed(
					{
						title: "Anal",
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
