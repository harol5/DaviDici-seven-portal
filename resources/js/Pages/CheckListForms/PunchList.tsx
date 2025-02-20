import { useRef, useState, FormEvent, useEffect } from "react";
// @ts-ignore
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";

type Unit = {
    kitchen: {
        isCompleted: boolean;
        comments: string;
    };
    bars: {
        isCompleted: boolean;
        comments: string;
    };
    vanities: {
        isCompleted: boolean;
        comments: string;
    };
    mirrors: {
        isCompleted: boolean;
        comments: string;
    }
    island: {
        isCompleted: boolean;
        comments: string;
    }
}

function PunchList() {
    const sigClientCanvas = useRef<SignatureCanvas | null>(null);
    const [signature, setSignature] = useState<string | null>(null);

    const sigProjectCanvas = useRef<SignatureCanvas | null>(null);
    const [signatureProject, setSignatureProject] = useState<string | null>(null);

    const [formState, setFormState] = useState({
        clientName: "",
        clientSignature: "",
        projectManagerName: "",
        projectManagerSignature: "",
        unitOne: {
            kitchen: {
                isCompleted: false,
                comments: "",
            },
            bars: {
                isCompleted: false,
                comments: "",
            },
            vanities: {
                isCompleted: false,
                comments: "",
            },
            mirrors: {
                isCompleted: false,
                comments: "",
            },
            island: {
                isCompleted: false,
                comments: "",
            },
        },
        unitTwo: {
            kitchen: {
                isCompleted: false,
                comments: "",
            },
            bars: {
                isCompleted: false,
                comments: "",
            },
            vanities: {
                isCompleted: false,
                comments: "",
            },
            mirrors: {
                isCompleted: false,
                comments: "",
            },
            island: {
                isCompleted: false,
                comments: "",
            },
        },
        unitThree: {
            kitchen: {
                isCompleted: false,
                comments: "",
            },
            bars: {
                isCompleted: false,
                comments: "",
            },
            vanities: {
                isCompleted: false,
                comments: "",
            },
            mirrors: {
                isCompleted: false,
                comments: "",
            },
            island: {
                isCompleted: false,
                comments: "",
            },
        },
        unitFour: {
            kitchen: {
                isCompleted: false,
                comments: "",
            },
            bars: {
                isCompleted: false,
                comments: "",
            },
            vanities: {
                isCompleted: false,
                comments: "",
            },
            mirrors: {
                isCompleted: false,
                comments: "",
            },
            island: {
                isCompleted: false,
                comments: "",
            },
        },
        unitClub: {
            kitchen: {
                isCompleted: false,
                comments: "",
            }
        },
    })
    const units = [
        {
            title: "Unit One",
            name: "unitOne",
        },
        {
            title: "Unit Two",
            name: "unitTwo",
        },
        {
            title: "Unit Three",
            name: "unitThree",
        },
        {
            title: "Unit Four",
            name: "unitFour",
        },
    ]

    const clearSignature = () => {
        sigClientCanvas.current?.clear();
        sigProjectCanvas.current?.clear();
        setSignature(null);
        setSignatureProject(null);
        setFormState(prev => ({
            ...prev,
            clientSignature: "",
            projectManagerSignature: "",
        }))
    };

    const saveSignature = () => {
        if (sigClientCanvas.current && sigProjectCanvas.current) {
            const sigClientData = sigClientCanvas.current.toDataURL("image/png");
            const sigProjectData = sigProjectCanvas.current.toDataURL("image/png");
            setSignature(sigClientData);
            setSignatureProject(sigProjectData);

            console.log(sigClientData);
            console.log(sigProjectData);

            setFormState(prev => ({
                ...prev,
                clientSignature: sigClientData,
                projectManagerSignature: sigProjectData,
            }))
        }
    };

    const submitForm = (e: FormEvent) => {
        e.preventDefault();
        console.log(formState);
        //post("/submit-signature");

        axios.post("/punch-list/store", formState).then(res => {console.log(res)}).catch(err => {console.log(err)})
    };

    const getDatalist = () => {
        axios.get("/punch-list/get-datalist").then(res => {console.log(res)}).catch(err => {console.log(err)})
    }

    useEffect(() => {
        axios.get("/punch-list/get-datalist")
            .then(res => {
                console.log(res)
                res.data.state && setFormState(res.data.state);
            })
            .catch(err => {console.log(err)})
    },[])

    return (
        <>
            <section className="py-5 bg-gray-700 w-[100%]">
                <img
                    className="w-[220px] mx-auto my-2"
                    src="https://portal.davidici.com/images/davidici-logo-nav-cropped.png"
                />
            </section>
            <div className="main-content-wrapper">
                <section className="goback-heading-wrapper">
                    <section className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl">Project Punch List</h1>
                        <p className="text-xl">Aqua Reserve - New Post Richey, Florida</p>
                    </section>
                </section>
                <section className="my-8">
                    <p className="font-bold">By check marking each product installed as completed, you are confirming that:</p>
                    <ul className="list-disc list-inside">
                        <li>Installation completed per approved design.</li>
                        <li>Alignment and leveling checked.</li>
                        <li>Functionality of drawers, cabinets, and doors verified.</li>
                        <li>All electrical components installed and tested.</li>
                        <li>Plumbing connections properly fitted and checked for leaks.</li>
                        <li>Compliance with local codes verified.</li>
                    </ul>
                </section>
                <form onSubmit={submitForm} className="my-8">
                    <div className="flex gap-4 mb-6 p-8 justify-center border-y border-gray-500">
                        {units.map((unit, index) => (
                            <div key={index} className="border-x border-gray-500 px-4">
                                <h1 className="text-2xl mb-3">{unit.title}</h1>
                                <div>
                                    <div>
                                        <div className="flex gap-2 mb-2">
                                            <label htmlFor="unit1">1 Kitchen Completed</label>
                                            <input
                                                type="checkbox"
                                                name="kitchen"
                                                checked={(formState[unit.name as keyof typeof formState] as Unit).kitchen.isCompleted}
                                                onChange={(e) => setFormState(prev => ({
                                                    ...prev,
                                                    [unit.name as keyof typeof formState]: {
                                                        ...prev[unit.name as keyof typeof formState] as Unit,
                                                        kitchen: {
                                                            ...(prev[unit.name as keyof typeof formState] as Unit).kitchen,
                                                            isCompleted: e.target.checked,
                                                        },
                                                    },
                                                }))}
                                            />
                                        </div>
                                        <textarea
                                            className="border border-black p-2 w-full mb-3 rounded"
                                            name="kitchenComments"
                                            cols={30}
                                            rows={5}
                                            placeholder={"Comments..."}
                                            onChange={(e) =>
                                                setFormState(prev => ({
                                                    ...prev,
                                                    [unit.name as keyof typeof formState]: {
                                                        ...prev[unit.name as keyof typeof formState] as Unit,
                                                        kitchen: {
                                                            ...(prev[unit.name as keyof typeof formState] as Unit).kitchen,
                                                            comments: e.target.value,
                                                        },
                                                    },}))
                                            }
                                            value={(formState[unit.name as keyof typeof formState] as Unit).kitchen.comments}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <div className="flex gap-2 mb-2">
                                            <label htmlFor="unit1">2 Bars Completed</label>
                                            <input
                                                type="checkbox"
                                                name="bars"
                                                checked={(formState[unit.name as keyof typeof formState] as Unit).bars.isCompleted}
                                                onChange={(e) => setFormState(prev => ({
                                                    ...prev,
                                                    [unit.name as keyof typeof formState]: {
                                                        ...prev[unit.name as keyof typeof formState] as Unit,
                                                        bars: {
                                                            ...(prev[unit.name as keyof typeof formState] as Unit).bars,
                                                            isCompleted: e.target.checked,
                                                        },
                                                    },
                                                }))}
                                            />
                                        </div>
                                        <textarea
                                            className="border border-black p-2 w-full mb-3 rounded"
                                            name="barsComment"
                                            cols={30}
                                            rows={5}
                                            placeholder={"Comments..."}
                                            onChange={(e)=>
                                                setFormState(prev => ({
                                                    ...prev,
                                                    [unit.name as keyof typeof formState]: {
                                                        ...prev[unit.name as keyof typeof formState] as Unit,
                                                        bars: {
                                                            ...(prev[unit.name as keyof typeof formState] as Unit).bars,
                                                            comments: e.target.value,
                                                        },
                                                    },
                                                }))
                                            }
                                            value={(formState[unit.name as keyof typeof formState] as Unit).bars.comments}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <div className="flex gap-2 mb-2">
                                            <label htmlFor="unit1">4 Vanities Completed</label>
                                            <input
                                                type="checkbox"
                                                name="vanities"
                                                checked={(formState[unit.name as keyof typeof formState] as Unit).vanities.isCompleted}
                                                onChange={(e) => setFormState(prev => ({
                                                    ...prev,
                                                    [unit.name as keyof typeof formState]: {
                                                        ...prev[unit.name as keyof typeof formState] as Unit,
                                                        vanities: {
                                                            ...(prev[unit.name as keyof typeof formState] as Unit).vanities,
                                                            isCompleted: e.target.checked,
                                                        },
                                                    },
                                                }))}
                                            />
                                        </div>
                                        <textarea
                                            className="border border-black p-2 w-full mb-3 rounded"
                                            name="vanitiesComment"
                                            cols={30}
                                            rows={5}
                                            placeholder={"Comments..."}
                                            onChange={(e)=>
                                                setFormState(prev => ({
                                                    ...prev,
                                                    [unit.name as keyof typeof formState]: {
                                                        ...prev[unit.name as keyof typeof formState] as Unit,
                                                        vanities: {
                                                            ...(prev[unit.name as keyof typeof formState] as Unit).vanities,
                                                            comments: e.target.value,
                                                        },
                                                    },}))
                                            }
                                            value={(formState[unit.name as keyof typeof formState] as Unit).vanities.comments}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <div className="flex gap-2 mb-2">
                                            <label htmlFor="unit1">4 Mirrors Completed</label>
                                            <input
                                                type="checkbox"
                                                name="mirrors"
                                                checked={(formState[unit.name as keyof typeof formState] as Unit).mirrors.isCompleted}
                                                onChange={(e) => setFormState(prev => ({
                                                    ...prev,
                                                    [unit.name as keyof typeof formState]: {
                                                        ...prev[unit.name as keyof typeof formState] as Unit,
                                                        mirrors: {
                                                            ...(prev[unit.name as keyof typeof formState] as Unit).mirrors,
                                                            isCompleted: e.target.checked,
                                                        },
                                                    },}))}
                                            />
                                        </div>
                                        <textarea
                                            className="border border-black p-2 w-full mb-3 rounded"
                                            name="mirrorsComment"
                                            cols={30}
                                            rows={5}
                                            placeholder={"Comments..."}
                                            onChange={(e)=>
                                                setFormState(prev => ({
                                                    ...prev,
                                                    [unit.name as keyof typeof formState]: {
                                                        ...prev[unit.name as keyof typeof formState] as Unit,
                                                        mirrors: {
                                                            ...(prev[unit.name as keyof typeof formState] as Unit).mirrors,
                                                            comments: e.target.value,
                                                        },
                                                    },
                                                }))
                                            }
                                            value={(formState[unit.name as keyof typeof formState] as Unit).mirrors.comments}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <div className="flex gap-2 mb-2">
                                            <label htmlFor="unit1">1 Island Completed</label>
                                            <input
                                                type="checkbox"
                                                name="island"
                                                checked={(formState[unit.name as keyof typeof formState] as Unit).island.isCompleted}
                                                onChange={(e) => setFormState(prev => ({
                                                    ...prev,
                                                    [unit.name as keyof typeof formState]: {
                                                        ...prev[unit.name as keyof typeof formState] as Unit,
                                                        island: {
                                                            ...(prev[unit.name as keyof typeof formState] as Unit).island,
                                                            isCompleted: e.target.checked,
                                                        },
                                                    },
                                                }))}
                                            />
                                        </div>
                                        <textarea
                                            className="border border-black p-2 w-full mb-3 rounded"
                                            name="islandComment"
                                            cols={30}
                                            rows={5}
                                            placeholder={"Comments..."}
                                            onChange={(e)=>
                                                setFormState(prev => ({
                                                    ...prev,
                                                    [unit.name as keyof typeof formState]: {
                                                        ...prev[unit.name as keyof typeof formState] as Unit,
                                                        island: {
                                                            ...(prev[unit.name as keyof typeof formState] as Unit).island,
                                                            comments: e.target.value,
                                                        },
                                                    },
                                                }))
                                            }
                                            value={(formState[unit.name as keyof typeof formState] as Unit).island.comments}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="">
                            <h1 className="text-2xl mb-3">Unit Club</h1>
                            <div>
                                <div>
                                    <div className="flex gap-2 mb-2">
                                        <label htmlFor="unit1">1 Kitchen Completed</label>
                                        <input
                                            type="checkbox"
                                            name="kitchen"
                                            checked={formState.unitClub.kitchen.isCompleted}
                                            onChange={(e) => setFormState(prev => ({
                                                ...prev,
                                                unitClub: {
                                                    ...prev.unitClub,
                                                    kitchen: {
                                                        ...prev.unitClub.kitchen,
                                                        isCompleted: e.target.checked,
                                                    },
                                                },
                                            }))}
                                        />
                                    </div>
                                    <textarea
                                        className="border border-black p-2 w-full mb-3 rounded"
                                        name="kitchenComments"
                                        cols={30}
                                        rows={5}
                                        placeholder={"Comments..."}
                                        onChange={(e) =>
                                            setFormState(prev => ({
                                                ...prev,
                                                unitClub: {
                                                    ...prev.unitClub,
                                                    kitchen: {
                                                        ...prev.unitClub.kitchen,
                                                        comments: e.target.value,
                                                    },
                                                },}))
                                        }
                                        value={formState.unitClub.kitchen.comments}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Client Name"
                                value={formState.clientName}
                                onChange={(e) => setFormState(prev => ({
                                    ...prev,
                                    clientName: e.target.value,
                                }))}
                                className="border p-2 w-full mb-3"
                                required
                            />
                            <p className="mb-2">Client Signature:</p>
                            <SignatureCanvas
                                ref={sigClientCanvas}
                                penColor="black"
                                canvasProps={{ className: "border w-full h-40 border-gray-500" }}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Project Manager Name"
                                value={formState.projectManagerName}
                                onChange={(e) => setFormState(prev => ({
                                    ...prev,
                                    projectManagerName: e.target.value,
                                }))}
                                className="border p-2 w-full mb-3"
                                required
                            />
                            <p className="mb-2">Project Manager Signature:</p>
                            <SignatureCanvas
                                ref={sigProjectCanvas}
                                penColor="black"
                                canvasProps={{ className: "border w-full h-40 border-gray-500" }}
                            />
                        </div>
                        <div className="flex flex-col justify-center gap-2 mt-3">
                            <button type="button" onClick={clearSignature} className="bg-gray-500 text-white px-3 py-1">
                                Clear
                            </button>
                            <button type="button" onClick={saveSignature} className="bg-gray-500 text-white px-3 py-1">
                                Save Signature
                            </button>
                        </div>
                    </div>
                    <p>Signatures captured</p>
                    <div className="flex justify-center gap-4">
                        <div className="flex justify-center gap-4">
                            {signature && <div>
                                <p className="mb-2">Client Signature:</p>
                                <img src={signature} alt="Signature preview" className="mt-3 border" />
                            </div>}
                            {signatureProject && <div>
                                <p className="mb-2">Project Manager Signature:</p>
                                <img src={signatureProject} alt="Signature preview" className="mt-3 border" />
                            </div>}
                        </div>
                    </div>

                    <button type="submit" className="bg-green-500 text-white px-3 py-1 mt-3 w-full text-sm">
                        SAVE
                    </button>
                </form>
                {/*<button type="button" onClick={getDatalist} className="bg-green-500 text-white px-3 py-1 mt-3">get data</button>*/}
            </div>
        </>
    );
}

export default PunchList;
