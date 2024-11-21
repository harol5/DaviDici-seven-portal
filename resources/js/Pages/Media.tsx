import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import UserAuthenticatedLayout from "../Layouts/UserAuthenticatedLayout";
import User from "../Models/User";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

function Media({ auth }: { auth: User }) {
    const [model, setModel] = useState("");
    const [files, setFiles] = useState<FileList | null>(null);
    const [response, setResponse] = useState("");

    const { isPending, data } = useQuery({
        queryKey: ["allImages"],
        queryFn: () => axios.get(`/media/images`).then((res) => res.data),
    });

    const [images, setImages] = useState([]);

    useEffect(() => {
        if (isPending) return;
        setImages(data.images);
    }, [data]);

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
                setResponse("ok");
                setModel("");
                setFiles(null);
            })
            .catch((error) => {
                // Handle error (optional: display an error message)
                console.error("There was an error uploading the files", error);
                setResponse("error");
            });
    };

    const handleDelete = (image: any) => {
        axios
            .post(`/media/images/delete`, {
                name: image["composition_name"],
                url: image["image_url"],
            })
            .then((res) => {
                const updatedImages = images.filter(
                    (crrImage) =>
                        crrImage["composition_name"] !==
                        image["composition_name"]
                );
                setImages(updatedImages);
            })
            .catch((err) => console.log(err));
    };

    const [modelFiltered, setModelFiltered] = useState("");

    const handleFilterByModel = (model: string) => {
        const imagesUpdated = data.images.filter(
            (image: any) => image["model"] === model
        );
        setImages(imagesUpdated);
        setModelFiltered(model);
    };

    return (
        <UserAuthenticatedLayout auth={auth} crrPage="orders">
            <div className="flex justify-center py-10 border-b-2">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="model">Which model?</label>
                        <select
                            name="model"
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
                            <option value="raffaello">raffaello</option>
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
                {response === "ok" && (
                    <p className="text-green-600">
                        Images uploaded successfully!
                    </p>
                )}
                {response === "error" && (
                    <p className="text-red-600">
                        Error on the server. DO NOT TRY to upload any pictures
                    </p>
                )}
            </div>
            {!isPending && (
                <div className="flex justify-center overflow-auto flex-wrap px-24 py-12">
                    <div>
                        <label htmlFor="modelFiltered">Filtered by:</label>
                        <select
                            name="modelFiltered"
                            value={modelFiltered}
                            onChange={(e) =>
                                handleFilterByModel(e.target.value)
                            }
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
                            <option value="raffaello">raffaello</option>
                        </select>
                    </div>
                    <div className="flex justify-center overflow-auto flex-wrap">
                        {images.map((image: any, index: number) => (
                            <div key={index} className="basis-1/4 m-2">
                                <img
                                    src={`https://${location.hostname}/storage/${image["image_url"]}`}
                                    alt=""
                                />
                                <h1>{image["model"]}</h1>
                                <p>{image["composition_name"]}</p>
                                <button onClick={() => handleDelete(image)}>
                                    delete
                                </button>
                            </div>
                        ))}
                        {images.length === 0 && <p>NO IMAGES FOR SUCH MODEL</p>}
                    </div>
                </div>
            )}
        </UserAuthenticatedLayout>
    );
}

export default Media;
