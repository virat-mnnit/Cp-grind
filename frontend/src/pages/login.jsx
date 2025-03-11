import { useState, useEffect } from "react";
import Heading from "../components/heading";
import Sub from "../components/subheading";
import { InputBox } from "../components/input";
import { BottomWarning } from "../components/footer";
import Button from "../components/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Signup() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handlesubmit() {
    try {
      const response = await axios.post(`${BACKEND_API_LOGIN}`, {
       
        email,
        password,
      });
      if(res.status===200){
      navigate("/");
      localStorage.setItem("token", response.data.token);}

     
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading heading="Login" className="p-10"></Heading>
          <Sub sub="Enter Your Details to Login"></Sub>
         
         
          <InputBox
            placeholder="abc@xyz.com"
            label={"Email"}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></InputBox>
          <InputBox
            placeholder="********"
            label={"Password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></InputBox>
         
          <Button onClick={handlesubmit} label={"Log In"}></Button>
          <BottomWarning
            label={"Create a new acoount"}
            buttonText={"Sign Up "}
            to={"/signup"}
          ></BottomWarning>
        </div>
      </div>
    </div>
  );
}
