const { GoogleGenAI } = require("@google/genai")
const {z} = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});


const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).length(5)
       .describe("Exactly 5 Technical questions that can be asked in the interview along with their intention"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).length(5)
       .describe("Exactly 5 Behavioral questions that can be asked in the interview along with their intention"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).max(10)
       .describe("List maximum of 10 skill gaps (if any) in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).length(7).describe("Exactly 7 days preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate with the following details:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}

    Generate:
        - exactly 5 technical interview questions
        - exactly 5 behavioral interview questions
        - up to 10 important skill gaps (if any)
        - a 7-day preparation plan
        - a match score from 0 to 100
        Keep the answers concise and practical. Do not generate unnecessarily long explanations.

`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json", //response generated will be in json format
            responseSchema: zodToJsonSchema(interviewReportSchema), //json will follow this schema
        }
    })

    return JSON.parse(response.text)

}

module.exports = { generateInterviewReport }