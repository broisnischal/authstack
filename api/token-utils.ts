import {
  AccessToken,
  AccessTokenPayload,
  Cookies,
  IUser,
  RefreshToken,
  RefreshTokenPayload,
} from "@shared";
import jwt from "jsonwebtoken";
import config from "./config";
import { CookieOptions, Response } from "express";
import User from "./user.model";

enum TokenExpiration {
  Access = 1 * 60,
  Refresh = 5 * 60,
  RefreshIfLessThan = 3 * 60,
}
// 3 * 24 * 60 * 60,
export function buildTokens(user: IUser) {
  const accessPayload: AccessTokenPayload = { userId: user.id };
  const refreshPayload: RefreshTokenPayload = {
    userId: user.id,
    version: user.tokenVersion,
  };

  const accessToken = signAccessToken(accessPayload);
  const refreshToken = refreshPayload && signRefreshToken(refreshPayload);

  return { accessToken, refreshToken };
}

function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, config.ACCESS_SECRET, {
    expiresIn: TokenExpiration.Access,
  });
}

function signRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, config.REFRESH_SECRET, {
    expiresIn: TokenExpiration.Refresh,
  });
}

const isProduction = config.NODE_ENV === "production";

const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  domain: config.BASE_DOMAIN,
  path: "/",
};

const accessTokenCookieOptions: CookieOptions = {
  ...defaultCookieOptions,
  maxAge: TokenExpiration.Access * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...defaultCookieOptions,
  maxAge: TokenExpiration.Refresh * 1000,
};

export function setTokens(res: Response, access: string, refresh?: string) {
  if (refresh) {
    res.cookie(Cookies.RefreshToken, refresh, refreshTokenCookieOptions);
  }
  res.cookie(Cookies.AccessToken, access, accessTokenCookieOptions);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, config.REFRESH_SECRET) as RefreshToken;
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, config.ACCESS_SECRET) as AccessToken;
  } catch (error) {}
}

export function refreshTokens(current: RefreshToken, tokenVersion: number) {
  if (tokenVersion !== current.version) throw "Token revoked";

  const accessPayoad: AccessTokenPayload = {
    userId: current.userId,
  };
  const accessToken = signAccessToken(accessPayoad);

  let refreshPayload: RefreshTokenPayload | undefined;

  const expiration = new Date(current.exp * 1000);
  const now = new Date();

  const secondsUntilExpiration = (expiration.getTime() - now.getTime()) / 1000;

  if (secondsUntilExpiration < TokenExpiration.RefreshIfLessThan) {
    refreshPayload = {
      userId: current.userId,
      version: tokenVersion + 1,
    };
  }

  const refreshToken = refreshPayload && signRefreshToken(refreshPayload);

  return { accessToken, refreshToken };
}

export function clearTokens(res: Response) {
  res.clearCookie(Cookies.AccessToken);
  res.clearCookie(Cookies.RefreshToken);
}

export async function increaseTokenVersion(userId: string) {
  const user = await User.findOneAndUpdate(
    { id: userId },
    { $inc: { tokenVersion: 1 } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) throw new Error("No user, Token revoked and mismatched!");

  return user;
}
