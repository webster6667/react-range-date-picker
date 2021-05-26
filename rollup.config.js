import babel from '@rollup/plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize'

import external from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'

import postcss from 'rollup-plugin-postcss'
import reactSvg from "rollup-plugin-react-svg";


const moduleFormat = process.env.NODE_ENV,
      shouldSqueeze = ['cjs'].includes(moduleFormat)

const inputFile = 'src/index.tsx',
      outputFile = 'dist/index',
      extensions = ['.js', '.ts','.tsx']

const plugins = [
    resolve({
        browser: true,
        extensions
    }),
    reactSvg({
        // svgo options
        svgo: {
            plugins: [], // passed to svgo
            multipass: true
        },

        // whether to output jsx
        jsx: false,

        // include: string
        include: null,

        // exclude: string
        exclude: null
    }),
    postcss(),
    external(),
    babel({
        extensions,
        babelHelpers: 'runtime',
        presets: [
            [
                '@babel/preset-env',
                {
                    bugfixes: true,
                    modules: false,
                    targets: { browsers: '> 0.25%, ie 11, not op_mini all, not dead' }
                }
            ],
            '@babel/preset-react',
            '@babel/preset-typescript'
        ],
        plugins: [
            '@babel/plugin-transform-runtime'
        ],
        exclude: 'node_modules/**',
    }),
    commonjs(),
    filesize(),
]

if (shouldSqueeze === true) {
    plugins.push(terser())
}

export default [
    {
        input: inputFile,
        output: [
            {
                file: `${outputFile}.${moduleFormat}.js`,
                format: moduleFormat,
            }
        ],
        external: [/@babel\/runtime/],
        plugins
    }
]