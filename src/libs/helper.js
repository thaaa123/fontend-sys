import { omit, keys, toNumber, isNaN, isArray } from 'lodash'

/**
 * @description 将单词转换为首字母大写
 * @param {String} word 需要转化的单词
 */
export function wordUpper (word) {
  return word.replace(word[0], word[0].toUpperCase())
}

/**
 * @description 在 source 中是否至少有一个 need 中的项目
 * @param {Array} source 数据源
 * @param {Array} need 需要存在的项目
 */
export function oneOf (source, need) {
  if (isArray(need)) return need.reduce((result, item) => result || source.indexOf(item) >= 0, false)
  return source.indexOf(need) >= 0
}

/**
 * @description 在 source 包括 need
 * @param {Array} source 数据源
 * @param {Array} need 需要存在的项目
 */
export function allIn (source, need) {
  if (isArray(need)) return need.reduce((result, item) => !(result === false || source.indexOf(item) < 0), true)
  return source.indexOf(need) >= 0
}

/**
 * @description 检查一个对象是否有子元素
 * @param {Object} item 检查的对象
 * @param {String} keyname 子元素的 keyname
 */
export function hasChildren (item = {}, keyname = 'children_list') {
  return item[keyname] && isArray(item[keyname]) && item[keyname].length > 0
}

/**
 * 比较两个数组是否值一样 忽略顺序
 * @param {Array} array1 比较的数组
 * @param {Array} array2 比较的数组
 */
export function isIdenticalArray (array1, array2) {
  let result = true
  if (array1.length !== array2.length) {
    result = false
  } else {
    array1.forEach(item => {
      if (array2.indexOf(item) < 0) {
        result = false
      }
    })
  }
  return result
}

/**
 * 比较两个对象是否值一样 忽略顺序
 * @param {Array} array1 比较的对象
 * @param {Array} array2 比较的对象
 */
export function isIdenticalObject (object1, object2) {
  let result = true
  const keys1 = keys(object1)
  const keys2 = keys(object2)
  if (!isIdenticalArray(keys1, keys2)) {
    result = false
  } else {
    keys1.forEach(keyName => {
      if (object1[keyName] !== object2[keyName]) {
        result = false
      }
    })
  }
  return result
}

/**
 * @description 合法的用户名
 * @description 3~10个字符 只能是字母 数字 下划线
 * @param {String} value 需要校验的数据
 */
export function isLegalUsername (value) {
  return /^[A-Za-z_0-9]{3,12}$/.test(value)
}
/**
 * @description 同 isLegalUsername
 * @description 适用于表单校验
 */
export function isLegalUsernameValidator (rule, value, callback) {
  callback(value === '' || isLegalUsername(value) ? undefined : new Error('3~10个字符 只能是字母 数字 下划线'))
}

/**
 * @description 合法的密码
 * @description 6-15个字符 至少包括大写 小写 下划线 数字两种
 * @param {String} value 需要校验的数据
 */
export function isLegalPassword (value) {
  if (value.length < 6 || value.length > 16) {
    return false
  }
  // 如果包含上述四种以外的字符 false
  if (/[^A-Za-z_0-9]/.test(value)) {
    return false
  }
  // 如果全为大写、小写、下划线、数字, false
  if (/(^[a-z]+$)|(^[A-Z]+$)|(^_+$)|(^\d+$)/g.test(value)) {
    return false
  }
  return true
}
/**
 * @description 同 isLegalPassword
 * @description 适用于表单校验
 */
export function isLegalPasswordValidator (rule, value, callback) {
  callback(value === '' || isLegalPassword(value) ? undefined : new Error('6-15个字符，至少包括大写、小写、下划线、数字两种'))
}

/**
 * @description 合法的手机号码
 * @param {String} value 需要校验的数据
 */
export function isLegalMobilePhone (value) {
  return /^1[3-9]\d{9}$/.test(value)
}
/**
 * @description 同 isLegalMobilePhone
 * @description 适用于表单校验
 */
export function isLegalMobilePhoneValidator (rule, value, callback) {
  callback(value === '' || isLegalMobilePhone(value) ? undefined : new Error('手机号码格式不正确'))
}

/**
 * @description 合法的邮箱
 * @description 名称允许汉字、字母、数字，域名只允许英文域名
 * @param {String} value 需要校验的数据
 */
export function isLegalEmail (value) {
  return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
}

/**
 * @description 同 isLegalEmail
 * @description 适用于表单校验
 */
