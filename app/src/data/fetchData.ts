export const getPeakDays = (growthRate: number): string => {
    if (growthRate == 0) {
        return 0;
    }
    if (growthRate < 6) {
        return 3;
    }
    if (growthRate < 11) {
        return 5;
    }
    if (growthRate < 13) {
        return 6;
    }
    if (growthRate < 16) {
        return 7;
    }
    if (growthRate < 20) {
        return 11;
    }
    if (growthRate < 21) {
        return 14;
    }
    if (growthRate < 24) {
        return 15;
    }
    if (growthRate < 26) {
        return 17;
    }
    if (growthRate < 31) {
        return 20;
    }
    return 30;
};

export const getPeakCases = (growthRate: number, cases: number): number => {
    if (growthRate === 0) {
            return cases;
    }
    if (growthRate < 6) {
            return cases * 1.1;
    }
    if (growthRate < 11) {
            return cases * 1.25;
    }
    if (growthRate < 13) {
            return cases * 1.55;
    }
    if (growthRate < 16) {
            return cases * 2.5;
    }
    if (growthRate < 20) {
            return cases * 5;
    }
    if (growthRate < 21) {
            return cases * 8;
    }
    if (growthRate < 24) {
            return cases * 12;
    }
    if (growthRate < 26) {
            return cases * 14;
    }
    if (growthRate < 31) {
            return cases * 33;
    }
    return cases * 48;
};
