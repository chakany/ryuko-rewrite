import Listener from "../struct/Listener";
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

		this.client!.commandHandler.handle(interaction);
	}
}
