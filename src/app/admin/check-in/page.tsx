'use client'

import IDScanner from './IDScanner'

export default function CheckIn() {
	return <IDScanner onScanned={alert} />
}
