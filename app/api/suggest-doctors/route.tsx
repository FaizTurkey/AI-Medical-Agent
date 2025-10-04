import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";
import { NextResponse } from "next/server";

export async function POST(req: NextResponse) {

    const {notes} = await req.json();
    try {
        const completion = await openai.chat.completions.create({
            // model: "openai/gpt-oss-120b:free",
            model: "openai/gpt-4o-mini",
            messages: [
                {role:'system',content:JSON.stringify(AIDoctorAgents)},
                {
                    "role": "user",
                    "content": "User Notes/Symptoms:"+notes+", Depends on user notes and symptoms, Please suggest list of Doctors , Return Object in JSON only"
                }
            ],
        });

        const rawResp=completion.choices[0].message;
        //@ts-ignore
        const Resp=rawResp.content.trim().replace('```json','').replace('```','')
        const JSONResp=JSON.parse(Resp);
        
        return NextResponse.json(JSONResp);
    } catch (e) {
        return NextResponse.json(e);
    }
}