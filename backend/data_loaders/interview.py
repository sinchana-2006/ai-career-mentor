from typing import List, Dict


class InterviewQuestionsLoader:
    """Generate and manage interview questions."""
    
    def __init__(self):
        self.questions = self._get_default_questions()
    
    def _get_default_questions(self) -> List[Dict]:
        """Get default interview questions."""
        return [
            # Technical Questions
            {
                "id": 1,
                "question": "Explain the difference between var, let, and const in JavaScript",
                "difficulty": "Easy",
                "category": "Technical",
                "tags": ["JavaScript", "Fundamentals"]
            },
            {
                "id": 2,
                "question": "What is the Virtual DOM and how does React use it?",
                "difficulty": "Medium",
                "category": "Technical",
                "tags": ["React", "Performance"]
            },
            {
                "id": 3,
                "question": "Design a rate limiter for an API",
                "difficulty": "Hard",
                "category": "Technical",
                "tags": ["System Design", "Algorithms"]
            },
            {
                "id": 4,
                "question": "Implement a debounce function in JavaScript",
                "difficulty": "Medium",
                "category": "Technical",
                "tags": ["JavaScript", "Performance"]
            },
            {
                "id": 5,
                "question": "Explain the concept of closures in JavaScript",
                "difficulty": "Medium",
                "category": "Technical",
                "tags": ["JavaScript", "Fundamentals"]
            },
            {
                "id": 6,
                "question": "What are the SOLID principles in object-oriented design?",
                "difficulty": "Medium",
                "category": "Technical",
                "tags": ["Design", "OOP"]
            },
            {
                "id": 7,
                "question": "Explain the difference between SQL and NoSQL databases",
                "difficulty": "Easy",
                "category": "Technical",
                "tags": ["Database", "SQL", "NoSQL"]
            },
            {
                "id": 8,
                "question": "What is the purpose of indexing in databases?",
                "difficulty": "Medium",
                "category": "Technical",
                "tags": ["Database", "Performance"]
            },
            # Behavioral Questions
            {
                "id": 9,
                "question": "Tell me about a time you faced a challenging bug and how you resolved it",
                "difficulty": "Medium",
                "category": "Behavioral",
                "tags": ["Problem Solving", "Experience"]
            },
            {
                "id": 10,
                "question": "Describe a situation where you had to work with a difficult team member",
                "difficulty": "Medium",
                "category": "Behavioral",
                "tags": ["Teamwork", "Communication"]
            },
            {
                "id": 11,
                "question": "How do you prioritize tasks when you have multiple deadlines?",
                "difficulty": "Easy",
                "category": "Behavioral",
                "tags": ["Time Management", "Leadership"]
            },
            {
                "id": 12,
                "question": "Tell me about a time you failed and what you learned from it",
                "difficulty": "Medium",
                "category": "Behavioral",
                "tags": ["Self-Awareness", "Growth"]
            },
            {
                "id": 13,
                "question": "Describe your ideal work environment",
                "difficulty": "Easy",
                "category": "Behavioral",
                "tags": ["Culture", "Preferences"]
            },
            {
                "id": 14,
                "question": "How do you handle criticism of your work?",
                "difficulty": "Medium",
                "category": "Behavioral",
                "tags": ["Communication", "Growth"]
            },
            # Problem Solving Questions
            {
                "id": 15,
                "question": "Given an array of integers, find two numbers that add up to a target sum",
                "difficulty": "Easy",
                "category": "Problem Solving",
                "tags": ["Arrays", "Hash Tables"]
            },
            {
                "id": 16,
                "question": "Implement a function to reverse a linked list",
                "difficulty": "Medium",
                "category": "Problem Solving",
                "tags": ["Linked Lists", "Pointers"]
            },
            {
                "id": 17,
                "question": "Design an algorithm to serialize and deserialize a binary tree",
                "difficulty": "Hard",
                "category": "Problem Solving",
                "tags": ["Trees", "Recursion"]
            },
            {
                "id": 18,
                "question": "Write a function to check if a string is a palindrome",
                "difficulty": "Easy",
                "category": "Problem Solving",
                "tags": ["Strings", "Algorithms"]
            },
            {
                "id": 19,
                "question": "Implement binary search in a sorted array",
                "difficulty": "Easy",
                "category": "Problem Solving",
                "tags": ["Arrays", "Search"]
            },
            {
                "id": 20,
                "question": "Solve the classic 'Two Sum' problem using optimal approach",
                "difficulty": "Easy",
                "category": "Problem Solving",
                "tags": ["Arrays", "Hash Tables"]
            },
            {
                "id": 21,
                "question": "Implement a queue using two stacks",
                "difficulty": "Medium",
                "category": "Problem Solving",
                "tags": ["Data Structures", "Stacks", "Queues"]
            },
            {
                "id": 22,
                "question": "Find the longest substring without repeating characters",
                "difficulty": "Medium",
                "category": "Problem Solving",
                "tags": ["Strings", "Sliding Window"]
            }
        ]
    
    def get_all_questions(self) -> List[Dict]:
        """Get all interview questions."""
        return self.questions
    
    def get_questions_by_category(self, category: str) -> List[Dict]:
        """Get questions by category."""
        return [q for q in self.questions if q.get("category", "").lower() == category.lower()]
    
    def get_questions_by_difficulty(self, difficulty: str) -> List[Dict]:
        """Get questions by difficulty."""
        return [q for q in self.questions if q.get("difficulty", "").lower() == difficulty.lower()]
    
    def get_question_by_id(self, question_id: int) -> Dict:
        """Get a specific question by ID."""
        for q in self.questions:
            if q.get("id") == question_id:
                return q
        return None
    
    def get_categories(self) -> List[str]:
        """Get all unique categories."""
        categories = set()
        for q in self.questions:
            categories.add(q.get("category"))
        return sorted(list(categories))


# Singleton instance
interview_questions_loader = InterviewQuestionsLoader()
