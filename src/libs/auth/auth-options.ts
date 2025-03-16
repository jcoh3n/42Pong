import type { NextAuthOptions } from "next-auth";
import { FortyTwoProvider } from "./42-provider";
import { User } from "@/services";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import { generatePassword } from "../utils/auth";
import { Database } from "@/types/database.types";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

// Type definitions for NextAuth
declare module "next-auth" {
	interface User {
		id: string;
		name?: string | null;
		email?: string | null;
		image?: string | null;
		login: string;
	}

	interface Session {
		accessToken?: string;
		user: {
			id?: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
			login?: string;
		};
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		accessToken?: string;
		refreshToken?: string;
		expiresAt?: number;
		user?: FortyTwoUser;
	}
}

// Extended 42 user type with internal database ID
interface FortyTwoUser {
	id: string;
	name?: string | null;
	email?: string | null;
	image?: string | null;
	login: string;
	dbId?: string;
}

async function createSupabaseUser(supabase: SupabaseClient<Database>, login: string, email: string) {
	const { data, error } = await supabase.auth.signUp({
		email: email,
		password: await generatePassword(login, email),
	});

	// const cookieStore = await cookies();
	
	// cookieStore.set("supabase_access_token", data.session?.access_token || "", {
	// 	httpOnly: true,
	// 	secure: process.env.NODE_ENV === "production",
	// 	maxAge: 60 * 60 * 24 * 30,
	// });

	// cookieStore.set("supabase_refresh_token", data.session?.refresh_token || "", {
	// 	httpOnly: true,
	// 	secure: process.env.NODE_ENV === "production",
	// });

	return { data, error };
}

async function modifyUserDetails(supabase: SupabaseClient<Database>, existingUser: User, user: FortyTwoUser) {
	
	if (existingUser.avatar_url !== user.image) {
		await supabase.from('Users').update(
			{
				avatar_url: user.image || "",
			}
		).eq('id', existingUser.id);
	}

	if (existingUser.email !== user.email) {
		await supabase.from('Users').update(
			{
				email: user.email || "",
			}
		).eq('id', existingUser.id);
	}

	if (existingUser.id !== user.id) {
		await supabase.from('Users').update(
			{
				id: user.id,
			}
		).eq('id', existingUser.id);
	}
}

export const authOptions: NextAuthOptions = {
	providers: [FortyTwoProvider()],
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/login",
		error: "/auth/error",
	},
	callbacks: {
		async signIn({ user }) {
			if (!user?.login || !user?.id || !user?.email) {
				return false;
			}

			try {
				const supabase = await createAdminSupabaseConnection();

				const result = await supabase.auth.admin.createUser({
					email: user.email,
					password: await generatePassword(user.login, user.email),
				});

				if (result.error) {
					console.error("--->> [Auth] Supabase create user error:", result.error);
				}

				const { data: existingUser, error } = await supabase
					.from('Users')
					.select('*')
					.eq('login', user.login)
					.single();

				if (existingUser) {
					await modifyUserDetails(supabase, existingUser, user);
					await supabase.auth.signOut( {
						scope: 'local'
					});
					return true;
				}

				// Create new user with generated UUID
				const dbId = result.data?.user?.id;
				const { data: newUser, error: createUserError } = await supabase
					.from('Users')
					.insert({
						id: dbId,
						login: user.login,
						avatar_url: user.image || "",
						elo_score: 1000,
						created_at: new Date().toISOString(),
						theme: "dark",
						language: "fr",
						notifications: true,
						email: user.email || "",
					})
					.single();

				if (createUserError) {
					console.error("--->> [Auth] Error creating user:", createUserError);
					await supabase.auth.signOut( {
						scope: 'local'
					} );
					return false;	
				}

				(user as FortyTwoUser).dbId = dbId;
				await supabase.auth.signOut( {
					scope: 'local'
				} );
				return true;
			} catch {
				return false;
			}
		},

		async jwt({ token, account, user }) {
			if (account && user) {
				const ft_user = user as FortyTwoUser;
				token.accessToken = account.access_token;
				token.refreshToken = account.refresh_token;
				token.expiresAt = account.expires_at;
				token.user = {
					...ft_user,
					id: ft_user.dbId || ft_user.id
				};
			}

			if (token.expiresAt && Date.now() >= token.expiresAt * 1000) {
				return {};
			}

			return token;
		},

		async session({ session, token }) {
			if (token.user) {
				session.accessToken = token.accessToken;
				session.user = {
					id: token.user.dbId || token.user.id,
					name: token.user.name,
					email: token.user.email,
					image: token.user.image,
					login: token.user.login,
				};
			}
			return session;
		},
	},
};

async function createAdminSupabaseConnection() {
	const supabase = createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_ADMIN_KEY!,
		{
			auth: {
				persistSession: false,
				autoRefreshToken: false,
				detectSessionInUrl: false,
			},
		}
	);
	return supabase;
}
