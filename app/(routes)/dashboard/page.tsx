import React from 'react'
import HistoryList from './_components/HistoryList'
import { Button } from '@/components/ui/button'
import DoctorAgentList from './_components/DoctorAgentList'
import AddNewSectionDialog from './_components/AddNewSectionDialog'

const Dashboard = () => {
  return (
    <div>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold text-2xl'>My Dashboard</h2>
        <AddNewSectionDialog/>
      </div>
      <HistoryList />
      <DoctorAgentList/>
    </div>
  )
}

export default Dashboard
