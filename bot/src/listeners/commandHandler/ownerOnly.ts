import Listener from "../../struct/Listener";
import Command from "../../struct/Command";
import { CommandInteraction } from "discord.js";

export default class OwnerOnlyListener extends Listener {
	constructor() {
		super("ownerOnly", {
			emitter: "commandHandler",
			event: "ownerOnly",
		});
	}

	async exec(interaction: CommandInteraction, command: Command) {
		await interaction.editReply({
			embeds: [
				command.errorEmbed(
					interaction,
					"Invalid Permissions",
					"You must be jacany#0001 to run this command!"
				),
			],
		});
	}
}
