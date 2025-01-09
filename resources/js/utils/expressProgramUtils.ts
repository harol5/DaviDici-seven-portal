import axios from "axios";
import {ProductInventory} from "../Models/Product.ts";

export async function handlePrint(
    configTitle: string,
    label: string,
    imageUrls: string[],
    defaultImage: string,
    allCurrentProducts: ProductInventory[],
    isDoubleSink: boolean,
    isDoubleSideUnit: boolean,
    grandTotal: number,
) {
    console.log(configTitle);
    console.log(label)
    console.log(imageUrls);
    console.log(defaultImage);
    console.log(allCurrentProducts);
    console.log(isDoubleSink);
    console.log(isDoubleSideUnit);
    console.log(grandTotal);

    const products: any[] = []
    allCurrentProducts.forEach(product => {
        const quantity =
            product.item === "VANITY" && isDoubleSink ||
            product.item === "SIDE UNIT" && isDoubleSideUnit ? 2 : 1

        const unitPrice = product.sprice ? product.sprice : product.msrp;

        products.push(
            {
                description: product.descw,
                compositionName: label,
                sku: product.uscode,
                unitPrice,
                quantity,
                total: quantity * unitPrice,
            }
        );
    })

    const currentConfigurationObj = {
        description: configTitle,
        image: imageUrls.length > 0 ? `storage/${imageUrls[0]}` : decodeURIComponent(new URL(defaultImage).pathname.slice(1)),
        products,
        grandTotal,
    }
    console.log(currentConfigurationObj);

    try {
        /*setIsGeneratingPdf(true);*/
        const response = await axios.post(
            "/express-program/generate-current-config-pdf",
            currentConfigurationObj,
            { responseType: "blob" } // Ensure response is properly handled as binary
        );

        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfURL = URL.createObjectURL(pdfBlob);

        /*setIsGeneratingPdf(false);*/

        // Open the PDF in a new tab
        window.open(pdfURL);
        /*const printWindow = window.open(pdfURL);
        if (printWindow) {
            printWindow.onload = () => printWindow.print();
        }*/
    } catch (error) {
        /*setIsGeneratingPdf(false);*/
        console.error("Error while generating PDF: ", error);
    }
}
