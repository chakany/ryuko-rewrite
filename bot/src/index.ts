import { ShardingManager, User } from "discord.js";
import path from "path";
const config = require("../config.json");
import Db from "./util/Db";
import Logger from "./struct/Logger";
import express from "express";
import Redis from "./util/Redis";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// Web Routes
import homeRoute from "./routes/home";
import wikiRoute from "./routes/wiki";
import verifyRoute from "./routes/verify";
const log = new Logger({
	name: "manager",
});

const db = new Db();

db.sync({ alter: true });

const redis = new Redis();

const manager = new ShardingManager(
	process.env.NODE_ENV == "production"
		? path.join(__dirname, "bot.js")
		: path.join(__dirname, "bot.ts"),
	{
		execArgv: ["-r", "ts-node/register"],
		token: config.token,
	}
);

const webserver = express();

const weblog = new Logger({
	name: "webserver",
});

let user: User;

manager.on("shardCreate", (shard) => {
	log.info(`Spawned shard ${shard.id}`);

	if (shard.id !== 0) return;

	shard.on("ready", async () => {
		webserver.set("view engine", "ejs");
		webserver.set("views", path.resolve(__dirname, "../app/pages"));
		webserver.use(bodyParser.urlencoded({ extended: true }));
		webserver.use(bodyParser.json());
		webserver.use(cookieParser());
		user = (await shard.fetchClientValue("user")) as User;
		webserver.use(express.json());
		webserver.use(
			"/static",
			express.static(path.resolve(__dirname, "../app/static"))
		);

		webserver.use("/", homeRoute);
		webserver.use("/wiki", wikiRoute);
		webserver.use("/verify", verifyRoute);

		// This should always be last
		webserver.get("*", function (req, res) {
			res.status(404).render("error", {
				username: user.username,
				avatar: user.avatarURL,
				code: 404,
				description: "Page Not Found",
			});
		});

		webserver.listen(config.port, () => {
			weblog.info(`Listening on Port ${config.port}`);
		});
	});
});

manager.spawn();

export { manager, weblog, user, redis };
