import {Input, Button,Card, CardHeader, CardBody, CardFooter, Divider, Link} from "@nextui-org/react";
import logo from "../assets/logo.png"
import { useState } from "react";
import {useDispatch, useSelector} from "react-redux"
import { loginUser } from "../redux/UserSlice";
import {useNavigate} from "react-router-dom"

const LoginPage = () => {

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const {loading,error} = useSelector((state)=>state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLoginEvent=(e)=>{
        e.preventDefault()
        let userCredentials = {"email":email,"password":password,strategy:"local"}
        dispatch(loginUser(userCredentials)).then((result)=>{
            if(result.payload){
                setEmail("")
                setPassword("")
                navigate("/")
            }
        })
    }


return (
    <div className='flex justify-center mt-28'>
            <Card className="w-[400px]">
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col w-full items-center justify-center">
                        <img className='w-7' src={logo} alt="logo"/>
                        <p className="text-md font-bold tracking-wider">JobHunter</p>
                    </div>
                </CardHeader>
                <Divider/>
                <CardBody>
                    <form onSubmit={handleLoginEvent}  className="flex w-full flex-wrap flex-col md:flex-nowrap gap-4">
                        <Input
                            isRequired
                            size="sm"
                            type="email"
                            label="Email"
                            value = {email}
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                        <Input
                            isRequired
                            size="sm"
                            type="password"
                            label="Password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                        <p>Don't have an account yet? <Link href="/register">Register</Link></p>
                        <Divider/>
                        <Button fullWidth color="primary" type="submit">
                            {loading ? "Loading..." : "Login"}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
)
}

export default LoginPage