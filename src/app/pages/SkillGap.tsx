import { motion } from 'motion/react';
import { Target, Clock, TrendingUp, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const radarData = [
  { skill: 'Frontend Dev', current: 85, target: 95 },
  { skill: 'Backend', current: 65, target: 85 },
  { skill: 'DevOps', current: 45, target: 75 },
  { skill: 'System Design', current: 50, target: 85 },
  { skill: 'Testing', current: 70, target: 90 },
  { skill: 'Cloud', current: 55, target: 80 },
];

const skillsData = [
  {
    priority: 'High Priority',
    description: 'Critical skills needed for your target roles',
    color: 'destructive',
    skills: [
      { name: 'TypeScript', current: 60, target: 90, effort: '3-4 weeks', status: 'in-progress' },
      { name: 'System Design', current: 50, target: 85, effort: '6-8 weeks', status: 'not-started' },
      { name: 'Advanced React Patterns', current: 65, target: 90, effort: '4-5 weeks', status: 'in-progress' },
    ],
  },
  {
    priority: 'Medium Priority',
    description: 'Important skills to enhance your profile',
    color: 'chart-3',
    skills: [
      { name: 'Docker & Kubernetes', current: 45, target: 75, effort: '4-6 weeks', status: 'not-started' },
      { name: 'Testing (Jest/Cypress)', current: 70, target: 90, effort: '2-3 weeks', status: 'in-progress' },
      { name: 'CI/CD Pipelines', current: 40, target: 70, effort: '3-4 weeks', status: 'not-started' },
      { name: 'MongoDB', current: 55, target: 80, effort: '3 weeks', status: 'not-started' },
    ],
  },
  {
    priority: 'Low Priority',
    description: 'Nice to have skills for broader opportunities',
    color: 'muted',
    skills: [
      { name: 'GraphQL', current: 50, target: 75, effort: '2 weeks', status: 'not-started' },
      { name: 'WebAssembly', current: 20, target: 60, effort: '4-5 weeks', status: 'not-started' },
      { name: 'Microservices Architecture', current: 35, target: 70, effort: '5-6 weeks', status: 'not-started' },
    ],
  },
];

export default function SkillGap() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-foreground mb-2">Skill Gap Analysis</h1>
          <p className="text-muted-foreground">AI-powered insights into your skill development needs</p>
        </div>
        <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25">
          Retake Assessment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Skills Tracked', value: '15', icon: Target, color: 'primary' },
          { label: 'High Priority', value: '3', icon: AlertCircle, color: 'destructive' },
          { label: 'In Progress', value: '4', icon: TrendingUp, color: 'chart-5' },
          { label: 'Completed', value: '8', icon: CheckCircle2, color: 'chart-2' },
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

      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="p-6 rounded-xl bg-card border border-border backdrop-blur-xl"
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Skills Overview</h2>
          <p className="text-sm text-muted-foreground">Current vs. Target skill levels across key competencies</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(74, 144, 226, 0.2)" />
                <PolarAngleAxis dataKey="skill" stroke="#8b95a8" />
                <PolarRadiusAxis stroke="#8b95a8" />
                <Radar name="Current" dataKey="current" stroke="#4a90e2" fill="#4a90e2" fillOpacity={0.3} />
                <Radar name="Target" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-4 h-4 rounded-full bg-primary"></div>
                <span className="text-foreground font-medium">Current Level</span>
              </div>
              <p className="text-sm text-muted-foreground ml-7">Your existing skill proficiency</p>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-4 h-4 rounded-full bg-chart-5"></div>
                <span className="text-foreground font-medium">Target Level</span>
              </div>
              <p className="text-sm text-muted-foreground ml-7">Required for your goal roles</p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-chart-2/10 border border-primary/20">
              <h3 className="text-foreground font-medium mb-2">Overall Gap Score</h3>
              <div className="text-3xl font-semibold text-primary mb-1">32%</div>
              <p className="text-sm text-muted-foreground">Average skill gap across all areas</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skill Lists by Priority */}
      <div className="space-y-6">
        {skillsData.map((section, sectionIdx) => (
          <motion.div
            key={sectionIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + sectionIdx * 0.1, duration: 0.5 }}
            className="p-6 rounded-xl bg-card border border-border backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-3 h-3 rounded-full bg-${section.color}`}></div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{section.priority}</h2>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {section.skills.map((skill, idx) => {
                const progress = ((skill.current / skill.target) * 100).toFixed(0);
                return (
                  <div key={idx} className="p-4 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {skill.status === 'in-progress' ? (
                          <TrendingUp className="w-5 h-5 text-chart-5" />
                        ) : skill.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-chart-2" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <h3 className="text-foreground font-medium">{skill.name}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-muted-foreground">
                              Current: {skill.current}% → Target: {skill.target}%
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {skill.effort}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-primary">{progress}%</p>
                        <p className="text-xs text-muted-foreground">Complete</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="w-full bg-secondary rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ delay: 0.7 + sectionIdx * 0.1 + idx * 0.05, duration: 0.8, ease: "easeOut" }}
                            className={`h-2 rounded-full ${
                              skill.status === 'in-progress' 
                                ? 'bg-gradient-to-r from-chart-5 to-chart-2' 
                                : skill.status === 'completed'
                                ? 'bg-chart-2'
                                : 'bg-muted'
                            }`}
                          ></motion.div>
                        </div>
                      </div>
                      <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 text-sm">
                        {skill.status === 'in-progress' ? 'Continue' : 'Start Learning'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
