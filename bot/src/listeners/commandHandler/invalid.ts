import Listener from "../../struct/Listener";
import { CommandInteraction } from "discord.js";

export default class InvalidCommandListener extends Listener {
	constructor() {
		super("invalidCommand", {
			emitter: "commandHandler",
			event: "invalidCommand",
		});
	}

	async exec(interaction: CommandInteraction) {
		await interaction.editReply({
			embeds: [
				this.errorEmbed(
					interaction,
					"Invalid Command",
					`The Command you are trying to run no longer exists.`
				),
			],
		});
	}
}
