import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/lib/auth/auth-options';
import { getServerSession } from 'next-auth';
import { userService } from '@/services';

const serverAuth = async () => {
	const session = await getServerSession(authOptions);

	if (!session?.user?.login) {
		return null;
	}

	const currentUser = await userService.getUserByLogin(session.user.login);

	if (!currentUser) {
		return null;
	}

	return currentUser
}

export default serverAuth;