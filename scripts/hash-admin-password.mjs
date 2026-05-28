import { pbkdf2Sync, randomBytes } from "node:crypto";
import { stdin, stdout, stderr, exit } from "node:process";
import { createInterface } from "node:readline/promises";

const password = process.argv[2];

async function readPassword() {
  if (password) return password;

  const rl = createInterface({ input: stdin, output: stdout });
  const value = await rl.question("Admin password: ");
  rl.close();
  return value;
}

const value = await readPassword();

if (!value || value.length < 16) {
  stderr.write("Use a password with at least 16 characters.\n");
  exit(1);
}

const iterations = 310000;
const salt = randomBytes(16).toString("hex");
const hash = pbkdf2Sync(value, salt, iterations, 32, "sha256").toString("hex");

stdout.write(`pbkdf2_sha256$${iterations}$${salt}$${hash}\n`);
