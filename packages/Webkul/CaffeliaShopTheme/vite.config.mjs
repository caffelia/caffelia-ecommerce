import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig(({ mode }) => {
    const envDir = '../../../';
    Object.assign(process.env, loadEnv(mode, envDir));

    return {
        build: {
            emptyOutDir: true,
        },
        envDir,
        server: {
            host: process.env.VITE_HOST || 'localhost',
            port: process.env.VITE_PORT || 5173,
            cors: true,
        },
        plugins: [
            vue(),

            laravel({
                hotFile: '../../../public/caffelia-shop-theme-vite.hot',
                publicDirectory: '../../../public',
                buildDirectory: 'themes/shop/caffelia-shop/build',
                input: [
                    'src/Resources/assets/css/app.css',
                    'src/Resources/assets/js/app.js',
                ],
                refresh: true,
            }),

            viteStaticCopy({
                targets: [
                    {
                        src: 'src/Resources/assets/images',
                        dest: '../../../public/themes/shop/caffelia-shop/assets'
                    },
                    {
                        src: '../MercadoPago/src/Resources/assets/images/mercadopago.png',
                        dest: '../../../public/themes/shop/caffelia-shop/assets'
                    }
                ]
            }),
        ],
        experimental: {
            renderBuiltUrl(filename, { hostId, hostType, type }) {
                if (hostType === 'css') {
                    return path.basename(filename);
                }
            },
        },
    };
});
