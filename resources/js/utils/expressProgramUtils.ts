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

    try {
        const response = await axios.post(
            "/express-program/generate-current-config-pdf",
            currentConfigurationObj,
            { responseType: "blob" } // Ensure response is properly handled as binary
        );
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfURL = URL.createObjectURL(pdfBlob);
        window.open(pdfURL);
    } catch (error) {
        console.error("Error while generating PDF: ", error);
    }
}
