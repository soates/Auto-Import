const isQuote = (char: string) => char === `"` || char === `'`;

export class PackageNameHelper {
    static isPackageNameQuoted(packageName: string): boolean {
        const first = packageName[0];
        const last = packageName[packageName.length - 1];

        return isQuote(first) && isQuote(last);
    }
}
