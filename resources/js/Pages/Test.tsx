import UserAuthenticatedLayout from "../Layouts/UserAuthenticatedLayout";

function Test({ response }: { response: any }) {
    console.log(response);
    return (
        <UserAuthenticatedLayout crrPage="orders">
            {JSON.stringify(response, null, 1)}
        </UserAuthenticatedLayout>
    );
}

export default Test;

// const handleOptionSelected = (
//     item: string,
//     property: string,
//     option: string
// ) => {
//     if (item === "vanity") {
//         const codes = { ...currentConfiguration.vanity };
//         codes[property as "drawer" | "handle" | "finish"] = option;

//         const copyOptions = { ...vanityOptions };

//         const currentCodesArr: string[] = [];

//         for (const property in codes) {
//             const code =
//                 codes[property as "drawer" | "handle" | "finish" | "baseSku"];
//             if (code) {
//                 currentCodesArr.push(code);
//             }
//         }

//         for (const drawersOption of copyOptions.drawerOptions) {
//             if (property === "drawer") break;
//             for (let i = 0; i < drawersOption.validSkus.length; i++) {
//                 ///////////////////////////////
//                 const validSku = drawersOption.validSkus[i];
//                 if (validSku.includes(option)) {
//                     drawersOption.isDisabled = false;
//                     break;
//                 }

//                 if (i === drawersOption.validSkus.length - 1)
//                     drawersOption.isDisabled = true;
//                 ///////////////////////////////

//                 let isOptionValid: boolean = false;
//                 const validSku = drawersOption.validSkus[i];

//                 for (let j = 0; j < currentCodesArr.length; j++) {
//                     const crrCode = currentCodesArr[j];
//                     if (!validSku.includes(crrCode)) break;

//                     if (
//                         j === currentCodesArr.length - 1 &&
//                         validSku.includes(crrCode)
//                     ) {
//                         isOptionValid = true;
//                     }
//                 }

//                 if (isOptionValid) {
//                     drawersOption.isDisabled = false;
//                     break;
//                 }

//                 if (
//                     i === drawersOption.validSkus.length - 1 &&
//                     !isOptionValid
//                 )
//                     drawersOption.isDisabled = true;
//                 else drawersOption.isDisabled = false;
//             }
//         }

//         for (const handleOption of copyOptions.handleOptions) {
//             if (property === "handle") break;
//             for (let i = 0; i < handleOption.validSkus.length; i++) {
//                 ///////////////////////////////
//                 const validSku = handleOption.validSkus[i];
//                 if (validSku.includes(option)) {
//                     handleOption.isDisabled = false;
//                     break;
//                 }

//                 if (i === handleOption.validSkus.length - 1)
//                     handleOption.isDisabled = true;
//                 ///////////////////////////////

//                 let isOptionValid: boolean = false;
//                 const validSku = handleOption.validSkus[i];

//                 for (let j = 0; j < currentCodesArr.length; j++) {
//                     const crrCode = currentCodesArr[j];
//                     if (!validSku.includes(crrCode)) break;

//                     if (
//                         j === currentCodesArr.length - 1 &&
//                         validSku.includes(crrCode)
//                     ) {
//                         isOptionValid = true;
//                     }
//                 }

//                 if (isOptionValid) {
//                     handleOption.isDisabled = false;
//                     break;
//                 }

//                 if (
//                     i === handleOption.validSkus.length - 1 &&
//                     !isOptionValid
//                 )
//                     handleOption.isDisabled = true;
//                 else handleOption.isDisabled = false;
//             }
//         }

//         for (const finishOption of copyOptions.finishOptions) {
//             if (property === "finish") break;
//             for (let i = 0; i < finishOption.validSkus.length; i++) {
//                 ///////////////////////////////
//                 const validSku = finishOption.validSkus[i];
//                 if (validSku.includes(option)) {
//                     finishOption.isDisabled = false;
//                     break;
//                 }

//                 if (i === finishOption.validSkus.length - 1)
//                     finishOption.isDisabled = true;
//                 ///////////////////////////////

//                 let isOptionValid: boolean = false;
//                 const validSku = finishOption.validSkus[i];

//                 for (let j = 0; j < currentCodesArr.length; j++) {
//                     const crrCode = currentCodesArr[j];
//                     if (!validSku.includes(crrCode)) break;

//                     if (
//                         j === currentCodesArr.length - 1 &&
//                         validSku.includes(crrCode)
//                     ) {
//                         isOptionValid = true;
//                     }
//                 }

//                 if (isOptionValid) {
//                     finishOption.isDisabled = false;
//                     break;
//                 }

//                 if (
//                     i === finishOption.validSkus.length - 1 &&
//                     !isOptionValid
//                 )
//                     finishOption.isDisabled = true;
//                 else finishOption.isDisabled = false;
//             }
//         }

//         setVanityOptions(copyOptions);
//     }

//     dispatch({ type: `set-${item}-${property}`, payload: `${option}` });
// };
