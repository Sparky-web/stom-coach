/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import jwt from "jsonwebtoken";

import {
  createTRPCStoreLimiter,
  defaultFingerPrint,
} from '@trpc-limiter/memory'
import { env } from "~/env";
// import { cookies } from "next/headers";
import strapi from "../strapi";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */

// t
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();

  return {
    db,
    session,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (ctx.session?.user) {
    const { data: [user] } = await strapi.get('clients', {
      filters: {
        id: ctx.session.user.id
      },
      populate: "*"
    })

    if (!user) return next({ ctx })

    delete user.attributes.password

    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user },
      },
    });
  }
  return next({ ctx })


});
;

export const rateLimiter = createTRPCStoreLimiter<typeof t>({
  fingerprint: (ctx) => defaultFingerPrint(ctx),
  message: (hitInfo) => `Слишкм много запросов, попробуйте позже через ${hitInfo} сек.`,
  max: 3,
  windowMs: 60000,
})

export const rateLimitMiddleware = t.middleware(async ({ ctx, next }) => {
  const result = await rateLimiter(ctx);

  if (!result.success) {
    throw new Error(result.message);
  }

  return next();
});

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const { data: [user] } = await strapi.get('clients', {
    filters: {
      id: ctx.session.user.id
    },
    populate: "*"
  })

  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
  delete user.attributes.password

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user },
    },
  });


});
