/** @type {import('next').NextConfig} */
const nextConfig = {

    // output: 'export',
    // Uncomment when add value for NEXT_PUBLIC_PATH in .env.production or .env.development
    // basePath: process.env.NEXT_PUBLIC_PATH,
    trailingSlash: true,
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
            },
        ];
    },
};

export default nextConfig;
