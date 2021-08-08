import { Sequelize, ModelCtor } from "sequelize";
const config = require("../../config.json");
import Logger from "../struct/Logger";

// Tables
import filteredPhrasesModel from "../models/filteredPhrases";
import guildsModel from "../models/guilds";
import membersModel from "../models/members";
import punishmentsModel from "../models/punishments";
import ticketsModel from "../models/tickets";
import transactionsModel from "../models/transactions";
import xpModel from "../models/xp";

export default class Db extends Sequelize {
	public filteredPhrases: ModelCtor<any>;
	public guilds: ModelCtor<any>;
	public members: ModelCtor<any>;
	public punishments: ModelCtor<any>;
	public tickets: ModelCtor<any>;
	public transactions: ModelCtor<any>;
	public xp: ModelCtor<any>;

	constructor() {
		const log = new Logger({
			name: "db",
		});
		super({
			dialect: "sqlite",
			storage: "./test.db",
			logging: (info) => log.debug(info),
		});

		this.filteredPhrases = filteredPhrasesModel(this);
		this.guilds = guildsModel(this, config);
		this.members = membersModel(this, config);
		this.punishments = punishmentsModel(this, config);
		this.tickets = ticketsModel(this, config);
		this.transactions = transactionsModel(this, config);
		this.xp = xpModel(this, config);
	}
}
