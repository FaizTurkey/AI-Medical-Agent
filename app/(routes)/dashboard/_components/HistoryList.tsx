'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import AddNewSectionDialog from './AddNewSectionDialog';
import axios from 'axios';
import HistoryTable from './HistoryTable';
import { SessionDetail } from '../medical-agent/[sessionId]/page';

const HistoryList = () => {
    const [historyList, setHistoryList] = useState<SessionDetail[]>([]);

    useEffect(() => {
        GetHistoryList();
    }, []);

    const GetHistoryList = async () => {
        const result = await axios.get('/api/session-chat?sessionId=all');
        console.log(result.data);
        setHistoryList(result.data); 
    }


    return (
        <div className='mt-10'>
            {historyList.length == 0 ?
                <div className='flex items-center flex-col justify-center p-7  border-dashed rounded-2xl border-4'>
                    <Image src={'/medical.png'} alt='logo' width={150} height={150} />
                    <h2 className='font-bold text-2xl mt-5'>No Recent Consultations</h2>
                    <p>It Looks like you haven't consulted with any doctors yet.</p>
                    <AddNewSectionDialog />
                </div>
                : <div>
                    <HistoryTable historyList={historyList} />
                </div>
            }
        </div>
    )
}

export default HistoryList
