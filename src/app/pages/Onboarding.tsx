import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, GraduationCap, Code, Briefcase, Target } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Education Level',
    subtitle: 'Tell us about your current education status',
    icon: GraduationCap,
  },
  {
    id: 2,
    title: 'Skills & Expertise',
    subtitle: 'What skills do you currently possess?',
    icon: Code,
  },
  {
    id: 3,
    title: 'Career Interests',
    subtitle: 'Which fields excite you the most?',
    icon: Briefcase,
  },
  {
    id: 4,
    title: 'Career Goals',
    subtitle: 'What are you aiming to achieve?',
    icon: Target,
  },
];

const educationOptions = [
  'High School',
  'Undergraduate (pursuing)',
  'Undergraduate (completed)',
  'Postgraduate (pursuing)',
  'Postgraduate (completed)',
  'PhD/Doctorate',
];

const skillsOptions = [
  'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js',
  'Machine Learning', 'Data Analysis', 'UI/UX Design', 'SQL',
  'Cloud Computing', 'DevOps', 'Mobile Development', 'Cybersecurity',
];

const interestsOptions = [
  'Software Engineering',
  'Data Science',
  'Product Management',
  'UI/UX Design',
  'DevOps Engineering',
  'Machine Learning',
  'Cybersecurity',
  'Cloud Architecture',
];

const goalsOptions = [
  'Get my first job',
  'Switch to a new field',
  'Level up in current role',
  'Prepare for competitive exams',
  'Build a startup',
  'Freelance professionally',
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/app');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return education !== '';
      case 2:
        return skills.length > 0;
      case 3:
        return interests.length > 0;
      case 4:
        return goals.length > 0;
      default:
        return false;
    }
  };

  const toggleSelection = (item: string, list: string[], setter: (list: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className={`flex items-center gap-3 ${idx < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      currentStep > step.id
                        ? 'bg-primary border-primary'
                        : currentStep === step.id
                        ? 'bg-primary/20 border-primary'
                        : 'bg-secondary border-border'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5 text-primary-foreground" />
                    ) : (
                      <step.icon className={`w-5 h-5 ${currentStep === step.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    )}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 transition-all duration-300 ${currentStep > step.id ? 'bg-primary' : 'bg-border'}`}></div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </p>
          </div>
        </div>

        {/* Content Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="p-8 rounded-2xl bg-card border border-border backdrop-blur-xl shadow-2xl"
        >
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-semibold text-foreground">{steps[currentStep - 1].title}</h2>
              <p className="text-muted-foreground">{steps[currentStep - 1].subtitle}</p>
            </div>

            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {educationOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setEducation(option)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        education === option
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-secondary/30 hover:bg-secondary/50'
                      }`}
                    >
                      <p className="text-foreground">{option}</p>
                    </button>
                  ))}
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-3 gap-3"
                >
                  {skillsOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleSelection(option, skills, setSkills)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        skills.includes(option)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-secondary/30 hover:bg-secondary/50 text-foreground'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {interestsOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleSelection(option, interests, setInterests)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        interests.includes(option)
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-secondary/30 hover:bg-secondary/50'
                      }`}
                    >
                      <p className="text-foreground">{option}</p>
                    </button>
                  ))}
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {goalsOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleSelection(option, goals, setGoals)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        goals.includes(option)
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-secondary/30 hover:bg-secondary/50'
                      }`}
                    >
                      <p className="text-foreground">{option}</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-6 py-2.5 rounded-lg border border-border text-foreground hover:bg-secondary/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center gap-2"
              >
                {currentStep === 4 ? 'Complete' : 'Continue'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
