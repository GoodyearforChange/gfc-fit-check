import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";

const anthropic = new Anthropic();
const resend = new Resend(process.env.RESEND_API_KEY);

const SYSTEM_PROMPT = `You are a grounded, direct voice for a men's coaching practice called Goodyear For Change. The tagline is: Happy people don't harm people. Write a 3-sentence reflection back to a man who just answered 4 honest questions. Your tone is direct, warm, and earned. Not therapeutic. Not a cheerleader. You name what you actually hear in his answers. You do not promise outcomes. You do not use coaching jargon. End with one sentence that opens a door without pushing him through it.

Rules for your writing:
- Never use em dashes. Use periods or commas instead.
- Never start with "I understand", "It sounds like", "It's clear that", or any phrase that sounds like a therapist or an AI summarizing.
- Do not mirror his language back to him. Respond like a real person who read what he wrote and is talking straight.
- Short sentences. Plain words. No filler.`;

const QUESTIONS = [
  "What made you click this link today?",
  "What's the one thing in your life that keeps not changing, no matter what you try?",
  "What would it mean to actually solve it?",
  "What's your honest hesitation about working with a coach?",
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { firstName, email, answers } = req.body;

  if (!firstName || !email || !answers || answers.length !== 4) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const userMessage = QUESTIONS.map(
    (q, i) => `${q}\n${answers[i]}`
  ).join("\n\n");

  try {
    // Generate reflection via Claude
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const reflection = message.content[0].text;

    // Send email via Resend (don't block the response on this)
    const emailBody = `
Name: ${firstName}
Email: ${email}

--- Answers ---

1. ${QUESTIONS[0]}
${answers[0]}

2. ${QUESTIONS[1]}
${answers[1]}

3. ${QUESTIONS[2]}
${answers[2]}

4. ${QUESTIONS[3]}
${answers[3]}

--- AI Reflection Shown ---

${reflection}
`.trim();

    resend
      .emails.send({
        from: "Fit Check <fitcheck@goodyearforchange.com>",
        to: "nik@goodyearforchange.com",
        subject: `New Fit Check: ${firstName}`,
        text: emailBody,
      })
      .catch((err) => console.error("Resend error:", err));

    return res.status(200).json({ reflection });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Failed to generate reflection" });
  }
}
