import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Select,SelectItem,Checkbox,Slider,Input, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Card, CardBody } from "@nextui-org/react";

const HomePage = () => {
    const { isOpen: isJobDetailsOpen, onOpen: openJobDetails, onOpenChange: onJobDetailsOpenChange } = useDisclosure();
    const { isOpen: isFilterOpen, onOpen: openFilter, onOpenChange: onFilterOpenChange } = useDisclosure();
    
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [searchableName, setSearchableName] = useState("");
    // filters
    const [salaryFrom,setSalaryFrom] = useState(500000)
    const [salaryTo,setSalaryTo] = useState(1000000)
    const [homeOffice,setHomeOffice] = useState(false)
    const [city,setCity] = useState("")
    const [type,setType] = useState("")
    const jobTypes = [
        {key: "full-time", label: "Full time"},
        {key: "part-time", label: "Part time"},
        {key: "internship", label: "Internship"},
    ];

    const formatCurrency = (number, locale = 'hu-HU', currency = 'HUF') => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(number);
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3030/jobs');
            setJobs(response.data.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };



    // http://localhost:3030/jobs?userId=1&salaryFrom[$gt]=350000&company[$like]=%miff%
    const fetchFilteredData = async () => {
        
        const queryParams = [];
        if (salaryTo) {queryParams.push(`salaryTo[$gt]=${salaryTo}`);}
        if (salaryFrom) {queryParams.push(`salaryFrom[$gt]=${salaryFrom}`);}
        if (homeOffice !== false) {queryParams.push(`homeOffice=${homeOffice}`);}
        if (type) {queryParams.push(`type=${type}`);}
        if (city) {queryParams.push(`city=${encodeURIComponent(city)}`)}

        try {
            const response = await axios.get(`http://localhost:3030/jobs${queryParams.length > 0 ? '?' + queryParams.join('&') : ''}`);
            console.log(response.data.data);
            setJobs(response.data.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleOpenJobDetailsModal = (job) => {
        setSelectedJob(job);
        openJobDetails();
    };

    const filteredJobs = jobs.filter(job => searchableName === "" || job.position.toLowerCase().includes(searchableName.toLowerCase()));

    return (
        <>
            {/* Job details modal */}
            <Modal size='3xl' backdrop="blur" isOpen={isJobDetailsOpen} onOpenChange={onJobDetailsOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <p>Job details | {selectedJob?.position}</p>
                            </ModalHeader>
                            <ModalBody>
                                <Divider />
                                <p>Company: {selectedJob?.company}</p>
                                <Divider />
                                <p>City: {selectedJob?.city}</p>
                                <Divider />
                                <p>Salary: {formatCurrency(selectedJob?.salaryFrom)} - {formatCurrency(selectedJob?.salaryTo)}</p>
                                <Divider />
                                <p>Job type: {selectedJob?.type}</p>
                                <Divider />
                                <p>Home office: {selectedJob?.homeOffice === 1 ? "Yes" : "No"}</p>
                                <Divider />
                                <p>Description:</p>
                                <p>{selectedJob?.description}</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Apply
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Filter modal */}
            <Modal size='sm' backdrop="blur" isOpen={isFilterOpen} onOpenChange={onFilterOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <p>Filter Jobs</p>
                            </ModalHeader>
                            <ModalBody>

                                <Slider 
                                label="Minimum salary"
                                step={50000} 
                                minValue={100000} 
                                maxValue={2000000} 
                                value={salaryFrom}
                                onChange={setSalaryFrom}
                                
                                formatOptions={{style: "currency", currency: "HUF",minimumFractionDigits:0,maximumFractionDigits:0}}
                                className="max-w-md"
                                />

                                <Slider 
                                label="Maximum salary"
                                step={50000} 
                                minValue={100000} 
                                maxValue={2000000} 
                                value={salaryTo}
                                onChange={setSalaryTo}
                                
                                formatOptions={{style: "currency", currency: "HUF",minimumFractionDigits:0,maximumFractionDigits:0}}
                                className="max-w-md"
                                />

                                <Checkbox
                                isSelected={homeOffice}
                                onChange={(e)=>setHomeOffice(e.target.checked)}
                                size="sm"
                                >
                                Home office
                                </Checkbox>

                                <Input
                                value={city}
                                onChange={(e)=>setCity(e.target.value)}
                                size="sm"
                                type="text"
                                label="City"
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


                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onPress={() => { setSearchableName(searchInput); fetchFilteredData(); onClose(); }}>
                                    Apply Filters
                                </Button>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <div className='flex flex-col items-center justify-center gap-5 mb-16 mt-5'>
                <div className='text-5xl'>Available jobs</div>
                <div className='flex items-center gap-3 w-[40%]'>
                    <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} type="text" label="Enter job title" />
                    <Button size='lg' color='primary' onPress={() => setSearchableName(searchInput)}>Search</Button>
                    <Button size='lg' color='default' onPress={openFilter}>Filter</Button>
                </div>
            </div>

            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}

            {!error && !loading &&
                <div className='flex flex-col gap-5 items-center justify-center w-[100%]'>
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map(job => (
                            <Card key={job.id} className="w-[40%]">
                                <CardBody className='flex flex-row justify-start'>
                                    <div className='w-[50%]'>
                                        <p>{job.position}</p>
                                        <p>{job.city}</p>
                                        <p>{job.type}</p>
                                    </div>
                                    <div className='w-[50%] text-right'>
                                        <p>{formatCurrency(job.salaryFrom)} - {formatCurrency(job.salaryTo)}</p>
                                        <Button color='primary' className='mt-5' onPress={() => handleOpenJobDetailsModal(job)}>See details</Button>
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
    );
}

export default HomePage;
