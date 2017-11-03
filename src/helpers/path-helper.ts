import * as path from 'path';

export class PathHelper {

    public static normalisePath(relativePath) {
        let removeFileExtenion = (rp) => {
            if (rp) {
                rp = rp.substring(0, rp.lastIndexOf('.'))
            }
            return rp;
        }

        let makeRelativePath = (rp) => {

            let preAppend = './';

            if (!rp.startsWith(preAppend) && !rp.startsWith('../')) {
                rp = preAppend + rp;
            }

            if (/^win/.test(process.platform)) {
                rp = rp.replace(/\\/g, '/');
            }

            return rp;
        }

        relativePath = makeRelativePath(relativePath);
        relativePath = removeFileExtenion(relativePath);

        return relativePath;
    }

    public static getRelativePath(a, b): string {
        return path.relative(path.dirname(a), b);
    }

}
