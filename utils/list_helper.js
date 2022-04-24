
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
    return {}
  const reducer = (sum, item) => {
    return sum> item.likes ? sum : item.likes
  }
  const max=blogs.reduce(reducer, 0)
  const favorite=blogs.find(b => b.likes===max)
  return favorite
}

const mostBlogs = (blogs) => {
  if(blogs.length===0)
    return {}

  const reducer=(groupByAuthor, currentAuthor) => {
    const temp = groupByAuthor.find(a => a.author === currentAuthor.author)
    //author never found in table
    if (!temp) groupByAuthor.push({ ...currentAuthor,
      blogs: 1
    })
    //author already found
    else temp.blogs=temp.blogs+1
    return groupByAuthor
  }

  const dataByAuthor=blogs.reduce(reducer, [])

  const maxblog = (max, item) => {
    return max> item.blogs ? max : item.blogs
  }

  const mbAuthor=dataByAuthor.find(a => a.blogs===dataByAuthor.reduce(maxblog,0)
  )
  const most={
    'author':mbAuthor.author,
    'blogs': mbAuthor.blogs
  }
  return most
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}