import HandlerCommand, {
	CommandOptions,
} from "@ryuko/handler/src/struct/command/Command";
import {
	CommandInteraction,
	MessageEmbed,
	MessageEmbedOptions,
	User,
	Guild,
} from "discord.js";
import Embed from "./Embed";

export default abstract class Listener extends HandlerCommand {
	constructor(id: string, options: CommandOptions) {
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
