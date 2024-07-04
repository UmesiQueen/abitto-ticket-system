import * as yup from "yup";

const editProfileSchema = yup.object().shape({
  first_name: yup.string().required("This field is required."),
  last_name: yup.string().required("This field is required."),
  email: yup
    .string()
    .email("Invalid email.")
    .required("This field is required."),
  gender: yup.string().required("This field is required."),
  location: yup.string().required("This field is required."),
  city: yup.string().required("This field is required."),
});
const passwordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required("Old password is required.")
    .trim()
    .lowercase(),
  newPassword: yup
    .string()
    .required("New password is required.")
    .min(2, "New Password must contain at least 2 character(s)")
    .max(35, "New Password cannot contain more than 30 character(s)")
    .trim()
    .lowercase()
    .when("currentPassword", ([currentPassword], field) =>
      currentPassword
        ? field.notOneOf(
            [yup.ref("currentPassword")],
            "Current and New Password cannot be the same."
          )
        : field
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords don't match."),
});

const scheduleTripSchema = yup.object().shape({
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
  cost: yup
    .string()
    .required("Ticket cost field is required.")
    .matches(/^\+?\d+$/, "Ticket cost must not include characters."),
  date: yup
    .string()
    .when("$date", ([dateOptions], field) =>
      !dateOptions
        ? field.required("Select at least one date.")
        : field.notRequired()
    ),
});

export { editProfileSchema, passwordSchema, scheduleTripSchema };
