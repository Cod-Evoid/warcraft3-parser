import esbuild from 'esbuild';
import { EnvPlugin } from './plugins/env.js';
import { StatusPlugin } from './plugins/status.js';

esbuild.build({
    entryPoints: [],
    target: 'es2020',
    format: 'esm',
    sourcemap: true,
    bundle: true,
    outdir: 'lib',
    plugins: [
        EnvPlugin(),
        StatusPlugin(),
    ],
}).catch(() => process.exit(1));
