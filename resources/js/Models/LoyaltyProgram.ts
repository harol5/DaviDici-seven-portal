export type monthCommissionInfo = {
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
