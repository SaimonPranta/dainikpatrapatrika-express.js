const getQueries = (search) => {
    if (!search) {
        return {}
    }
    let query = {
        $or: [
          {
            title: new RegExp(search, "i")
          },
          {
            category: new RegExp(search, "i")
          },
          {
            subcategory: new RegExp(search, "i")
          },
        ]
      }

      return query
}


module.exports = { getQueries }