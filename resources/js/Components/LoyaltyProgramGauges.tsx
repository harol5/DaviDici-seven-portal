import { useMemo } from "react";
import classes from "../../css/loyalty-program.module.css";

type monthCommissionInfo = {
    l1comm: number; // $amount commission level 1.
    l1percent: number; // %commission level 1.
    l1sum: number; // $amount sold level 1.
    l2comm: number; // $amount commission level 2.
    l2need: number; // $amount left to reach level 1 $amount goal.
    l2percent: number; // %commission level 2.
    l2sum: number; // $amount sold level 2.
    l2total: number; // $amount commission with %commission level 2 when reached $amount goal.
    level1: number; // $amount goal.
    level2: number;
    monyear: string;
    wholesaler: string;
};

interface LoyaltyProgramGaugesProps {
    commissionInfo: monthCommissionInfo[];
}

function LoyaltyProgramGauges({ commissionInfo }: LoyaltyProgramGaugesProps) {
    const currentMonth = useMemo(() => {
        commissionInfo.forEach((month) => {
            month.monyear = month.monyear.replace(/\s/g, "");
        });

        commissionInfo.sort(
            (a: monthCommissionInfo, b: monthCommissionInfo) => {
                const valueA = a.monyear.toUpperCase();
                const valueB = b.monyear.toUpperCase();

                if (valueA < valueB) return -1;
                if (valueA > valueB) return 1;
                return 0;
            }
        );

        const latestMonth = commissionInfo[0];

        const obj = {
            currentSales: {
                dollarAmountToTarget: 0,
                dollarAmountGoal: 0,
                dollarAmountSold: 0,
                currentSalesGaugeFillerDeg: 0,
            },
            currentCommission: {
                currentDollarAmountCommission: 0,
                currentCommPercent: 0,
                goalCommPercent: 0,
                goalDollarAmountCommission: 0,
                currentCommissionGaugeFillerDeg: 0,
            },
        };

        if (latestMonth.l2need !== 0) {
            obj.currentSales.dollarAmountToTarget = latestMonth.l2need;
            obj.currentSales.dollarAmountGoal = latestMonth.level1;
            obj.currentSales.dollarAmountSold = latestMonth.l1sum;
            obj.currentSales.currentSalesGaugeFillerDeg =
                (latestMonth.l1sum * 180) / latestMonth.level1;

            obj.currentCommission.currentDollarAmountCommission =
                latestMonth.l1comm;
            obj.currentCommission.currentCommPercent = latestMonth.l1percent;
            obj.currentCommission.goalCommPercent = latestMonth.l2percent;
            obj.currentCommission.goalDollarAmountCommission =
                latestMonth.l2total;
            obj.currentCommission.currentCommissionGaugeFillerDeg =
                (latestMonth.l1comm * 180) / latestMonth.l2total;
        } else {
            obj.currentSales.dollarAmountToTarget = latestMonth.l2need;
            obj.currentSales.dollarAmountGoal = latestMonth.level1;
            obj.currentSales.dollarAmountSold = latestMonth.l2sum;
            obj.currentSales.currentSalesGaugeFillerDeg = 180;

            obj.currentCommission.currentDollarAmountCommission =
                latestMonth.l2comm;
            obj.currentCommission.currentCommPercent = latestMonth.l2percent;
            obj.currentCommission.goalCommPercent = latestMonth.l2percent;
            obj.currentCommission.goalDollarAmountCommission =
                latestMonth.l2total;
            obj.currentCommission.currentCommissionGaugeFillerDeg = 180;
        }

        document.documentElement.style.cssText = `
            --current-sales-gauge-deg: ${obj.currentSales.currentSalesGaugeFillerDeg}deg;
            --current-comm-gauge-deg: ${obj.currentCommission.currentCommissionGaugeFillerDeg}deg;
        `;

        return obj;
    }, []);

    console.log(commissionInfo);
    console.log(currentMonth);

    return (
        <section className={classes.allGauges}>
            <div className={classes.loyaltyProgramHeader}>
                <h1 className={classes.currentMonth}>July 2024</h1>
                <h1 className={classes.loyaltyProgramTitle}>Loyalty Program</h1>
            </div>
            <div className={classes.titleAndGaugeWrapper}>
                <h1>Current Sales</h1>
                <div className={classes.loyaltyProgramGaugeWrapper}>
                    <div className={classes.gaugeMainInfo}>
                        <h1>
                            ${currentMonth.currentSales.dollarAmountToTarget}
                        </h1>
                        <p>To Target</p>
                    </div>
                    <h1 className={classes.gaugeGoalAmount}>
                        ${currentMonth.currentSales.dollarAmountGoal}
                    </h1>
                    <svg
                        // width="410"
                        viewBox="0 0 644 644"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="Frame 11" clipPath="url(#clip0_545_280)">
                            <g className={classes.currentSalesGaugeFiller}>
                                <mask id="path-1-inside-1_545_280" fill="white">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M0.000638514 322C0.000211249 322.214 2.81251e-05 322.428 2.81064e-05 322.642C1.25837e-05 500.201 143.94 644.142 321.5 644.142C499.06 644.142 643 500.201 643 322.642C643 322.428 643 322.214 642.999 322L626.315 322C626.315 322 626.315 322 626.315 322C626.315 470.853 505.647 591.521 356.794 591.521C207.942 591.521 87.2735 470.852 87.2735 322L0.000638514 322Z"
                                    />
                                </mask>
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M0.000638514 322C0.000211249 322.214 2.81251e-05 322.428 2.81064e-05 322.642C1.25837e-05 500.201 143.94 644.142 321.5 644.142C499.06 644.142 643 500.201 643 322.642C643 322.428 643 322.214 642.999 322L626.315 322C626.315 322 626.315 322 626.315 322C626.315 470.853 505.647 591.521 356.794 591.521C207.942 591.521 87.2735 470.852 87.2735 322L0.000638514 322Z"
                                    fill="#D2AC69"
                                />
                                <path
                                    d="M0.000638514 322L0.000642448 321L-0.997366 321L-0.999359 321.998L0.000638514 322ZM642.999 322L643.999 321.998L643.997 321L642.999 321L642.999 322ZM626.315 322L626.315 321L625.315 321L625.315 322L626.315 322ZM87.2735 322L88.2735 322L88.2735 321L87.2735 321L87.2735 322ZM-0.999359 321.998C-0.999788 322.212 -0.999972 322.427 -0.999972 322.642L1.00003 322.642C1.00003 322.428 1.00021 322.215 1.00064 322.002L-0.999359 321.998ZM-0.999972 322.642C-0.999987 500.753 143.388 645.142 321.5 645.142L321.5 643.142C144.493 643.142 1.00001 499.649 1.00003 322.642L-0.999972 322.642ZM321.5 645.142C499.612 645.142 644 500.753 644 322.642L642 322.642C642 499.649 498.507 643.142 321.5 643.142L321.5 645.142ZM644 322.642C644 322.427 644 322.212 643.999 321.998L641.999 322.002C642 322.215 642 322.428 642 322.642L644 322.642ZM642.999 321L626.315 321L626.315 323L642.999 323L642.999 321ZM627.315 322C627.315 322 627.315 322 627.315 322C627.315 322 627.315 322 627.315 322L625.315 322C625.315 322 625.315 322 625.315 322C625.315 322 625.315 322 625.315 322L627.315 322ZM356.794 592.521C506.199 592.521 627.315 471.405 627.315 322L625.315 322C625.315 470.3 505.094 590.521 356.794 590.521L356.794 592.521ZM86.2735 322C86.2735 471.405 207.39 592.521 356.794 592.521L356.794 590.521C208.494 590.521 88.2735 470.3 88.2735 322L86.2735 322ZM87.2735 321L0.000642448 321L0.00063458 323L87.2735 323L87.2735 321Z"
                                    fill="#D1AA68"
                                    mask="url(#path-1-inside-1_545_280)"
                                />
                            </g>
                            <g clipPath="url(#clip1_545_280)">
                                <path
                                    id="Vector"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M641.717 321.359C641.717 144.429 498.288 1 321.359 1C144.429 1 1 144.429 1 321.359C1 321.572 1.00021 321.786 1.00063 322H0.000626547C0.000208913 321.786 0 321.572 0 321.359C0 143.877 143.877 0 321.359 0C498.84 0 642.717 143.877 642.717 321.359C642.717 321.572 642.717 321.786 642.716 322H641.716C641.717 321.786 641.717 321.572 641.717 321.359ZM555.482 321.817C555.383 173.114 434.805 52.5976 286.08 52.5976C137.304 52.5976 16.6948 173.196 16.6773 321.968V321H1.28287V322H16.6773H555.482H641.434V321H555.482V321.817Z"
                                    fill="white"
                                />
                                <g id="Mask group">
                                    <mask
                                        id="mask0_545_280"
                                        maskUnits="userSpaceOnUse"
                                        x="0"
                                        y="0"
                                        width="643"
                                        height="322"
                                    >
                                        <g id="Group">
                                            <path
                                                id="Vector_2"
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M641.717 321.359C641.717 144.429 498.288 1 321.359 1C144.429 1 1 144.429 1 321.359C1 321.572 1.00021 321.786 1.00063 322H0.000626547C0.000208913 321.786 0 321.572 0 321.359C0 143.877 143.877 0 321.359 0C498.84 0 642.717 143.877 642.717 321.359C642.717 321.572 642.717 321.786 642.716 322H641.716C641.717 321.786 641.717 321.572 641.717 321.359ZM555.482 321.817C555.383 173.114 434.805 52.5976 286.08 52.5976C137.304 52.5976 16.6948 173.196 16.6773 321.968V321H1.28287V322H16.6773H555.482H641.434V321H555.482V321.817Z"
                                                fill="white"
                                            />
                                        </g>
                                    </mask>
                                    <g mask="url(#mask0_545_280)">
                                        <path
                                            id="Vector_3"
                                            d="M1.00063 322V323H2.00259L2.00063 321.998L1.00063 322ZM0.000626564 322L-0.999372 322.002L-0.997422 323H0.000626564V322ZM642.716 322V323H643.714L643.716 322.002L642.716 322ZM641.716 322L640.716 321.998L640.714 323H641.716V322ZM555.482 321.817H554.482H556.482H555.482ZM16.6773 321.968H15.6773H17.6773H16.6773ZM16.6773 321H17.6773V320H16.6773V321ZM1.28287 321V320H0.282869V321H1.28287ZM1.28287 322H0.282869V323H1.28287V322ZM641.434 322V323H642.434V322H641.434ZM641.434 321H642.434V320H641.434V321ZM555.482 321V320H554.482V321H555.482ZM321.359 2C497.735 2 640.717 144.982 640.717 321.359H642.717C642.717 143.877 498.84 0 321.359 0V2ZM2 321.359C2 144.982 144.982 2 321.359 2V0C143.877 0 0 143.877 0 321.359H2ZM2.00063 321.998C2.00021 321.785 2 321.572 2 321.359H0C0 321.573 0.000210198 321.788 0.000630379 322.002L2.00063 321.998ZM0.000626564 323H1.00063V321H0.000626564V323ZM-1 321.359C-1 321.573 -0.99979 321.788 -0.999372 322.002L1.00062 321.998C1.00021 321.785 1 321.572 1 321.359H-1ZM321.359 -1C143.325 -1 -1 143.325 -1 321.359H1C1 144.429 144.429 1 321.359 1V-1ZM643.717 321.359C643.717 143.325 499.392 -1 321.359 -1V1C498.288 1 641.717 144.429 641.717 321.359H643.717ZM643.716 322.002C643.717 321.787 643.717 321.573 643.717 321.359H641.717C641.717 321.572 641.717 321.785 641.716 321.998L643.716 322.002ZM641.716 323H642.716V321H641.716V323ZM640.717 321.359C640.717 321.572 640.717 321.785 640.716 321.998L642.716 322.002C642.717 321.787 642.717 321.573 642.717 321.359H640.717ZM286.08 53.5976C434.253 53.5976 554.383 173.667 554.482 321.817H556.482C556.383 172.562 435.358 51.5976 286.08 51.5976V53.5976ZM17.6773 321.968C17.6947 173.748 137.856 53.5976 286.08 53.5976V51.5976C136.751 51.5976 15.6949 172.644 15.6773 321.968H17.6773ZM15.6773 321V321.968H17.6773V321H15.6773ZM1.28287 322H16.6773V320H1.28287V322ZM2.28287 322V321H0.282869V322H2.28287ZM16.6773 321H1.28287V323H16.6773V321ZM555.482 321H16.6773V323H555.482V321ZM641.434 321H555.482V323H641.434V321ZM640.434 321V322H642.434V321H640.434ZM555.482 322H641.434V320H555.482V322ZM556.482 321.817V321H554.482V321.817H556.482Z"
                                            fill="#D2AC69"
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                        <defs>
                            <clipPath id="clip0_545_280">
                                <rect width="644" height="644" fill="white" />
                            </clipPath>
                            <clipPath id="clip1_545_280">
                                <rect width="643" height="322" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </div>
            <div className={classes.titleAndGaugeWrapper}>
                <h1>Current Commission</h1>
                <div className={classes.loyaltyProgramGaugeWrapper}>
                    <div className={classes.gaugeMainInfo}>
                        <h1>
                            $
                            {
                                currentMonth.currentCommission
                                    .currentDollarAmountCommission
                            }
                        </h1>
                        <p>
                            {currentMonth.currentCommission.currentCommPercent}%
                            Commission
                        </p>
                    </div>
                    <h1 className={classes.gaugeGoalAmount}>
                        {currentMonth.currentCommission.goalCommPercent}%
                    </h1>
                    <svg
                        // width="410"
                        viewBox="0 0 644 644"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="Frame 11" clipPath="url(#clip0_545_280)">
                            <g className={classes.currentCommGaugeFiller}>
                                <mask id="path-1-inside-1_545_280" fill="white">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M0.000638514 322C0.000211249 322.214 2.81251e-05 322.428 2.81064e-05 322.642C1.25837e-05 500.201 143.94 644.142 321.5 644.142C499.06 644.142 643 500.201 643 322.642C643 322.428 643 322.214 642.999 322L626.315 322C626.315 322 626.315 322 626.315 322C626.315 470.853 505.647 591.521 356.794 591.521C207.942 591.521 87.2735 470.852 87.2735 322L0.000638514 322Z"
                                    />
                                </mask>
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M0.000638514 322C0.000211249 322.214 2.81251e-05 322.428 2.81064e-05 322.642C1.25837e-05 500.201 143.94 644.142 321.5 644.142C499.06 644.142 643 500.201 643 322.642C643 322.428 643 322.214 642.999 322L626.315 322C626.315 322 626.315 322 626.315 322C626.315 470.853 505.647 591.521 356.794 591.521C207.942 591.521 87.2735 470.852 87.2735 322L0.000638514 322Z"
                                    fill="#D2AC69"
                                />
                                <path
                                    d="M0.000638514 322L0.000642448 321L-0.997366 321L-0.999359 321.998L0.000638514 322ZM642.999 322L643.999 321.998L643.997 321L642.999 321L642.999 322ZM626.315 322L626.315 321L625.315 321L625.315 322L626.315 322ZM87.2735 322L88.2735 322L88.2735 321L87.2735 321L87.2735 322ZM-0.999359 321.998C-0.999788 322.212 -0.999972 322.427 -0.999972 322.642L1.00003 322.642C1.00003 322.428 1.00021 322.215 1.00064 322.002L-0.999359 321.998ZM-0.999972 322.642C-0.999987 500.753 143.388 645.142 321.5 645.142L321.5 643.142C144.493 643.142 1.00001 499.649 1.00003 322.642L-0.999972 322.642ZM321.5 645.142C499.612 645.142 644 500.753 644 322.642L642 322.642C642 499.649 498.507 643.142 321.5 643.142L321.5 645.142ZM644 322.642C644 322.427 644 322.212 643.999 321.998L641.999 322.002C642 322.215 642 322.428 642 322.642L644 322.642ZM642.999 321L626.315 321L626.315 323L642.999 323L642.999 321ZM627.315 322C627.315 322 627.315 322 627.315 322C627.315 322 627.315 322 627.315 322L625.315 322C625.315 322 625.315 322 625.315 322C625.315 322 625.315 322 625.315 322L627.315 322ZM356.794 592.521C506.199 592.521 627.315 471.405 627.315 322L625.315 322C625.315 470.3 505.094 590.521 356.794 590.521L356.794 592.521ZM86.2735 322C86.2735 471.405 207.39 592.521 356.794 592.521L356.794 590.521C208.494 590.521 88.2735 470.3 88.2735 322L86.2735 322ZM87.2735 321L0.000642448 321L0.00063458 323L87.2735 323L87.2735 321Z"
                                    fill="#D1AA68"
                                    mask="url(#path-1-inside-1_545_280)"
                                />
                            </g>
                            <g clipPath="url(#clip1_545_280)">
                                <path
                                    id="Vector"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M641.717 321.359C641.717 144.429 498.288 1 321.359 1C144.429 1 1 144.429 1 321.359C1 321.572 1.00021 321.786 1.00063 322H0.000626547C0.000208913 321.786 0 321.572 0 321.359C0 143.877 143.877 0 321.359 0C498.84 0 642.717 143.877 642.717 321.359C642.717 321.572 642.717 321.786 642.716 322H641.716C641.717 321.786 641.717 321.572 641.717 321.359ZM555.482 321.817C555.383 173.114 434.805 52.5976 286.08 52.5976C137.304 52.5976 16.6948 173.196 16.6773 321.968V321H1.28287V322H16.6773H555.482H641.434V321H555.482V321.817Z"
                                    fill="white"
                                />
                                <g id="Mask group">
                                    <mask
                                        id="mask0_545_280"
                                        maskUnits="userSpaceOnUse"
                                        x="0"
                                        y="0"
                                        width="643"
                                        height="322"
                                    >
                                        <g id="Group">
                                            <path
                                                id="Vector_2"
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M641.717 321.359C641.717 144.429 498.288 1 321.359 1C144.429 1 1 144.429 1 321.359C1 321.572 1.00021 321.786 1.00063 322H0.000626547C0.000208913 321.786 0 321.572 0 321.359C0 143.877 143.877 0 321.359 0C498.84 0 642.717 143.877 642.717 321.359C642.717 321.572 642.717 321.786 642.716 322H641.716C641.717 321.786 641.717 321.572 641.717 321.359ZM555.482 321.817C555.383 173.114 434.805 52.5976 286.08 52.5976C137.304 52.5976 16.6948 173.196 16.6773 321.968V321H1.28287V322H16.6773H555.482H641.434V321H555.482V321.817Z"
                                                fill="white"
                                            />
                                        </g>
                                    </mask>
                                    <g mask="url(#mask0_545_280)">
                                        <path
                                            id="Vector_3"
                                            d="M1.00063 322V323H2.00259L2.00063 321.998L1.00063 322ZM0.000626564 322L-0.999372 322.002L-0.997422 323H0.000626564V322ZM642.716 322V323H643.714L643.716 322.002L642.716 322ZM641.716 322L640.716 321.998L640.714 323H641.716V322ZM555.482 321.817H554.482H556.482H555.482ZM16.6773 321.968H15.6773H17.6773H16.6773ZM16.6773 321H17.6773V320H16.6773V321ZM1.28287 321V320H0.282869V321H1.28287ZM1.28287 322H0.282869V323H1.28287V322ZM641.434 322V323H642.434V322H641.434ZM641.434 321H642.434V320H641.434V321ZM555.482 321V320H554.482V321H555.482ZM321.359 2C497.735 2 640.717 144.982 640.717 321.359H642.717C642.717 143.877 498.84 0 321.359 0V2ZM2 321.359C2 144.982 144.982 2 321.359 2V0C143.877 0 0 143.877 0 321.359H2ZM2.00063 321.998C2.00021 321.785 2 321.572 2 321.359H0C0 321.573 0.000210198 321.788 0.000630379 322.002L2.00063 321.998ZM0.000626564 323H1.00063V321H0.000626564V323ZM-1 321.359C-1 321.573 -0.99979 321.788 -0.999372 322.002L1.00062 321.998C1.00021 321.785 1 321.572 1 321.359H-1ZM321.359 -1C143.325 -1 -1 143.325 -1 321.359H1C1 144.429 144.429 1 321.359 1V-1ZM643.717 321.359C643.717 143.325 499.392 -1 321.359 -1V1C498.288 1 641.717 144.429 641.717 321.359H643.717ZM643.716 322.002C643.717 321.787 643.717 321.573 643.717 321.359H641.717C641.717 321.572 641.717 321.785 641.716 321.998L643.716 322.002ZM641.716 323H642.716V321H641.716V323ZM640.717 321.359C640.717 321.572 640.717 321.785 640.716 321.998L642.716 322.002C642.717 321.787 642.717 321.573 642.717 321.359H640.717ZM286.08 53.5976C434.253 53.5976 554.383 173.667 554.482 321.817H556.482C556.383 172.562 435.358 51.5976 286.08 51.5976V53.5976ZM17.6773 321.968C17.6947 173.748 137.856 53.5976 286.08 53.5976V51.5976C136.751 51.5976 15.6949 172.644 15.6773 321.968H17.6773ZM15.6773 321V321.968H17.6773V321H15.6773ZM1.28287 322H16.6773V320H1.28287V322ZM2.28287 322V321H0.282869V322H2.28287ZM16.6773 321H1.28287V323H16.6773V321ZM555.482 321H16.6773V323H555.482V321ZM641.434 321H555.482V323H641.434V321ZM640.434 321V322H642.434V321H640.434ZM555.482 322H641.434V320H555.482V322ZM556.482 321.817V321H554.482V321.817H556.482Z"
                                            fill="#D2AC69"
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                        <defs>
                            <clipPath id="clip0_545_280">
                                <rect width="644" height="644" fill="white" />
                            </clipPath>
                            <clipPath id="clip1_545_280">
                                <rect width="643" height="322" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </div>
        </section>
    );
}

export default LoyaltyProgramGauges;
