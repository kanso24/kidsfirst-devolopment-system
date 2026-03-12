import { d as defineEventHandler, r as readBody, c as createError, p as prisma, e as generateToken, s as setCookie } from '../../../nitro/nitro.mjs';
import bcrypt from 'bcryptjs';
import 'jsonwebtoken';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';

const login_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { username, password } = body;
    if (!username || !password) {
      throw createError({ statusCode: 400, statusMessage: "Username and password are required" });
    }
    const user = await prisma.user.findUnique({
      where: { username }
    });
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Invalid credentials" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw createError({ statusCode: 401, statusMessage: "Invalid credentials" });
    }
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role
    };
    const token = generateToken(payload);
    setCookie(event, "auth_token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24,
      // 1 day
      path: "/"
    });
    const { password: _, ...userWithoutPassword } = user;
    return {
      message: "Login successful",
      user: userWithoutPassword
    };
  } catch (error) {
    if (error.statusCode) throw error;
    throw createError({ statusCode: 500, statusMessage: "Internal server error" });
  }
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
