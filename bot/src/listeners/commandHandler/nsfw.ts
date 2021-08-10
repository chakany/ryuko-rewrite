import Listener from "../../struct/Listener";
import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";

export default class CommandNSFWListener extends Listener {
	constructor() {
		super("commandNSFW", {
			emitter: "commandHandler",
			event: "nsfw",
		});
	}

	async exec(interaction: CommandInteraction, command: Command) {
		await interaction.editReply({
			embeds: [
				command.errorEmbed(
					interaction,
					"Invalid Channel",
					"This command is only usable in NSFW Channels!"
				),
			],
		});
	}
}
