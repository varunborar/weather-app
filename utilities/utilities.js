module.exports = function format(seconds) {

    let ans = "";
    let daysOfMonth = [31, 28, 31, 30, 31, 30,
        31, 31, 30, 31, 30, 31
    ];
    let currYear, daysTillNow, extraTime,
        extraDays, index, date, month, hours,
        minutes, secondss, flag = 0;
    daysTillNow = parseInt(seconds / (24 * 60 * 60), 10);
    extraTime = seconds % (24 * 60 * 60);
    currYear = 1970;
    while (daysTillNow >= 365) {
        if (currYear % 400 == 0 ||
            (currYear % 4 == 0 &&
                currYear % 100 != 0)) {
            daysTillNow -= 366;
        } else {
            daysTillNow -= 365;
        }
        currYear += 1;
    }
    extraDays = daysTillNow + 1;

    if (currYear % 400 == 0 ||
        (currYear % 4 == 0 &&
            currYear % 100 != 0))
        flag = 1;
    month = 0;
    index = 0;
    if (flag == 1) {
        while (true) {
            if (index == 1) {
                if (extraDays - 29 < 0)
                    break;

                month += 1;
                extraDays -= 29;
            } else {
                if (extraDays -
                    daysOfMonth[index] < 0) {
                    break;
                }
                month += 1;
                extraDays -= daysOfMonth[index];
            }
            index += 1;
        }
    } else {
        while (true) {
            if (extraDays - daysOfMonth[index] < 0) {
                break;
            }
            month += 1;
            extraDays -= daysOfMonth[index];
            index += 1;
        }
    }

    // Current Month
    if (extraDays > 0) {
        month += 1;
        date = extraDays;
    } else {
        if (month == 2 && flag == 1)
            date = 29;
        else {
            date = daysOfMonth[month - 1];
        }
    }
    hours = parseInt(extraTime / 3600, 10);
    minutes = parseInt((extraTime % 3600) / 60, 10);

    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}