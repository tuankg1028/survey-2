import HttpStatus from "http-status-codes";
export default {
  ERR_400: (res, message = "BAD REQUEST") =>
    res.status(HttpStatus.BAD_REQUEST).send({
      message
    }),
  ERR_401: (res, message = "UNAUTHORIZED") =>
    res.status(HttpStatus.UNAUTHORIZED).send({
      message
    }),
  ERR_403: (res, message = "FORBIDDEN") =>
    res
      .status(HttpStatus.FORBIDDEN)
      .send({
        message
      })
      .end(),
  ERR_404: (res, message = "NOT FOUND") =>
    res.status(HttpStatus.NOT_FOUND).send({
      message
    }),
  ERR_409: (res, message = "CONFLICT") =>
    res.status(HttpStatus.CONFLICT).send({
      message
    }),
  ERR_422: (res, message = []) =>
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
      message
    })
};
