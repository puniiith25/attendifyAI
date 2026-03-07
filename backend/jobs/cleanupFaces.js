import cron from "node-cron";
import { supabase } from "../config/supabase.js";

cron.schedule("0 * * * *", async () => {

    const limit = 1000;

    const { data } = await supabase.storage
        .from("attendance-faces")
        .list("", { limit });

    const cutoff = Date.now() - 48 * 60 * 60 * 1000;

    for (const file of data) {

        const created = new Date(file.created_at).getTime();

        if (created < cutoff) {

            await supabase.storage
                .from("attendance-faces")
                .remove([file.name]);

        }

    }

});