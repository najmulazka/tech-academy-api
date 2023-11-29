module.exports = {
  getPagination: (req, count, limit, page) => {
    let result = {};
    let link = {};
    let path = `${req.protocol}://${req.get('host')}` + req.baseUrl + req.path;

    if (count - limit * page <= 0) {
      link.next = '';
      if (page - 1 <= 0) {
        link.prev = '';
      } else {
        link.prev = `${path}?limit=${limit}&page=${page - 1}`;
      }
    } else {
      link.next = `${path}?limit=${limit}&page${page + 1}`;
      if (page - 1 <= 0) {
        link.prev = '';
      } else {
        link.prev = `${path}?limit=${limit}&page=${page - 1}`;
      }
    }

    result.links = link;
    result.total_items = count;

    return result;
  },
};
