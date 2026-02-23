import json
import os
from typing import List, Dict, Optional
from backend.config import settings


class JobRolesLoader:
    """Load and process IT job roles and skills data."""
    
    def __init__(self):
        self.data = []
        self._load_data()
    
    def _load_data(self):
        """Load job roles data from JSON file."""
        json_path = os.path.join(settings.DATASET_PATH, "Top_207_IT_Job_Roles_Skills_Database.json")
        
        if os.path.exists(json_path):
            try:
                with open(json_path, 'r', encoding='utf-8') as f:
                    self.data = json.load(f)
            except Exception as e:
                print(f"Error loading job roles data: {e}")
                self.data = self._get_default_data()
        else:
            self.data = self._get_default_data()
    
    def _get_default_data(self) -> List[Dict]:
        """Get default job roles data if file not found."""
        return [
            {
                "Job Role": "Frontend Developer",
                "Skills": "JavaScript, React, CSS, HTML, TypeScript",
                "Demand": "High",
                "Salary Range": "$85k - $120k"
            },
            {
                "Job Role": "Full Stack Engineer",
                "Skills": "JavaScript, Node.js, React, SQL, Docker",
                "Demand": "High",
                "Salary Range": "$95k - $140k"
            },
            {
                "Job Role": "UI/UX Designer",
                "Skills": "Figma, UI Design, Prototyping, User Research",
                "Demand": "Medium",
                "Salary Range": "$70k - $105k"
            },
            {
                "Job Role": "Product Manager",
                "Skills": "Product Strategy, Agile, Data Analysis, Communication",
                "Demand": "High",
                "Salary Range": "$100k - $150k"
            },
            {
                "Job Role": "Data Analyst",
                "Skills": "SQL, Python, Tableau, Excel, Statistics",
                "Demand": "Medium",
                "Salary Range": "$75k - $110k"
            },
            {
                "Job Role": "DevOps Engineer",
                "Skills": "Docker, Kubernetes, AWS, CI/CD, Linux",
                "Demand": "High",
                "Salary Range": "$110k - $160k"
            },
            {
                "Job Role": "Data Scientist",
                "Skills": "Python, Machine Learning, SQL, TensorFlow, Statistics",
                "Demand": "High",
                "Salary Range": "$100k - $150k"
            },
            {
                "Job Role": "Cloud Architect",
                "Skills": "AWS, Azure, Cloud Architecture, DevOps, Security",
                "Demand": "High",
                "Salary Range": "$130k - $180k"
            },
            {
                "Job Role": "Mobile Developer",
                "Skills": "React Native, Swift, Kotlin, Firebase, APIs",
                "Demand": "Medium",
                "Salary Range": "$80k - $125k"
            },
            {
                "Job Role": "Machine Learning Engineer",
                "Skills": "Python, TensorFlow, PyTorch, ML Algorithms, Cloud",
                "Demand": "High",
                "Salary Range": "$120k - $170k"
            }
        ]
    
    def get_all_roles(self) -> List[Dict]:
        """Get all job roles."""
        return self.data
    
    def get_role_by_name(self, role_name: str) -> Optional[Dict]:
        """Get a specific job role by name."""
        for role in self.data:
            if role.get("Job Role", "").lower() == role_name.lower():
                return role
        return None
    
    def get_roles_by_skill(self, skill: str) -> List[Dict]:
        """Get job roles that require a specific skill."""
        matching_roles = []
        for role in self.data:
            role_skills = role.get("Skills", "").lower()
            if skill.lower() in role_skills:
                matching_roles.append(role)
        return matching_roles
    
    def get_all_skills(self) -> List[str]:
        """Get all unique skills from job roles."""
        skills = set()
        for role in self.data:
            role_skills = role.get("Skills", "").split(",")
            for skill in role_skills:
                skill = skill.strip()
                if skill:
                    skills.add(skill)
        return sorted(list(skills))
    
    def calculate_match_score(self, user_skills: List[str], role: Dict) -> float:
        """Calculate match score between user skills and job role requirements."""
        if not role.get("Skills"):
            return 0
        
        role_skills = [s.strip().lower() for s in role.get("Skills", "").split(",")]
        user_skills_lower = [s.lower() for s in user_skills]
        
        matches = sum(1 for skill in role_skills if skill in user_skills_lower)
        
        if not role_skills:
            return 0
        
        return round((matches / len(role_skills)) * 100, 1)
    
    def get_career_matches(self, user_skills: List[str], limit: int = 10) -> List[Dict]:
        """Get career matches sorted by match score."""
        matches = []
        for role in self.data:
            score = self.calculate_match_score(user_skills, role)
            if score > 0:
                matches.append({
                    "role": role.get("Job Role"),
                    "match_percentage": score,
                    "demand": role.get("Demand", "Medium"),
                    "salary_range": role.get("Salary Range"),
                    "skills": role.get("Skills", "")
                })
        
        # Sort by match percentage descending
        matches.sort(key=lambda x: x["match_percentage"], reverse=True)
        return matches[:limit]


# Singleton instance
job_roles_loader = JobRolesLoader()
