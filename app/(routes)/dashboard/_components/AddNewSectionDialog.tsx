'use client'
import React, { useEffect, useState } from 'react'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Loader2 } from 'lucide-react'
import axios from 'axios'
import DoctorAgentCard, { doctorAgent } from './DoctorAgentCard'
import SuggestedDoctorCard from './SuggestedDoctorCard'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { SessionDetail } from '../medical-agent/[sessionId]/page'


function AddNewSectionDialog() {

    const [note, setNote] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>();
    const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();
    const router = useRouter();
    const [historyList, setHistoryList] = useState<SessionDetail[]>([]);


    const { has } = useAuth();
    //@ts-ignore
    const paidUser = has && has({ plan: 'pro' });
    // console.log(paidUser);

    useEffect(() => {
        GetHistoryList();
    }, []);

    const GetHistoryList = async () => {
        const result = await axios.get('/api/session-chat?sessionId=all');
        console.log(result.data);
        setHistoryList(result.data);
    }


    const OnClickNext = async () => {
        setLoading(true);
        const result = await axios.post('/api/suggest-doctors', {
            notes: note
        });
        console.log(result.data);
        setSuggestedDoctors(result.data);
        setLoading(false);
    }

    const onStartConsultation = async () => {
        setLoading(true);
        // Save All Info To DataBase
        const result = await axios.post('/api/session-chat', {
            notes: note,
            selectedDoctor: selectedDoctor
        });

        console.log(result.data);
        if (result.data?.sessionId) {
            console.log(result.data.sessionId);
            //Route new Conversation Screen
            router.push('/dashboard/medical-agent/' + result.data.sessionId);
        }
        setLoading(false);
    }



    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='mt-5' disabled={!paidUser && historyList?.length >= 1}>+ Start a Consultation</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Basic Details.</DialogTitle>
                    <DialogDescription asChild>
                        {!suggestedDoctors ? <div>
                            <h2>Add Symptoms or Any Other Details.</h2>
                            <Textarea placeholder='Add Details Here.......' className='h-[200px] mt-4'
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div> :
                            <div>
                                <h2 >Select The Doctor</h2>
                                <div className='grid grid-cols-3 gap-5 mt-2'>
                                    {/*// Suggested Doctors */}
                                    {suggestedDoctors.map((doctor, index) => (
                                        <SuggestedDoctorCard doctorAgent={doctor} key={index} setSelectedDoctor={() => setSelectedDoctor(doctor)}
                                            //@ts-ignore 
                                            selectedDoctor={selectedDoctor} />
                                    ))}
                                </div>
                            </div>}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose>
                        <Button variant={'outline'}>Cancel</Button>
                    </DialogClose>
                    {!suggestedDoctors ? <Button disabled={!note || loading} onClick={() => OnClickNext()}>
                        Next {loading ? <Loader2 className='animate-spin' /> : <ArrowRight />} </Button>
                        : <Button disabled={loading || !selectedDoctor} onClick={() => onStartConsultation()}>Start Consultation
                            {loading ? <Loader2 className='animate-spin' /> : <ArrowRight />}
                        </Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNewSectionDialog
