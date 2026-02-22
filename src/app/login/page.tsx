import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import LoginForm from "../components/FormInicio"

export default function Login() {
  return (
    
    <div className="grid bg-violet-500 grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen bg-brand-primary  gap-16 sm:p-20 ]">
      <Navbar titulo={"BIENVENIDO"} data={"INCIO"}></Navbar>
      

<LoginForm></LoginForm>

<BottomNav></BottomNav>
    </div>
  );
}
