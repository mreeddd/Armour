"""
Conversation generation module for AI agents in the LOVE platform.

This module handles the generation of conversational responses based on
agent personality traits, conversation history, and relationship context.
"""

import json
import logging
from typing import Dict, List, Optional, Tuple, Any
import requests
from ..personality.models import PersonalityTraits, PersonalityProfile

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ConversationGenerator:
    """
    Handles generation of conversational responses for AI agents.
    
    This class integrates with LLM APIs to generate contextually appropriate
    responses based on agent personality, conversation history, and relationship context.
    """
    
    def __init__(
        self,
        llm_api_url: str,
        api_key: str,
        default_model: str = "gpt-4",
        temperature: float = 0.7,
        max_tokens: int = 300
    ):
        """
        Initialize the conversation generator.
        
        Args:
            llm_api_url: URL of the LLM API endpoint
            api_key: API key for authentication
            default_model: Default LLM model to use
            temperature: Sampling temperature (0.0-1.0)
            max_tokens: Maximum tokens in generated response
        """
        self.llm_api_url = llm_api_url
        self.api_key = api_key
        self.default_model = default_model
        self.temperature = temperature
        self.max_tokens = max_tokens
    
    def generate_response(
        self,
        agent_profile: PersonalityProfile,
        user_message: str,
        conversation_history: List[Dict[str, str]],
        relationship_context: Optional[Dict] = None,
        override_params: Optional[Dict] = None
    ) -> Dict:
        """
        Generate a response from the AI agent to the user message.
        
        Args:
            agent_profile: Personality profile of the AI agent
            user_message: The user's message to respond to
            conversation_history: List of previous messages in the conversation
            relationship_context: Optional context about the relationship
            override_params: Optional parameters to override defaults
            
        Returns:
            Dictionary containing the generated response and metadata
        """
        # Prepare the prompt with agent personality and conversation context
        prompt = self._prepare_prompt(
            agent_profile, user_message, conversation_history, relationship_context
        )
        
        # Set up request parameters
        params = {
            "model": self.default_model,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
            "top_p": 1.0,
            "frequency_penalty": 0.5,
            "presence_penalty": 0.5
        }
        
        # Override default parameters if specified
        if override_params:
            params.update(override_params)
        
        # Call the LLM API
        try:
            response = self._call_llm_api(prompt, params)
            
            # Process and enhance the response
            processed_response = self._process_response(
                response, agent_profile, conversation_history, relationship_context
            )
            
            return processed_response
            
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return {
                "text": "I'm having trouble responding right now. Let's try again in a moment.",
                "error": str(e)
            }
    
    def _prepare_prompt(
        self,
        agent_profile: PersonalityProfile,
        user_message: str,
        conversation_history: List[Dict[str, str]],
        relationship_context: Optional[Dict] = None
    ) -> str:
        """
        Prepare the prompt for the LLM based on agent personality and context.
        
        Args:
            agent_profile: Personality profile of the AI agent
            user_message: The user's message to respond to
            conversation_history: List of previous messages in the conversation
            relationship_context: Optional context about the relationship
            
        Returns:
            Formatted prompt string for the LLM
        """
        # Convert personality traits to a descriptive format
        personality_desc = self._traits_to_description(agent_profile.traits)
        
        # Format conversation history
        history_text = ""
        for msg in conversation_history[-10:]:  # Use last 10 messages for context
            role = msg.get("role", "unknown")
            content = msg.get("content", "")
            history_text += f"{role.capitalize()}: {content}\n"
        
        # Add relationship context if available
        relationship_text = ""
        if relationship_context:
            rel_type = relationship_context.get("type", "undefined")
            duration = relationship_context.get("duration", "unknown")
            compatibility = relationship_context.get("compatibility_score", 0)
            
            relationship_text = (
                f"Relationship type: {rel_type}\n"
                f"Relationship duration: {duration}\n"
                f"Compatibility score: {compatibility}/100\n"
            )
        
        # Construct the full prompt
        prompt = (
            f"You are an AI agent with the following personality traits:\n"
            f"{personality_desc}\n\n"
            f"Your interests include: {', '.join(agent_profile.interests)}\n"
            f"Your values include: {', '.join(agent_profile.values)}\n"
            f"Your communication style is: {agent_profile.communication_style}\n\n"
            f"Relationship context:\n{relationship_text}\n"
            f"Recent conversation history:\n{history_text}\n"
            f"User: {user_message}\n\n"
            f"Respond in a way that authentically reflects your personality traits, "
            f"interests, values, and communication style. Be engaging, natural, and "
            f"conversational. Your response should be appropriate for the relationship "
            f"context and conversation history."
        )
        
        return prompt
    
    def _traits_to_description(self, traits: PersonalityTraits) -> str:
        """Convert numerical personality traits to descriptive text."""
        descriptions = []
        
        # Map trait values to descriptive terms
        trait_descriptions = {
            "openness": self._describe_trait_level(traits.openness, 
                ["closed-minded", "conventional", "moderately open", "open-minded", "extremely open to new experiences"]),
            "conscientiousness": self._describe_trait_level(traits.conscientiousness,
                ["very spontaneous", "somewhat spontaneous", "balanced", "organized", "extremely organized and detail-oriented"]),
            "extraversion": self._describe_trait_level(traits.extraversion,
                ["very introverted", "somewhat introverted", "ambivert", "somewhat extraverted", "very extraverted"]),
            "agreeableness": self._describe_trait_level(traits.agreeableness,
                ["very critical", "somewhat critical", "balanced", "agreeable", "extremely agreeable and compassionate"]),
            "neuroticism": self._describe_trait_level(traits.neuroticism,
                ["very emotionally stable", "emotionally stable", "moderate emotional sensitivity", "somewhat neurotic", "highly neurotic"]),
            "intelligence": self._describe_trait_level(traits.intelligence,
                ["practical intelligence", "average intelligence", "above average intelligence", "highly intelligent", "exceptionally intelligent"]),
            "creativity": self._describe_trait_level(traits.creativity,
                ["conventional thinking", "somewhat creative", "moderately creative", "highly creative", "exceptionally creative"]),
            "humor": self._describe_trait_level(traits.humor,
                ["very serious", "occasionally humorous", "moderately humorous", "good sense of humor", "exceptionally witty and humorous"])
        }
        
        # Format as bullet points
        for trait, description in trait_descriptions.items():
            descriptions.append(f"- {trait.capitalize()}: {description}")
        
        return "\n".join(descriptions)
    
    def _describe_trait_level(self, value: int, descriptors: List[str]) -> str:
        """Map a numerical trait value to a descriptive term."""
        # Map 0-100 scale to descriptor index
        index = min(len(descriptors) - 1, value // 25)
        return descriptors[index]
    
    def _call_llm_api(self, prompt: str, params: Dict) -> Dict:
        """
        Call the LLM API to generate a response.
        
        Args:
            prompt: The formatted prompt
            params: Parameters for the API call
            
        Returns:
            Raw API response
        """
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        payload = {
            "prompt": prompt,
            **params
        }
        
        response = requests.post(
            self.llm_api_url,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code != 200:
            logger.error(f"API error: {response.status_code} - {response.text}")
            raise Exception(f"API error: {response.status_code}")
        
        return response.json()
    
    def _process_response(
        self,
        raw_response: Dict,
        agent_profile: PersonalityProfile,
        conversation_history: List[Dict[str, str]],
        relationship_context: Optional[Dict]
    ) -> Dict:
        """
        Process and enhance the raw LLM response.
        
        Args:
            raw_response: Raw response from the LLM API
            agent_profile: Personality profile of the AI agent
            conversation_history: Conversation history
            relationship_context: Relationship context
            
        Returns:
            Processed and enhanced response
        """
        # Extract the text from the API response
        if "choices" in raw_response and len(raw_response["choices"]) > 0:
            response_text = raw_response["choices"][0].get("text", "").strip()
        else:
            response_text = "I'm not sure how to respond to that."
        
        # Analyze emotional tone based on agent personality
        emotional_tone = self._analyze_emotional_tone(
            response_text, agent_profile.traits
        )
        
        # Analyze conversation dynamics
        conversation_dynamics = self._analyze_conversation_dynamics(
            conversation_history, response_text
        )
        
        return {
            "text": response_text,
            "emotional_tone": emotional_tone,
            "conversation_dynamics": conversation_dynamics,
            "timestamp": import_module("datetime").datetime.now().isoformat()
        }
    
    def _analyze_emotional_tone(
        self,
        text: str,
        traits: PersonalityTraits
    ) -> Dict:
        """
        Analyze the emotional tone of the response based on personality traits.
        
        This is a simplified implementation. In a production system, this would
        use more sophisticated sentiment analysis.
        """
        # Placeholder for sentiment analysis
        # In a real implementation, this would use NLP to analyze the text
        
        # For now, we'll use a simplified approach based on personality traits
        base_positivity = 0.5  # Neutral baseline
        
        # Adjust based on neuroticism (higher neuroticism = less positive)
        positivity_adjustment = (100 - traits.neuroticism) / 200  # -0.25 to +0.25
        
        # Adjust based on extraversion (higher extraversion = more positive)
        positivity_adjustment += (traits.extraversion - 50) / 200  # -0.25 to +0.25
        
        positivity = max(0.0, min(1.0, base_positivity + positivity_adjustment))
        
        return {
            "positivity": positivity,
            "intensity": traits.extraversion / 100,
            "formality": traits.conscientiousness / 100
        }
    
    def _analyze_conversation_dynamics(
        self,
        conversation_history: List[Dict[str, str]],
        current_response: str
    ) -> Dict:
        """
        Analyze the dynamics of the conversation.
        
        This is a simplified implementation. In a production system, this would
        use more sophisticated conversation analysis.
        """
        # Count messages from each participant
        user_messages = sum(1 for msg in conversation_history if msg.get("role") == "user")
        agent_messages = sum(1 for msg in conversation_history if msg.get("role") == "agent")
        
        # Calculate average message length
        user_length = sum(len(msg.get("content", "")) for msg in conversation_history if msg.get("role") == "user")
        agent_length = sum(len(msg.get("content", "")) for msg in conversation_history if msg.get("role") == "agent")
        
        user_avg_length = user_length / max(1, user_messages)
        agent_avg_length = agent_length / max(1, agent_messages)
        
        # Current response length
        current_length = len(current_response)
        
        return {
            "message_count": len(conversation_history) + 1,
            "user_engagement": user_messages / max(1, len(conversation_history)),
            "agent_response_length_trend": current_length / max(1, agent_avg_length),
            "conversation_depth": min(1.0, len(conversation_history) / 20)  # Normalize to 0-1
        }


# Import datetime module dynamically to avoid circular imports
def import_module(name):
    """Dynamically import a module."""
    return __import__(name)
