import type { Outputs, Inputs } from "@repo/trpc/client";

type OUserRoute = Outputs["user"];

type IAuthRoute = Inputs["auth"];

export type UserProfile = OUserRoute["getProfile"];
export type UserRegister = OUserRoute["register"];

export type LoginArgs = IAuthRoute["login"];
