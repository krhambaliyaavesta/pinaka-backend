import { ObjectSchema } from "joi";

interface ValidationSuccess {
  success: true;
  value: any;
}

interface ValidationFailure {
  success: false;
  error: {
    message: string;
  };
}

type ValidationResult = ValidationSuccess | ValidationFailure;

/**
 * Validates request data against a Joi schema
 */
export function validateRequest(
  data: any,
  schema: ObjectSchema
): ValidationResult {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };

  const { error, value } = schema.validate(data, options);

  if (error) {
    return {
      success: false,
      error: {
        message: `Validation error: ${error.details
          .map((x) => x.message)
          .join(", ")}`,
      },
    };
  }

  return {
    success: true,
    value,
  };
}
