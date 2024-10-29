export function isSameDate(d1: Date, d2: Date): boolean {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}

export const calculateHoursDifference = (date1: Date, date2: Date): number => {
    const differenceInMilliseconds = Math.abs(date2.getTime() - date1.getTime());
    return differenceInMilliseconds / (1000 * 60 * 60); 
};

export const compareTimeWithDate = (inputTime: string, dateObj: Date): boolean => {
    const [inputHours, inputMinutes] = inputTime.split(':').map(Number);
    const dateHours = dateObj.getHours();
    const dateMinutes = dateObj.getMinutes();

    if (inputHours > dateHours) {
        return true;
    } else if (inputHours === dateHours && inputMinutes > dateMinutes) {
        return true;
    }

    return false;
};

export const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatTime = (dateTimeString: Date) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};
