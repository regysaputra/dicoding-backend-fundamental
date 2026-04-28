export default function urlParamsValidator(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.params, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if(error) {
      return next(error);
    }

    next();
  };
}