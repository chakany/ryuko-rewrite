import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";
import { get } from "reddit-grabber";

export default class BlowjobCommand extends Command {
	constructor() {
		super("blowjob", {
			name: "blowjob",
			description: "See Blowjob Pics",
			category: "nsfw",
			nsfw: true,
		});
	}

	async exec(interaction: CommandInteraction) {
		const request = await get("image", "blowjobs", true);

		return interaction.editReply({
			embeds: [
				this.embed(
					{
						title: "Blowjob",
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
