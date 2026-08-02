/** @type {import('postcss-load-config').Config} */

import postcssNested from 'postcss-nested';
import autoprefixer from 'autoprefixer';

export default {
    plugins: [
        postcssNested,
        autoprefixer
    ]
};