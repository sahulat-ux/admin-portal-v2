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