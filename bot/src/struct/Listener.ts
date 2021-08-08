import HandlerListener, {
	ListenerOptions,
} from "@ryuko/handler/src/struct/listener/Listener";
import { CommandInteraction, MessageEmbed } from "discord.js";

export default abstract class Listener extends HandlerListener {
	constructor(id: string, options: ListenerOptions) {
		super(id, options);
	}

	errorEmbed(
		interaction: CommandInteraction,
		type: string,
		description: string
	) {
		return new MessageEmbed({
			author: {
				name: `❌ Error: ${interaction.commandName}`,
			},
			title: type,
			description,
			timestamp: new Date(),
			color: interaction.guild!.me?.displayHexColor,
			footer: {
				text: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			},
		});
	}
}
