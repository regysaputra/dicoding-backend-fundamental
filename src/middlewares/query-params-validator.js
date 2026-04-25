export default function validateQueryParams(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    });

    if(error) {
      return next(error);
    }

    res.locals.validatedQuery = value;

    next();
  };
}