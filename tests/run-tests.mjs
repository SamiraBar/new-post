import { spawn } from "node:child_process";

const grep = process.argv[2]; // например "@login"

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit", shell: true, ...opts });
    p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

async function main() {

  await run("npm", ["run", "seed:test"], { cwd: "../back" });

  const back = spawn("npm", ["run", "start:test"], {
    cwd: "../back",
    stdio: "inherit",
    shell: true,
  });

  const front = spawn("npm", ["run", "start:test"], {
    cwd: "../front",
    stdio: "inherit",
    shell: true,
  });

  await run("npx", ["wait-on", "tcp:5183"], { cwd: process.cwd() });

  const codeceptArgs = ["codeceptjs", "run", "--steps"];
  if (grep) codeceptArgs.push("--grep", grep);

  let exitCode = 0;
  try {
    await run("npx", codeceptArgs);
  } catch (e) {
    exitCode = 1;
  }

  back.kill("SIGTERM");
  front.kill("SIGTERM");

  setTimeout(() => {
    back.kill("SIGKILL");
    front.kill("SIGKILL");
    process.exit(exitCode);
  }, 1000);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
