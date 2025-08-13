import type { Outputs } from "@repo/trpc/client";

type UserRoute = Outputs["user"];

type AuthRoute = Outputs["auth"];

export type UserProfile = UserRoute["getProfile"];
export type UserRegister = UserRoute["register"];
export type UserLogin = AuthRoute["login"];
