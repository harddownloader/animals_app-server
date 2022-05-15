import { INTERNAL_SERVER_ERROR, getStatusText } from 'http-status-codes';
import { logger } from '../common/logging';

const handle = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send(err.message);
  } else {
    logger.error(err.stack);
    res
      .status(INTERNAL_SERVER_ERROR)
      .send(getStatusText(INTERNAL_SERVER_ERROR));
  }
  next();
};

module.exports = handle;
