import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { SessionDetail } from '../medical-agent/[sessionId]/page'
import moment from 'moment'
import { REPORT_GEN_PROMPT } from '@/app/api/medical-report/route'

type props = {
    record: SessionDetail
}

function ViewReportDialog({ record }: props) {
    return (

        <Dialog>
            <DialogTrigger>
                <Button className='cursor-pointer' variant={"link"} size={'sm'}>View Report</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle asChild>
                        <h2 className='text-center text-4xl'>AI Medical Voice Agent Report</h2>
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className='mt-10'>
                            <h2 className='font-bold text-blue-500 text-lg'>Session Info :</h2>
                            <div className='grid grid-cols-2'>

                                <h2 className='mb-4'> <span className='font-bold'>Doctor Specialization :</span> {record.selectedDoctor?.specialist}</h2>
                                <h2><span className='font-bold'> Consult Date :</span> {moment(new Date(record?.createdOn)).fromNow()}</h2>
                                <h2><span className='font-bold mt-5'>Chief Complient : </span>{record.notes}</h2>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default ViewReportDialog
