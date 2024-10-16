import { useEffect, useState } from "react";
import classes from "../../../css/image-slider.module.css";
import Modal from "../Modal";

interface ImageSlider {
    imageUrls: string[];
    defaultImage: string;
}

function ImageSlider({ imageUrls, defaultImage }: ImageSlider) {
    const [crrImageIndex, setCrrImageIndex] = useState(0);
    const [openCompositionImageModal, setOpenCompositionImageModal] =
        useState(false);

    const handleArrows = (imageIndex: number) => {
        if (imageIndex < 0 || imageIndex > imageUrls.length - 1) return;
        setCrrImageIndex(imageIndex);
    };

    useEffect(() => {
        setCrrImageIndex(0);
    }, [imageUrls]);

    return (
        <>
            <div className={classes.imageSlider}>
                {imageUrls.length === 0 && (
                    <img
                        src={defaultImage}
                        alt="product image"
                        onError={(e) => {
                            (e.target as HTMLImageElement).onerror = null;
                            (e.target as HTMLImageElement).src =
                                "https://portal.davidici.com/images/express-program/not-image.jpg";
                        }}
                    />
                )}
                <div className={classes.imagesContainer}>
                    {imageUrls.map((image, index) => (
                        <img
                            key={index}
                            src={`https://${location.hostname}/${image}`}
                            className={
                                crrImageIndex === index
                                    ? classes.display
                                    : classes.hide
                            }
                        />
                    ))}
                </div>
                {imageUrls.length > 1 && (
                    <>
                        <div className={classes.indicatorsContainer}>
                            {imageUrls.map((image, index) => (
                                <span
                                    key={index}
                                    onClick={() => setCrrImageIndex(index)}
                                    className={
                                        crrImageIndex === index
                                            ? `${classes.indicator} ${classes.active}`
                                            : classes.indicator
                                    }
                                ></span>
                            ))}
                        </div>
                        <div className={classes.arrowsContainer}>
                            <img
                                className={classes.arrows}
                                src={`https://${location.hostname}/images/left-arrow.svg`}
                                alt="arrow pointing left"
                                onClick={() => handleArrows(crrImageIndex - 1)}
                            />
                            <img
                                className={classes.arrows}
                                src={`https://${location.hostname}/images/right-arrow.svg`}
                                alt="arrow pointing right"
                                onClick={() => handleArrows(crrImageIndex + 1)}
                            />
                        </div>
                    </>
                )}
                {/* <button onClick={() => setOpenCompositionImageModal(true)}>
                    open big
                </button> */}
            </div>
            <Modal
                show={openCompositionImageModal}
                onClose={() => setOpenCompositionImageModal(false)}
                customClass={classes.imageSliderModal}
            >
                <button onClick={() => setOpenCompositionImageModal(false)}>
                    close
                </button>
                <div className={classes.imageSlider}>
                    {imageUrls.length === 0 && (
                        <img
                            src={defaultImage}
                            alt="product image"
                            onError={(e) => {
                                (e.target as HTMLImageElement).onerror = null;
                                (e.target as HTMLImageElement).src =
                                    "https://portal.davidici.com/images/express-program/not-image.jpg";
                            }}
                        />
                    )}
                    <div className={classes.imagesContainer}>
                        {imageUrls.map((image, index) => (
                            <img
                                key={index}
                                src={`https://${location.hostname}/${image}`}
                                className={
                                    crrImageIndex === index
                                        ? classes.display
                                        : classes.hide
                                }
                            />
                        ))}
                    </div>
                    {imageUrls.length > 1 && (
                        <>
                            <div className={classes.indicatorsContainer}>
                                {imageUrls.map((image, index) => (
                                    <span
                                        key={index}
                                        onClick={() => setCrrImageIndex(index)}
                                        className={
                                            crrImageIndex === index
                                                ? `${classes.indicator} ${classes.active}`
                                                : classes.indicator
                                        }
                                    ></span>
                                ))}
                            </div>
                            <div className={classes.arrowsContainer}>
                                <img
                                    className={classes.arrows}
                                    src={`https://${location.hostname}/images/left-arrow.svg`}
                                    alt="arrow pointing left"
                                    onClick={() =>
                                        handleArrows(crrImageIndex - 1)
                                    }
                                />
                                <img
                                    className={classes.arrows}
                                    src={`https://${location.hostname}/images/right-arrow.svg`}
                                    alt="arrow pointing right"
                                    onClick={() =>
                                        handleArrows(crrImageIndex + 1)
                                    }
                                />
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </>
    );
}

export default ImageSlider;
