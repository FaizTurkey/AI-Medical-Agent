'use client'
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { doctorAgent } from '../../_components/DoctorAgentCard';
import { Circle, Loader, PhoneCall, PhoneOff } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';
import Provider from '@/app/provider';
import { toast } from 'sonner';


export type SessionDetail = {
  id: number,
  notes: string,
  sessionId: string,
  report: JSON,
  selectedDoctor: doctorAgent,
  createdOn: string,

}

type messages = {
  role: string,
  text: string
}

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currentRoll, setCurrentRoll] = useState<string | null>();
  const [liveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<messages[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();



  useEffect(() => {
    sessionId && GetSessionDetails();
  }, [sessionId]);

  const GetSessionDetails = async () => {
    const result = await axios.get('/api/session-chat?sessionId=' + sessionId);
    console.log(result.data);
    setSessionDetail(result.data);
  }


  const StartCall = () => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);


    // For All AI Voice some error occured
    // const VapiAgentConfig={
    //   name:'AI Medical Doctor Voice Agent',
    //   firstMessage:"Hi there! I am your AI Medical Assistance. I'm here to help you with any Medical Issue, and i will help you with any health questions or concerns you might have today. How are you feeling? ",
    //   transcriber:{
    //     provider:'assembly-ai',
    //     language:'en'
    //   }, 
    //   voice:{
    //     provider:'Azure',
    //     voiceId:sessionDetail?.selectedDoctor?.voiceId
    //   },
    //   model:{
    //     provider:'openai',
    //     model:'gpt-4',
    //     messages:[
    //     {
    //         role:'system',
    //         content:sessionDetail?.selectedDoctor?.agentPrompt
    //     }
    //     ]
    //   }
    // }

    vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID);


    //@ts-ignore
    // vapi.start(VapiAgentConfig);
    vapi.on('call-start', () => {
      console.log('Call started')
      setCallStarted(true);
    });
    vapi.on('call-end', () => {
      console.log('Call ended')
      setCallStarted(false);
    });
    vapi.on('message', (message) => {
      if (message.type === 'transcript') {
        const { role, transcriptType, transcript } = message;
        console.log(`${message.role}: ${message.transcript}`);
        if (transcriptType == 'partial') {
          setLiveTranscript(transcript);
          setCurrentRoll(role);
        } else if (transcriptType == 'final') {
          // Final Transcript
          setMessages((prev: any) => [...prev, { role: role, text: transcript }]);
          setLiveTranscript("");
          setCurrentRoll(null);

        }
      }
    });

    vapiInstance.on('speech-start', () => {
      console.log('Assistant started speaking');
      setCurrentRoll('assistant')
    });
    vapiInstance.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setCurrentRoll('user');
    });
  }

  const endCall = async () => {
    // setLoading(true);
     const result = await GenerateReport();
    if (!vapiInstance) return;
    // Stop The Call 
    vapiInstance.stop();

    // Optional Remove listeners (Good For Memory Management)

    vapiInstance.off('call-start');
    vapiInstance.off('call-end');
    vapiInstance.off('message');
    vapiInstance.off('speech-start');
    vapiInstance.off('speech-end');

    // Reset call state

    setCallStarted(false);
    setVapiInstance(null);

    toast.success('Your Report Is Generated!');

    router.replace('/dashboard');
   

    // setLoading(false);
  };


  const GenerateReport = async () => {
    setLoading(true);
    const result = await axios.post('/api/medical-report', {
      messages: messages,
      sessionDetail: sessionDetail,
      sessionId: sessionId
    })

    console.log(result.data);
    return result.data;
  }

  return (
    <div className='p-5 border rounded-2xl bg-secondary'>
      <div className='flex justify-between items-center'>
        <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'> <Circle className={`w-4 h-4 rounded-full ${callStarted ? 'bg-green-500' : 'bg-red-500'}`} /> {callStarted ? 'Connected....' : 'Not Connected'}  </h2>
        <h2 className='font-bold text-xl text-gray-400'>00:00</h2>
      </div>

      {sessionDetail && <div className='flex items-center flex-col mt-10'>
        <Image src={sessionDetail?.selectedDoctor?.image} alt={sessionDetail?.selectedDoctor?.specialist ?? ''}
          width={120} height={120} className='h-[150px] w-[150px] object-cover rounded-full' />
        <h2 className='mt-1 text-lg font-bold'>{sessionDetail?.selectedDoctor?.specialist}</h2>
        <p className='text-sm text-gray-400'>AI Medical Voice Agent</p>

        <div className='mt-32 overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72'>
          {
            messages?.slice(-4).map((msg: messages, index) => (
              <h2 className='text-gray-400 p-2' key={index}>{msg.role} : {msg.text}</h2>
            ))
          }
          {liveTranscript && liveTranscript?.length > 0 && <h2 className='text-lg'>{currentRoll} : {liveTranscript}</h2>}
        </div>

        {!callStarted ? (
          <Button className='mt-20' onClick={StartCall} disabled={loading}>
            {loading ? <Loader className='animate-spin' /> : <PhoneCall />} Start Call </Button>
        ) : (
           <Button variant={'destructive'} onClick={endCall} disabled={loading}> 
                {loading ? <Loader className='animate-spin' /> :  <PhoneOff /> }Disconnected
          </Button>

        ) }
      </div>}
    </div>
  )
}

export default MedicalVoiceAgent
