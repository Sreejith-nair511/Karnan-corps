import { redirect } from 'next/navigation';

export default function RootRedirect() {
  // Redirect to the default locale
  redirect('/en');
}