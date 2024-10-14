import { ChangeEvent, FormEvent, useState } from "react";
import UserAuthenticatedLayout from "../Layouts/UserAuthenticatedLayout";
import User from "../Models/User";
import axios from "axios";

function Media({ auth }: { auth: User }) {
    const [model, setModel] = useState("");
    const [files, setFiles] = useState<FileList | null>(null);

    const handleTextChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setModel(e.target.value);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFiles(e.target.files);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!files || files.length === 0 || !model) {
            alert("Please select at least one image to upload");
            return;
        }

        // Create FormData object to handle file uploads
        const formData = new FormData();
        formData.append("model", model);

        // Append each selected file to the formData
        for (let i = 0; i < files.length; i++) {
            formData.append("images[]", files[i]);
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
                    <label htmlFor="model">Which model?</label>
                    <select
                        name="state"
                        value={model}
                        onChange={(e) => handleTextChange(e)}
                        required
                    >
                        <option value={""}></option>
                        <option value="elora">elora</option>
                        <option value="kora">kora</option>
                        <option value="kora xl">kora xl</option>
                        <option value="margi">margi</option>
                        <option value="new bali">new bali</option>
                        <option value="new york">new york</option>
                        <option value="opera">opera</option>
                    </select>
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
