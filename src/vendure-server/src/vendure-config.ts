import {
    examplePaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    VendureConfig,
} from '@vendure/core'; 
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import path from 'path';

export const config: VendureConfig = {
    apiOptions: {
        port: 4020,
        adminApiPath: 'admin-api',
        adminApiPlayground: {
            settings: {
                'request.credentials': 'include',
            } as any,
        },// turn this off for production
        adminApiDebug: true, // turn this off for production
        shopApiPath: 'shop-api',
        shopApiPlayground: { 
            settings: {
                'request.credentials': 'include',
            } as any,
        },// turn this off for production
        shopApiDebug: true,// turn this off for production
    },
    authOptions: {
        sessionSecret: 'edolbgjzrl',
        superadminCredentials: {
            identifier: 'superadmin',
            password: 'superadmin',
        },
    },
    dbConnectionOptions: {
        type: 'sqlite',
        synchronize: false, // not working with SQLite/SQL.js, see https://github.com/typeorm/typeorm/issues/2576
        logging: false,
        database: path.join(__dirname, '../vendure.sqlite'),
        migrations: [path.join(__dirname, '../migrations/*.ts')],
    },
    paymentOptions: {
        paymentMethodHandlers: [examplePaymentHandler],
    },
    customFields: {},
    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, '../static/assets'),
            port: 4001,
        }),
        DefaultJobQueuePlugin,
        DefaultSearchPlugin,
        // EmailPlugin.init({
        //     devMode: true,
        //     outputPath: path.join(__dirname, '../static/email/test-emails'),
        //     mailboxPort: 3003,
        //     handlers: defaultEmailHandlers,
        //     templatePath: path.join(__dirname, '../static/email/templates'),
        //     globalTemplateVars: {
        //         // The following variables will change depending on your storefront implementation
        //         fromAddress: '"example" <noreply@example.com>',
        //         verifyEmailAddressUrl: 'http://localhost:8080/verify',
        //         passwordResetUrl: 'http://localhost:8080/password-reset',
        //         changeEmailAddressUrl: 'http://localhost:8080/verify-email-address-change'
        //     },
        // }),
        AdminUiPlugin.init({ port: 4002 }),
    ],
};
