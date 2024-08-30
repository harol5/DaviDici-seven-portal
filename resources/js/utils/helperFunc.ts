export function isAlphanumericWithSpaces(str: string) {
    return /^[a-zA-Z0-9\s]*$/.test(str);
}
