module.exports = ({ bodySchema, paramsSchema, querySchema }) => {
  if (!bodySchema && !paramsSchema && !querySchema) {
    console.log('At least one validation schema is required');
    process.exit(1);
  }

  return (req, res, next) => {
    try {
      if (bodySchema) {
        const { value, error } = bodySchema.validate(req.body);
        if (error) throw error;
        req.body = value;
      }

      if (paramsSchema) {
        const { value, error } = paramsSchema.validate(req.params);
        if (error) throw error;
        req.params = value;
      }

      if (querySchema) {
        const { value, error } = querySchema.validate(req.query);
        if (error) throw error;
        req.query = value;
      }

      return next();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
};