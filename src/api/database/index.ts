import { database, ENV } from "./config";

import { connectDB } from "./mongoose";

export function DBConnection() {
    connectDB(database, ENV);
}