import * as yup from "yup";

export const shipmentDetailsSchema = yup.object().shape({
	departure: yup.string().required("Departure is required."),
	arrival: yup
		.string()
		.required("Arrival is required.")
		.when("departure", ([departure], schema) =>
			departure
				? schema.notOneOf(
					[yup.ref("departure")],
					"Departure and arrival cannot be the same."
				)
				: schema
		),
	category: yup.string().required("Category is required."),
	name: yup
		.string()
		.when(["category", "$isAdmin"], ([category, isAdmin], field) => {
			category === "Others" && isAdmin // Condition to check if the name is "Others" and isAdmin
				? field.required("Item name is required").trim()
				: field.notRequired();
		}),
	description: yup.string().notRequired(),
	no_item: yup
		.number()
		.required("No. of item is required.")
		.min(1, "No.of item must be at least 1")
		.typeError("No. of item must be a number."),
	weight: yup
		.number()
		.required("Weight is required.")
		.min(1, "Weight must be at least 1kg.")
		.typeError("Weight must be a number."),
	value: yup.string().required("Value is required."),
});

export const senderDetailsSchema = yup.object().shape({
	sender_name: yup
		.string()
		.required("Name is required.")
		.min(2, "Name must have at least 2 characters.")
		.trim()
		.lowercase(),
	sender_email: yup
		.string()
		.email("Invalid email.")
		.required("Email address is required.")
		.trim()
		.lowercase(),
	sender_phone_number: yup
		.string()
		.required("Phone number is required.")
		.matches(/^\+?\d+$/, "Invalid phone number.")
		.min(11, "Phone number must have at least 11 characters.")
		.trim(),
	sender_alt_phone_number: yup.string().notRequired(),
	sender_address: yup.string().trim(),
});

export const receiverDetailsSchema = yup.object().shape({
	receiver_name: yup
		.string()
		.required("Name is required.")
		.min(2, "Name must have at least 2 characters.")
		.trim()
		.lowercase(),
	receiver_email: yup
		.string()
		.email("Invalid email.")
		.required("Email address is required.")
		.trim()
		.lowercase(),
	receiver_phone_number: yup
		.string()
		.required("Phone number is required.")
		.matches(/^\+?\d+$/, "Invalid phone number.")
		.min(11, "Phone number must have at least 11 characters.")
		.trim(),
	receiver_alt_phone_number: yup.string().notRequired(),
	receiver_address: yup.string().trim(),
});

export const paymentSchema = yup.object().shape({
	txRef: yup.string().required("This field is required."),
	payment_method: yup.string().required("This field is required."),
});
