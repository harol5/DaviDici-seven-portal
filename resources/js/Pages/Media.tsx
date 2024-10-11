import { ChangeEvent, FormEvent, useState } from "react";
import UserAuthenticatedLayout from "../Layouts/UserAuthenticatedLayout";
import User from "../Models/User";
import { Inertia } from "@inertiajs/inertia";
import axios from "axios";

function Media({ auth }: { auth: User }) {
    const [textValue, setTextValue] = useState("");
    const [files, setFiles] = useState<FileList | null>(null);

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTextValue(e.target.value);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFiles(e.target.files);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!files || files.length === 0) {
            alert("Please select at least one image to upload");
            return;
        }

        // Create FormData object to handle file uploads
        const formData = new FormData();
        formData.append("textValue", textValue);

        // Append each selected file to the formData
        for (let i = 0; i < files.length; i++) {
            formData.append("images[]", files[i]);
        }

        for (var [key, value] of formData.entries()) {
            console.log(key, value);
        }

        // Use Axios to send form data to the backend
        axios
            .post("/media/upload-images", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                // Handle success (optional: redirect or show a success message)
                console.log(response.data);
                // Inertia.visit("/some-route"); // Example inertia visit
            })
            .catch((error) => {
                // Handle error (optional: display an error message)
                console.error("There was an error uploading the files", error);
            });
    };

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="textValue">Text:</label>
                    <input
                        type="text"
                        id="textValue"
                        value={textValue}
                        onChange={handleTextChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="fileUpload">Upload Images:</label>
                    <input
                        type="file"
                        id="fileUpload"
                        multiple
                        accept="image/webp"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </UserAuthenticatedLayout>
    );
}

export default Media;
