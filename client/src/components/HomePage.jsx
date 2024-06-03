import React, { useEffect, useState } from 'react'
import axios from "axios"
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";


export const formatCurrency = (number, locale = 'hu-HU', currency = 'HUF') => {
    return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    }).format(number);
};


const HomePage = () => {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const response = await axios.get('http://localhost:3030/jobs');
                console.log(response.data.data)
                setJobs(response.data.data);
            }catch(error){
                setError(error.message)
            }finally{
                setLoading(false)
            }
        }

        fetchData();
    },[])


    return (
    <>
        <div className='flex justify-center text-5xl m-5'>Avaliable jobs</div>

        {loading && <div>Loading...</div>}

        {error && <div>Error: {error}</div>}

        {!error && !loading &&
            <div className='flex flex-col gap-5 items-center justify-center w-[100%]'>
            {jobs.length > 0 ? (
                jobs.map(job => (
                    

                    <Card key={job.id} className="w-[40%]">
                        <CardBody className='flex flex-row justify-start'>
                            <div className='w-[50%]'>
                                <p>{job.position}</p>
                                <p>{job.city}</p>
                            </div>
                            <div className='w-[50%] text-right'>
                                <p>{formatCurrency(job.salaryFrom)} - {formatCurrency(job.salaryTo)}</p>
                                <p>{job.type}</p>
                            </div>
                            
                        </CardBody>
                    </Card>
                    



                ))
            ) : (
                <p>No jobs available</p>
            )}
            </div>
        }

        
        
    </>
    
    )
}

export default HomePage