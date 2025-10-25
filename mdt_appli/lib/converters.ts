export const stringToNumber = (value?: string): number | undefined => {
    if (!value) return undefined;

    const number = Number(value);
    if (isNaN(number)) {
        return undefined;
    }
    return number;
};

export const booleanToString = (value?: boolean | null) => {
    if (!value) return "Non";

    return value ? "Oui" : "Non";
};
