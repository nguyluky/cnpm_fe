

import * as path from "node:path";
import * as process from "node:process";
import * as fs from "node:fs/promises";
import { generateApi } from "swagger-typescript-api";

const swaggerUrl = "https://raw.githubusercontent.com/nguyluky/cnpm/refs/heads/main/docs/swagger.json"

fetch(swaggerUrl)
    .then((response) => response.json())
    .then(async (data) => {
        const outputPath = path.resolve(process.cwd(), "./swagger.json");
        await fs.writeFile(outputPath, JSON.stringify(data, null, 2), "utf-8");
        await generateApi({
            input: outputPath,
            output: path.resolve(process.cwd(), "./src/api/"),
            httpClientType: "fetch",
            addReadonly: true,
            // templatePaths: {
            //     base: path.resolve(process.cwd(), "./scripts/swagger-templates/base")!,
            //     default: path.resolve(process.cwd(), "./scripts/swagger-templates/default")!,
            //     modular: path.resolve(process.cwd(), "./scripts/swagger-templates/modular")!,
            //     original: path.resolve(process.cwd(), "./scripts/swagger-templates/original")!,
            //     custom: null
            // },
            templates: path.resolve(process.cwd(), "./scripts/swagger-templates/modular"),
            cleanOutput: true,
            modular: true,
        });
    })
    .catch(async (error) => {
        console.error("Failed to fetch Swagger JSON from URL, falling back to local file.", error);
    });

