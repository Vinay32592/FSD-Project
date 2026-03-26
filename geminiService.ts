
import { GoogleGenAI, Type } from "@google/genai";
import { Step } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || '' });

// Helper function to try different models
const tryGenerateContent = async (models: string[], contents: any, config?: any) => {
  for (const model of models) {
    try {
      return await ai.models.generateContent({
        model,
        contents,
        config,
      });
    } catch (error) {
      console.warn(`Model ${model} failed:`, error);
      if (model === models[models.length - 1]) {
        throw error; // If last model fails, throw the error
      }
    }
  }
};

// Fallback functions for when API is not available
const generateFallbackRoadmap = (goal: string): Step[] => {
  const lowerGoal = goal.toLowerCase();

  if (lowerGoal.includes('software engineer') || lowerGoal.includes('developer') || lowerGoal.includes('programming')) {
    return [
      {
        title: "Learn Programming Basics",
        description: "Start with HTML, CSS, and JavaScript fundamentals",
        duration: "2 weeks",
        milestone: "Build your first simple website"
      },
      {
        title: "Choose a Language",
        description: "Pick Python or JavaScript and learn the basics",
        duration: "3 weeks",
        milestone: "Write simple programs and understand syntax"
      },
      {
        title: "Learn Data Structures",
        description: "Study arrays, lists, stacks, and basic algorithms",
        duration: "4 weeks",
        milestone: "Solve coding problems efficiently"
      },
      {
        title: "Build Projects",
        description: "Create small applications and practice coding",
        duration: "6 weeks",
        milestone: "Portfolio of working applications"
      },
      {
        title: "Learn Frameworks",
        description: "Study React, Django, or similar popular frameworks",
        duration: "8 weeks",
        milestone: "Build full-stack applications"
      }
    ];
  }

  if (lowerGoal.includes('data science') || lowerGoal.includes('machine learning') || lowerGoal.includes('ai')) {
    return [
      {
        title: "Learn Python Basics",
        description: "Master Python programming fundamentals",
        duration: "3 weeks",
        milestone: "Write Python scripts for data manipulation"
      },
      {
        title: "Statistics and Math",
        description: "Study probability, statistics, and linear algebra",
        duration: "6 weeks",
        milestone: "Understand data analysis concepts"
      },
      {
        title: "Learn Pandas & NumPy",
        description: "Master data manipulation libraries",
        duration: "4 weeks",
        milestone: "Clean and analyze datasets"
      },
      {
        title: "Machine Learning Basics",
        description: "Study supervised and unsupervised learning",
        duration: "8 weeks",
        milestone: "Build predictive models"
      },
      {
        title: "Deep Learning",
        description: "Learn neural networks and TensorFlow/PyTorch",
        duration: "10 weeks",
        milestone: "Create AI applications"
      }
    ];
  }

  // Default roadmap for any other goal
  return [
    {
      title: "Research and Planning",
      description: `Dive deep into ${goal} fundamentals. Research industry trends, required skills, career paths, and learning resources. Create a personalized study plan with realistic timelines, identify knowledge gaps, and set achievable milestones. Join relevant communities and forums to connect with practitioners.`,
      duration: "1 week",
      milestone: "Clear understanding of what to learn"
    },
    {
      title: "Foundation Knowledge",
      description: `Build strong theoretical foundations in ${goal}. Study core concepts, principles, terminology, and basic frameworks. Learn fundamental theories, historical context, and industry standards. Focus on understanding 'why' before 'how' to ensure lasting knowledge.`,
      duration: "4 weeks",
      milestone: "Strong foundation in core concepts"
    },
    {
      title: "Practical Skills",
      description: `Apply your knowledge through hands-on practice in ${goal}. Work on real projects, complete tutorials, and build practical applications. Learn essential tools, software, and methodologies. Focus on building confidence through consistent practice and problem-solving.`,
      duration: "6 weeks",
      milestone: "Working knowledge and practical experience"
    },
    {
      title: "Advanced Topics",
      description: `Explore specialized areas within ${goal}. Study advanced techniques, emerging trends, and complex problem-solving. Learn industry best practices, optimization strategies, and professional workflows. Begin contributing to open-source projects or professional communities.`,
      duration: "8 weeks",
      milestone: "Expert-level understanding"
    },
    {
      title: "Real Projects & Portfolio",
      description: `Create comprehensive projects that demonstrate your ${goal} expertise. Build a professional portfolio showcasing your skills and achievements. Network with industry professionals, seek mentorship, and prepare for career opportunities. Document your learning journey and share knowledge with others.`,
      duration: "6 weeks",
      milestone: "Portfolio of completed work"
    }
  ];
};

