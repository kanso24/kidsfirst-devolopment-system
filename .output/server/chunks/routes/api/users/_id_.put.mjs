import { d as defineEventHandler, g as getUserFromEvent, c as createError, r as readBody, p as prisma } from '../../../nitro/nitro.mjs';
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

const _id__put = defineEventHandler(async (event) => {
  var _a;
  const currentUser = getUserFromEvent(event);
  if (!currentUser || currentUser.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden: Admins only" });
  }
  const id = parseInt(((_a = event.context.params) == null ? void 0 : _a.id) || "0");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid user ID" });
  }
  const body = await readBody(event);
  const { firstname, lastname, username, password, role } = body;
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }
  if (username && username !== existingUser.username) {
    const usernameTaken = await prisma.user.findUnique({ where: { username } });
    if (usernameTaken) {
      throw createError({ statusCode: 400, statusMessage: "Username already exists" });
    }
  }
  const updateData = {
    firstname: firstname || existingUser.firstname,
    lastname: lastname || existingUser.lastname,
    username: username || existingUser.username,
    role: role || existingUser.role
  };
  if (password) {
    if (password.length < 6) {
      throw createError({ statusCode: 400, statusMessage: "Password must be at least 6 characters" });
    }
    updateData.password = await bcrypt.hash(password, 10);
  }
  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      firstname: true,
      lastname: true,
      username: true,
      role: true,
      updatedAt: true
    }
  });
  return { message: "User updated successfully", user: updatedUser };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
