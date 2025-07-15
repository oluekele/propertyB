"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const express_1 = __importDefault(require("express"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const property_routes_1 = __importDefault(require("./routes/property.routes"));
const db_1 = require("./config/db"); // ✅ DB util
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["https://property-f.vercel.app", "http://localhost:3000"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// ✅ Quick test route (does NOT depend on DB)
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        node_env: process.env.NODE_ENV || "undefined",
        mongo_uri_present: !!process.env.MONGO_URI,
        timestamp: new Date().toISOString(),
    });
});
// ✅ Lazy DB connection middleware (only when needed)
async function ensureDBConnection(req, res, next) {
    try {
        await (0, db_1.connectDB)(); // Will connect only once per cold start
        next();
    }
    catch (err) {
        console.error("❌ DB connection failed:", err);
        return res.status(500).json({ error: "Database connection failed" });
    }
}
// ✅ Protect DB routes with connection check
app.use("/api/auth", ensureDBConnection, auth_routes_1.default);
app.use("/api/properties", ensureDBConnection, property_routes_1.default);
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
// ✅ Debug logs
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URI present?", !!process.env.MONGO_URI);
// ✅ Local dev only
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    (0, db_1.connectDB)().catch((err) => console.error("❌ DB connection error at startup:", err));
    app.listen(PORT, () => console.log(`🚀 Local server running at http://localhost:${PORT}`));
}
// ✅ Export for Vercel
exports.handler = (0, serverless_http_1.default)(app);
