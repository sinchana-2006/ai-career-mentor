from typing import List, Dict, Optional


class SkillsLoader:
    """Load and process skills data."""
    
    def __init__(self):
        self.skills = self._get_default_skills()
    
    def _get_default_skills(self) -> List[Dict]:
        """Get default skills data."""
        return [
            # Technical Skills
            {"name": "JavaScript", "category": "Programming", "type": "technical"},
            {"name": "Python", "category": "Programming", "type": "technical"},
            {"name": "Java", "category": "Programming", "type": "technical"},
            {"name": "C++", "category": "Programming", "type": "technical"},
            {"name": "TypeScript", "category": "Programming", "type": "technical"},
            {"name": "React", "category": "Web Development", "type": "technical"},
            {"name": "Node.js", "category": "Backend", "type": "technical"},
            {"name": "SQL", "category": "Database", "type": "technical"},
            {"name": "Machine Learning", "category": "AI/ML", "type": "technical"},
            {"name": "Data Analysis", "category": "Data", "type": "technical"},
            {"name": "UI/UX Design", "category": "Design", "type": "technical"},
            {"name": "Cloud Computing", "category": "Cloud", "type": "technical"},
            {"name": "DevOps", "category": "Operations", "type": "technical"},
            {"name": "Mobile Development", "category": "Mobile", "type": "technical"},
            {"name": "Cybersecurity", "category": "Security", "type": "technical"},
            
            # Skills for skill gap analysis
            {"name": "Frontend Dev", "category": "Web Development", "type": "competency"},
            {"name": "Backend", "category": "Backend", "type": "competency"},
            {"name": "DevOps", "category": "Operations", "type": "competency"},
            {"name": "System Design", "category": "Architecture", "type": "competency"},
            {"name": "Testing", "category": "Quality", "type": "competency"},
            {"name": "Cloud", "category": "Cloud", "type": "competency"},
            {"name": "Docker", "category": "DevOps", "type": "technical"},
            {"name": "Kubernetes", "category": "DevOps", "type": "technical"},
            {"name": "AWS", "category": "Cloud", "type": "technical"},
            {"name": "Git", "category": "Tools", "type": "technical"},
            {"name": "RESTful API", "category": "Backend", "type": "technical"},
            {"name": "GraphQL", "category": "Backend", "type": "technical"},
            {"name": "MongoDB", "category": "Database", "type": "technical"},
            {"name": "PostgreSQL", "category": "Database", "type": "technical"},
            {"name": "Redis", "category": "Database", "type": "technical"},
            
            # Soft Skills
            {"name": "Communication", "category": "Soft Skills", "type": "soft"},
            {"name": "Teamwork", "category": "Soft Skills", "type": "soft"},
            {"name": "Problem Solving", "category": "Soft Skills", "type": "soft"},
            {"name": "Time Management", "category": "Soft Skills", "type": "soft"},
            {"name": "Leadership", "category": "Soft Skills", "type": "soft"},
        ]
    
    def get_all_skills(self) -> List[Dict]:
        """Get all skills."""
        return self.skills
    
    def get_skills_by_category(self, category: str) -> List[Dict]:
        """Get skills by category."""
        return [s for s in self.skills if s.get("category", "").lower() == category.lower()]
    
    def get_skills_by_type(self, skill_type: str) -> List[Dict]:
        """Get skills by type (technical, soft, competency)."""
        return [s for s in self.skills if s.get("type") == skill_type]
    
    def get_skill_by_name(self, name: str) -> Optional[Dict]:
        """Get a specific skill by name."""
        for skill in self.skills:
            if skill.get("name", "").lower() == name.lower():
                return skill
        return None
    
    def get_all_categories(self) -> List[str]:
        """Get all unique categories."""
        categories = set()
        for skill in self.skills:
            categories.add(skill.get("category"))
        return sorted(list(categories))
    
    def get_skill_gaps(self, user_skills: List[str], target_skills: List[str]) -> List[Dict]:
        """Calculate skill gaps between user skills and target skills."""
        user_skills_lower = [s.lower() for s in user_skills]
        gaps = []
        
        for target in target_skills:
            target_lower = target.lower()
            current_level = 0
            
            # Check if user has this skill
            if target_lower in user_skills_lower:
                current_level = 75  # Assume user has some proficiency if they have the skill
            
            # Determine priority based on skill type
            skill_info = self.get_skill_by_name(target)
            if skill_info and skill_info.get("type") == "technical":
                priority = "High"
            elif skill_info and skill_info.get("type") == "competency":
                priority = "High"
            else:
                priority = "Medium"
            
            # Estimate effort
            if priority == "High":
                effort = "4-6 weeks"
            elif priority == "Medium":
                effort = "2-3 weeks"
            else:
                effort = "1-2 weeks"
            
            gaps.append({
                "skill_name": target,
                "current_level": current_level,
                "target_level": 90,
                "priority": priority,
                "estimated_effort": effort,
                "gap_score": 90 - current_level,
                "status": "not-started" if current_level == 0 else "in-progress"
            })
        
        return gaps


# Singleton instance
skills_loader = SkillsLoader()
