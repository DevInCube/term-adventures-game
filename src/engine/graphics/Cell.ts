export class Cell {
    get isEmpty() {
        const result = 
            this.character === ' ' && 
            this.textColor === '' && 
            this.backgroundColor === '';
        return result;
    }

    constructor(
        public character: string = ' ', 
        public textColor: string = 'white', 
        public backgroundColor: string = 'black') 
    {
    }
}
