/**
 * This plugin allows to enable dev mode via passing '--dev' flag to node script.
 */

export function EnvPlugin() {
    return {
        name: 'env-plugin',
        setup(build) {
            const isDev = process.argv.includes('--dev'),
                options = build.initialOptions;
    
            if (isDev) {
                options.watch = true;
            } else {
                options.minify = true;
                options.treeShaking = true;
            }
        },
    };
}
