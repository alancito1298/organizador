
import BottomNav from "./components/BottomNav";
import LoginForm from "./components/FormInicio";

export default function Home() {
  return (
    
    <div className="grid bg-violet-500 items-center justify-items-center min-h-screen bg-brand-primary  gap-16 sm:p-10 font-[family-name:var(--font-geist-sans)]">
    
      


<LoginForm></LoginForm>

<BottomNav></BottomNav>
    </div>
  );
}
