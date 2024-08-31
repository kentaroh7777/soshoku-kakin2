/** @type {import('next').NextConfig} */
import dotenv from "dotenv"
const environment = process.env.NODE_ENV || 'development';

//console.log(`environment: ${environment}`)

if (environment === 'test') {
    dotenv.config({ path: '.env.test.local' });
} else if (environment === 'development') {
    dotenv.config({ path: '.env.development.local' });
} else if (environment === 'production') {
    dotenv.config({ path: '.env.production.local' });
}

dotenv.config({ path: '.env.local'})

const nextConfig = {

    reactStrictMode: true,

    env: {
        MONGODB_URI: process.env.MONGODB_URI,
        JWT_SECRET: process.env.JWT_SECRET,
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS
    },
};

export const JWT_SECRET = () => {
    return nextConfig.env.JWT_SECRET || "jwt-secret-default";
}

export default nextConfig;
