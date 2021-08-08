import { Collection, Snowflake } from "discord.js";
import { ModelCtor } from "sequelize";

export default class Settings {
	private table: ModelCtor<any>;
	private items: Collection<any, any>;
	private idCol: string;

	constructor(table: ModelCtor<any>, idCol = "id") {
		this.table = table;
		this.items = new Collection();
		this.idCol = idCol;
	}

	public async init() {
		const rows = await this.table.findAll();
		for (const row of rows) {
			this.items.set(row[this.idCol], row);
		}
	}

	public get(id: Snowflake, key: string, defaultValue: any) {
		if (this.items.has(id)) {
			const value = this.items.get(id)[key];
			return value == null ? defaultValue : value;
		}

		return defaultValue;
	}

	public set(id: Snowflake, key: string, value: any) {
		const data = this.items.get(id) || {};
		data[key] = value;
		this.items.set(id, data);

		return this.table.upsert({
			[this.idCol]: id,
			[key]: value,
		});
	}

	public delete(id: Snowflake, key: string) {
		const data = this.items.get(id) || {};
		delete data[key];

		return this.table.upsert({
			[this.idCol]: id,
			[key]: null,
		});
	}

	public clear(id: Snowflake) {
		this.items.delete(id);
		return this.table.destroy({ where: { [this.idCol]: id } });
	}
}
