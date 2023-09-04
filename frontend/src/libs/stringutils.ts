export class StringUtils{
    static capitalize(word: string) : string{
        let char = word.charAt(0).toLocaleUpperCase();
        word = word.slice(1, word.length);
        return char.concat(word);
    }
}
