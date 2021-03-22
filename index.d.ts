/* eslint-disable */

import { HashOptions } from "crypto";

export function stringify(obj: unknown): string;

export function hash(obj: unknown, alg: string, options?: HashOptions): string;

export function streamingHash(obj: unknown, alg: string, options?: HashOptions): string;