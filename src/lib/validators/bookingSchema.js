import * as yup from "yup";

export const bookingDetailsSchema = yup.object().shape({
  travel_from: yup.string().required("Traveling from is required."),
  travel_to: yup
    .string()
    .required("Traveling to is required.")
    .when("travel_from", (travel_from, schema) =>
      travel_from[0]
        ? schema.notOneOf(
          [yup.ref("travel_from")],
          "Departure and arrival cannot be the same."
        )
        : schema
    ),
  departure_date: yup.string().required("Departure date is required."),
  return_date: yup.string().notRequired(),
  adults_number: yup
    .number()
    .required("No of adults is required.")
    .typeError("No of adults is required."),
  children_number: yup
    .number()
    .nullable(true)
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .notRequired(),
});
