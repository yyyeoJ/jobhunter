import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Slider, Select, SelectItem, Textarea, Checkbox, Button, Card, CardHeader, CardBody, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure
} from '@nextui-org/react';
import axios from 'axios';
import { useFetcher, useNavigate } from "react-router-dom";

const Profile = () => {
    const jobTypes = [
        { key: "full-time", label: "full time" },
        { key: "part-time", label: "part time" },
        { key: "internship", label: "internship" },
    ];

    const userId = useSelector((state) => state.user.user.user.id);
    const accessToken = useSelector((state) => state.user.user.accessToken);
    const [userData, setUserData] = useState();
    const [loading, setLoading] = useState(true);
    const [experiences, setExperiences] = useState([]);
    const { isOpen: isEditModalOpen, onOpen: openEditModal, onOpenChange: onEditModalOpenChange } = useDisclosure();
    const { isOpen: isAddModalOpen, onOpen: openAddModal, onOpenChange: onAddModalOpenChange } = useDisclosure();
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [newExperience, setNewExperience] = useState({ company: '', title: '', interval: '' });
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const { isOpen: isApplicantsModalOpen, onOpen: openApplicantsModal, onOpenChange: onApplicantsModalOpenChange } = useDisclosure();


    const fetchJobApplicants = async (jobId, token) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response = await axios.get(`http://localhost:3030/applicants?jobId=${jobId}`, { headers });
            setApplicants(response.data);






            return response.data;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    const handleViewApplicants = async (jobId) => {
        await fetchJobApplicants(jobId, accessToken);
        openApplicantsModal();
    };


    const navigate = useNavigate();

    useEffect(() => {
        if (accessToken && userId) {
            fetchUserData(accessToken);
        }
    }, [accessToken, userId]);

    useEffect(() => {
        if (userData) {
            if (userData.role === "jobseeker") {
                fetchUserExperience(accessToken);
            }
            if (userData.role === "company") {
                fetchUserJobs(accessToken);
            }
        }
    }, [userData]);

    const fetchUserData = async (token) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response = await axios.get(`http://localhost:3030/users/${userId}`, { headers });
            setUserData(response.data);

            return response.data;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const fetchUserExperience = async (token) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response = await axios.get(`http://localhost:3030/experiences`, { headers });
            setExperiences(response.data.data);

            return response.data;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    const fetchUserJobs = async (token) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response = await axios.get(`http://localhost:3030/jobs?userId=${userId}`, { headers });
            setJobs(response.data.data);

            return response.data;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    const handleEditExperienceButtonClick = (experience) => {
        setSelectedExperience(experience);
        openEditModal();
    };

    const handleExperienceInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedExperience((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditJobButtonClick = (job) => {
        setSelectedJob(job);
        openEditModal();
    };

    const handleJobTypeChange = (value) => {
        setSelectedJob((prev) => ({ ...prev, type: value }));
    };

    const handleHomeOfficeChange = (checked) => {

        let newValue = checked ? 1 : 0

        setSelectedJob((prev) => ({ ...prev, homeOffice: newValue }));
    };

    if(selectedJob){

        console.log(selectedJob.homeOffice)
    }

    const handleJobInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setSelectedJob((prev) => ({ ...prev, [name]: checked }));
        } else {
            setSelectedJob((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSliderChange = (name, value) => {
        setSelectedJob((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveExperienceChanges = async () => {
        const updatedData = {
            company: selectedExperience.company,
            title: selectedExperience.title,
            interval: selectedExperience.interval
        };

        try {
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };

            const response = await axios.patch(`http://localhost:3030/experiences/${selectedExperience.id}`, updatedData, { headers });
            const updatedExperience = response.data;

            setExperiences((prevExperiences) =>
                prevExperiences.map((exp) =>
                    exp.id === updatedExperience.id ? updatedExperience : exp
                )
            );

            onEditModalOpenChange();
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };


    const handleSaveJobChanges = async () => {
        const updatedData = {
            company: selectedJob.company,
            position: selectedJob.position,
            description: selectedJob.description,
            salaryFrom: selectedJob.salaryFrom,
            salaryTo: selectedJob.salaryTo,
            type: selectedJob.type,
            city: selectedJob.city,
            homeOffice: selectedJob.homeOffice === 1,
        };


        try {
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };

            const response = await axios.patch(`http://localhost:3030/jobs/${selectedJob.id}`, updatedData, { headers });
            const updatedJob = response.data;

            setJobs((prevJobs) =>
                prevJobs.map((job) =>
                    job.id === updatedJob.id ? updatedJob : job
                )
            );

            onEditModalOpenChange();
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    const handleAddInputChange = (e) => {
        const { name, value } = e.target;
        setNewExperience((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddExperience = async () => {
        try {
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };

            const response = await axios.post(`http://localhost:3030/experiences`, newExperience, { headers });
            const addedExperience = response.data;

            setExperiences((prevExperiences) => [...prevExperiences, addedExperience]);
            setNewExperience({ company: '', title: '', interval: '' });
            onAddModalOpenChange();
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    const handleDeleteExperience = async (experienceId) => {
        try {
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };

            await axios.delete(`http://localhost:3030/experiences/${experienceId}`, { headers });

            setExperiences((prevExperiences) => prevExperiences.filter(exp => exp.id !== experienceId));
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    const handleDeleteJob = async (jobId) => {
        try {
            const headers = {
                Authorization: `Bearer ${accessToken}`
            };

            await axios.delete(`http://localhost:3030/jobs/${jobId}`, { headers });

            setJobs((prevJobs) => prevJobs.filter(job => job.id !== jobId));
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    return (
        <>
            <div className='flex justify-center mt-16'>
                {loading ? <div>Loading...</div> :
                    <Card className="w-[90%] lg:w-[40%]">
                        <CardHeader className="flex justify-between items-center">
                            <p className="text-2xl">My profile</p>
                            {userData && userData.role === "company" ? (
                                <Button size='sm' color='primary' onPress={() => { navigate("/jobposting") }}>Add job posting</Button>
                            ) : (
                                <Button size='sm' color='primary' onPress={openAddModal}>Add experience</Button>
                            )}
                        </CardHeader>
                        <Divider />

                        <CardBody>
                            <p className="text-lg mb-2">Personal info</p>
                            <div className='flex flex-col gap-2 justify-center'>
                                <Divider />
                                <div className='flex'>
                                    <div className='flex-1'>Name:</div>
                                    <div className='flex-1'>{userData.fullname}</div>
                                </div>
                                <Divider />
                                <div className='flex'>
                                    <div className='flex-1'>Email:</div>
                                    <div className='flex-1'>{userData.email}</div>
                                </div>
                                <Divider />
                                <div className='flex'>
                                    <div className='flex-1'>Status:</div>
                                    <div className='flex-1'>{userData.role}</div>
                                </div>
                                <Divider />
                            </div>

                            {/* Jobseeker specific data */}
                            {userData && userData.role === "jobseeker" && (
                                <>
                                    <p className="text-lg mb-5 mt-5">Past experiences</p>
                                    <div className='flex flex-col gap-2 justify-center'>
                                        <Divider />
                                        {experiences && experiences.map((element, index) => (
                                            <div key={index}>
                                                <div className='flex'>
                                                    <div className='flex-1'>{element.interval}</div>
                                                    <div className='flex-1'>{element.company} : {element.title}</div>
                                                    <div className='flex flex-col sm:flex-row gap-2 items-center justify-center mr-2 ml-2'>
                                                        <Button color="primary" size='sm' onPress={() => handleEditExperienceButtonClick(element)}>Edit</Button>
                                                        <Button color="danger" size='sm' onPress={() => handleDeleteExperience(element.id)}>Delete</Button>
                                                    </div>
                                                </div>
                                                <Divider className='my-2'/>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Company specific data */}
                            {userData && userData.role === "company" && (
                                <>
                                    <p className="text-lg mb-5 mt-5">Job Postings</p>
                                    <div className='flex flex-col gap-2 justify-center'>
                                        <Divider />
                                        {jobs && jobs.map((job, index) => (
                                            <div key={index}>
                                                <div className='flex mb-2 items-center'>
                                                    <div className='flex-1'>{job.position}</div>
                                                    <div className='flex-1'>{job.company}</div>
                                                    <div className='flex flex-col sm:flex-row gap-2 items-center justify-center mr-2'>
                                                        <Button size='sm' onPress={() => handleViewApplicants(job.id)} color="success">View</Button>
                                                        <Button size='sm' color="primary" onPress={() => handleEditJobButtonClick(job)}>Edit</Button>
                                                        <Button size='sm' color="danger" onPress={() => handleDeleteJob(job.id)}>Delete</Button>
                                                    </div>
                                                </div>
                                                <Divider />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                        </CardBody>
                    </Card>
                }
            </div>

            {/* Editing modal */}
            <Modal size='lg' backdrop="blur" isOpen={isEditModalOpen} onOpenChange={onEditModalOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {userData && userData.role === "company" ? (
                                    <p>Edit job posting</p>
                                ) : (
                                    <p>Edit experience</p>
                                )}
                            </ModalHeader>
                            <ModalBody>
                                {userData && userData.role === "jobseeker" && (
                                    <>
                                        <Input
                                            label="Interval"
                                            name="interval"
                                            value={selectedExperience?.interval || ''}
                                            onChange={handleExperienceInputChange}
                                            fullWidth
                                        />
                                        <Input
                                            label="Company"
                                            name="company"
                                            value={selectedExperience?.company || ''}
                                            onChange={handleExperienceInputChange}
                                            fullWidth
                                        />
                                        <Input
                                            label="Title"
                                            name="title"
                                            value={selectedExperience?.title || ''}
                                            onChange={handleExperienceInputChange}
                                            fullWidth
                                        />
                                    </>
                                )}

                                {userData && userData.role === "company" && (
                                    <>
                                        <Input
                                            value={selectedJob.position}
                                            onChange={handleJobInputChange}
                                            size="sm"
                                            type="text"
                                            label="Position"
                                            name="position"
                                        />

                                        <Input
                                            label="City"
                                            name="city"
                                            value={selectedJob.city}
                                            onChange={handleJobInputChange}
                                            fullWidth
                                        />

                                        <Slider
                                            label="Salary range minimum"
                                            name="salaryFrom"
                                            step={50000}
                                            minValue={100000}
                                            maxValue={2000000}
                                            value={selectedJob.salaryFrom}
                                            onChange={(value) => handleSliderChange('salaryFrom', value)}
                                            formatOptions={{ style: "currency", currency: "HUF", minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                                            className="max-w-md"
                                        />

                                        <Slider
                                            label="Salary range maximum"
                                            name="salaryTo"
                                            step={50000}
                                            minValue={100000}
                                            maxValue={2000000}
                                            value={selectedJob.salaryTo}
                                            onChange={(value) => handleSliderChange('salaryTo', value)}
                                            formatOptions={{ style: "currency", currency: "HUF", minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                                            className="max-w-md"
                                        />

                                        <Select
                                            label="Type"
                                            name="type"
                                            placeholder="Select a job type"
                                            className="w-[100%]"
                                            selectedKeys={new Set([selectedJob.type])}
                                            onSelectionChange={(e)=>{handleJobTypeChange(e.anchorKey)}}
                                        >
                                            {jobTypes.map((type) => (
                                                <SelectItem key={type.key}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </Select>

                                        <div className="flex flex-col gap-2">
                                            <Textarea
                                                placeholder="Description"
                                                name="description"
                                                value={selectedJob.description}
                                                onChange={handleJobInputChange}
                                            />
                                        </div>

                                        <Checkbox
                                        name="homeOffice"
                                        isSelected={selectedJob.homeOffice}
                                        value = {selectedJob.homeOffice}
                                        size="sm"
                                        onChange={(e) => handleHomeOfficeChange(e.target.checked)}
                                        >
                                        Home office
                                        </Checkbox>
                                    </>
                                )}

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={userData && userData.role === "company" ? handleSaveJobChanges : handleSaveExperienceChanges}>
                                    Save Changes
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Adding modal */}
            <Modal size='lg' backdrop="blur" isOpen={isAddModalOpen} onOpenChange={onAddModalOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <p>Add Experience</p>
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Interval"
                                    name="interval"
                                    value={newExperience.interval}
                                    onChange={handleAddInputChange}
                                    fullWidth
                                />
                                <Input
                                    label="Company"
                                    name="company"
                                    value={newExperience.company}
                                    onChange={handleAddInputChange}
                                    fullWidth
                                />
                                <Input
                                    label="Title"
                                    name="title"
                                    value={newExperience.title}
                                    onChange={handleAddInputChange}
                                    fullWidth
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={handleAddExperience}>
                                    Add Experience
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* applicants modal */}
            <Modal size='lg' backdrop="blur" isOpen={isApplicantsModalOpen} onOpenChange={onApplicantsModalOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <p>Applicants</p>
                            </ModalHeader>
                            <ModalBody>
                                {applicants && applicants.map((applicant, index) => (
                                    <Card key={index} className='flex gap-5 flex-row bg-[#27272A]'>
                                        <CardBody className='flex'>
                                            <div className='flex-1'>{applicant.user.fullname}</div>
                                            <div className='flex-1'>{applicant.user.email}</div>
                                        </CardBody>
                                    </Card>
                                    
                                ))}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default Profile;
