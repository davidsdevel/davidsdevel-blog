const renderPost = () => async function (req, res, next) {
  console.log(req.url)
  switch (req.params.title) {
    case 'feed':
    case 'terminos':
    case 'privacidad':
    case 'search':
    case 'acerca':
    case 'resize-image':
    case 'admin':
    case 'logout':
    case 'fb-webhook':
    case 'favicon.ico':
    case 'touch-icon.png':
      return req.handle(req, res);

    default: break;
  }

  if (
    /.*\.\w\w*$/ig.test(req.url)
    || /^_|webpack|next|react-refresh|main\.js/.test(req.params.title)
  ) { return req.handle(req, res); }

  try {
    const {
      title, year, month, day, category,
    } = req.params;

    const ID = await req.db.getUrlID();
    let data;
    let url = title;

    if (ID === '1') { data = await req.db.getPostByTitle(url); }

    if (ID === '2') {
      if (!category) { return req.handle(req, res); }

      data = await req.db.getPostByCategory(category, url);
      url = `${category}/${url}`;
    }
    if (ID === '3') {
      if (day && !/^\d\d\d\d$/.test(year) && /^\d\d?$/.test(month)) { return req.handle(req, res); }

      data = await req.db.getPostByYearMonth(year, month, url);
      url = `${year}/${month}/${url}`;
    }
    if (ID === '4') {
      if (!day && !/^\d\d\d\d$/.test(year) && /^\d\d?$/.test(month) && /^\d\d?/.test(day)) { return req.handle(req, res); }

      data = await req.db.getPostByYearMonthDay(year, month, day, url);
      url = `${year}/${month}/${day}/${url}`;
    }

    req.data = {
      ...data,
      url,
    };
    req.urlID = ID;

    return next(true);
  } catch (err) {
    console.log(err);

    if (err === 'dont-exists') { return req.handle(req, res); }
  }

  return req.handle(req, res);
};

module.exports = {
  renderPost,
};
