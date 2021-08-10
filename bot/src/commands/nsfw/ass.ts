import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";
import { get } from "reddit-grabber";

export default class AssCommand extends Command {
	constructor() {
		super("ass", {
			name: "ass",
			description: "See Ass",
			category: "nsfw",
			nsfw: true,
		});
	}

	async exec(interaction: CommandInteraction) {
		const request = await get("image", "ass", true);

		return interaction.editReply({
			embeds: [
				this.embed(
					{
						title: "ass",
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
