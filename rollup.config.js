import inject from '@rollup/plugin-inject';
import { execSync } from 'child_process';
import { builtinModules } from 'module';
import pkg from './package.json';

const commit = execSync('git rev-parse HEAD').toString('utf-8').slice(0, 12);

const banner = `/**
 * ${pkg.name} v${pkg.version} — git ${commit}
 * ${new Date().toUTCString()}
 * ${pkg.homepage}
 * @license ${pkg.license}
 * @author ${pkg.author.name}
 */`;

const CREATE_REQUIRE = `\
import { createRequire } from 'module';
export var _require = createRequire(import.meta.url);
`;

const external = [...builtinModules, 'uuid'];

export default [{
    input: 'src/lib.js',
    output: [{
        file: 'lib/lib.cjs',
        format: 'cjs',
        interop: (id) => builtinModules.includes(id) ? 'default' : 'auto',
        banner,
    }],
    external,
}, {
    input: 'src/lib.js',
    output: [{
        file: 'lib/lib.mjs',
        format: 'es',
        banner,
    }],
    plugins: [
        inject({
            modules: {
                require: ['createRequire', '_require'],
            }
        }),
        {
            name: 'createRequire',
            resolveId(id) {
                if (id === 'createRequire')
                    return id;
            },
            load(id) {
                if (id === 'createRequire')
                    return CREATE_REQUIRE;
            }
        },
    ],
    external,
}];
