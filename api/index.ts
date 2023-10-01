import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";
import { getGithubUser } from "./github-adapter";
import db from "./db";
import { v4 as uuidv4 } from "uuid";
import connectDatabase from "./db";
import User from "./user.model";
import {
  buildTokens,
  clearTokens,
  increaseTokenVersion,
  refreshTokens,
  setTokens,
  verifyRefreshToken,
} from "./token-utils";
import { Cookies } from "@shared";
import { authMiddleware } from "./auth.middleware";

const app = express();

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.send("API is working");
});

app.get("/github", async (req, res) => {
  try {
    const { code } = req.query;
    const githubUser = await getGithubUser(code as string);

    let user = await User.findOne({ githubUserId: githubUser.id });

    if (!user) {
      user = await User.create({
        id: uuidv4(),
        name: githubUser.name,
        githubUserId: githubUser.id.toString(),
      });
    }

    // build tokens
    const { accessToken, refreshToken } = buildTokens(user);

    // set tokens
    setTokens(res, accessToken, refreshToken);

    res.redirect(`${config.CLIENT_URL}/me`);
  } catch (error) {
    // biome-ignore lint/complexity/noUselessCatch: <explanation>
    throw error;
    // return res.send(error);
  }
});

app.post("/refresh", async (req, res) => {
  try {
    const current = verifyRefreshToken(req.cookies[Cookies.RefreshToken]);

    const user = await User.findOne({ id: current.userId });

    if (!user) throw "User not found";

    const { accessToken, refreshToken } = refreshTokens(
      current,
      user.tokenVersion
    );

    setTokens(res, accessToken, refreshToken);

    res.end();
  } catch (error) {
    clearTokens(res);
    return res.sendStatus(401);
  }
});

app.post("/logout", authMiddleware, async (req, res) => {
  await increaseTokenVersion(res.locals.token.userId);
  clearTokens(res);
  res.end();
});

app.post("/logoutall", authMiddleware, async (req, res) => {
  await increaseTokenVersion(res.locals.token.userId);
  clearTokens(res);
  res.end();
});

app.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findOne({ id: res.locals.token.userId });
  res.json(user);
});

async function main() {
  console.log(config.MONGO_URI);
  await connectDatabase()
    .then(() => {
      app.listen(3000, () => {
        console.log("Listening on port 3000");
      });
    })
    .catch((err) => {
      throw err;
    });
}

main();
