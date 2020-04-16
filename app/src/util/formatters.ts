
export const getDateParts = (date: Date) => {
    return {
        day: `0${date.getUTCDate()}`.slice(-2),
        month: `0${date.getUTCMonth() + 1}`.slice(-2),
        year: date.getFullYear()
    }
};


export const stringToInt = (strVal: string | number) => (parseInt(String(strVal).split(',').join('')) || 0);
