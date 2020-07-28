const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let total = 0
  for (let i = 0; i < blogs.length; i++) {
    total += blogs[i].likes
  }
  return total
}

const mostLikes = (blogs) => {
  let most = 0
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > most) {
      most = blogs[i].likes
    }
  }
  return most
}

module.exports = {
  dummy,
  totalLikes,
  mostLikes
}