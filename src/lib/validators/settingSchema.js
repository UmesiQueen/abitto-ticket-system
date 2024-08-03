import * as yup from "yup";

// const MAX_FILE_SIZE = 1024 * 1000 * 2; //2MB
const validFileExtensions = {
  image: ["jpg", "png", "jpeg", "svg", "webp"],
};

function isValidFileType(fileName, fileType) {
  return (
    fileName &&
    validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1
  );
}

const editProfileSchema = yup.object().shape({
  first_name: yup
    .string()
    .required("This field is required.")
    .min(2, "First name must have a min of 2 characters.")
    .trim(),
  last_name: yup
    .string()
    .required("This field is required.")
    .min(2, "Last name must have a min of 2 characters.")
    .trim(),
  email: yup
    .string()
    .email("Invalid email.")
    .required("This field is required.")
    .trim()
    .lowercase(),
  gender: yup.string().required("This field is required."),
  location: yup
    .string()
    .required("This field is required.")
    .min(2, "Location must have a min of 2 characters.")
    .trim(),
  city: yup
    .string()
    .required("This field is required.")
    .min(2, "City must have a min of 2 characters.")
    .trim(),
  profile_picture: yup
    .mixed()
    .test("is-valid-type", "Not a valid image type", ([value]) => {
      return value ? isValidFileType(value.name.toLowerCase(), "image") : true;
    })
    // .test("is-valid-size", "Max allowed size is 2MB", ([value]) => {
    //   console.log(value.size > MAX_FILE_SIZE, "value size");
    //   return value ? value.size > MAX_FILE_SIZE : true;
    // })
    .notRequired(),
});

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required("Old password is required.").trim(),
  newPassword: yup
    .string()
    .required("New password is required.")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Password must contain at least 8 characters, at least one letter and one number"
    )
    .max(25, "Password cannot contain more than 25 character(s)")
    .trim()
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

export { editProfileSchema, passwordSchema };
