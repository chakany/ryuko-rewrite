import express from "express";

const { supportInvite } = require("../../config.json");

import { manager, user } from "../index";

const router = express.Router();
router.get("/", async function (req, res, next) {
	try {
		res.render("index", {
			totalServers: (
				await manager.fetchClientValues("guilds.cache.size")
			).reduce((acc: any, guildCount) => acc + guildCount, 0),
			totalUsers: (
				await manager.fetchClientValues("users.cache.size")
			).reduce((acc: any, guildCount) => acc + guildCount, 0),
			avatar: user.avatarURL,
			username: user.username,
			support: supportInvite,
			invite: `https://discord.com/oauth2/authorize?client_id=${user.id}&permissions=8&scope=bot`,
		});
	} catch (error) {
		next(error);
	}
});

export default router;
