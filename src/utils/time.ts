const formatDate = (time?: string) => {
    const date = time ? new Date(time) : new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const formatTime = (time: string) => {
    const date = new Date(time);
    const hour = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    return `${hour}:${min}`;
}
export {
    formatDate,
    formatTime
}