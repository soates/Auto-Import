export class PackageNameHelper {
    static isPackageNameQuoted(packageName: string): boolean {
        return !!packageName.match(/['"].*['"]/g);
    }
}
