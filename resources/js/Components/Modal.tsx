import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface ModalProps {
    children?: ReactNode;
    show: boolean;
    customClass?: string;
    maxWidth?: string;
    closeable?: boolean;
    onClose: () => void;
}

function Modal({
    children,
    show = false,
    customClass = "",
    maxWidth = "",
    closeable = true,
    onClose = () => {},
}: ModalProps) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };
    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="modal-backdrop fixed inset-0 flex overflow-y-auto px-2 py-6 sm:px-0 z-50 transform transition-all justify-center items-center"
                onClose={close}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-gray-500/75" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <Dialog.Panel
                        className={`${customClass} bg-white rounded-lg shadow-davidiciGold/40 overflow-hidden shadow-2xl transform transition-all`}
                    >
                        {children}
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}

export default Modal;
