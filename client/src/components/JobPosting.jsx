import React, { useState } from 'react'
import { Slider,Select, SelectItem, Link, Textarea, RadioGroup, Radio, Checkbox, Input, Button, Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import logo from "../assets/logo.png";
import {useDispatch, useSelector} from "react-redux"
import axios from "axios"
import {useNavigate} from "react-router-dom"

const jobTypes = [
    {key: "full-time", label: "full time"},
    {key: "part-time", label: "part time"},
    {key: "internship", label: "internship"},
];

const JobPosting = () => {

    const user = useSelector((state)=>state.user)

    const [position,setPosition] = useState("")
    const [description,setDescription] = useState("")
    const [salary,setSalary] = useState([500000,1000000])
    const [type,setType] = useState("")
    const [city,setCity] = useState("")
    const [homeOffice,setHomeOffice] = useState(false)

    const jobData = {
        "company": user.user.user.fullname,
        "position": position,
        "description": description,
        "salaryFrom": salary[0], 
        "salaryTo": salary[1],
        "type": type,
        "city": city,
        "homeOffice": homeOffice
    }

    const navigate = useNavigate()

    const postJob = async ()=>{
        try{
            const request = await axios.post('http://localhost:3030/jobs/1',jobData,{
                headers:{
                    Authorization: `Bearer ${user.user.accessToken}`
                }
            });
            navigate("/")


        }catch(error){
            setError(error.message)
        }
    }




    return (
    <>
    <div className='flex justify-center sm:mt-5 mb-5'>
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
                <p>Create new job posting</p>
                <Input
                value={position}
                onChange={(e)=>setPosition(e.target.value)}
                isRequired
                size="sm"
                type="text"
                label="Position"
                />

                <Input
                value={city}
                onChange={(e)=>setCity(e.target.value)}
                isRequired
                size="sm"
                type="text"
                label="City"
                />

                <Divider/>

                <div className="flex flex-col gap-2">
                    <Textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                    />
                </div>

                <Slider 
                label="Salary range"
                step={50000} 
                minValue={100000} 
                maxValue={2000000} 
                value={salary}
                onChange={setSalary}
                
                formatOptions={{style: "currency", currency: "HUF", minimumFractionDigits:0, maximumFractionDigits:0}}
                className="max-w-md"
                />
                
                <Select
                label="Type"
                placeholder="Select a job type"
                className="max-w-xs"
                selectedKeys={[type]}
                onChange={(e)=>{setType(e.target.value)}}
                >
                {jobTypes.map((type) => (
                <SelectItem key={type.key}>
                    {type.label}
                </SelectItem>
                ))}
                </Select>

                <Checkbox
                value={homeOffice}
                onChange={(e)=>setHomeOffice(e.target.checked)}
                isRequired
                size="sm"
                >
                Home office
                </Checkbox>

                <Divider/>
                
            </div>
            
            <Checkbox
            isRequired
            size="sm"
            >
            I accept the terms and conditions
            </Checkbox>

            </CardBody>
            <CardFooter>
            <div className='w-full flex items-center justify-center'>
                <div className='w-[50%]'>
                <Button onClick={()=>postJob()}  fullWidth color="primary">
                    Post
                </Button>
                </div>
            </div>
            </CardFooter>
        </Card>
    </div>
    </>
    )
}

export default JobPosting