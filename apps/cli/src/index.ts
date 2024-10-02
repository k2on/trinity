import { api } from "./utils/api";
import { cli, cmd, run } from "@koons/cli";
import { spinner } from "@clack/prompts";

run(
    cli({
        run: cmd.describe("Run the stuff").run(async () => {
            const s = spinner();
            s.start("Running");
            await api.user.createRepo.mutate();
            s.stop("Running");
        }),
    }),
);
