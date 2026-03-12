import { d as defineEventHandler, f as deleteCookie } from '../../../nitro/nitro.mjs';
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

const logout_post = defineEventHandler((event) => {
  deleteCookie(event, "auth_token", { path: "/" });
  return { message: "Logout successful" };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
