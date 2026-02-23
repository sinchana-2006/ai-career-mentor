import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import SkillGap from "./pages/SkillGap";
import LearningRoadmap from "./pages/LearningRoadmap";
import InterviewPrep from "./pages/InterviewPrep";
import AIChat from "./pages/AIChat";
import Layout from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/onboarding",
    Component: Onboarding,
  },
  {
    path: "/app",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "skill-gap", Component: SkillGap },
      { path: "roadmap", Component: LearningRoadmap },
      { path: "interview-prep", Component: InterviewPrep },
      { path: "ai-mentor", Component: AIChat },
    ],
  },
]);
