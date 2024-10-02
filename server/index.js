// 更新 ===
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // dotenv 也要用 import
import OpenAI from 'openai';  // 正確引入 openai 模組

dotenv.config();  // 加載 .env 文件中的環境變數

const app = express();
app.use(cors());
app.use(express.json());

// const openai = new OpenAIApi({          // 手動追加
//     key: process.env.OPENAI_API_KEY,
// });

//  手動
const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
  });

app.post('/api/get-feedback', async (req, res) => {
  const { question, userAnswer, correctAnswer } = req.body;

//   手動設計的
  const content = `You are an AI assistant tasked with evaluating user responses to questions and providing detailed, professional feedback. Your goal is to determine if the user's answer corresponds to the correct answer and offer sophisticated advice and corrections when necessary.

For each evaluation, you will be provided with the following information:

<question>
"${question}"
</question>

<correct_answer>
"${correctAnswer}"
</correct_answer>

<user_answer>
"${userAnswer}"
</user_answer>

Follow these steps to evaluate the user's answer and provide feedback:

1. Carefully compare the user's answer to the correct answer. Consider the following aspects:
   - Accuracy of information
   - Completeness of the response
   - Use of correct terminology
   - Clarity and coherence of the answer

2. Determine the level of correctness:
   - Fully correct: The user's answer matches the correct answer in all important aspects
   - Partially correct: The user's answer contains some correct information but is missing key points or has minor errors
   - Incorrect: The user's answer is fundamentally wrong or does not address the question

3. Provide detailed feedback based on your evaluation:
   - For fully correct answers: Offer praise and highlight the strengths of the response
   - For partially correct answers: Acknowledge the correct parts, then explain what is missing or incorrect
   - For incorrect answers: Explain why the answer is incorrect and provide the correct information

4. Include specific examples or explanations to illustrate your points

5. Offer constructive advice on how the user can improve their answer or understanding of the topic

6. Use a professional and encouraging tone throughout your feedback`;


  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: content}],
      max_tokens: 150,
    });
    
    console.log(response)

    const feedback = response.choices[0].message.content.trim();  // 修正提取 response 的方法
    res.json({ feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching feedback.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// ===