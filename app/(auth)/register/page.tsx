"use client"
import MobileContainer from '@/components/MobileContainer';
import React, { useEffect, useState } from 'react'
import { FaGift, FaPhone, FaUser } from 'react-icons/fa';
import { IoEye, IoEyeOff, IoLockClosed } from 'react-icons/io5';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MdArrowBackIosNew, MdOutlineMailOutline } from 'react-icons/md';
import axios from 'axios';
import SERVER_URL from '@/config/SERVER_URL';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { laborUnions } from '@/contants/labourUnion'
function Register() {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(null);
    const [localSelect, setLocalSelect] = useState(null);
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });
    const [assembly, setAssembly] = useState('');
    const [local, setLocal] = useState('');
    const [district, setDistrict] = useState('');
    const [districtList, setDistrictList] = useState([]);
    const [constituencyList, setConstituencyList] = useState([]);
    const [localList, setLocalList] = useState([]);
    const [constituency, setConstituency] = useState('');
    // const [union, setUnion] = useState('');
    const [assemblyList, setAssemblyList] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const handleDateChange = (date: any) => {
        setSelectedDate(date);
    };

    const handleRadioChange = (event: any) => {
        setLocalSelect(event.target.value);
        axios.get(SERVER_URL + '/admin/districtV4?district=' + district + '&constituency=' + district + '&assembly=' + assembly + '&local=' + event.target.value).then((response) => {
            setLocalList(response.data)
        })
    };
    useEffect(() => {
        axios.get(SERVER_URL + '/admin/districtV4').then((response) => {
            setDistrictList(response.data)
        });
        axios.get(SERVER_URL + '/admin/mandalam').then((response) => {
            setConstituencyList(response.data)
        })
    }, [])
    const handleDistrictChange = (event: any) => {
        setDistrict(event.target.value);
        axios.get(SERVER_URL + '/admin/districtV4?district=' + event.target.value + '&constituency=' + event.target.value).then((response) => {
            setAssemblyList(response.data)
        })
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (data.password !== data.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        //validate data
       if(!data.name){
           return toast.error('Please enter your name');
       }
       if(!data.phone){
           return toast.error('Please enter your phone number');
       }
        if(!data.email){
            return toast.error('Please enter your email');
        }
        if(!data.password){
            return toast.error('Please enter your password');
        }
        if(!district){
            return toast.error('Please select your district');
        }
        if(!assembly){
            return toast.error('Please select your assembly');
        }
        if(!constituency){
            return toast.error('Please select your constituency');
        }

        //email format check 
        if (!data.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
            return toast.error('Please enter a valid email');
        }
        let panchayath = localSelect === 'panchayath' ? local : ''
        let municipality = localSelect === 'municipality' ? local : ''
        let corporation = localSelect === 'corporation' ? local : ''
        axios.post(SERVER_URL + '/user/register', {
            name: data.name,
            email: data.email,
            password: data.password,
            phoneNumber: data.phone,
            date_of_birth: selectedDate,
            assembly: assembly,
            district: district,
            constituency: constituency,
            panchayath: panchayath,
            municipality: municipality,
            corporation: corporation,
        }).then((response) => {
            if (response.status === 200) {
                toast.success("User created successfully");
                router.push("/verify-otp");
                localStorage.setItem('token', response.data.token);
            }

        }).catch((err) => {
            toast.error(err.response.data.message);

        })

    }
    const maxSelectableYear = new Date().getFullYear(); // Current year

    // Calculate the number of years to show in the dropdown
    const yearsToShow = maxSelectableYear - 1920 + 1; // Calculate the range from 1920 to current year
    return (
        <>
            <MobileContainer>
                <div className='w-full h-full flex flex-col' style={{ backgroundImage: "url('/images/bg_main.jpg')", backgroundSize: "cover" }}>
                    <div className='w-full  h-16 flex justify-center items-center  mb-1 relative z-10'>
                        <MdArrowBackIosNew className='text-xl cursor-pointer absolute top-5 left-5 top-text' onClick={() => router.back()} />
                    </div>
                    <div className='w-full  h-60 flex justify-center items-center mt-28 mb-10'>
                        <img src="/images/imagecontri.png" alt="" className='w-24' />
                    </div>
                    <div className='flex-1 justify-center items-center bg-neutral-900 rounded-t-3xl'>
                        <div className="input-container pt-10 pb-5 flex flex-col w-full justify-center items-center">
                            <div style={{ width: "80%", height: "50px" }} className="my-3 rounded-lg flex justify-start items-center border border-white/20 pl-5 gap-1">
                                <FaUser size={18} color='white' />
                                <input type="text" placeholder="Name" onChange={(e) => setData({ ...data, name: e.target.value })} value={data.name} className='bg-transparent border-none outline-none text-white pl-2 w-full gap-1' />
                            </div>
                            <div style={{ width: "80%", height: "50px" }} className="my-3 rounded-lg flex justify-start items-center border border-white/20 pl-5 gap-1">
                                <MdOutlineMailOutline size={24} color='white' />
                                <input type="text" placeholder="Email" onChange={(e) => setData({ ...data, email: e.target.value })} value={data.email} className='bg-transparent border-none outline-none text-white pl-2 w-full gap-1' />
                            </div>
                            <div style={{ width: "80%", height: "50px" }} className="my-3 rounded-lg flex justify-start items-center border border-white/20 pl-5 gap-1">
                                <FaPhone size={18} color='white' />
                                <input type="number" placeholder="Phone Number" onChange={(e) => setData({ ...data, phone: e.target.value })} value={data.phone} className='bg-transparent border-none outline-none text-white pl-2 w-full' />
                            </div>
                            <div style={{ width: '80%', height: '50px' }} className="my-3 rounded-lg flex justify-start items-center border border-white/20 pl-5 gap-1">
                                <FaGift size={18} color="white" className="mr-2" />
                                <DatePicker
                                    id="date"
                                    name="date"
                                    selected={selectedDate}
                                    onChange={handleDateChange}
                                    placeholderText="Birthday"
                                    dateFormat="MM/dd/yyyy"
                                    showYearDropdown
                                    scrollableYearDropdown
                                    yearDropdownItemNumber={yearsToShow}
                                    maxDate={new Date()}
                                    
                                    className="text-white bg-transparent border-none outline-none w-full"
                                />

                            </div>
                            <select id="constituency" onChange={(e) => setConstituency(e.target.value)} style={{ width: '80%', height: '50px' }} value={constituency} className="my-3 rounded-lg flex justify-start items-center border border-white/20 pl-5 bg-neutral-900 text-gray-300">
                                <option selected value="">Loka Sabha</option>
                                {constituencyList?.map((constituency: any) => (
                                    <option key={constituency._id} value={constituency.mandalam}>{constituency.mandalam}</option>
                                ))}
                            </select>
                            <select id="district" onChange={handleDistrictChange} style={{ width: '80%', height: '50px' }} value={district} className="my-3 rounded-lg flex justify-start items-center border border-white/20 pl-5 bg-neutral-900 text-gray-300">
                                <option selected value="">District</option>
                                {districtList?.map((district) => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </select>
                            {
                                assemblyList.length > 0 && (
                                    <>
                                        <select id="assembly" onChange={(e) => setAssembly(e.target.value)} value={assembly} style={{ width: '80%', height: '50px' }} className="my-3 rounded-lg flex justify-start items-center border border-white/20 pl-5 bg-neutral-900 text-gray-300">
                                            <option selected>Legislative Assembly</option>
                                            {
                                                assemblyList?.map((assembly: any) => (
                                                    <option key={assembly} value={assembly}>{assembly}</option>
                                                ))
                                            }
                                        </select>
                                    </>
                                )
                            }

                            <div className='w-full'>
                                <label htmlFor="panchayath" className='flex pl-10 text-white/20'>
                                    <input
                                        type="radio"
                                        id="panchayath"
                                        value="panchayath"
                                        checked={localSelect === 'panchayath'}
                                        onChange={handleRadioChange}
                                        className="mr-2"
                                    />
                                    <p className='text-white/20'>Panchayath</p>
                                </label>

                                <label htmlFor="municipality" className='flex pl-10 text-white/20'>
                                    <input
                                        type="radio"
                                        id="municipality"
                                        value="municipality"
                                        checked={localSelect === 'municipality'}
                                        onChange={handleRadioChange}
                                        className="mr-2"
                                    />
                                    <p className='text-white/20'>Municipality</p>
                                </label>

                                <label htmlFor="corporation" className='flex pl-10 text-gray-300'>
                                    <input
                                        type="radio"
                                        id="corporation"
                                        value="corporation"
                                        checked={localSelect === 'corporation'}
                                        onChange={handleRadioChange}
                                        className="mr-2"
                                    />
                                    <p className='text-white/20'>Corporation</p>
                                </label>
                            </div>
                            {
                                localList.length > 0 && (
                                    <>
                                        <select id="local" onChange={(e) => setLocal(e.target.value)} value={local} style={{ width: '80%', height: '50px' }} className="my-3 rounded-lg flex justify-start items-center border-2 border-white pl-5 bg-neutral-900 text-white">
                                            <option selected>{localSelect}</option>
                                            {
                                                localList?.map((loc: any, index: any) => (
                                                    <option key={index} value={loc}>{loc}</option>
                                                ))
                                            }

                                        </select>
                                    </>
                                )
                            }

                            <div style={{ width: "80%", height: "50px" }} className="my-3 rounded-lg flex justify-start items-center border border-white/20 pl-5 pr-5 gap-1">
                                <IoLockClosed size={21} color='white' />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    onChange={(e) => setData({ ...data, password: e.target.value })}
                                    value={data.password}
                                    className='bg-transparent border-none outline-none text-white pl-2 w-full '
                                />
                                {/* Toggle password visibility */}
                                {showPassword ? (
                                    <IoEyeOff size={21} color='white' onClick={togglePasswordVisibility} />
                                ) : (
                                    <IoEye size={21} color='white' onClick={togglePasswordVisibility} />
                                )}
                            </div>
                            <div style={{ width: "80%", height: "50px" }} className="my-3 rounded-lg flex justify-start items-center border border-white/20 pl-5 pr-5 gap-1">
                                <IoLockClosed size={21} color='white' />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                                    value={data.confirmPassword}
                                    className='bg-transparent border-none outline-none text-white pl-2 w-full'
                                />
                                {/* Toggle confirm password visibility */}
                                {showConfirmPassword ? (
                                    <IoEyeOff size={21} color='white' onClick={toggleConfirmPasswordVisibility} />
                                ) : (
                                    <IoEye size={21} color='white' onClick={toggleConfirmPasswordVisibility} />
                                )}
                            </div>

                        </div>
                        <div className='w-full flex justify-center items-center my-5'>
                            <button onClick={handleSubmit} className='bg-white text-blue-950 w-80 mx-5 text-xl py-2 rounded-2xl font-semibold'>Register</button>
                        </div>

                    </div>
                </div>

            </MobileContainer>

        </>
    )
}

export default Register;