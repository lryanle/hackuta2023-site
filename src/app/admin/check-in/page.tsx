import { getEnhancedSession } from '@/lib/utils/server'
import { headers } from 'next/headers'
import IDScanner from './IDScanner'

export default function CheckIn() {
	const { perms } = getEnhancedSession(headers())
	return <IDScanner perms={perms} />
}
