import { Link } from "@inertiajs/react";

function Welcome({ name, error }: { name: string; error: string }) {
    return (
        <section className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-[4.2em] py-[3em]  rounded shadow shadow-davidiciGold/70 text-center">
            <img
                className="w-[200px] mx-auto my-2"
                src="https://portal.davidici.com/images/davidici-logo-nav-cropped.png"
            />
            {!error && (
                <div className="mt-7">
                    <h1>Welcome {name}</h1>
                    <p className="mb-4">your account was created succesfully</p>
                    <Link
                        className="rounded shadow-sm shadow-gray-700 px-4 py-1 transition-shadow  hover:shadow-gray-400"
                        href="/"
                    >
                        Go to login page.
                    </Link>
                </div>
            )}
            {error && (
                <div className="mt-7">
                    <p className="mb-4">
                        Something went wrong, Please contact support.
                    </p>
                </div>
            )}
        </section>
    );
}

export default Welcome;
