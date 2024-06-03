import React, { useEffect, useState } from 'react';
import axios from "axios";
import {Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Card, CardBody } from "@nextui-org/react";

export const formatCurrency = (number, locale = 'hu-HU', currency = 'HUF') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number);
};

const HomePage = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3030/jobs');
                console.log(response.data.data);
                setJobs(response.data.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleOpenModal = (job) => {
        setSelectedJob(job);
        onOpen();
    };

    return (
        <>
            <Modal size='3xl' backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <p>Job details | {selectedJob.position}</p>
                                
                            </ModalHeader>
                            <ModalBody>
                                <Divider/>
                                <p>Company: {selectedJob.company}</p>
                                <Divider/>
                                <p>City: {selectedJob.city}</p>
                                <Divider/>
                                <p>Salary: {formatCurrency(selectedJob.salaryFrom)} - {formatCurrency(selectedJob.salaryTo)}</p>
                                <Divider/>
                                <p>Job type: {selectedJob.type}</p>
                                <Divider/>
                                <p>Home office: {selectedJob.homeOffice == 1 ? "Yes" : "No"}</p>
                                <Divider/>
                                <p>Description:</p>
                                <p>{selectedJob.description}</p>
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

            <div className='flex justify-center text-5xl m-5'>Available jobs</div>

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
                                        <Button color='primary' onPress={() => handleOpenModal(job)}>See details</Button>
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
