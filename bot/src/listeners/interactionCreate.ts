import { Listener } from "@ryuko/handler";
import { Interaction } from "discord.js";

export default class InteractionCreateListener extends Listener {
	constructor() {
		super("interactionCreate", {
			emitter: "client",
			event: "interactionCreate",
		});
	}

	async exec(interaction: Interaction) {
		if (!interaction.isCommand()) return;
		if (!interaction.inGuild()) return;

		await interaction.deferReply();

		await interaction.editReply({
			content: `Hello! I am an in-development version of Ryuko! Built to replace the current version that runs Discord.js v12, everything is custom made, and uses slash commands!`,
		});
	}
}
