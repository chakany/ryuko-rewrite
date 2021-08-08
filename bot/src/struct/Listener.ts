import HandlerListener, {
	ListenerOptions,
} from "@ryuko/handler/src/struct/listener/Listener";
import {
	CommandInteraction,
	MessageEmbedOptions,
	User,
	Guild,
} from "discord.js";
import Embed from "./Embed";

export default abstract class Listener extends HandlerListener {
	constructor(id: string, options: ListenerOptions) {
		super(id, options);
	}

	errorEmbed(
		interaction: CommandInteraction,
		type: string,
		description: string
	) {
		return this.embed(
			{
				author: {
					name: `❌ Error: ${interaction.commandName}`,
				},
				title: type,
				description,
			},
			interaction.user,
			interaction.guild!
		);
	}

	embed(options: MessageEmbedOptions, user: User, guild: Guild) {
		return new Embed(options, user, guild);
	}
}
