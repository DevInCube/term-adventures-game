// https://stackoverflow.com/a/7616484
function hash(str: string): number {
    if (str.length === 0) {
        return 0;
    }

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        let chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }

    return hash;
}

export const stringHash = hash;