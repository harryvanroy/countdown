export function sampleLetters(vowels: number, cons: number): string {
    let result = '';
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const consonantsLen = consonants.length;
    for (let i = 0; i < cons; i++) {
        result += consonants.charAt(Math.floor(Math.random() *
            consonantsLen));
    }
    for (let i = 0; i < vowels; i++) {
        result += "aeiou".charAt(Math.floor(Math.random() * 5));
    }
    return result;
}