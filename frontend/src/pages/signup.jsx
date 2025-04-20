import { useState, useEffect } from "react";
import Heading from "../components/heading";
import Sub from "../components/subheading";
import { InputBox } from "../components/input";
import { BottomWarning } from "../components/footer";
import Button from "../components/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Signup() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function handlesubmit() {
    try {
      console.log(password);
      const res = await axios.post('http://localhost:3001/api/v1/auth/signup', {
        firstname,
        lastname,
        email,
        username,
        password,
      },{withCredentials: true});
      if (res.status === 201) {
        navigate("/after_signup");
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading heading="Signup" className="p-10"></Heading>
          <Sub sub="Enter Your Details to Create Account"></Sub>
          <InputBox
            placeholder="John"
            label={"First Name"}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          ></InputBox>
          <InputBox
            placeholder="Shrader"
            label={"Last Name"}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          ></InputBox>
          <InputBox
            placeholder="abc@xyz.com"
            label={"Email"}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></InputBox>
          <InputBox
            placeholder="username"
            label={"username"}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></InputBox>
          <InputBox
            placeholder="********"
            label={"Password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></InputBox>
         
          <Button onClick={handlesubmit} label={"Sign Up"}></Button>

          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Login "}
            to={"/login"}
          ></BottomWarning>
        </div>
      </div>
    </div>
  );
}
