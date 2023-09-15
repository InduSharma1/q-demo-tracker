const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const Redis = require("ioredis");
const connectRedis = require("connect-redis");

dotenv.config();

const app = express();

const RedisStore = connectRedis(session);

//Configure redis client
let redisClient;
if (process.env.NODE_ENV === "production") {
    redisClient = new Redis(process.env.REDIS_URL, {
        tls: {
            rejectUnauthorized: false,
        },
    });
} else {
    redisClient = new Redis();
}

app.use(helmet({
    contentSecurityPolicy: false
}));

app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json({ limit: '100mb' }));

app.use(rateLimit({
    windowMs: (process.env.RATE_LIMITER_TIMEFRAME || 60) * 60 * 1000, // 1 hour
    max: (process.env.RATE_LIMITER_MAX_APIS || 1000), // limit each IP to 1000 create account request per `window` (here, per hour)
    message:
        "Too many accounts created from this IP, please try again after an hour",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));

app.use(cookieParser());
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 3,
        },
    })
);

// routes
app.use("/auth", require("./apis/routes/auth"));
app.use("/api", require("./apis/routes/api"));

app.use(express.static(`${process.cwd()}/dist/`));

app.get("/", (req, res) => {
    res.sendFile(`${process.cwd()}/dist/index.html`);
});

// handle undefined routes
app.use("*", (req, res) => {
    res.sendFile(`${process.cwd()}/dist/index.html`);
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port ${process.env.PORT || 3000}`);
});