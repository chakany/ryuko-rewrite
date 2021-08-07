import { ShardingManager } from "discord.js";
import path from "path";
import config from "../../config.json";

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
	console.log(`Spawned Shard at ID ${shard.id}`);
});

manager.spawn();
