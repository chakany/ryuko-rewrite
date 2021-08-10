import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";
import { get } from "reddit-grabber";

export default class LesbianCommand extends Command {
	constructor() {
		super("lesbian", {
			name: "lesbian",
			description: "See Lesbians",
			category: "nsfw",
			nsfw: true,
		});
	}

	async exec(interaction: CommandInteraction) {
		const request = await get("image", "lesbians", true);

		return interaction.editReply({
			embeds: [
				this.embed(
					{
						title: "Lesbian",
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
