import { Input as InputModel } from "../Models/Registration";

interface InputProps extends InputModel {
    data: string;
    errors: string;
    setData: (name: string, value: string) => void;
}

function Input({
    htmlFor,
    fieldType,
    type,
    labelContent,
    name,
    data,
    errors,
    setData,
}: InputProps) {
    console.log(fieldType);
    return (
        <div className="mb-6 last-name">
            <label htmlFor={htmlFor} className="inline-block text-lg mb-2">
                {labelContent}
            </label>
            <input
                type={type}
                className="border border-gray-200 rounded p-2 w-full"
                name={name}
                value={data}
                onChange={(e) => setData("lastName", e.target.value)}
            />

            {errors && <p className="text-red-500 text-xs mt-1">{errors}</p>}
        </div>
    );
}

export default Input;
