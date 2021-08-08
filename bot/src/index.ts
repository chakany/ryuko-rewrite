import { ShardingManager } from "discord.js";
import path from "path";
const config = require("../config.json");
import Db from "./util/Db";
import Logger from "./struct/Logger";

const log = new Logger({
	name: "manager",
});

const db = new Db();

db.sync({ alter: true });

const manager = new ShardingManager(
	process.env.NODE_ENV == "production"
		? path.join(__dirname, "bot.js")
		: path.join(__dirname, "bot.ts"),
	{
		execArgv: ["-r", "ts-node/register"],
		token: config.token,
	}
);

manager.on("shardCreate", (shard) => {
	log.info(`Spawned shard ${shard.id}`);
});

manager.spawn();
