import bcrypt from "bcrypt";
import { Router } from "express";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

const router = Router();
const SALT_ROUNDS = 10;

function getJwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (typeof s !== "string" || s.trim() === "") {
    throw new Error(
      "JWT_SECRET is missing. Add it to backend/.env (e.g. JWT_SECRET=your-long-random-string).",
    );
  }
  return s.trim();
}

function signToken(userId: number): string {
  const opts: jwt.SignOptions = { expiresIn: "7d" };
  return jwt.sign({ userId }, getJwtSecret(), opts);
}

function verifyToken(token: string): { userId: number } | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload & {
      userId?: unknown;
    };
    const userId = decoded.userId;
    if (typeof userId !== "number" || !Number.isInteger(userId)) {
      return null;
    }
    return { userId };
  } catch {
    return null;
  }
}

type PublicUser = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  phone: string | null;
};

function toPublicUser(u: {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  phone: string | null;
}): PublicUser {
  return {
    id: u.id,
    email: u.email,
    firstname: u.firstname,
    lastname: u.lastname,
    username: u.username,
    phone: u.phone,
  };
}

async function uniqueUsernameFromEmail(email: string): Promise<string> {
  const raw = (email.split("@")[0] ?? "user")
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .slice(0, 24);
  const base = raw || "user";
  let candidate = base;
  for (let n = 0; n < 50; n++) {
    const exists = await prisma.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
    candidate = `${base.slice(0, 18)}_${n + 1}`;
  }
  return `user_${Date.now()}`;
}

const signupPost: RequestHandler = async (req, res, next) => {
  try {
    const body = req.body as Record<string, unknown>;
    const firstname =
      typeof body.firstname === "string" ? body.firstname.trim() : "";
    const lastname =
      typeof body.lastname === "string" ? body.lastname.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const phoneRaw = typeof body.phone === "string" ? body.phone.trim() : "";
    const phone = phoneRaw.length > 0 ? phoneRaw : null;

    if (!firstname || !lastname || !email || !password) {
      res.status(400).json({
        error: "firstname, lastname, email, and password are required",
      });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: "Invalid email address" });
      return;
    }

    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      res
        .status(409)
        .json({ error: "An account with this email already exists" });
      return;
    }

    const username = await uniqueUsernameFromEmail(email);
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        username,
        password: hash,
        phone,
      },
    });

    const token = signToken(user.id);
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      res.status(409).json({
        error: "An account with this email or username already exists",
      });
      return;
    }
    next(e);
  }
};

const loginPost: RequestHandler = async (req, res, next) => {
  try {
    const body = req.body as Record<string, unknown>;
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = signToken(user.id);
    res.json({
      token,
      user: toPublicUser(user),
    });
  } catch (e) {
    next(e);
  }
};

const meGet: RequestHandler = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    const token = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : "";
    if (!token) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const v = verifyToken(token);
    if (!v) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { id: v.userId },
    });
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    res.json({ user: toPublicUser(user) });
  } catch (e) {
    next(e);
  }
};

router.post("/signup", signupPost);
router.post("/login", loginPost);
router.get("/me", meGet);

export default router;
