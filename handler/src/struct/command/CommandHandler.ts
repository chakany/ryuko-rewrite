import Handler, { HandlerOptions } from "../Handler";
import Command from "./Command";
import {
	CommandInteraction,
	ApplicationCommandData,
	Snowflake,
	TextChannel,
} from "discord.js";
import Constants from "../../Constants";

export interface CommandHandlerOptions extends HandlerOptions {
	owner?: Snowflake | Snowflake[];
}

export default class CommandHandler extends Handler {
	public owner: Snowflake | Snowflake[];

	constructor(
		dir: string,
		{
			client,
			extensions = [".ts", ".js"],
			classToHandle = Command,
			owner = [],
		}: CommandHandlerOptions
	) {
		super(dir, {
			client,
			extensions,
			classToHandle,
		});

		this.owner = owner;
	}

	public async handle(interaction: CommandInteraction) {
		// whyyyyyy
		let command: Command | undefined = undefined;

		if (this.modules.get(interaction.commandName)) {
			command = this.modules.get(interaction.commandName) as Command;
		} else if (this.modules.get(interaction.options.getSubcommand())) {
			command = this.modules.get(
				interaction.options.getSubcommand()
			) as Command;
		} else {
			command = this.modules.find(
				(command: any) =>
					command.categoryId == interaction.commandName &&
					command.group == interaction.options.getSubcommandGroup() &&
					command.name == interaction.options.getSubcommand()
			) as Command;
		}

		if (!command)
			return this.emit(
				Constants.commandHandler.events.invalidCommand,
				interaction
			);

		if (!(await this.runInhibitors(interaction, command))) return;

		this.emit(
			Constants.commandHandler.events.commandStarted,
			interaction,
			command
		);

		try {
			await command.exec(interaction);
		} catch (error) {
			this.emit(
				Constants.commandHandler.events.error,
				interaction,
				command,
				error
			);
		}

		this.emit(
			Constants.commandHandler.events.commandFinished,
			interaction,
			command
		);
	}

	private async runInhibitors(
		interaction: CommandInteraction,
		command: Command
	): Promise<boolean> {
		// Check Owner Permissions
		if (command.ownerOnly && !this.owner.includes(interaction.user.id)) {
			this.emit(
				Constants.commandHandler.events.owner,
				interaction,
				command
			);

			return false;
		}

		// Check Client Permissions
		if (command.clientPermissions.length) {
			const missing = (<TextChannel>interaction.channel!)
				.permissionsFor(interaction.guild!.me!)
				.missing(command.clientPermissions);

			if (missing.length) {
				this.emit(
					Constants.commandHandler.events.missingPermissions,
					interaction,
					command,
					"client",
					missing
				);
				return false;
			}
		}

		// Check User Permissions
		if (command.userPermissions.length) {
			const missing = (<TextChannel>interaction.channel!)
				.permissionsFor(interaction.user)!
				.missing(command.userPermissions);

			if (missing.length) {
				this.emit(
					Constants.commandHandler.events.missingPermissions,
					interaction,
					command,
					"user",
					missing
				);
				return false;
			}
		}

		return true;
	}

	public async registerSlashCommands() {
		const commands: ApplicationCommandData[] = [];

		for (const category of this.categories.values()) {
			let constructedCategory: ApplicationCommandData;
			if (category.id !== "default")
				constructedCategory = {
					name: category.id,
					description: category.description,
					options: [],
					defaultPermission: true,
				};

			for (const command of category.values() as IterableIterator<Command>) {
				// assume we in a subcommand or some goofy shit idk what i'm doing
				if (command.group) {
					if (
						!constructedCategory!.options!.find(
							(option) => option.name == command.group!
						)
					)
						constructedCategory!.options!.push({
							name: command.group,
							description: command.description,
							type: "SUB_COMMAND_GROUP",
							options: [
								{
									name: command.name,
									description: command.description,
									type: "SUB_COMMAND",
									options: command.options,
								},
							],
						});
					else {
						// There is an existing group
						constructedCategory!
							.options!.find(
								(option) => option.name == command.group!
							)!
							.options!.push({
								name: command.name,
								description: command.description,
								type: "SUB_COMMAND",
								options: command.options,
							});
					}
				} else if (command.categoryId == "default") {
					commands.push({
						name: command.name,
						description: command.description,
						options: command.options,
					});
				} else {
					constructedCategory!.options!.push({
						name: command.name,
						description: command.description,
						type: "SUB_COMMAND",
						options: command.options,
					});
				}
			}

			if (category.id !== "default") commands.push(constructedCategory!);
		}

		// Update to global when release
		process.env.NODE_ENV == "production"
			? this.client.application?.commands.set(commands)
			: await this.client.guilds.cache
					.get("867791409008607273")
					?.commands.set(commands);
	}
}
