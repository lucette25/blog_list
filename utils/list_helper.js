const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if(blogs.length===0)
    return []
  const reducer = (sum, item) => {
    return sum> item.likes ? sum : item.likes
  }
  const max=blogs.reduce(reducer, 0)
  const favorite=blogs.find(p => p.likes===max)
  return favorite
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}