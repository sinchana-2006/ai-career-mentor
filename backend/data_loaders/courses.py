import os
import csv
from typing import List, Dict, Optional
from backend.config import settings


class CoursesLoader:
    """Load and process courses data from Coursera dataset."""
    
    def __init__(self):
        self.data = []
        self._load_data()
    
    def _load_data(self):
        """Load courses data from CSV file."""
        csv_path = os.path.join(settings.DATASET_PATH, "Coursera data set for courses", "CourseraDataset-Clean.csv")
        
        if os.path.exists(csv_path):
            try:
                with open(csv_path, 'r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    self.data = list(reader)
            except Exception as e:
                print(f"Error loading courses data: {e}")
                self.data = self._get_default_data()
        else:
            self.data = self._get_default_data()
    
    def _get_default_data(self) -> List[Dict]:
        """Get default courses data if file not found."""
        return [
            {
                "Course Name": "JavaScript Fundamentals",
                "Difficulty": "Beginner",
                "Duration": "8 hours",
                "Topics": 12,
                "Category": "Programming"
            },
            {
                "Course Name": "ES6+ Modern JavaScript",
                "Difficulty": "Intermediate",
                "Duration": "6 hours",
                "Topics": 10,
                "Category": "Programming"
            },
            {
                "Course Name": "React Basics",
                "Difficulty": "Beginner",
                "Duration": "10 hours",
                "Topics": 15,
                "Category": "Web Development"
            },
            {
                "Course Name": "TypeScript Advanced",
                "Difficulty": "Advanced",
                "Duration": "12 hours",
                "Topics": 18,
                "Category": "Programming"
            },
            {
                "Course Name": "React State Management",
                "Difficulty": "Intermediate",
                "Duration": "8 hours",
                "Topics": 12,
                "Category": "Web Development"
            },
            {
                "Course Name": "RESTful API Design",
                "Difficulty": "Intermediate",
                "Duration": "10 hours",
                "Topics": 14,
                "Category": "Backend"
            },
            {
                "Course Name": "Testing with Jest",
                "Difficulty": "Intermediate",
                "Duration": "7 hours",
                "Topics": 10,
                "Category": "Testing"
            },
            {
                "Course Name": "Node.js & Express",
                "Difficulty": "Intermediate",
                "Duration": "15 hours",
                "Topics": 20,
                "Category": "Backend"
            },
            {
                "Course Name": "System Design Principles",
                "Difficulty": "Advanced",
                "Duration": "20 hours",
                "Topics": 25,
                "Category": "Architecture"
            },
            {
                "Course Name": "Docker & Kubernetes",
                "Difficulty": "Advanced",
                "Duration": "16 hours",
                "Topics": 20,
                "Category": "DevOps"
            }
        ]
    
    def get_all_courses(self) -> List[Dict]:
        """Get all courses."""
        return self.data
    
    def get_course_by_name(self, course_name: str) -> Optional[Dict]:
        """Get a specific course by name."""
        for course in self.data:
            if course.get("Course Name", "").lower() == course_name.lower():
                return course
        return None
    
    def get_courses_by_category(self, category: str) -> List[Dict]:
        """Get courses by category."""
        return [c for c in self.data if c.get("Category", "").lower() == category.lower()]
    
    def get_courses_by_skill(self, skill: str) -> List[Dict]:
        """Get courses related to a specific skill."""
        matching_courses = []
        for course in self.data:
            course_name = course.get("Course Name", "").lower()
            if skill.lower() in course_name:
                matching_courses.append(course)
        return matching_courses
    
    def get_roadmap_courses(self) -> Dict[str, List[Dict]]:
        """Get courses organized by roadmap stage."""
        roadmap = {
            "Foundation": [],
            "Intermediate": [],
            "Advanced": []
        }
        
        for course in self.data:
            difficulty = course.get("Difficulty", "Beginner")
            if difficulty == "Beginner":
                roadmap["Foundation"].append(course)
            elif difficulty == "Intermediate":
                roadmap["Intermediate"].append(course)
            else:
                roadmap["Advanced"].append(course)
        
        return roadmap


# Singleton instance
courses_loader = CoursesLoader()
