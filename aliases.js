import path from 'node:path';
import tsconfig from './tsconfig.json' with { type: "json" };

const { compilerOptions: { paths } } = tsconfig;
const aliasReg = (str) => str.replace(/^(.*)\/\*$/, '$1');
export default Object.keys(paths).reduce(
    (obj, a) => (obj[aliasReg(a)] = path.resolve(aliasReg(paths[a][0])), obj),
    {}
);