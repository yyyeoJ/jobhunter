import { Link, Textarea, RadioGroup, Radio, Checkbox, Input, Button, Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import logo from "../assets/logo.png";
import { useState } from "react";
import {useDispatch, useSelector} from "react-redux"
import { registerUser,loginUser} from "../redux/UserSlice";
import {useNavigate} from "react-router-dom"
import axios from "axios";

const RegisterPage = () => {

    const [fullname,setFullname] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")
    const [role,setRole] = useState("")
    const [acceptTerms,setAcceptTerms] = useState(false)
    const [experiences,setExperiences] = useState("")

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const registerUserExperience = async (experiences, token) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };
    
            const response = await axios.post("http://localhost:3030/experiences", experiences, { headers });
            
            return response.data;
        } catch (error) {
            console.error("Error registering user experience:", error);
            throw error;
        }
    };

    const handleRegister = (e) => {
        if (!fullname || !email || !password || !confirmPassword || !role || !acceptTerms) {
            alert("Missing credentials");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        let userCredentials = {
            email: email,
            password: password,
            fullname: fullname,
            role: role
        };
        dispatch(registerUser(userCredentials)).then((result) => {
            if (result.payload) {
                dispatch(loginUser({ email: email, password: password,"strategy":"local" })).then((loginResult) => {
                    if (loginResult.payload) {
                        if(experiencesArray && role == "jobseeker"){
                            registerUserExperience(experiencesFormatted,loginResult.payload.accessToken)
                        }
                        
                        setEmail("");
                        setPassword("");
                        setConfirmPassword("");
                        setFullname("");
                        setAcceptTerms(false);
                        setRole("");
                        navigate("/");
                        
                        
                    }
                });
            }
        });
    };
    const experiencesArray = []
    experiences.split('\n').forEach((experience)=>{
        experiencesArray.push(experience.split(';'))
    })
    const experiencesFormatted = experiencesArray.map(experience => ({
        company: experience[0],
        title: experience[1],
        interval: experience[2]
    }));



return (
    <div className='flex justify-center sm:mt-28 mb-5'>
    <Card className="w-[400px]">
        <CardHeader className="flex gap-3">
        <div className="flex flex-col w-full items-center justify-center">
            <img className='w-7' src={logo} alt="Logo" />
            <p className="text-md font-bold tracking-wider">JobHunter</p>
        </div>
        </CardHeader>
        <Divider/>
        <CardBody>
        <div className="flex w-full flex-wrap flex-col md:flex-nowrap gap-4">
            <Input
            value={fullname}
            onChange={(e)=>setFullname(e.target.value)}
            isRequired
            size="sm"
            type="text"
            label="Full Name"
            />
            <Input
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            isRequired
            size="sm"
            type="email"
            label="Email"
            />
            <Input
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            isRequired
            size="sm"
            type="password"
            label="Password"
            />
            <Input
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            isRequired
            size="sm"
            type="password"
            label="Retype Password"
            />

            {role == "jobseeker" &&
            <div className="flex flex-col gap-2">
                <p>Add past experiences </p>
                <Textarea value={experiences} onChange={(e)=>setExperiences(e.target.value)} placeholder="Company;Title;Interval"/>
            </div>
            }

            <RadioGroup
            isRequired
            label="I want to register as a :"
            value={role}
            onChange={(e)=>setRole(e.target.value)}
            >
            <Radio size="sm" value="jobseeker">Job Seeker</Radio>
            <Radio size="sm" value="company">Company</Radio>
            </RadioGroup>

            
            
            <Divider/>
            <p>Already have an account? <Link className="font-bold" href="/login">Login instead</Link></p>
            <Checkbox
            onChange={(e)=>setAcceptTerms(e.target.checked)}
            value={acceptTerms}
            isRequired
            size="sm"
            >
            I accept the terms and conditions
            </Checkbox>
        </div>
        
        </CardBody>
        <CardFooter>
        <div className='w-full flex items-center justify-center'>
            <div className='w-[50%]'>
            <Button onClick={()=>handleRegister()}  fullWidth color="primary">
                Register
            </Button>
            </div>
        </div>
        </CardFooter>
    </Card>
    </div>
);
};

export default RegisterPage;
