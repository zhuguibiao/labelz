import { execSync } from "child_process";

function runCommand(command: string) {
  console.log(`\n🚀 Running: ${command}`);
  execSync(command, { stdio: "inherit" });
}

function buildDesktop() {
  // Mac M1
  runCommand("pnpm tauri build --target aarch64-apple-darwin");
  // Mac Intel
  runCommand("pnpm tauri build --target x86_64-apple-darwin");
  // Windows
  runCommand(
    "pnpm tauri build --runner cargo-xwin --target x86_64-pc-windows-msvc"
  );
  console.log("✅ Desktop builds finished!");
}

buildDesktop();
