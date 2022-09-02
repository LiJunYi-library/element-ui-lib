export function parseDate(date, cFormat = '{y}-{m}-{d} {h}:{i}:{s}:{c}') {
  if (arguments.length === 0) {
    return null
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
    c: date.getMilliseconds()
  }
  const timeStr = cFormat.replace(/{(y|m|d|h|i|s|a|c)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = `0${value}`
    }
    return value || 0
  })
  return timeStr
}

export function parseTime(time, cFormat = '{y}-{m}-{d} {h}:{i}:{s}:{c}') {
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (`${time}`.length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }

  return parseDate(date, cFormat)
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()
  const diff = (now - d) / 1000
  if (diff < 30) {
    return '刚刚'
  }
  if (diff < 3600) {
    // less 1 hour
    return `${Math.ceil(diff / 60)}分钟前`
  }
  if (diff < 3600 * 24) {
    return `${Math.ceil(diff / 3600)}小时前`
  }
  if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  }
  return `${
    d.getMonth() + 1
  }月${d.getDate()}日${d.getHours()}时${d.getMinutes()}分`
}

export function surplusTime(endTime, option) {
  const end = new Date(endTime)
  const now = new Date()
  const time = endTime - now
  const days = parseInt(time / 1000 / 60 / 60 / 24, 10) // 计算剩余的天数
  let hours = parseInt(time / 1000 / 60 / 60, 10) // 计算剩余的小时
  let minutes = parseInt((time / 1000 / 60) % 60, 10) // 计算剩余的分钟
  let seconds = parseInt((time / 1000) % 60, 10) // 计算剩余的秒数
  // const y = end.getFullYear() - now.getFullYear();
  seconds = seconds < 10 ? `0${seconds}` : seconds
  minutes = minutes < 10 ? `0${minutes}` : minutes
  hours = hours < 10 ? `0${hours}` : hours
  return `${hours}时${minutes}分${seconds}秒`
}

export function surplusTimeObj(endTime) {
  const end = new Date(endTime)
  const now = new Date()
  const time = endTime - now
  const days = parseInt(time / 1000 / 60 / 60 / 24, 10) // 计算剩余的天数
  let hours = parseInt(time / 1000 / 60 / 60, 10) // 计算剩余的小时
  let minutes = parseInt((time / 1000 / 60) % 60, 10) // 计算剩余的分钟
  let seconds = parseInt((time / 1000) % 60, 10) // 计算剩余的秒数
  // const y = end.getFullYear() - now.getFullYear();
  seconds = seconds < 10 ? `0${seconds}` : seconds
  minutes = minutes < 10 ? `0${minutes}` : minutes
  hours = hours < 10 ? `0${hours}` : hours
  return { days, hours, minutes, seconds }
}

export function stringToDate(
  stringTime,
  format = '{y}-{m}-{d} {h}:{i}:{s}:{c}'
) {
  const obj = {}
  let type = format.replace(/{(y|m|d|h|i|s|a|c)+}/g, '').split('')
  type = Array.from(new Set(type))
  const RegExpString = type.reduce((add, val, index) => {
    if (index === type.length - 1) return add + val
    return `${add + val}|`
  }, '')
  const regexp = new RegExp(RegExpString, 'g')
  const formatArr = format.split(regexp)
  const stringTimeArr = stringTime.split(regexp)
  formatArr.forEach((element, index) => {
    obj[element] = stringTimeArr[index]
  })
  const date = new Date()
  for (const key in obj) {
    if (/y/.test(key) && obj[key]) date.setFullYear(obj[key] * 1)
    if (/m/.test(key) && obj[key]) date.setMonth(obj[key] * 1 - 1)
    if (/d/.test(key) && obj[key]) date.setDate(obj[key] * 1)
    if (/h/.test(key) && obj[key]) date.setHours(obj[key] * 1)
    if (/i/.test(key) && obj[key]) date.setMinutes(obj[key] * 1)
    if (/s/.test(key) && obj[key]) date.setSeconds(obj[key] * 1)
    if (/a/.test(key) && obj[key]) date.setDay(obj[key] * 1)
    if (/c/.test(key) && obj[key]) date.setMilliseconds(obj[key] * 1)
  }
  return date
}

export function stringTotime(
  stringTime,
  format = '{y}-{m}-{d} {h}:{i}:{s}:{c}'
) {
  return stringToDate(stringTime, format).getTime()
}
/**
 * options : {
    FullYear: 0,
    Month: 0,
    Date: 0,
    Hours: 0,
    Minutes: 0,
    Seconds: 0,
    Time: 0,
  }
 */
export function getDate(options = {}) {
  const date = new Date()
  for (const key in options) {
    if (Object.hasOwnProperty.call(options, key)) {
      date[`set${key}`](options[key])
    }
  }
  return date
}

export function getDateTime(options = {}) {
  return getDate(options).getTime()
}

export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function getAgoDate(parms = {}) {
  const date = new Date()
  const year29 = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const year28 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const MothDay = isLeapYear(date.getFullYear()) ? year29 : year28
  let options = {
    FullYear: 0,
    Month: 0,
    Date: 0,
    Hours: 0,
    Minutes: 0,
    Seconds: 0,
    Time: 0,
    Milliseconds: 0
  }
  options = Object.assign(options, parms)
  const currentDate = date.getDate()
  const optionMaxDay = MothDay[date.getMonth() + options.Month]
  if (optionMaxDay < currentDate) {
    date.setDate(optionMaxDay)
  }
  for (const key in options) {
    if (Object.hasOwnProperty.call(options, key)) {
      date[`set${key}`](date[`get${key}`]() + options[key])
    }
  }
  return date
}

export function getAgoDateTime(parms = {}) {
  const date = getAgoDate(parms)
  return date.getTime()
}

export function getAgoDateStr(parms = {}, cFormat) {
  const time = getAgoDateTime(parms)
  return parseTime(time, cFormat)
}

export function resetDate(parms) {
  const date = getAgoDate(parms)
  date.setHours(0)
  date.setSeconds(0)
  date.setMinutes(0)
  date.setMilliseconds(0)
  return date
}

export function resetDateTime(parms) {
  return resetDate(parms).getTime()
}

export function resetDateStr(parms = {}, cFormat) {
  return parseTime(resetDateTime(parms), cFormat)
}

export default {}
