export type Input = {
    name: string;
    fieldType: string;
    type: string;
    htmlFor: string;
    labelContent: string;
    value: string;
};

export const FormInputs: Input[] = [
    {
        name: "firstName",
        fieldType: "input",
        type: "text",
        htmlFor: "last-name",
        labelContent: "First Name",
        value: "none",
    },
];
