

import LoginForm from "../components/FormInicio";
import Header from "../components/Header";
import Footer from "../components/Footer";
export default function Login() {
  return (
    
    <div className="block pb-10 flex-col bg-white items-center justify-items-center min-h-screen bg-brand-primary   ">
    <Header></Header>
    <LoginForm ></LoginForm>
    <Footer></Footer>
   
    </div>
  );
}
