import Command from "../../struct/Command";
import {
	CommandInteraction,
	Permissions,
	TextChannel,
	OverwriteResolvable,
} from "discord.js";

export default class TicketCreateCommand extends Command {
	constructor() {
		super("ticketCreate", {
			name: "create",
			description: "Create a new Ticket",
			category: "ticket",
			clientPermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
		});
	}

	async exec(interaction: CommandInteraction) {
		if (
			!this.client.guildSettings.get(
				interaction.guild!.id,
				"tickets",
				false
			)
		)
			return interaction.editReply({
				embeds: [
					this.errorEmbed(
						interaction,
						"Invalid Configuration",
						`Ticketing is not setup! Please refer to the [Ticketing Wiki](${this.client.config.siteUrl}/wiki/Features/Ticketing) on instructions on how to set it up.`
					),
				],
			});

		let perms: OverwriteResolvable[] = [
			{
				id: interaction.guild!.roles.everyone,
				deny: [
					Permissions.FLAGS.VIEW_CHANNEL,
					Permissions.FLAGS.SEND_MESSAGES,
				],
			},
			{
				id: interaction.user.id,
				allow: [
					Permissions.FLAGS.VIEW_CHANNEL,
					Permissions.FLAGS.SEND_MESSAGES,
				],
			},
			{
				id: this.client.user!.id,
				allow: [
					Permissions.FLAGS.VIEW_CHANNEL,
					Permissions.FLAGS.SEND_MESSAGES,
				],
			},
		];

		const roleToAdd = this.client.guildSettings.get(
			interaction.guild!.id,
			"ticketRole",
			null
		);

		if (roleToAdd)
			perms.push({
				id: roleToAdd,
				allow: [
					Permissions.FLAGS.VIEW_CHANNEL,
					Permissions.FLAGS.SEND_MESSAGES,
				],
			});

		let channel: TextChannel | undefined;

		// Try catch assuming that we have all of the permissions, and that the error is related to the category.
		try {
			channel = await interaction.guild!.channels.create(
				`ticket-${interaction.user.username}`,
				{
					topic: `Opened on <t:${Math.round(
						new Date().getTime() / 1000
					)}:f> by ${interaction.member}`,
					reason: `${
						interaction.user.tag
					} opened a ticket on ${new Date().toString()}`,
					permissionOverwrites: perms,
					parent: this.client.guildSettings.get(
						interaction.guild!.id,
						"ticketCategory",
						undefined
					),
				}
			);
		} catch (error) {
			channel = await interaction.guild!.channels.create(
				`ticket-${interaction.user.username}`,
				{
					topic: `Opened on <t:${Math.round(
						new Date().getTime() / 1000
					)}:f> by ${interaction.member}`,
					reason: `${
						interaction.user.tag
					} opened a ticket on <t:${Math.round(
						new Date().getTime() / 1000
					)}:f>`,
					permissionOverwrites: perms,
				}
			);
		}

		await this.client.db.addTicket(
			interaction.guild!.id,
			interaction.user.id,
			channel!.id
		);

		channel!.send({
			embeds: [
				this.embed(
					{
						title: "Ticket Opened",
						description: `**The following commands can be used to manage this ticket:**\n\`/ticket close\` - Close the Ticket\n\`/ticket add <member>\` - Add a Member to the Ticket\n\`/ticket remove <member>\` - Remove a Member from the Ticket`,
						timestamp: new Date(),
						footer: {},
					},
					interaction.user,
					interaction.guild!
				),
			],
		});

		await interaction.editReply({
			content: `Ticket Opened!`,
		});

		await interaction.followUp({
			content: `You can access it in ${channel.toString()}`,
			ephemeral: true,
		});
	}
}
