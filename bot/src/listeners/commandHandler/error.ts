import Listener from "../../struct/Listener";
import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";

export default class CommandErrorListener extends Listener {
	constructor() {
		super("commandError", {
			emitter: "commandHandler",
			event: "error",
		});
	}

	async exec(interaction: CommandInteraction, command: Command, error: any) {
		await interaction.editReply({
			embeds: [
				command.errorEmbed(
					interaction,
					"An Error Occurred",
					error.message
				),
			],
		});
	}
}
