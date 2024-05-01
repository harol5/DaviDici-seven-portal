import { useForm } from "@inertiajs/react";
import FlashMessage from "../../Components/FlashMessage";
import { FormEvent } from "react";

function Register({ message }: { message: string }) {
    const { data, setData, post, errors, reset } = useForm({
        name: "",
        email: "",
        username: "",
        role: "user",
        password: "",
        password_confirmation: "",
    });
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/users", {
            onSuccess: () => reset(),
        });
    };
    return (
        <div className="main-content-wrapper">
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="name" className="inline-block text-lg mb-2">
                        {" "}
                        Name{" "}
                    </label>
                    <input
                        type="text"
                        className="border border-gray-200 rounded p-2 w-full"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                    />

                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="email"
                        className="inline-block text-lg mb-2"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        className="border border-gray-200 rounded p-2 w-full"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="username"
                        className="inline-block text-lg mb-2"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        className="border border-gray-200 rounded p-2 w-full"
                        name="username"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                    />

                    {errors.username && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.username}
                        </p>
                    )}
                </div>

                <div className="mb-6">
                    <label htmlFor="role" className="inline-block text-lg mb-2">
                        Role
                    </label>
                    <select
                        name="role"
                        className="border border-gray-200 rounded p-2 w-full"
                        value={data.role}
                        onChange={(e) => setData("role", e.target.value)}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    {errors.role && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.role}
                        </p>
                    )}
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="password"
                        className="inline-block text-lg mb-2"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        className="border border-gray-200 rounded p-2 w-full"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="password2"
                        className="inline-block text-lg mb-2"
                    >
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        className="border border-gray-200 rounded p-2 w-full"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                    />
                </div>

                <div className="mb-6">
                    <button
                        type="submit"
                        className="bg-laravel text-black rounded py-2 px-4 hover:bg-black hover:text-white"
                    >
                        Sign Up
                    </button>
                </div>
            </form>
            <FlashMessage message={message} />
        </div>
    );
}

export default Register;