export function isLegalEmailValidator (rule, value, callback) {
  callback(value === '' || isLegalEmail(value) ? undefined : new Error('邮箱格式不正确'))
}

/**
 * @description 将树形数据扁平化 输出数组格式
 * @param {Object} config {Array} data 树形数据
 * @param {Object} config {String} keyChildren 子节点字段名
 * @param {Object} config {Boolean} includeChildren 输出的数据中是否包含子节点数据
 */
export function flatTreeToArray ({
  data = [],
  keyChildren = 'children_list',
  includeChildren = false
} = {}) {
  function maker (result, item) {
    result.push(includeChildren ? item : omit(item, [keyChildren]))
    if (hasChildren(item, keyChildren)) result = result.concat(item[keyChildren].reduce(maker, []))
    return result
  }
  return data.reduce(maker, [])
}

/**
 * @description 将树形数据扁平化 输出对象格式
 * @param {Object} config {Array} data 树形数据
 * @param {Object} config {String} keyChildren 子节点字段名
 * @param {Object} config {String} keyId 唯一 id 字段名
 * @param {Object} config {Boolean} includeChildren 输出的数据中是否包含子节点数据
 */
export function flatTreeToObject ({
  data = [],
  keyChildren = 'children_list',
  keyId = 'id',
  includeChildren = false
} = {}) {
  function maker (result, item) {
    result[item[keyId]] = includeChildren ? item : omit(item, [keyChildren])
    if (hasChildren(item, keyChildren)) Object.assign(result, item[keyChildren].reduce(maker, {}))
    return result
  }
  return data.reduce(maker, {})
}

/**
 * @description 传入一个值 返回处理成数字的结果
 * @param {Any} value 需要处理的值
 */
export function getNumberOrZero (value) {
  const result = toNumber(value)
  return isNaN(result) ? 0 : result
}

/**
 * @description 传入一个数组 返回对应的keys数组
 * @param {arr} value 需要处理的数组
 * @param {keyName} value key名称
 */
export function getArrayKeys (arr, keyName) {
  const array = arr.reduce((arr, cur) => {
    if (cur[keyName]) {
      arr.push(cur[keyName])
    }
    return arr
  }, [])
  return array
}

export function uuid () {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 18; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = '-'

  var uuid = s.join('')
  return uuid
}

export function arrayEquals (originArray, array) {
  if (!array) {
    return false
  }
  if (originArray.length !== array.length) {
    return false
  }

  for (var i = 0, l = originArray.length; i < l; i++) {
    // Check if we have nested arrays
    if (originArray[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!originArray[i].equals(array[i])) {
        return false
      }
    } else if (originArray[i] !== array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false
    }
  }
  return true
}

export const flattenArr = (arr) => {
  return arr.reduce((map, item) => {
    map[item.value] = item
    return map
  }, {})
}

// 获取当天 时分秒为0
export const getCurrentDate = () => {
  return pattern(new Date(), 'yyyy-MM-dd')
}

// 获取上一天 时分秒为0
export const getPreDate = (date = new Date()) => {
  return pattern(new Date(date.getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
}

// 获取下一天 时分秒为0
export const getNextDate = (date = new Date()) => {
  return pattern(new Date(date.getTime() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
}

// 获取当前日期前3个月的日期
export const getThreeMonthDate = (date = new Date()) => {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate() + 1
  var year2 = year
  var month2 = parseInt(month) - 3
  if (month2 <= 0) {
    year2 = parseInt(year2) - parseInt(parseInt(month2 / 12) === 0 ? 1 : parseInt(month2) / 12)
    month2 = 12 - (Math.abs(month2) % 12)
  }
  var day2 = day
  var days2 = new Date(year2, month2, 0)
  days2 = days2.getDate()
  if (day2 > days2) {
    day2 = days2
  }
  if (month2 < 10) {
    month2 = '0' + month2
  }
  if (day2 < 10) {
    day2 = '0' + day2
  }
  var t2 = year2 + '-' + month2 + '-' + day2
  return t2
}

export const pattern = (date, fmt) => {
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  var week = {
    0: '/u65e5',
    1: '/u4e00',
    2: '/u4e8c',
    3: '/u4e09',
    4: '/u56db',
    5: '/u4e94',
    6: '/u516d'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[date.getDay() + ''])
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

export const monDiff = (startTime, endTime, count = 3) => {
  let flag = true
  const treeMonthDate = new Date(getThreeMonthDate(new Date(endTime))).getTime()
  const startDate = new Date(startTime).getTime()
  if (treeMonthDate > startDate) {
    flag = false
  }
  return flag
}
