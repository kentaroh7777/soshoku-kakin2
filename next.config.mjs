/** @type {import('next').NextConfig} */
import dotenv from "dotenv"

dotenv.config({ path: '.env.local'})

const nextConfig = {
    env: {
        MONGODB_URI: process.env.MONGODB_URI,
        JWT_SECRET: process.env.JWT_SECRET
    }
};

export default nextConfig;
