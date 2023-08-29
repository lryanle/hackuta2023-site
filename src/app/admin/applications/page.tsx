import { headers } from 'next/headers'

import { Heading } from '@/components/Heading'
import { hasPermission } from '@/lib/auth/shared'
import User from '@/lib/db/models/User'
import { getEnhancedSession } from '@/lib/utils/server'

import ApplicantTable from './ApplicantTable'
import { getUsers } from './utils'

export default async function Applications() {
	const { perms } = getEnhancedSession(headers())
	const appliedUsers: User[] | undefined = ((await getUsers()) ?? []).filter(
		(user) => user.application,
	)
	const queue: User[] | undefined = (appliedUsers ?? [])?.filter(
		(user) =>
			!user.applicationStatus || user.applicationStatus === 'waitlisted',
	)

	const hasBasicWritePerm = hasPermission(perms, {
		applications: { manage: { basic: { write: true } } },
	})
	const hasDemographicsReadPerm = hasPermission(perms, {
		applications: { manage: { demographicsInformation: { read: true } } },
	})

	return (
		<>
			<Heading level={1}>Applications</Heading>
			Queue Size: {queue.length}/{appliedUsers.length}
			<div className="h-[48vh] w-[600px] overflow-scroll">
				<ul>
					{queue.length > 0
						? queue.map((user: User, i: number) => (
								<li key={i}>
									<ApplicantTable
										user={JSON.parse(JSON.stringify(user))}
										hasBasicWritePerm={hasBasicWritePerm}
										hasDemographicsReadPerm={hasDemographicsReadPerm}
									/>
								</li>
						  ))
						: 'No applicants in the queue.'}
				</ul>
			</div>
		</>
	)
}
