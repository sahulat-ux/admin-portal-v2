export async function loginCall(email: string, password: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
        credentials: "include",
    });
    const data = await response.json();
    localStorage.setItem("sahulatUser",JSON.stringify(data.data))

    if (!response.ok){
        throw new Error(data.message ||  `Login api call failed with status ${response.status}`)
    }
    return data
}


// export interface Merchant {
//   id: string;
//   name: string;
//   // …add any other fields you expect
// }

export async function getMerchants(): Promise<any[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "";
  const res = await fetch(`${baseUrl}/merchant`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to load merchants (${res.status})`);
  }

  return res.json();
}
