/*
* Get the date <timeLength> ago (from current date)
* */
export const getStartDate = (timeLength: string) => {
    const today = new Date();
    let startDate = new Date();
    
    if(timeLength === '7 Days') {
        startDate.setDate(today.getDate() - 7);
    } else if (timeLength === '1 Month') {
        startDate.setMonth(today.getMonth() - 1);
    } else if (timeLength === '3 Months') {
        startDate.setMonth(today.getMonth() - 3);
    } else if (timeLength === '1 Year') {
        startDate.setFullYear(today.getFullYear() - 1);
    } else if (timeLength === '3 Years') {
        startDate.setFullYear(today.getFullYear() - 3);
    } else if (timeLength === '5 Years') {
        startDate.setFullYear(today.getFullYear() - 5);
    }
    
    const year = startDate.getFullYear();
    // getMonth() returns 0-indexed month, so add 1.
    // padStart(2, '0') ensures two digits (e.g., 1 becomes 01).
    const month = String(startDate.getMonth() + 1).padStart(2, '0');
    // getDate() returns the day of the month.
    const day = String(startDate.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

export const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}