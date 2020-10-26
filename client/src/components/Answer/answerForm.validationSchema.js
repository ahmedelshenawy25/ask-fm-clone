import * as Yup from 'yup';

const answerFormValidationSchema = Yup.object()
  .shape({
    answer: Yup.string()
      .trim()
      .min(1)
      .max(3000)
      .required()
  });

export default answerFormValidationSchema;
