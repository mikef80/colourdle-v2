export const createSignupFormRequest = (data: Record<string, string>, method = "POST") => {
  const form = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    form.append(key, value);
  }

  return new Request("http://localhost/signup", {
    method,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });
};

export const createLoginFormRequest = (data: Record<string, string>, method = "POST") => {
  const form = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    form.append(key, value);
  }

  return new Request("http://localhost/login", {
    method,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });
};
