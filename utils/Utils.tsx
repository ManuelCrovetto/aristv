export const getPagination = (page: number, size: number) => {
    let from = ((page * size) - size)
    let to = from + (size - 1)
  
    return { from, to };
  };

  export const getDateString = (time: any) => {
    let dateTime = Date.parse(time)
    let date = new Date(dateTime)
    let day = date.getDate()
    let month = ""
    let year = date.getFullYear()
    switch(date.getMonth() + 1) {
        case 1:
            month = "January"
            break
        case 2:
            month = "February"
            break
        case 3:
            month = "March"
            break
        case 4:
            month = "April"
            break
        case 5:
            month = "May"
            break
        case 6:
            month = "June"
            break
        case 7:
            month = "July"
            break
        case 8:
            month = "August"
            break
        case 9:
            month = "September"
            break
        case 10:
            month = "October"
            break
        case 11:
            month = "November"
            break
        case 12: 
            month = "December"
            break
        default:
            month = "Unknown"
    }
    return `${day} ${month}`
  }