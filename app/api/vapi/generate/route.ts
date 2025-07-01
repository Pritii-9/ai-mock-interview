// app/api/vapi/generate/route.ts

import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  let body;
  try {
    // Attempt to parse the JSON body
    body = await request.json();
    console.log("Received request body:", body);

    // Destructure the properties from the parsed body
    const { type, role, level, techstack, amount, userid } = body;

    // --- Validation (Highly Recommended) ---
    if (!type || !role || !level || !techstack || !amount || !userid) {
      console.error("Missing required fields in request body:", body);
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }
    // ----------------------------------------
    
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return NextResponse.json({ success: true , data: "Thank You!"}, { status: 200 });

  } catch (error) {
    // This catch block will now catch the JSON parsing error specifically.
    console.error("Error processing POST request:", error);

    // To get more information, you can try to read the body as plain text
    // to see if it's empty or something else.
    try {
        const rawBody = await request.text();
        console.error("Raw request body:", rawBody);
    } catch (textError) {
        console.error("Could not read raw body:", textError);
    }

    return NextResponse.json({ success: false, error: "Failed to process request" }, { status: 500 });
  }
}