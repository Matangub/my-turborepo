export function formDataToJson(formData: FormData) {
	return JSON.parse(JSON.stringify(Object.fromEntries(formData)));
}
