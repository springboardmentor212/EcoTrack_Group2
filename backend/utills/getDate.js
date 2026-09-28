const currDates = () =>{
    const date = new Date().getDate(),month = new Date().getMonth(),year = new Date().getFullYear();
    const startDate = new Date(Date.UTC(year,month,date));
    return startDate;    
}

const utcDates = (date) => {
    const newDate = new Date(date);
    const d = newDate.getDate(),m = newDate.getMonth(),y = newDate.getFullYear();
    const endDate = new Date(Date.UTC(y,m,d,23, 59, 59, 999));
    return endDate;
}

module.exports = {currDates,utcDates};