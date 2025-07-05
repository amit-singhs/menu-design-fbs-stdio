import { KitchenLoginForm } from '@/components/auth/kitchen-login-form';

export default function KitchenLoginPage() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4">
       <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-0" />
       <div className="z-10 animate-in fade-in zoom-in-95 duration-500">
        <KitchenLoginForm />
       </div>
    </div>
  );
}
