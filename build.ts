import {build} from "esbuild";
import {glsl} from "esbuild-plugin-glsl";

console.log("Building...");

build(
    {
        entryPoints: ["src/Main.ts"],
        bundle: true,
        outfile: "app.js",
        plugins: [glsl()],
        watch: true,
        logLevel: "info",
        loader: {
            ".glsl": "text",
        }
    }
).catch(
    (e) => {
        console.log(e);

        process.exit(1);
    }
);

console.log("Done.");
