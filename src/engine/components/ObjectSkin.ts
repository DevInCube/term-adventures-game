export class ObjectSkin {

    characters: string[] = [];
    grid: string[][] = [];
    raw_colors: (string | undefined)[][][] = [];

    constructor(
        public charactersMask: string = '',
        public colorsMask: string = '', 
        public colors: {
        [key: string]: (string | undefined)[];
    } = {}) {

        this.raw_colors = this.getRawColors();
        this.characters = charactersMask.split('\n');
        this.grid = this.characters.map(this.groupUnicode);
        // console.log(charactersMask, this.characters);
    }

    private getRawColors() {
        let raw_colors: (string | undefined)[][][] = [];
        const lines = this.colorsMask.split('\n');
        for (let y = 0; y < lines.length; y++) {
            raw_colors.push([]);
            for (let x = 0; x < lines[y].length; x++) {
                const cellColor = lines[y][x] || ' ';
                const color = this.colors[cellColor];
                raw_colors[y].push(color ? [...color] : ['', '']);
            }
        }
        return raw_colors;
    }

    private groupUnicode(line: string): string[] {
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
}
