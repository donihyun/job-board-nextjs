import { connectToDB} from "@/lib/db";
import Visa from "@/lib/models/visa-schema";
import { logger } from "@/lib/logger";

export async function importVisas() {
    await connectToDB();
    try {
        const visaData = await Visa.find({});
        logger.dbOperation("fetch", "visas", { count: visaData.length });
        return visaData;
    } catch (error) {
        logger.error("Error finding visa data", error);
        return [];
    }
}