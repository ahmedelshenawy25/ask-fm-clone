import * as Yup from 'yup';

const askFormValidationSchema = Yup.object()
  .shape({
    question: Yup.string()
      .trim()
      .min(1)
      .max(300)
      .required()
  });

export default askFormValidationSchema;
