function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export function debounce(func, delay) {
  let timer

  return function (...args) {

    if (timer) {

      clearTimeout(timer)
    }
    
    timer = setTimeout(() => {
      console.log('args', args)
      func.apply(this, args)
    }, delay)
  }
}

export function filterZE(string){
  var reg=/\(?[\u4e00-\u9fa5]\)?/g
  var result=string.replace(reg,'')
  return result
}