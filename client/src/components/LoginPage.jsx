import {Input, Button,Card, CardHeader, CardBody, CardFooter, Divider, Link} from "@nextui-org/react";
import logo from "../assets/logo.png"


const LoginPage = () => {

return (
    <div className='flex justify-center mt-28'>
            <Card className="w-[400px]">
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col w-full items-center justify-center">
                        <img className='w-7' src={logo} alt="logo"/>
                    </div>
                </CardHeader>
                <Divider/>
                <CardBody>
                    <form  className="flex w-full flex-wrap flex-col md:flex-nowrap gap-4">
                        <Input
                            isRequired
                            size="sm"
                            type="email"
                            label="Email"
                            
                        />
                        <Input
                            isRequired
                            size="sm"
                            type="password"
                            label="Password"
                        />
                        <p>Don't have an account yet? <Link href="/register">Register</Link></p>
                        <Divider/>
                        <Button fullWidth color="primary" type="submit">
                            Sign in
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
)
}

export default LoginPage