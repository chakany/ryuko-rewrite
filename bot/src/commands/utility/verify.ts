import Command from "../../struct/Command";
import {
	CommandInteraction,
	GuildMember,
	GuildMemberRoleManager,
	Message,
} from "discord.js";
import ms from "ms";
import moment from "moment";
import crypto from "crypto";
import myRedis from "../../util/Redis";

export default class VerifyCommand extends Command {
	constructor() {
		super("verify", {
			name: "verify",
			description: "Verify your Discord account",
		});
	}

	async exec(interaction: CommandInteraction) {
		const verifiedRole = this.client.guildSettings.get(
			interaction.guild!.id,
			"verifiedRole",
			null
		);

		if (
			!this.client.guildSettings.get(
				interaction.guild!.id,
				"verification",
				false
			) ||
			!verifiedRole
		)
			return interaction.editReply({
				embeds: [
					this.errorEmbed(
						interaction,
						"Invalid Configuration",
						`You must configure verification first! Use the "/configuration verificationn" command to set it up.`
					),
				],
			});
		else if (
			(<GuildMemberRoleManager>interaction.member!.roles).cache.get(
				verifiedRole
			)
		) {
			return interaction.editReply({
				embeds: [
					this.errorEmbed(
						interaction,
						"Invalid Member",
						"You have already been verified!"
					),
				],
			});
		}

		const level = this.client.guildSettings.get(
			interaction.guild!.id,
			"verificationLevel",
			"low"
		);

		const redis = new myRedis();

		const key = crypto.randomBytes(4).toString("hex");
		redis.addNewVerification(
			interaction.guild!.id,
			interaction.user.id,
			level,
			key
		);

		redis.subscribe(`verification-${key}`);

		let sentMessage: Message;
		try {
			sentMessage = await interaction.user.send({
				content: `The server **${
					interaction.guild!.name
				}** has Member Verification enabled.\nTo verify, please visit: ${
					this.client.config.siteUrl
				}/verify?state=${key}\n\nThis expires <t:${moment()
					.add(ms("10m"), "ms")
					.unix()}:R>`,
			});
			await interaction.editReply({
				content: "I have sent you a DM with instructuctions!",
			});
		} catch (error) {
			await redis.unsubscribe(`verification-${key}`);
			redis.removeVerification(key);
			return interaction.editReply({
				embeds: [
					this.errorEmbed(
						interaction,
						"Invalid Privacy Settings",
						"I cannot DM you! Check your privacy settings and try again"
					),
				],
			});
		}

		let completed = false;

		const miCallback = async (channel: any, recieved: any) => {
			if (channel !== `verification-${key}`) return;
			let call = JSON.parse(recieved);

			if (call.message == "verified") {
				sentMessage.edit(
					`Verified Successfully, Welcome to **${
						interaction.guild!.name
					}**!`
				);
				this.client.sendToLog(
					this.embed(
						{
							title: "Member Verified",
							thumbnail: {
								url: interaction.user.displayAvatarURL({
									dynamic: true,
								}),
							},
							footer: {},
							fields: [
								{
									name: "Member",
									value: interaction.member!.toString(),
								},
							],
						},
						interaction.user,
						interaction.guild!
					),
					interaction.guild!
				);
				(<GuildMemberRoleManager>interaction.member!.roles).add(
					// @ts-expect-error
					interaction.guild!.roles.cache.get(verifiedRole)
				);
			} else if (call.message == "alt") {
				switch (level) {
					case "strict":
						(<GuildMember>interaction.member)?.ban({
							reason: `Alternate Account of User <@!${call.originalAccount}>`,
						});
						sentMessage.edit({
							embeds: [
								this.embed(
									{
										title: "Banned from Guild",
										description: `Using alternate accounts in **${
											interaction.guild!.name
										}** is prohibited. If you believe this is an error, please contact the server owner.`,
									},
									interaction.user,
									interaction.guild!
								),
							],
						});
						this.client.sendToLog(
							this.embed(
								{
									title: "Member Verification Failed",
									description:
										"An alternate account was detected, they have been banned.",
									thumbnail: {
										url: interaction.user.displayAvatarURL({
											dynamic: true,
										}),
									},
									footer: {},
									fields: [
										{
											name: "Member",
											value: interaction.member!.toString(),
											inline: true,
										},
										{
											name: "Original Account",
											value: `<@${call.originalAccount}>`,
											inline: true,
										},
									],
								},
								interaction.user,
								interaction.guild!
							),
							interaction.guild!
						);
						break;
					case "medium":
						const userPunishments =
							await this.client.db.getCurrentUserPunishments(
								call.originalAccount
									? call.originalAccount
									: null,
								interaction.guild!.id
							);

						if (
							userPunishments[0]?.memberId ||
							(await interaction.guild!.bans.fetch()).has(
								call.originalAccount
							)
						) {
							(<GuildMember>interaction.member)?.ban({
								reason: `Alternate Account of User <@!${call.originalAccount}>`,
							});
							sentMessage.edit({
								embeds: [
									this.embed(
										{
											title: "Banned from Guild",
											description: `Evading punishments in **${
												interaction.guild!.name
											}** is prohibited. If you believe this is an error, please contact the server owner.`,
										},
										interaction.user,
										interaction.guild!
									),
								],
							});

							this.client.sendToLog(
								this.embed(
									{
										title: "Member Verification Failed",
										description:
											"An alternate account was detected, they have been banned.",
										thumbnail: {
											url: interaction.user.displayAvatarURL(
												{
													dynamic: true,
												}
											),
										},
										footer: {},
										fields: [
											{
												name: "Member",
												value: interaction.member!.toString(),
												inline: true,
											},
											{
												name: "Original Account",
												value: `<@${call.originalAccount}>`,
												inline: true,
											},
										],
									},
									interaction.user,
									interaction.guild!
								),
								interaction.guild!
							);
						} else {
							(<GuildMemberRoleManager>(
								interaction.member!.roles
							)).add(
								// @ts-expect-error
								interaction.guild!.roles.cache.get(verifiedRole)
							);
							sentMessage.edit({
								embeds: [
									this.embed(
										{
											title: "Verified Successfully",
											description: `Welcome to **${
												interaction.guild!.name
											}**! Enjoy your stay!`,
										},
										interaction.user,
										interaction.guild!
									),
								],
							});
							this.client.sendToLog(
								this.embed(
									{
										title: "Member Verified",
										thumbnail: {
											url: interaction.user.displayAvatarURL(
												{
													dynamic: true,
												}
											),
										},
										footer: {},
										fields: [
											{
												name: "Member",
												value: interaction.member!.toString(),
											},
										],
									},
									interaction.user,
									interaction.guild!
								),
								interaction.guild!
							);
						}
						break;
					case "low":
						(<GuildMemberRoleManager>interaction.member!.roles).add(
							// @ts-expect-error 2345
							message.guild!.roles.cache.get(verifiedRole)
						);
						sentMessage.edit({
							embeds: [
								this.embed(
									{
										title: "Verified Successfully",
										description: `Welcome to **${
											interaction.guild!.name
										}**! Enjoy your stay!`,
									},
									interaction.user,
									interaction.guild!
								),
							],
						});

						this.client.sendToLog(
							this.embed(
								{
									title: "Member Verified",
									thumbnail: {
										url: interaction.user.displayAvatarURL({
											dynamic: true,
										}),
									},
									footer: {},
									fields: [
										{
											name: "Member",
											value: interaction.member!.toString(),
										},
									],
								},
								interaction.user,
								interaction.guild!
							),
							interaction.guild!
						);
				}
			}
			completed = true;
			redis.removeListener("message", miCallback);
			return redis.unsubscribe(`verification-${key}`);
		};

		setTimeout(() => {
			redis.removeListener("message", miCallback);
			redis.unsubscribe(`verification-${key}`);
		}, 600000);

		return redis.on("message", miCallback);
	}
}
