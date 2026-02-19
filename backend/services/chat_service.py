from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from datetime import datetime

from backend.models.models import User
from backend.schemas.chat import ChatMessageCreate, ChatMessageResponse, ChatRequest, ChatResponse


class ChatService:
    """Service for AI chat operations."""
    
    @staticmethod
    def process_message(db: Session, user_id: int, message: str) -> ChatResponse:
        """Process user message and return AI response."""
        user = db.query(User).filter(User.id == user_id).first()
        
        # Generate response based on message content
        response_text = ChatService._generate_response(message, user)
        
        # Generate suggestions
        suggestions = ChatService._get_suggestions(message)
        
        return ChatResponse(
            message=response_text,
            suggestions=suggestions
        )
    
    @staticmethod
    def _generate_response(message: str, user: Optional[User]) -> str:
        """Generate AI response based on user message."""
        message_lower = message.lower()
        
        if "readiness" in message_lower or "score" in message_lower:
            return """Your current readiness score of 78% is quite strong! To boost it further, I recommend:

1. Complete the 'TypeScript Advanced' course (currently 45% done) - this will add 8 points to your technical skills
2. Practice 5 more System Design questions - these are frequently asked in senior roles
3. Work on a portfolio project that demonstrates your full-stack capabilities

Focusing on these areas over the next 2-3 weeks could push your score to 85%+, making you highly competitive for your target roles."""
        
        if "focus" in message_lower or "this week" in message_lower:
            return """Based on your current progress and upcoming milestones, here's what I recommend focusing on this week:

📚 Learning Priority:
- Complete 'TypeScript Advanced' course (3 hours remaining)
- Start 'React State Management' course

💡 Skill Development:
- Practice 2-3 System Design problems
- Review your weak areas in testing

🎯 Career Actions:
- Update your LinkedIn with your new TypeScript skills
- Apply to 3-5 Frontend Developer positions that match your 92% score

This balanced approach will help you maintain momentum while building market-ready skills."""
        
        if "react" in message_lower:
            return """Here are some best practices for React development that align with current industry standards:

1. **Component Architecture**: Use functional components with hooks. Keep components small and focused on a single responsibility.

2. **State Management**: Start with useState/useContext for simple apps. Consider Redux Toolkit or Zustand for complex state.

3. **Performance**: Use React.memo, useMemo, and useCallback strategically. Don't over-optimize early.

4. **Code Organization**: Group by feature, not by type. Keep related components, hooks, and utilities together.

5. **TypeScript**: Use it! It catches bugs early and improves developer experience.

Would you like me to elaborate on any of these points?"""
        
        if "career path" in message_lower or "career options" in message_lower:
            return f"""Software engineering offers diverse career paths! Based on your profile, here are the most promising options:

🎯 **Frontend Specialist** (92% match)
Average Salary: $95k-130k
Grow into: Senior Frontend → Staff Engineer → Engineering Manager

🚀 **Full Stack Engineer** (87% match)
Average Salary: $105k-150k
Grow into: Senior Full Stack → Technical Lead → Solutions Architect

🎨 **UI/UX Engineer** (81% match)
Average Salary: $90k-125k
Grow into: Senior UI Engineer → Design Systems Lead → Principal Designer

Your current skills align best with Frontend and Full Stack roles. Would you like a detailed roadmap for any specific path?"""
        
        # Default response
        return """That's a great question! I'm here to help you with personalized career guidance. I can assist you with:

• Skill development strategies and learning priorities
• Career path recommendations based on your profile
• Interview preparation tips and best practices
• Resume and portfolio optimization
• Salary negotiation guidance
• Work-life balance in tech

Feel free to ask me anything specific about your career journey!"""
    
    @staticmethod
    def _get_suggestions(message: str) -> List[str]:
        """Get suggested follow-up questions."""
        message_lower = message.lower()
        
        if "readiness" in message_lower or "score" in message_lower:
            return [
                "What should I focus on this week?",
                "Best practices for React development",
                "Career paths in software engineering"
            ]
        
        if "focus" in message_lower or "this week" in message_lower:
            return [
                "How can I improve my readiness score?",
                "Best practices for React development",
                "Career paths in software engineering"
            ]
        
        if "react" in message_lower:
            return [
                "How can I improve my readiness score?",
                "What should I focus on this week?",
                "Career paths in software engineering"
            ]
        
        if "career path" in message_lower:
            return [
                "How can I improve my readiness score?",
                "What should I focus on this week?",
                "Best practices for React development"
            ]
        
        return [
            "How can I improve my readiness score?",
            "What should I focus on this week?",
            "Best practices for React development",
            "Career paths in software engineering"
        ]


chat_service = ChatService()
