import React, { useEffect,useState } from 'react'
import {useSelector} from "react-redux"
import {Button,Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";
import axios from "axios"

const Profile = () => {

    const userId = useSelector((state)=>state.user.user.user.id)
    const accessToken = useSelector((state)=>state.user.user.accessToken)
    const [userData,setUserData] = useState()
    const [loading,setLoading] = useState(true)
    const [experiences,setExperiences] = useState()

    useEffect(()=>{
        fetchUserData(accessToken)
        fetchUserExperience(accessToken)

    },[])

    console.log(experiences)

    const fetchUserData = async (token) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };
    
            const response = await axios.get(`http://localhost:3030/users/${userId}`,{headers});
            setUserData(response.data);
            
            return response.data;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }finally {
            setLoading(false);
        }
    };

    const fetchUserExperience = async (token) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };
    
            const response = await axios.get(`http://localhost:3030/experiences`,{headers});
            setExperiences(response.data.data);
            
            return response.data;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };



return (

    <>
        <div className='flex justify-center mt-16'>
            {loading ?  <div>Loading...</div> :  
            <Card className="w-[60%]">
                <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                    <p className="text-2xl">My profile</p>
                </div>
                </CardHeader>
                <Divider/>


                <CardBody>
                <p className="text-lg mb-5">Personal info</p>
                <div className='flex mb-2'>
                    <div className='w-[50%]'>
                        <p>Full name:</p>
                        <p>Email:</p>
                        <p>Status:</p>
                    </div>
                    <div className='w-[50%]'>
                        <p>{userData.fullname}</p>
                        <p>{userData.email}</p>
                        <p>{userData.role}</p>
                    </div>
                </div>
                <Divider/>
                <p className="text-lg mb-5">Past experiences</p>

                <div className='flex flex-col gap-2 justify-center'>
                    {experiences && experiences.map((element,index)=>(
                        <>
                        <div className='flex'>
                            <div className='flex-1' key={index}>{element.interval}</div>
                            <div className='flex-1' key={index}>{element.company} : {element.title}</div>
                            <Button color="primary" size='sm'>Edit</Button>
                        </div>
                        <Divider/>
                        </>
                        
                    ))}


                </div>
                
                
                
                </CardBody>
            </Card>
            }
            
        </div>
    </>

    
)
}

export default Profile