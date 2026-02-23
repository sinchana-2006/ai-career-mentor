import { motion } from 'motion/react';
import { BookOpen, Clock, CheckCircle2, Play, Lock, Award, TrendingUp } from 'lucide-react';

const roadmapStages = [
  {
    stage: 'Foundation',
    description: 'Build your core technical foundation',
    progress: 85,
    courses: [
      { title: 'JavaScript Fundamentals', duration: '8 hours', status: 'completed', topics: 12 },
      { title: 'ES6+ Modern JavaScript', duration: '6 hours', status: 'completed', topics: 10 },
      { title: 'React Basics', duration: '10 hours', status: 'completed', topics: 15 },
      { title: 'Git & Version Control', duration: '4 hours', status: 'in-progress', topics: 8, progress: 60 },
    ],
  },
  {
    stage: 'Intermediate',
    description: 'Advanced concepts and real-world applications',
    progress: 40,
    courses: [
      { title: 'TypeScript Advanced', duration: '12 hours', status: 'in-progress', topics: 18, progress: 45 },
      { title: 'React State Management', duration: '8 hours', status: 'in-progress', topics: 12, progress: 30 },
      { title: 'RESTful API Design', duration: '10 hours', status: 'not-started', topics: 14 },
      { title: 'Testing with Jest', duration: '7 hours', status: 'not-started', topics: 10 },
      { title: 'Node.js & Express', duration: '15 hours', status: 'not-started', topics: 20 },
    ],
  },
  {
    stage: 'Advanced',
    description: 'Expert-level skills and specializations',
    progress: 0,
    courses: [
      { title: 'System Design Principles', duration: '20 hours', status: 'locked', topics: 25 },
      { title: 'Microservices Architecture', duration: '18 hours', status: 'locked', topics: 22 },
      { title: 'Docker & Kubernetes', duration: '16 hours', status: 'locked', topics: 20 },
      { title: 'Advanced Performance Optimization', duration: '12 hours', status: 'locked', topics: 15 },
      { title: 'Cloud Architecture (AWS)', duration: '24 hours', status: 'locked', topics: 30 },
    ],
  },
];

const milestones = [
  { title: 'Frontend Developer Ready', completed: true, date: 'Dec 2025' },
  { title: 'Full Stack Capable', completed: false, date: 'Mar 2026' },
  { title: 'Senior Engineer Level', completed: false, date: 'Aug 2026' },
];

export default function LearningRoadmap() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-foreground mb-2">Learning Roadmap</h1>
          <p className="text-muted-foreground">Your personalized path to career success</p>
        </div>
        <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25">
          Customize Plan
        </button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 rounded-xl bg-card border border-border backdrop-blur-xl"
        >
          <div className="w-10 h-10 rounded-lg bg-chart-5/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-5 h-5 text-chart-5" />
          </div>
          <h3 className="text-3xl font-semibold text-foreground mb-1">12</h3>
          <p className="text-sm text-muted-foreground">Courses Completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="p-6 rounded-xl bg-card border border-border backdrop-blur-xl"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <Play className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-3xl font-semibold text-foreground mb-1">4</h3>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="p-6 rounded-xl bg-card border border-border backdrop-blur-xl"
        >
          <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
            <Clock className="w-5 h-5 text-chart-3" />
          </div>
          <h3 className="text-3xl font-semibold text-foreground mb-1">142</h3>
          <p className="text-sm text-muted-foreground">Hours Invested</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="p-6 rounded-xl bg-card border border-border backdrop-blur-xl"
        >
          <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-chart-2" />
          </div>
          <h3 className="text-3xl font-semibold text-foreground mb-1">67%</h3>
          <p className="text-sm text-muted-foreground">Overall Progress</p>
        </motion.div>
      </div>

      {/* Milestones Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="p-6 rounded-xl bg-card border border-border backdrop-blur-xl"
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Career Milestones</h2>
          <p className="text-sm text-muted-foreground">Key achievements on your journey</p>
        </div>
        
        <div className="flex items-center justify-between">
          {milestones.map((milestone, idx) => (
            <div key={idx} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    milestone.completed
                      ? 'bg-chart-5 border-chart-5'
                      : 'bg-secondary border-border'
                  }`}
                >
                  {milestone.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <Award className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="mt-4 text-center">
                  <p className={`font-medium ${milestone.completed ? 'text-chart-5' : 'text-muted-foreground'}`}>
                    {milestone.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{milestone.date}</p>
                </div>
              </div>
              {idx < milestones.length - 1 && (
                <div className={`h-0.5 flex-1 mx-4 ${milestone.completed ? 'bg-chart-5' : 'bg-border'}`}></div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Roadmap Stages */}
      <div className="space-y-6">
        {roadmapStages.map((stage, stageIdx) => (
          <motion.div
            key={stageIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + stageIdx * 0.1, duration: 0.5 }}
            className="p-6 rounded-xl bg-card border border-border backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-1">{stage.stage}</h2>
                <p className="text-sm text-muted-foreground">{stage.description}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-semibold text-primary">{stage.progress}%</p>
                <p className="text-xs text-muted-foreground">Complete</p>
              </div>
            </div>

            <div className="w-full bg-secondary rounded-full h-2 mb-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stage.progress}%` }}
                transition={{ delay: 0.6 + stageIdx * 0.1, duration: 1, ease: "easeOut" }}
                className="h-2 rounded-full bg-gradient-to-r from-primary to-chart-2"
              ></motion.div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {stage.courses.map((course, courseIdx) => (
                <div
                  key={courseIdx}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    course.status === 'completed'
                      ? 'bg-chart-5/5 border-chart-5/30'
                      : course.status === 'in-progress'
                      ? 'bg-primary/5 border-primary/30'
                      : course.status === 'locked'
                      ? 'bg-secondary/20 border-border opacity-60'
                      : 'bg-secondary/30 border-border hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          course.status === 'completed'
                            ? 'bg-chart-5/20'
                            : course.status === 'in-progress'
                            ? 'bg-primary/20'
                            : course.status === 'locked'
                            ? 'bg-secondary'
                            : 'bg-secondary'
                        }`}
                      >
                        {course.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-chart-5" />
                        ) : course.status === 'in-progress' ? (
                          <Play className="w-5 h-5 text-primary" />
                        ) : course.status === 'locked' ? (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <BookOpen className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-foreground font-medium mb-1">{course.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </span>
                          <span>{course.topics} topics</span>
                        </div>
                        
                        {course.status === 'in-progress' && course.progress !== undefined && (
                          <div className="mt-2">
                            <div className="w-full bg-secondary rounded-full h-1.5">
                              <div
                                className="h-1.5 rounded-full bg-primary"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      disabled={course.status === 'locked'}
                      className={`px-5 py-2 rounded-lg transition-all duration-200 ${
                        course.status === 'completed'
                          ? 'bg-chart-5/10 text-chart-5 hover:bg-chart-5/20'
                          : course.status === 'in-progress'
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25'
                          : course.status === 'locked'
                          ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                          : 'bg-secondary text-foreground hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      {course.status === 'completed'
                        ? 'Review'
                        : course.status === 'in-progress'
                        ? 'Continue'
                        : course.status === 'locked'
                        ? 'Locked'
                        : 'Start'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-chart-2/10 border border-primary/20"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">AI Recommendation</h3>
            <p className="text-muted-foreground mb-4">
              Based on your progress and target roles, we recommend focusing on "TypeScript Advanced" and 
              "React State Management" courses this week. Completing these will boost your Frontend Developer 
              readiness score to 85% and unlock new opportunities.
            </p>
            <button className="px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25">
              View Detailed Plan
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