const generateFallbackQuiz = (stepTitle: string): QuizQuestion[] => {
  const stepLower = stepTitle.toLowerCase();

  if (stepLower.includes('research') || stepLower.includes('planning')) {
    return [
      {
        question: `What is the most important first step when learning ${stepTitle}?`,
        options: [
          "Buy expensive equipment",
          "Research and understand the field thoroughly",
          "Start coding immediately",
          "Join every online community"
        ],
        correctAnswer: 1,
        hint: "Think about building a solid foundation",
        explanation: "Research helps you understand the landscape, avoid common pitfalls, and create an effective learning plan."
      },
      {
        question: "How long should you spend on research and planning?",
        options: [
          "Just a few hours",
          "1-2 weeks to get comprehensive understanding",
          "Several months",
          "The entire learning journey"
        ],
        correctAnswer: 1,
        hint: "Balance is key - enough time to be informed but not so much you delay starting",
        explanation: "1-2 weeks allows you to gather essential information, assess your goals, and create a realistic plan without analysis paralysis."
      },
      {
        question: "What should you include in your study plan?",
        options: [
          "Only technical skills",
          "Timeline, resources, milestones, and self-assessment",
          "Just course recommendations",
          "Social media following plan"
        ],
        correctAnswer: 1,
        hint: "A comprehensive plan covers multiple aspects of learning",
        explanation: "An effective study plan includes realistic timelines, recommended resources, measurable milestones, and regular self-assessment checkpoints."
      }
    ];
  }

  if (stepLower.includes('foundation') || stepLower.includes('basic')) {
    return [
      {
        question: `Why is building a strong foundation important in ${stepTitle}?`,
        options: [
          "To impress others",
          "To ensure advanced concepts make sense later",
          "To get certifications faster",
          "To skip difficult topics"
        ],
        correctAnswer: 1,
        hint: "Think about long-term understanding",
        explanation: "A strong foundation ensures you can build advanced knowledge upon solid ground, making complex topics much easier to grasp."
      },
      {
        question: "What should you focus on during foundation learning?",
        options: [
          "Only memorization",
          "Understanding core concepts and principles",
          "Advanced techniques",
          "Real-world applications"
        ],
        correctAnswer: 1,
        hint: "Foundations are about deep understanding",
        explanation: "Foundation learning emphasizes understanding 'why' and 'how' things work, not just memorizing facts or jumping to applications."
      },
      {
        question: "How should you validate your foundation knowledge?",
        options: [
          "Take advanced exams",
          "Explain concepts to others in simple terms",
          "Build complex projects",
          "Skip to next level"
        ],
        correctAnswer: 1,
        hint: "Teaching others is the best test of understanding",
        explanation: "Being able to explain concepts simply to others demonstrates true understanding of foundational knowledge."
      }
    ];
  }

  // Default quiz for other steps
  return [
    {
      question: `What is the primary goal of "${stepTitle}"?`,
      options: [
        "To complete it as quickly as possible",
        "To gain specific knowledge and skills",
        "To get a certificate",
        "To finish the entire learning path"
      ],
      correctAnswer: 1,
      hint: "Focus on the step's learning objective",
      explanation: "Each step has a specific purpose in your learning journey - understanding and achieving that goal is key."
    },
    {
      question: `How should you approach learning in "${stepTitle}"?`,
      options: [
        "Only theory, no practice",
        "Balance theory with hands-on application",
        "Only practice, skip theory",
        "Copy others' work"
      ],
      correctAnswer: 1,
      hint: "Effective learning combines different approaches",
      explanation: "The best learning combines theoretical understanding with practical application for lasting knowledge."
    },
    {
      question: `What should you do after completing "${stepTitle}"?`,
      options: [
        "Immediately move to advanced topics",
        "Review what you learned and assess progress",
        "Take a long break",
        "Forget everything and start over"
      ],
      correctAnswer: 1,
      hint: "Consolidation is important for retention",
      explanation: "Reviewing and assessing your progress helps reinforce learning and identify areas for improvement."
    }
  ];
};

