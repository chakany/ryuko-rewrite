import Handler, { HandlerOptions } from "../Handler";
import Command from "./Command";
import {
	CommandInteraction,
	ApplicationCommandData,
	ApplicationCommandOptionData,
} from "discord.js";
import Constants from "../../Constants";

export interface CommandHandlerOptions extends HandlerOptions {}

export default class CommandHandler extends Handler {
	constructor(
		dir: string,
		{
			client,
			extensions = [".ts", ".js"],
			classToHandle = Command,
		}: CommandHandlerOptions
	) {
		super(dir, {
			client,
			extensions,
			classToHandle,
		});
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
		}

		if (!command)
			return this.emit(
				Constants.commandHandler.events.invalidCommand,
				interaction
			);

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

	public async registerSlashCommands() {
		const commands: ApplicationCommandData[] = [];

		for (const category of this.categories.values()) {
			let constructedCategory: ApplicationCommandData = {
				name: category.id,
				description: category.description,
				options: [],
				defaultPermission: true,
			};

			for (const command of category.values() as IterableIterator<Command>) {
				// assume we in a subcommand or some goofy shit idk what i'm doing
				if (command.group) {
					if (
						!constructedCategory.options!.find(
							(option) => option.name == command.group!
						)
					)
						constructedCategory.options!.push({
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
						constructedCategory
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
				} else if (!command.category) {
					commands.push({
						name: command.name,
						description: command.description,
						options: command.options,
					});
				} else {
					constructedCategory.options!.push({
						name: command.name,
						description: command.description,
						type: "SUB_COMMAND",
						options: command.options,
					});
				}
			}

			commands.push(constructedCategory);
		}

		// Update to global when release
		await this.client.guilds.cache
			.get("867791409008607273")
			?.commands.set(commands);
	}
}
