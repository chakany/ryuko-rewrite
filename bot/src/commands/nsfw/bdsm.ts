import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";
import { get } from "reddit-grabber";

export default class BDSMCommand extends Command {
	constructor() {
		super("bdsm", {
			name: "bdsm",
			description: "See BDSM Pics",
			category: "nsfw",
			nsfw: true,
		});
	}

	async exec(interaction: CommandInteraction) {
		const request = await get("image", "bdsm", true);

		return interaction.editReply({
			embeds: [
				this.embed(
					{
						title: "BDSM",
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
