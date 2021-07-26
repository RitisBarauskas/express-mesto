const { NotFoundError } = require("../errors");

const notFoundPage = (req, res, next) => {
  next(new NotFoundError("Запрашиваемая страница отсутствует"));
};

module.exports = { notFoundPage };
