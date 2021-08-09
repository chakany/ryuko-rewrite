import Command from "../../../struct/Command";
import { CommandInteraction, Permissions } from "discord.js";
import PaginateEmbed from "../../../struct/PaginateEmbed";

export default class FilterListCommand extends Command {
	constructor() {
		super("filterList", {
			name: "list",
			description: "List all Phrases in the Filter",
			category: "moderation",
			group: "filter",
			clientPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
			userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
		});
	}

	async exec(interaction: CommandInteraction) {
		const phrases = await this.client.db.getFilteredPhrases(
			interaction.guild!.id
		);

		const embed = new PaginateEmbed(interaction, this.client)
			.format((entry: any) => `\`${entry.phrase}\``)
			.setFieldName("Phrases")
			.setExpireTime(60000);

		embed
			.getEmbed()
			.setTitle(`${interaction.guild!.name}'s Filtered Phrases`)
			.setThumbnail(interaction.guild!.iconURL({ dynamic: true }) || "")
			.setFooter(
				`Expires in 1 minute | ${interaction.user.tag}`,
				interaction.user.displayAvatarURL({ dynamic: true })
			);

		embed.send(phrases, 6);
	}
}
