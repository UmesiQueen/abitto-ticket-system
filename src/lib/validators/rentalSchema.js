import * as yup from "yup";

export const rentalSchema = yup.object().shape({
  first_name: yup
    .string()
    .required("First name is required.")
    .min(2, "First name must have a min of 2 characters.")
    .trim()
    .lowercase(),
  surname: yup
    .string()
    .required("Surname is required.")
    .min(2, "Surname must have at least 2 characters.")
    .trim()
    .lowercase(),
  email: yup
    .string()
    .email("Invalid email.")
    .required("Email address is required.")
    .trim()
    .lowercase(),
  phone_number: yup
    .string()
    .required("Phone number is required.")
    .matches(/^\+?\d+$/, "Invalid phone number.")
    .min(11, "Phone number must have at least 11 characters.")
    .trim(),
  passengers: yup.string().required("Passengers is required."),
  rental_date: yup.string().required("Rental date is required."),
  rental_time: yup.string().required("Rental time is required."),
  rental_duration: yup
    .string()
    .when(["$rentalType"], ([rentalType], field) =>
      rentalType == "within marina"
        ? field.required("Rental duration is required.")
        : field.notRequired()
    ),
});
