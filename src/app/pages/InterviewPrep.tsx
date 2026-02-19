import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Users, Brain, ChevronDown, ChevronUp, Star, Clock, TrendingUp } from 'lucide-react';

const questionCategories = [
  {
    category: 'Technical',
    icon: Code,
    color: 'primary',
    count: 28,
    questions: [
      {
        id: 1,
        question: 'Explain the difference between var, let, and const in JavaScript',
        difficulty: 'Easy',
        answered: true,
        rating: 4,
        tags: ['JavaScript', 'Fundamentals'],
      },
      {
        id: 2,
        question: 'What is the Virtual DOM and how does React use it?',
        difficulty: 'Medium',
        answered: true,
        rating: 5,
        tags: ['React', 'Performance'],
      },
      {
        id: 3,
        question: 'Design a rate limiter for an API',
        difficulty: 'Hard',
        answered: false,
        tags: ['System Design', 'Algorithms'],
      },
      {
        id: 4,
        question: 'Implement a debounce function in JavaScript',
        difficulty: 'Medium',
        answered: false,
        tags: ['JavaScript', 'Performance'],
      },
    ],
  },
  {
    category: 'Behavioral',
    icon: Users,
    color: 'chart-2',
    count: 18,
    questions: [
      {
        id: 5,
        question: 'Tell me about a time you faced a challenging bug and how you resolved it',
        difficulty: 'Medium',
        answered: true,
        rating: 4,
        tags: ['Problem Solving', 'Experience'],
      },
      {
        id: 6,
        question: 'Describe a situation where you had to work with a difficult team member',
        difficulty: 'Medium',
        answered: false,
        tags: ['Teamwork', 'Communication'],
      },
      {
        id: 7,
        question: 'How do you prioritize tasks when you have multiple deadlines?',
        difficulty: 'Easy',
        answered: true,
        rating: 3,
        tags: ['Time Management', 'Leadership'],
      },
    ],
  },
  {
    category: 'Problem Solving',
    icon: Brain,
    color: 'chart-3',
    count: 15,
    questions: [
      {
        id: 8,
        question: 'Given an array of integers, find two numbers that add up to a target sum',
        difficulty: 'Easy',
        answered: true,
        rating: 5,
        tags: ['Arrays', 'Hash Tables'],
      },
      {
        id: 9,
        question: 'Implement a function to reverse a linked list',
        difficulty: 'Medium',
        answered: false,
        tags: ['Linked Lists', 'Pointers'],
      },
      {
        id: 10,
        question: 'Design an algorithm to serialize and deserialize a binary tree',
        difficulty: 'Hard',
        answered: false,
        tags: ['Trees', 'Recursion'],
      },
    ],
  },
];

export default function InterviewPrep() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Technical');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const toggleQuestion = (id: number) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-chart-5 bg-chart-5/10';
      case 'Medium':
        return 'text-chart-3 bg-chart-3/10';
      case 'Hard':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-foreground mb-2">Interview Preparation</h1>
          <p className="text-muted-foreground">Practice with curated questions for your target roles</p>
        </div>
        <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25">
          Start Mock Interview
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Questions', value: '61', icon: Brain, color: 'primary' },
          { label: 'Answered', value: '18', icon: TrendingUp, color: 'chart-5' },
          { label: 'Average Rating', value: '4.2', icon: Star, color: 'chart-3' },
          { label: 'Time Invested', value: '12h', icon: Clock, color: 'chart-2' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="p-6 rounded-xl bg-card border border-border backdrop-blur-xl"
          >
            <div className={`w-10 h-10 rounded-lg bg-${stat.color}/10 flex items-center justify-center mb-4`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}`} />
            </div>
            <h3 className="text-3xl font-semibold text-foreground mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Question Categories */}
      <div className="space-y-4">
        {questionCategories.map((category, categoryIdx) => (
          <motion.div
            key={categoryIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + categoryIdx * 0.1, duration: 0.5 }}
            className="rounded-xl bg-card border border-border backdrop-blur-xl overflow-hidden"
          >
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.category)}
              className="w-full p-6 flex items-center justify-between hover:bg-secondary/30 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg bg-${category.color}/10 flex items-center justify-center`}>
                  <category.icon className={`w-6 h-6 text-${category.color}`} />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold text-foreground">{category.category} Questions</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.count} questions • {category.questions.filter(q => q.answered).length} answered
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-semibold text-primary">
                    {Math.round((category.questions.filter(q => q.answered).length / category.questions.length) * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
                {expandedCategory === category.category ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Questions List */}
            <AnimatePresence>
              {expandedCategory === category.category && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-border"
                >
                  <div className="p-6 space-y-3">
                    {category.questions.map((question) => (
                      <div
                        key={question.id}
                        className="rounded-lg bg-secondary/30 border border-border overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(question.id)}
                          className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-all duration-200"
                        >
                          <div className="flex items-start gap-3 flex-1 text-left">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              question.answered ? 'bg-chart-5' : 'bg-muted'
                            }`}>
                              {question.answered ? (
                                <span className="text-xs text-white">✓</span>
                              ) : (
                                <span className="text-xs text-muted-foreground">{question.id}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-foreground font-medium mb-2">{question.question}</p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(question.difficulty)}`}>
                                  {question.difficulty}
                                </span>
                                {question.tags.map((tag, idx) => (
                                  <span key={idx} className="px-2 py-1 rounded text-xs bg-muted/50 text-muted-foreground">
                                    {tag}
                                  </span>
                                ))}
                                {question.answered && question.rating && (
                                  <span className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-chart-3/20 text-chart-3">
                                    <Star className="w-3 h-3 fill-current" />
                                    {question.rating}/5
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {expandedQuestion === question.id ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground ml-4" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground ml-4" />
                          )}
                        </button>

                        <AnimatePresence>
                          {expandedQuestion === question.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-border"
                            >
                              <div className="p-4 space-y-4">
                                {question.answered ? (
                                  <>
                                    <div className="p-4 rounded-lg bg-chart-5/5 border border-chart-5/20">
                                      <h4 className="text-sm font-medium text-foreground mb-2">Your Answer</h4>
                                      <p className="text-sm text-muted-foreground">
                                        This is a placeholder for your saved answer. In a real application, this would 
                                        display your recorded or written response to the interview question.
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200">
                                        Review Answer
                                      </button>
                                      <button className="px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/70 transition-all duration-200">
                                        Practice Again
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                      <h4 className="text-sm font-medium text-foreground mb-2">Tips</h4>
                                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                        <li>Take your time to think through the problem</li>
                                        <li>Ask clarifying questions before starting</li>
                                        <li>Explain your thought process as you work</li>
                                      </ul>
                                    </div>
                                    <button className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25">
                                      Start Practicing
                                    </button>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* AI Suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-chart-2/10 border border-primary/20"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Recommended Focus Area</h3>
            <p className="text-muted-foreground mb-4">
              Based on your target roles and recent job postings, we recommend focusing on System Design questions 
              this week. These are frequently asked in senior developer interviews and align with your career goals.
            </p>
            <button className="px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25">
              View Recommended Questions
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
