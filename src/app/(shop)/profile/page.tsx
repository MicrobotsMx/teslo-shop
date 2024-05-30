import { auth } from '@/auth.config';
import { Title } from '@/components';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  
  const session = await auth();
  
  if(!session?.user){
    redirect('/');
    // redirect('/auth/login?returnTo=/perfil');
    }

  return (
    <div>
      <Title title='Perfil'/>
      <pre>
        {
            JSON.stringify(session.user, null, 2)
        }
        <h3 className='text-xl mb-10'>{session.user.role}</h3>
      </pre>
    </div>
  );
}