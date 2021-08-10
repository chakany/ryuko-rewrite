import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";
import { get } from "reddit-grabber";

export default class ThighsCommand extends Command {
	constructor() {
		super("thighs", {
			name: "thighs",
			description: "See Lesbians",
			category: "nsfw",
			nsfw: true,
		});
	}

	async exec(interaction: CommandInteraction) {
		const request = await get("image", "thighs", true);

		return interaction.editReply({
			embeds: [
				this.embed(
					{
						title: "Thighs",
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
