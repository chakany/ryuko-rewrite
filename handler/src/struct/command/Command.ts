import Module, { ModuleOptions } from "../Module";
import {
	Interaction,
	ApplicationCommandOptionData,
	PermissionFlags,
} from "discord.js";

export interface CommandOptions extends ModuleOptions {
	name: string;
	description?: string;
	group?: string | undefined;
	options?: ApplicationCommandOptionData[];
	ownerOnly?: boolean;
	nsfw?: boolean;
	clientPermissions?: bigint[];
	userPermissions?: bigint[];
	ephemeral?: boolean;
}

export default abstract class Command extends Module {
	public name: string;
	public description: string;
	public group: string | undefined;
	public options: ApplicationCommandOptionData[];
	public ownerOnly: boolean;
	public nsfw: boolean;
	public clientPermissions: bigint[];
	public userPermissions: bigint[];
	public ephemeral: boolean;

	constructor(
		id: string,
		{
			name,
			description = "",
			category = "default",
			group = undefined,
			options = [],
			ownerOnly = false,
			clientPermissions = [],
			userPermissions = [],
			nsfw = false,
			ephemeral = false,
		}: CommandOptions
	) {
		super(id, {
			category,
		});

		this.name = name;
		this.description = description;
		this.group = group;
		this.options = options;
		this.ownerOnly = ownerOnly;
		this.clientPermissions = clientPermissions;
		this.userPermissions = userPermissions;
		this.nsfw = nsfw;
		this.ephemeral = ephemeral;
	}

	abstract exec(interaction: Interaction): any | Promise<any>;
}