export const generateRoadmapSteps = async (goal: string): Promise<Step[]> => {
  try {
    // Check if API key is configured
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
      console.log('No API key configured, using fallback roadmap');
      return generateFallbackRoadmap(goal);
    }

    // Try AI generation first
    try {
      // Simple classification
      const classificationResponse = await tryGenerateContent(
        ["gemini-1.5-pro", "gemini-1.5-flash"],
        `Is this asking for a learning path or just information?

Query: "${goal}"

If it asks "how to", "learn", "become", "roadmap", or similar, respond with "ROADMAP"
Otherwise respond with "INFO"

Keep response to one word only.`,
        {
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: "text/plain",
        }
      );

      const classification = classificationResponse.text?.trim().toUpperCase();

      if (classification === "ROADMAP") {
        // Simple roadmap generation with basic English
        const response = await tryGenerateContent(
          ["gemini-1.5-pro", "gemini-1.5-flash"],
          `Create a simple learning guide for: "${goal}"

          Write 5-8 easy steps in simple English. Each step should have:
          - A clear title
          - Simple explanation
          - Time needed (like "2 weeks")
          - What you learn

          Keep it simple and easy to understand.`,
          {
            thinkingConfig: { thinkingBudget: 0 },
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "Simple title for this step"
                  },
                  description: {
                    type: Type.STRING,
                    description: "Easy explanation in simple words"
                  },
                  duration: {
                    type: Type.STRING,
                    description: "How long it takes, like '1 week' or '2 months'"
                  },
                  milestone: {
                    type: Type.STRING,
                    description: "What you will learn or achieve"
                  },
                },
                required: ["title", "description", "duration", "milestone"],
              },
            },
          }
        );

        const result = JSON.parse(response.text || "[]");
        return result;
      } else {
        // Simple information response
        const response = await tryGenerateContent(
          ["gemini-1.5-pro", "gemini-1.5-flash"],
          `Explain: "${goal}" in simple English.

          Break it down into 3-5 easy parts. Each part should have:
          - A simple title
          - Clear explanation
          - "Immediate" as duration
          - What you learn from this part

          Use easy words and keep it simple.`,
          {
            thinkingConfig: { thinkingBudget: 0 },
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "Simple title for this part"
                  },
                  description: {
                    type: Type.STRING,
                    description: "Easy explanation in simple words"
                  },
                  duration: {
                    type: Type.STRING,
                    description: "Always 'Immediate'"
                  },
                  milestone: {
                    type: Type.STRING,
                    description: "What you learn from this part"
                  },
                },
                required: ["title", "description", "duration", "milestone"],
              },
            },
          }
        );

        const result = JSON.parse(response.text || "[]");
        return result;
      }
    } catch (aiError) {
      console.log('AI generation failed, using fallback roadmap:', aiError);
      return generateFallbackRoadmap(goal);
    }
  } catch (error) {
    console.error("Error generating response:", error);
    // Return fallback even on general errors
    return generateFallbackRoadmap(goal);
  }
};

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
  explanation: string;
}

export const generateFinalQuizForRoadmap = async (steps: Step[], goal: string): Promise<QuizQuestion[]> => {
  try {
    // Check if API key is configured
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
      console.log('No API key configured, using fallback final quiz');
      return generateFallbackFinalQuiz(steps, goal);
    }

    // Try AI generation first
    try {
      const stepsSummary = steps.map((step, idx) => `${idx + 1}. ${step.title}: ${step.description}`).join('\n');
      const response = await tryGenerateContent(
        ["gemini-1.5-pro", "gemini-1.5-flash"],
        `Create 10 comprehensive quiz questions that test knowledge across this entire learning roadmap for "${goal}":

Roadmap Steps:
${stepsSummary}

Each question should:
- Test understanding of concepts from any step in the roadmap
- Have 4 simple answer choices (A, B, C, D)
- One correct answer
- A short hint
- Simple explanation

Create questions that cover different aspects of the learning journey. Use easy words and keep it simple.`,
        {
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "Comprehensive question covering roadmap concepts" },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  minItems: 4,
                  maxItems: 4,
                  description: "4 simple answer choices"
                },
                correctAnswer: {
                  type: Type.INTEGER,
                  minimum: 0,
                  maximum: 3,
                  description: "Index of correct answer (0-3)"
                },
                hint: { type: Type.STRING, description: "Short helpful hint" },
                explanation: { type: Type.STRING, description: "Simple explanation of correct answer" }
              },
              required: ["question", "options", "correctAnswer", "hint", "explanation"]
            },
            minItems: 10,
            maxItems: 10
          }
        }
      );

      const result = JSON.parse(response.text || "[]");
      return result;
    } catch (aiError) {
      console.log('AI final quiz generation failed, using fallback:', aiError);
      return generateFallbackFinalQuiz(steps, goal);
    }
  } catch (error) {
    console.error("Error generating final quiz:", error);
    return generateFallbackFinalQuiz(steps, goal);
  }
};

const generateFallbackFinalQuiz = (steps: Step[], goal: string): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];

  // Generate 2 questions per step, up to 10 total
  const maxQuestions = Math.min(10, steps.length * 2);

  for (let i = 0; i < maxQuestions; i++) {
    const stepIndex = Math.floor(i / 2);
    const step = steps[stepIndex];

    if (i % 2 === 0) {
      // Question about the step's purpose
      questions.push({
        question: `What is the main purpose of the "${step.title}" step in learning ${goal}?`,
        options: [
          "To complete the entire learning journey",
          "To achieve the specific milestone: " + step.milestone,
          "To get a certification immediately",
          "To work on unrelated projects"
        ],
        correctAnswer: 1,
        hint: "Look at the milestone for this step",
        explanation: "Each step has a specific purpose and milestone that contributes to your overall learning goal."
      });
    } else {
      // Question about the step's duration/timeline
      questions.push({
        question: `How much time should you typically spend on "${step.title}" when learning ${goal}?`,
        options: [
          "Just a few hours",
          step.duration,
          "Several months",
          "The entire learning period"
        ],
        correctAnswer: 1,
        hint: "Check the recommended duration for this step",
        explanation: "The timeline provides a realistic estimate for thorough learning without rushing."
      });
    }
  }

  return questions;
};
