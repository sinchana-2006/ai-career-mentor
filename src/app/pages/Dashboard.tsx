import { motion } from 'motion/react';
import { TrendingUp, Target, Zap, BookOpen, MessageSquare, ArrowUpRight, Award, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router';

const careerMatches = [
  { role: 'Frontend Developer', match: 92, demand: 'High', salary: '$85k - $120k' },
  { role: 'Full Stack Engineer', match: 87, demand: 'High', salary: '$95k - $140k' },
  { role: 'UI/UX Designer', match: 81, demand: 'Medium', salary: '$70k - $105k' },
  { role: 'Product Manager', match: 76, demand: 'High', salary: '$100k - $150k' },
  { role: 'Data Analyst', match: 68, demand: 'Medium', salary: '$75k - $110k' },
];

const skillGaps = [
  { skill: 'TypeScript', priority: 'High', effort: '3-4 weeks' },
  { skill: 'System Design', priority: 'High', effort: '6-8 weeks' },
  { skill: 'Testing (Jest)', priority: 'Medium', effort: '2-3 weeks' },
  { skill: 'Docker/K8s', priority: 'Medium', effort: '4-6 weeks' },
  { skill: 'GraphQL', priority: 'Low', effort: '2 weeks' },
];

const progressData = [
  { month: 'Oct', score: 45 },
  { month: 'Nov', score: 58 },
  { month: 'Dec', score: 65 },
  { month: 'Jan', score: 72 },
  { month: 'Feb', score: 78 },
];

const activityData = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.2 },
  { day: 'Wed', hours: 1.8 },
  { day: 'Thu', hours: 4.1 },
  { day: 'Fri', hours: 2.9 },
  { day: 'Sat', hours: 3.5 },
  { day: 'Sun', hours: 2.2 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-foreground mb-2">Welcome back, Alex</h1>
          <p className="text-muted-foreground">Here's your career intelligence overview</p>
        </div>
        <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25">
          Update Profile
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Readiness Score', value: '78%', change: '+12%', icon: TrendingUp, color: 'text-chart-5' },
          { label: 'Skills Acquired', value: '24', change: '+6', icon: Award, color: 'text-primary' },
          { label: 'Learning Hours', value: '142', change: '+18', icon: Clock, color: 'text-chart-2' },
          { label: 'Career Matches', value: '5', change: 'New', icon: Target, color: 'text-chart-4' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="p-6 rounded-xl bg-card border border-border backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-sm text-chart-5 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                {stat.change}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-semibold text-foreground mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Career Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-2 p-6 rounded-xl bg-card border border-border backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Top Career Matches</h2>
              <p className="text-sm text-muted-foreground mt-1">AI-powered role recommendations based on your profile</p>
            </div>
            <Link to="/app/skill-gap" className="text-primary hover:underline text-sm flex items-center gap-1">
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {careerMatches.map((career, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-secondary/30 border border-border hover:border-primary/30 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-foreground font-medium group-hover:text-primary transition-colors">{career.role}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{career.salary}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      career.demand === 'High' 
                        ? 'bg-chart-5/20 text-chart-5' 
                        : 'bg-chart-3/20 text-chart-3'
                    }`}>
                      {career.demand} Demand
                    </span>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-primary">{career.match}%</p>
                      <p className="text-xs text-muted-foreground">Match</p>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${career.match}%` }}
                    transition={{ delay: 0.5 + idx * 0.1, duration: 0.8, ease: "easeOut" }}
                    className="h-2 rounded-full bg-gradient-to-r from-primary to-chart-2"
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Readiness Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="p-6 rounded-xl bg-card border border-border backdrop-blur-xl"
        >
          <h2 className="text-xl font-semibold text-foreground mb-2">Career Readiness</h2>
          <p className="text-sm text-muted-foreground mb-6">Your overall job readiness score</p>
          
          <div className="relative">
            <div className="w-48 h-48 mx-auto relative">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-secondary"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  className="text-primary"
                  initial={{ strokeDasharray: "0 552" }}
                  animate={{ strokeDasharray: "432 552" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-semibold text-foreground">78%</span>
                <span className="text-sm text-muted-foreground">Ready</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Technical Skills</span>
              <span className="text-foreground font-medium">85%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Soft Skills</span>
              <span className="text-foreground font-medium">72%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Experience</span>
              <span className="text-foreground font-medium">68%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="p-6 rounded-xl bg-card border border-border backdrop-blur-xl"
        >
          <h2 className="text-xl font-semibold text-foreground mb-2">Readiness Progress</h2>
          <p className="text-sm text-muted-foreground mb-6">Your journey over the last 5 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 144, 226, 0.1)" />
              <XAxis dataKey="month" stroke="#8b95a8" />
              <YAxis stroke="#8b95a8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#141c2d', 
                  border: '1px solid rgba(74, 144, 226, 0.2)',
                  borderRadius: '8px',
                  color: '#e8edf5'
                }} 
              />
              <Line type="monotone" dataKey="score" stroke="#4a90e2" strokeWidth={3} dot={{ fill: '#4a90e2', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="p-6 rounded-xl bg-card border border-border backdrop-blur-xl"
        >
          <h2 className="text-xl font-semibold text-foreground mb-2">Weekly Activity</h2>
          <p className="text-sm text-muted-foreground mb-6">Hours spent learning this week</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 144, 226, 0.1)" />
              <XAxis dataKey="day" stroke="#8b95a8" />
              <YAxis stroke="#8b95a8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#141c2d', 
                  border: '1px solid rgba(74, 144, 226, 0.2)',
                  borderRadius: '8px',
                  color: '#e8edf5'
                }} 
              />
              <Bar dataKey="hours" fill="#4a90e2" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="p-6 rounded-xl bg-card border border-border backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Priority Skill Gaps</h2>
              <p className="text-sm text-muted-foreground mt-1">Skills to focus on for your target roles</p>
            </div>
            <Link to="/app/skill-gap" className="text-primary hover:underline text-sm flex items-center gap-1">
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {skillGaps.map((skill, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-foreground font-medium">{skill.skill}</p>
                    <p className="text-xs text-muted-foreground">{skill.effort}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  skill.priority === 'High' 
                    ? 'bg-destructive/20 text-destructive' 
                    : skill.priority === 'Medium'
                    ? 'bg-chart-3/20 text-chart-3'
                    : 'bg-muted/50 text-muted-foreground'
                }`}>
                  {skill.priority}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="p-6 rounded-xl bg-card border border-border backdrop-blur-xl"
        >
          <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/app/roadmap"
              className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-chart-2/10 border border-primary/20 hover:border-primary/40 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-foreground font-medium">Continue Learning Path</h3>
                <p className="text-sm text-muted-foreground">Resume TypeScript Advanced Course</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-primary" />
            </Link>

            <Link
              to="/app/interview-prep"
              className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-chart-2/10 to-chart-3/10 border border-chart-2/20 hover:border-chart-2/40 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-lg bg-chart-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-foreground font-medium">Practice Interview Questions</h3>
                <p className="text-sm text-muted-foreground">52 questions waiting for you</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-chart-2" />
            </Link>

            <Link
              to="/app/ai-mentor"
              className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-chart-3/10 to-chart-4/10 border border-chart-3/20 hover:border-chart-3/40 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-lg bg-chart-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-foreground font-medium">Ask AI Mentor</h3>
                <p className="text-sm text-muted-foreground">Get personalized career guidance</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-chart-3" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
