const currDates = () =>{
    const date = new Date().getUTCDate(),month = new Date().getUTCMonth(),year = new Date().getUTCFullYear();
    const startDate = new Date(Date.UTC(year,month,date));
    return startDate;    
}

const utcDates = (date) => {
    const newDate = new Date(date);
    const d = newDate.getUTCDate(),m = newDate.getUTCMonth(),y = newDate.getUTCFullYear();
    const endDate = new Date(Date.UTC(y,m,d,23, 59, 59, 999));
    return endDate;
}

const getCurrentDayDates = () => {
    const today = new Date();
    const dayStart = new Date(
        Date.UTC(
         today.getUTCFullYear(),
         today.getUTCMonth(),
         today.getUTCDate(),
         0,1,0,0
    ));

    const dayEnd = new Date(
        Date.UTC(
         today.getUTCFullYear(),
         today.getUTCMonth(),
         today.getUTCDate(),
         23,58,0,0
    ));
  
    return {dayStart,dayEnd};
}

const getCurrentWeekDates = () => {
    const today = new Date();

    const day = today.getUTCDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const weekStart = new Date(
        Date.UTC(
         today.getUTCFullYear(),
         today.getUTCMonth(),
         today.getUTCDate() + diffToMonday,
         0,1,0,0
        ));

    const weekEnd = new Date(
        Date.UTC(
         weekStart.getUTCFullYear(),
         weekStart.getUTCMonth(),
         weekStart.getUTCDate() + 6,
         23,58,0,0
        ));

    return {
        weekStart,
        weekEnd
    };
};

const getCurrentMonthDates = () => {
    const today = new Date();

    const monthStart = new Date(
       Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        1,
        0, 1, 0, 0
    ));

    const monthEnd = new Date(
        Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth() + 1,
        0,
        23, 58, 0, 0
    ));

    return {
        monthStart,
        monthEnd
    };
};

module.exports = {currDates,utcDates,getCurrentDayDates,getCurrentWeekDates,getCurrentMonthDates};