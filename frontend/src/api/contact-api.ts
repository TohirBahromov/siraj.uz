import { api } from "./api";

export async function submitContactForm(data: {
  name: string;
  phone: string;
  message: string;
}) {
  const res = await api<{}>("/contact/submit", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res;
}
