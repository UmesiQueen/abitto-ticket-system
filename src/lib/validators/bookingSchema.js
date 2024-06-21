import * as yup from "yup";

const travelDetailsSchema = yup.object().shape({
  travel_from: yup.string().required("Traveling from is required."),
  travel_to: yup
    .string()
    .required("Traveling to is required.")
    .when("travel_from", (travel_from, schema) =>
      travel_from[0]
        ? schema.notOneOf(
            [yup.ref("travel_from")],
            "Destination and departure cannot be the same."
          )
        : schema
    ),
  departure_date: yup.string().required("Departure date is required."),
  departure_time: yup.string().required("Departure time is required."),
  return_date: yup
    .string()
    .when("$roundTrip", (isRoundTrip, field) =>
      isRoundTrip[0]
        ? field.required("Return date is required.")
        : field.notRequired()
    ),
  return_time: yup
    .string()
    .when("$roundTrip", (isRoundTrip, field) =>
      isRoundTrip[0]
        ? field.required("Return time is required.")
        : field.notRequired()
    ),
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

const customerDetailsSchema = yup.object().shape({
  first_name: yup
    .string()
    .required("First name is required.")
    .min(2, "First name must have a min of 2 characters."),
  surname: yup
    .string()
    .required("Surname is required.")
    .min(2, "Surname must have at least 2 characters."),
  email: yup.string().email("Invalid email."),
  phone_number: yup
    .string()
    .required("Phone number is required.")
    .matches(/^\+?\d+$/, "Invalid phone number.")
    .min(11, "Phone number must have at least 11 characters."),
  passenger2_first_name: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 2 && !isChecked
          ? field
              .required("First name is required.")
              .min(2, "First name must have a min of 2 characters.")
          : field.notRequired()
    ),
  passenger2_surname: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 2 && !isChecked
          ? field
              .required("Surname is required.")
              .min(2, "Surname must have at least 2 characters.")
          : field.notRequired()
    ),
  passenger2_email: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 2 && !isChecked
          ? field.email("Invalid email.")
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
          : field.notRequired()
    ),
  passenger3_surname: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 3 && !isChecked
          ? field
              .required("Surname is required.")
              .min(2, "Surname must have at least 2 characters.")
          : field.notRequired()
    ),
  passenger3_email: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 3 && !isChecked
          ? field.email("Invalid email.")
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
          : field.notRequired()
    ),
  passenger4_surname: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 4 && !isChecked
          ? field
              .required("Surname is required.")
              .min(2, "Surname must have at least 2 characters.")
          : field.notRequired()
    ),
  passenger4_email: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 4 && !isChecked
          ? field.email("Invalid email.")
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
          : field.notRequired()
    ),
  passenger5_surname: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 5 && !isChecked
          ? field
              .required("Surname is required.")
              .min(2, "Surname must have at least 2 characters.")
          : field.notRequired()
    ),
  passenger5_email: yup
    .string()
    .when(
      ["$adultPassengers", "$isChecked"],
      ([adultsNumber, isChecked], field) =>
        adultsNumber >= 5 && !isChecked
          ? field.email("Invalid email.")
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
          : field.notRequired()
    ),
});

export { travelDetailsSchema, customerDetailsSchema };
