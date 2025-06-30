export const convertToDatetimeLocalFormat = (
    dateTimeString: string
  ): string => {
    if (!dateTimeString) return "";
    if (dateTimeString.includes("T")) {
      return dateTimeString;
    }
    const [datePart, timePart] = dateTimeString.split(" ");
    if (!datePart || !timePart) return "";
    const [day, month, year] = datePart.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}T${timePart}`;
  };
  export const convertDateForSearch = (datestr: string):string => {
    if (!datestr) return "";
    const date = new Date(datestr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year} 00:00:00`;
  }
  export const reserveDateForSearch = (datestr: string):string => {
    if (!datestr) return "";
    const date = new Date(datestr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}/${month}/${day}`;
  }
  export const convertDateTimeFormat = (dateTimeString: string): string => {
    if (!dateTimeString) return "";
    if (dateTimeString.includes("T")) {
      const date = new Date(dateTimeString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }
    if (dateTimeString.includes("/")) {
      return dateTimeString;
    }
    return dateTimeString;
  };