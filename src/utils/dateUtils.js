export function formatDate(time) {

  if (!time) return ''
  let date = new Date(time)
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  if(hours < 10) hours = '0' + hours;
  if(minutes < 10) minutes = '0' + minutes;
  if(seconds < 10) seconds = '0' + seconds;
  
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
                            + ' ' + hours + ':' + minutes + ':' + seconds
}