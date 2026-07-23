import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { env } from "../lib/env";
import { HttpError } from "../middlewares/error.middleware";

const SALT_ROUNDS = 10;

function signTokens(userId: string, email: string){
  const accessToken = jwt.sign({ sub: userId, email}, env.jwt.accessSecret,{
    expiresIn: env.jwt.accessExpiresIn as jwt.SignOptions["expiresIn"],
  });
  const refreshToken = jwt.sign({ sub: userId}, env.jwt.refreshSecret,{
    expiresIn: env.jwt.refreshExpiresIn as jwt.SignOptions["expiresIn"],
  });
  return { accessToken, refreshToken };
}

export async function register(email: string, password: string, name: string){
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new HttpError(409, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });

  return { user: { id: user.id, email: user.email, name: user.name }, ...signTokens(user.id, user.email) };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new HttpError(401, "Invalid credentials");
  }

  return { user:{ id: user.id, email: user.email, name: user.name }, ...signTokens(user.id, user.email) };
}

export async function refresh(refreshToken: string) {
  let payload:{sub: string};
  try {
    payload = jwt.verify(refreshToken, env.jwt.refreshSecret) as {sub: string};
  } catch {
    throw new HttpError(401, "Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if(!user){
    throw new HttpError(401, "User no longer exists");
  }

  return signTokens(user.id, user.email);
}
