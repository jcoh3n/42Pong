import { cookies } from "next/headers";
import { createClient } from "../supabase/server";
import serverAuth from "../auth/serverAuth";

export const generatePassword = (login: string, email: string) => {
	const asNumber = (str: string) => {
		let result = '';
		for (let i = 0; i < str.length; i++) {
			result += str.charCodeAt(i).toString();
		}
		return result;
	};

	const loginAsNumber = asNumber(login);
    const emailAsNumber = asNumber(email);

	const result = (loginAsNumber + emailAsNumber + "42");

	if (result.length > 72) {
		return result.slice(0, 72);
	}

	return result;
}

export async function loginSupabaseUser() {

	const user = await serverAuth();
	if (!user || !user.email || !user.login) {
		return { data: null, error: "User not found" };
	}

	const supabase = await createClient();

	const { data, error } = await supabase.auth.signInWithPassword({
		email: user.email,
		password: await generatePassword(user.login, user.email),
	});

	if (error) {
		console.error("[Auth] Supabase login error:", error);
		return { data: null, error: error };
	}

	if (!data) {
		console.error("[Auth] Supabase login error: No data returned");
		return { data: null, error: "No data returned" };
	}

	return {
		data: {
			access_token: data.session?.access_token,
			refresh_token: data.session?.refresh_token
		},
		error: null
	};
}
