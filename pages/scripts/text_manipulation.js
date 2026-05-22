class TextManipulation {

    static reverseString(str) {
        return str.split('').reverse().join('');
    }

    static flipChar(char) {
        const charMap = {
            lowercase: { from: "abcdefghijklmnopqrstuvwxyz", to: "ɐqɔpǝɟᵷɥᴉɾʞlɯuodqɹsʇnʌʍxʎz" },
            uppercase: { from: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", to: "ⱯꓭƆꓷƎℲ⅁HIՐꓘ⅂WNOԀꝹꓤSꞱՈɅMX⅄Z" },
            numbers:   { from: "0123456789",                 to: "0ƖƧƐᔭϛ9ㄥ86" },
            symbols:   { from: "!?.,;:&_()[]{}",             to: "¡¿˙'؛ː⅋‾)(][}{" },
        };

        for (const { from, to } of Object.values(charMap)) {
            const i = from.indexOf(char);
            if (i !== -1) return to[i] || char;
        }
        return char;
    }

    static flipString(str) {
        return this.reverseString(str).split('').map(char => this.flipChar(char)).join('');
    }
}