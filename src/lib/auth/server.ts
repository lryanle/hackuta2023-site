import '@/node-only'

import clientPromise from '../db'
import { AppPermissions, Role } from '../db/models/Role'
import User from '../db/models/User'
import { BuiltInRoles, mergePermission } from './shared'

export * from './shared'

export async function getUserPerms(user: User | null): Promise<AppPermissions> {
	const roles = [
		...(user ? ['hacker'] : []),
		...(user?.roles ?? []),
	]
	const builtInRoles = roles.filter((r): r is keyof typeof BuiltInRoles =>
		r in BuiltInRoles
	)
	const externalRoles = roles.filter((r) => !(r in BuiltInRoles))
	const client = await clientPromise
	const perms = [
		...builtInRoles.map((r) => BuiltInRoles[r]),
		...(await client.db()
			.collection<Role>('roles')
			.find({
				_id: { $in: externalRoles },
			})
			.toArray())
			.map((v) => v.granted),
	]
	return mergePermission(BuiltInRoles['@@base'], ...perms)
}
