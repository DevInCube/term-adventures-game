export function groupUnicode(line: string): string[] {
    const newLine: string[] = [];
    let x = 0;
    for (let charIndex = 0; charIndex < line.length; charIndex++) {
        const codePoint = line.codePointAt(charIndex);
        
        let char = line[charIndex] || ' ';
        if (codePoint && <number>codePoint > 0xffff) {
            const next = line[charIndex + 1];
            if (next) {
                char += next;
                charIndex += 1;
            }
        }

        newLine.push(char);
        x += 1;
    }

    return newLine;
}