import { execSync } from "node:child_process";

// A per-build token appended to local asset URLs (?v=…) so a deploy always
// busts the browser cache — GitHub Pages serves assets with a 10-minute
// max-age and no way to set headers, so without this a changed script or
// stylesheet can stay stale for that long.
export default {
    rev: (() => {
        try {
            return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
                .toString()
                .trim();
        } catch {
            return Date.now().toString(36);
        }
    })(),
};
