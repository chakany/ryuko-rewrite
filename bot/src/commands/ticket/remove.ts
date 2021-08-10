import Command from "../../struct/Command";
import {
	CommandInteraction,
	Permissions,
	TextChannel,
	GuildMemberRoleManager,
} from "discord.js";

export default class TicketRemoveCommand extends Command {
	constructor() {
		super("ticketRemove", {
			name: "remove",
			description: "Remove a member from a Ticket",
			category: "ticket",
			options: [
				{
					name: "member",
					type: "USER",
					required: true,
					description: "Member to add to the Ticket",
				},
			],
			clientPermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
		});
	}

	async exec(interaction: CommandInteraction) {
		const member = interaction.options.getUser("member")!;

		const ticketResult = await this.client.db.findTicket(
			interaction.guild!.id,
			interaction.channel!.id
		);

		if (!ticketResult)
			return interaction.editReply({
				embeds: [
					this.errorEmbed(
						interaction,
						"Invalid Channel",
						"This is not a ticket channel!"
					),
				],
			});

		const ticketRole = this.client.guildSettings.get(
			interaction.guild!.id,
			"ticketRole",
			null
		);

		if (
			(ticketRole &&
				(<GuildMemberRoleManager>interaction.member!.roles).cache.find(
					(role) => role.id == ticketRole
				)) ||
			(<Readonly<Permissions>>interaction.member!.permissions).has(
				Permissions.FLAGS.MANAGE_CHANNELS
			)
		) {
			// for some reason updateOverwrite didn't exist unless i casted...
			(<TextChannel>interaction.channel).permissionOverwrites.delete(
				member.id
			);

			return interaction.editReply({
				embeds: [
					this.embed(
						{
							title: `${this.client.emoji.greenCheck} Removed Member`,
							fields: [
								{
									name: "Member",
									value: member.toString(),
									inline: true,
								},
								{
									name: "Removed by",
									value: interaction.member!.toString(),
									inline: true,
								},
							],
						},
						interaction.user,
						interaction.guild!
					),
				],
			});
		} else
			return interaction.editReply({
				embeds: [
					this.errorEmbed(
						interaction,
						"Invalid Permissions",
						`Only Channel Managers${
							ticketRole
								? `, and members with the <@&${ticketRole}> role`
								: ""
						} can run this command!`
					),
				],
			});
	}
}
