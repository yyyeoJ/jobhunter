import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Button, Card, CardHeader, CardBody, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure
} from '@nextui-org/react';
import axios from 'axios';

const Profile = () => {
    const userId = useSelector((state) => state.user.user.user.id);
    const accessToken = useSelector((state) => state.user.user.accessToken);
    const [userData, setUserData] = useState();
    const [loading, setLoading] = useState(true);
    const [experiences, setExperiences] = useState([]);
    const { isOpen: isEditModalOpen, onOpen: openEditModal, onOpenChange: onEditModalOpenChange } = useDisclosure();
    const { isOpen: isAddModalOpen, onOpen: openAddModal, onOpenChange: onAddModalOpenChange } = useDisclosure();
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [newExperience, setNewExperience] = useState({ company: '', title: '', interval: '' });

    useEffect(() => {
        fetchUserData(accessToken);
        fetchUserExperience(accessToken);
    }, []);

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

    const handleEditButtonClick = (experience) => {
        setSelectedExperience(experience);
        openEditModal();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedExperience((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async () => {
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

    return (
        <>
            <div className='flex justify-center mt-16'>
                {loading ? <div>Loading...</div> :
                    <Card className="w-[60%]">
                        <CardHeader className="flex justify-between items-center">
                            <p className="text-2xl">My profile</p>
                            <Button size='sm' color='primary' onPress={openAddModal}>Add experience</Button>
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

                            <p className="text-lg mb-5 mt-5">Past experiences</p>
                            <div className='flex flex-col gap-2 justify-center'>
                                <Divider />
                                {experiences && experiences.map((element, index) => (
                                    <div key={index}>
                                        <div className='flex'>
                                            <div className='flex-1'>{element.interval}</div>
                                            <div className='flex-1'>{element.company} : {element.title}</div>
                                            <Button className='mr-2' color="primary" size='sm' onPress={() => handleEditButtonClick(element)}>Edit</Button>
                                            <Button color="danger" size='sm' onPress={() => handleDeleteExperience(element.id)}>Delete</Button>
                                        </div>
                                        <Divider />
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                }
            </div>

            <Modal size='lg' backdrop="blur" isOpen={isEditModalOpen} onOpenChange={onEditModalOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <p>Edit Experience</p>
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Interval"
                                    name="interval"
                                    value={selectedExperience?.interval || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <Input
                                    label="Company"
                                    name="company"
                                    value={selectedExperience?.company || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <Input
                                    label="Title"
                                    name="title"
                                    value={selectedExperience?.title || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={handleSaveChanges}>
                                    Save Changes
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

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
        </>
    );
}

export default Profile;
