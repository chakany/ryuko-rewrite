import Listener from "../../struct/Listener";
import Command from "../../struct/Command";
import { CommandInteraction, PermissionString } from "discord.js";

export default class MissingPermissionsListener extends Listener {
	constructor() {
		super("missingPermissions", {
			emitter: "commandHandler",
			event: "missingPermissions",
		});
	}

	async exec(
		interaction: CommandInteraction,
		command: Command,
		type: "user" | "client",
		missing: PermissionString[]
	) {
		await interaction.editReply({
			embeds: [
				command.errorEmbed(
					interaction,
					"Invalid Permissions",
					type == "client"
						? `I am missing the ${
								missing.length > 1
									? "permissions"
									: "permission"
						  } ${missing.join(",")}`
						: `You are missing the ${
								missing.length > 1
									? "permissions"
									: "permission"
						  } ${missing.join(",")}`
				),
			],
		});
	}
}
