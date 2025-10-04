'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/userDetailContext';

export type UserDetail = {
    name: string,
    email: string,
    credits: number
}

function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { user } = useUser();
    const [useDetail,setUserDetail] = useState <any>();

    useEffect(() => {
        user && CreateNewUser();
    }, [user])

    const CreateNewUser = async () => {
        const result = await axios.post('/api/users');
        console.log(result.data);
        setUserDetail(result.data);
    }

    return (
        <div>

            <UserDetailContext.Provider value={{useDetail,setUserDetail}}>

                {children}
            </UserDetailContext.Provider>
        </div>
    )
}

export default Provider
