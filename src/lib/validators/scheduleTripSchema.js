import * as yup from "yup";

export const scheduleTripSchema = yup.object().shape({
  departure: yup.string().required("Departure field is required."),
  arrival: yup
    .string()
    .required("Arrival field is required.")
    .when("departure", ([departure], schema) =>
      departure
        ? schema.notOneOf(
            [yup.ref("departure")],
            "Departure and Arrival cannot be the same."
          )
        : schema
    ),
  time: yup.string().required("Time field is required."),
  cost: yup.string().required("Ticket cost field is required."),
  // .matches(/^\+?\d+$/, "Ticket cost must not include characters."),
  date: yup
    .string()
    .when("$date", ([dateOptions], field) =>
      !dateOptions
        ? field.required("Select at least one date.")
        : field.notRequired()
    ),
});
