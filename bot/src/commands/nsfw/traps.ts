import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";
import { get } from "reddit-grabber";

export default class TrapCommand extends Command {
	constructor() {
		super("traps", {
			name: "traps",
			description: "See Traps",
			category: "nsfw",
			nsfw: true,
		});
	}

	async exec(interaction: CommandInteraction) {
		const request = await get("image", "traps", true);

		return interaction.editReply({
			embeds: [
				this.embed(
					{
						title: "Trap",
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
