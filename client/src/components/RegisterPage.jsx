import { Textarea, RadioGroup, Radio, Checkbox, Input, Button, Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import logo from "../assets/logo.png";


const RegisterPage = () => {

return (
    <div className='flex justify-center mt-28 mb-5'>
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
            
            isRequired
            size="sm"
            type="text"
            label="Full Name"
            />
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
            <Input
            
            isRequired
            size="sm"
            type="password"
            label="Retype Password"
            />
            <RadioGroup
            isRequired
            label="I want to register as a :"
            
            >
            <Radio size="sm" value="jobseeker">Job Seeker</Radio>
            <Radio size="sm" value="company">Company</Radio>
            </RadioGroup>


            <div className="flex flex-col gap-2">
                <p>Add past experiences </p>
                <Textarea placeholder="Company;Title;Interval"/>
            </div>
            


            <Divider/>
            <Checkbox
            
            
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
            <Button  fullWidth color="primary">
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
