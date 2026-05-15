import { redirect } from 'next/navigation'
import AccountPageClient from '@/components/account/account-page-client'
import { getCurrentAccountProfile } from '@/lib/account'

export default async function ProfilePage() {
  const profile = await getCurrentAccountProfile()

  if (!profile) {
    redirect('/auth/signin?callbackUrl=/profile')
  }

  return <AccountPageClient profile={profile} />
}
