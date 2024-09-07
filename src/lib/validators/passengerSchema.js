import * as yup from "yup";

export const passengerDetailsSchema = yup.object().shape({
  passenger1_first_name: yup
    .string()
    .required("First name is required.")
    .min(2, "First name must have a min of 2 characters.")
    .trim()
    .lowercase(),
  passenger1_last_name: yup
    .string()
    .required("Surname is required.")
    .min(2, "Surname must have at least 2 characters.")
    .trim()
    .lowercase(),
  passenger1_email: yup
    .string()
    .email("Invalid email.")
    .required("Email address is required.")
    .trim()
    .lowercase(),
  passenger1_phone_number: yup
    .string()
    .required("Phone number is required.")
    .matches(/^\+?\d+$/, "Invalid phone number.")
    .min(11, "Phone number must have at least 11 characters.")
    .trim(),
  departure_seats: yup.lazy((val) =>
    Array.isArray(val)
      ? yup.array().of(yup.string())
      : yup.string().notRequired()
  ),
  return_seats: yup.lazy((val) =>
    Array.isArray(val)
      ? yup.array().of(yup.string())
      : yup.string().notRequired()
  ),
  passenger2_first_name: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 2 && !isChecked
          ? field
            .required("First name is required.")
            .min(2, "First name must have a min of 2 characters.")
            .trim()
            .lowercase()
          : field.notRequired()
    ),
  passenger2_last_name: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 2 && !isChecked
          ? field
            .required("Surname is required.")
            .min(2, "Surname must have at least 2 characters.")
            .trim()
            .lowercase()
          : field.notRequired()
    ),
  passenger2_email: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 2 && !isChecked
          ? field
            .email("Invalid email.")
            .required("Email address is required.")
            .trim()
            .lowercase()
          : field.notRequired()
    ),
  passenger2_phone_number: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 2 && !isChecked
          ? field
            .required("Phone number is required.")
            .matches(/^\+?\d+$/, "Invalid phone number.")
            .min(11, "Phone number must have at least 11 characters.")
            .trim()
          : field.notRequired()
    ),
  passenger3_first_name: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 3 && !isChecked
          ? field
            .required("First name is required.")
            .min(2, "First name must have a min of 2 characters.")
            .trim()
            .lowercase()
          : field.notRequired()
    ),
  passenger3_last_name: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 3 && !isChecked
          ? field
            .required("Surname is required.")
            .min(2, "Surname must have at least 2 characters.")
            .trim()
            .lowercase()
          : field.notRequired()
    ),
  passenger3_email: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 3 && !isChecked
          ? field
            .email("Invalid email.")
            .required("Email address is required.")
            .trim()
            .lowercase()
          : field.notRequired()
    ),
  passenger3_phone_number: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 3 && !isChecked
          ? field
            .required("Phone number is required.")
            .matches(/^\+?\d+$/, "Invalid phone number.")
            .min(11, "Phone number must have at least 11 characters.")
            .trim()
          : field.notRequired()
    ),
  passenger4_first_name: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 4 && !isChecked
          ? field
            .required("First name is required.")
            .min(2, "First name must have a min of 2 characters.")
            .trim()
            .lowercase()
          : field.notRequired()
    ),
  passenger4_last_name: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 4 && !isChecked
          ? field
            .required("Surname is required.")
            .min(2, "Surname must have at least 2 characters.")
            .trim()
            .lowercase()
          : field.notRequired()
    ),
  passenger4_email: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 4 && !isChecked
          ? field
            .email("Invalid email.")
            .required("Email address is required.")
            .trim()
            .lowercase()
          : field.notRequired()
    ),
  passenger4_phone_number: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 4 && !isChecked
          ? field
            .required("Phone number is required.")
            .matches(/^\+?\d+$/, "Invalid phone number.")
            .min(11, "Phone number must have at least 11 characters.")
            .trim()
          : field.notRequired()
    ),
  passenger5_first_name: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 5 && !isChecked
          ? field
            .required("First name is required.")
            .min(2, "First name must have a min of 2 characters.")
            .trim()
            .lowercase()
          : field.notRequired()
    ),
  passenger5_last_name: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 5 && !isChecked
          ? field
            .required("Surname is required.")
            .min(2, "Surname must have at least 2 characters.")
            .trim()
            .lowercase()
          : field.notRequired()
    ),
  passenger5_email: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 5 && !isChecked
          ? field
            .email("Invalid email.")
            .required("Email address is required.")
            .trim()
            .lowercase()
          : field.notRequired()
    ),
  passenger5_phone_number: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 5 && !isChecked
          ? field
            .required("Phone number is required.")
            .matches(/^\+?\d+$/, "Invalid phone number.")
            .min(11, "Phone number must have at least 11 characters.")
            .trim()
          : field.notRequired()
    ),
});
