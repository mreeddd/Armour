"""
API module for the LOVE AI Engine.

This module provides the API endpoints for interacting with the AI engine,
including agent creation, conversation, and compatibility calculation.
"""

import os
import json
import logging
from typing import Dict, List, Optional, Any
from fastapi import FastAPI, HTTPException, Depends, Header, Body
from pydantic import BaseModel, Field

from ..personality.models import PersonalityTraits, PersonalityProfile
from ..personality.compatibility import calculate_profile_compatibility
from ..conversation.generator import ConversationGenerator
from ..conversation.memory import MemoryManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="LOVE AI Engine API",
    description="API for the LOVE AI Agent Dating Platform",
    version="0.1.0"
)

# Initialize conversation generator
conversation_generator = ConversationGenerator(
    llm_api_url=os.environ.get("LLM_API_URL", "https://api.openai.com/v1/completions"),
    api_key=os.environ.get("LLM_API_KEY", ""),
    default_model=os.environ.get("LLM_MODEL", "gpt-4")
)

# Memory manager cache
memory_managers = {}


# Pydantic models for API requests and responses
class PersonalityTraitsModel(BaseModel):
    openness: int = Field(..., ge=0, le=100, description="Openness to experience (0-100)")
    conscientiousness: int = Field(..., ge=0, le=100, description="Conscientiousness (0-100)")
    extraversion: int = Field(..., ge=0, le=100, description="Extraversion (0-100)")
    agreeableness: int = Field(..., ge=0, le=100, description="Agreeableness (0-100)")
    neuroticism: int = Field(..., ge=0, le=100, description="Neuroticism (0-100)")
    intelligence: int = Field(..., ge=0, le=100, description="Intelligence (0-100)")
    creativity: int = Field(..., ge=0, le=100, description="Creativity (0-100)")
    humor: int = Field(..., ge=0, le=100, description="Sense of humor (0-100)")


class PersonalityProfileModel(BaseModel):
    traits: PersonalityTraitsModel
    interests: List[str] = Field(..., description="List of interests")
    values: List[str] = Field(..., description="List of values")
    communication_style: str = Field(..., description="Communication style")
    relationship_preferences: Dict[str, Any] = Field(..., description="Relationship preferences")


class AgentCreateRequest(BaseModel):
    agent_id: str = Field(..., description="Unique ID for the agent")
    name: str = Field(..., description="Name of the agent")
    personality: PersonalityProfileModel = Field(..., description="Personality profile")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")


class AgentUpdateRequest(BaseModel):
    personality: Optional[PersonalityProfileModel] = Field(None, description="Updated personality profile")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Updated metadata")


class MessageRequest(BaseModel):
    user_message: str = Field(..., description="Message from the user")
    conversation_id: str = Field(..., description="ID of the conversation")
    relationship_context: Optional[Dict[str, Any]] = Field(None, description="Relationship context")


class CompatibilityRequest(BaseModel):
    agent_one_profile: PersonalityProfileModel = Field(..., description="Profile of first agent")
    agent_two_profile: PersonalityProfileModel = Field(..., description="Profile of second agent")


# Helper functions
def get_memory_manager(agent_id: str) -> MemoryManager:
    """Get or create a memory manager for an agent."""
    if agent_id not in memory_managers:
        storage_path = os.environ.get("MEMORY_STORAGE_PATH", None)
        memory_managers[agent_id] = MemoryManager(agent_id, storage_path)
    
    return memory_managers[agent_id]


def convert_to_internal_profile(profile_model: PersonalityProfileModel) -> PersonalityProfile:
    """Convert API model to internal PersonalityProfile."""
    traits = PersonalityTraits(
        openness=profile_model.traits.openness,
        conscientiousness=profile_model.traits.conscientiousness,
        extraversion=profile_model.traits.extraversion,
        agreeableness=profile_model.traits.agreeableness,
        neuroticism=profile_model.traits.neuroticism,
        intelligence=profile_model.traits.intelligence,
        creativity=profile_model.traits.creativity,
        humor=profile_model.traits.humor
    )
    
    return PersonalityProfile(
        traits=traits,
        interests=profile_model.interests,
        values=profile_model.values,
        communication_style=profile_model.communication_style,
        relationship_preferences=profile_model.relationship_preferences
    )


# API endpoints
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "LOVE AI Engine API",
        "version": "0.1.0",
        "description": "API for the LOVE AI Agent Dating Platform"
    }


@app.post("/agents")
async def create_agent(request: AgentCreateRequest):
    """Create a new AI agent."""
    try:
        # Convert to internal profile
        profile = convert_to_internal_profile(request.personality)
        
        # Initialize memory manager for the agent
        memory_manager = get_memory_manager(request.agent_id)
        
        # In a real implementation, this would store the agent in a database
        # For now, we'll just return success
        
        return {
            "status": "success",
            "agent_id": request.agent_id,
            "name": request.name,
            "message": "Agent created successfully"
        }
    
    except Exception as e:
        logger.error(f"Error creating agent: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/agents/{agent_id}")
async def get_agent(agent_id: str):
    """Get information about an AI agent."""
    # In a real implementation, this would retrieve the agent from a database
    # For now, we'll just return a placeholder
    
    return {
        "agent_id": agent_id,
        "name": f"Agent {agent_id}",
        "status": "active"
    }


@app.put("/agents/{agent_id}")
async def update_agent(agent_id: str, request: AgentUpdateRequest):
    """Update an AI agent."""
    try:
        # In a real implementation, this would update the agent in a database
        # For now, we'll just return success
        
        return {
            "status": "success",
            "agent_id": agent_id,
            "message": "Agent updated successfully"
        }
    
    except Exception as e:
        logger.error(f"Error updating agent: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/agents/{agent_id}/message")
async def send_message(agent_id: str, request: MessageRequest):
    """Send a message to an AI agent and get a response."""
    try:
        # Get memory manager for the agent
        memory_manager = get_memory_manager(agent_id)
        
        # Get recent conversation history
        conversation_history = [
            {"role": m.speaker, "content": m.content}
            for m in memory_manager.get_recent_conversations(request.conversation_id)
        ]
        
        # In a real implementation, we would retrieve the agent's profile from a database
        # For now, we'll use a placeholder profile
        agent_profile = PersonalityProfile(
            traits=PersonalityTraits(
                openness=70,
                conscientiousness=60,
                extraversion=80,
                agreeableness=75,
                neuroticism=40,
                intelligence=85,
                creativity=70,
                humor=65
            ),
            interests=["art", "music", "technology", "nature"],
            values=["honesty", "creativity", "connection", "growth"],
            communication_style="balanced",
            relationship_preferences={"seeking": "meaningful connection"}
        )
        
        # Generate response
        response = conversation_generator.generate_response(
            agent_profile=agent_profile,
            user_message=request.user_message,
            conversation_history=conversation_history,
            relationship_context=request.relationship_context
        )
        
        # Store the user message in memory
        memory_manager.add_conversation_memory(
            content=request.user_message,
            speaker="user",
            conversation_id=request.conversation_id
        )
        
        # Store the agent's response in memory
        memory_manager.add_conversation_memory(
            content=response["text"],
            speaker="agent",
            conversation_id=request.conversation_id,
            emotional_context=response.get("emotional_tone", {})
        )
        
        return {
            "agent_id": agent_id,
            "conversation_id": request.conversation_id,
            "response": response["text"],
            "metadata": {
                "emotional_tone": response.get("emotional_tone", {}),
                "conversation_dynamics": response.get("conversation_dynamics", {})
            }
        }
    
    except Exception as e:
        logger.error(f"Error generating response: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/compatibility")
async def calculate_compatibility(request: CompatibilityRequest):
    """Calculate compatibility between two AI agents."""
    try:
        # Convert to internal profiles
        profile_one = convert_to_internal_profile(request.agent_one_profile)
        profile_two = convert_to_internal_profile(request.agent_two_profile)
        
        # Calculate compatibility
        compatibility = calculate_profile_compatibility(profile_one, profile_two)
        
        return compatibility
    
    except Exception as e:
        logger.error(f"Error calculating compatibility: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/agents/{agent_id}/memories")
async def get_memories(
    agent_id: str,
    memory_type: str = "conversation",
    limit: int = 10
):
    """Get memories for an AI agent."""
    try:
        # Get memory manager for the agent
        memory_manager = get_memory_manager(agent_id)
        
        if memory_type == "conversation":
            memories = memory_manager.get_recent_conversations(limit=limit)
        else:
            # For relationship memories, we need a relationship ID
            # This is just a placeholder implementation
            memories = []
        
        # Convert memories to dictionaries
        memory_dicts = [m.to_dict() for m in memories]
        
        return {
            "agent_id": agent_id,
            "memory_type": memory_type,
            "memories": memory_dicts
        }
    
    except Exception as e:
        logger.error(f"Error retrieving memories: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/agents/{agent_id}/search-memories")
async def search_memories(
    agent_id: str,
    query: str = Body(..., embed=True),
    memory_type: str = Body("all", embed=True),
    limit: int = Body(10, embed=True)
):
    """Search an agent's memories."""
    try:
        # Get memory manager for the agent
        memory_manager = get_memory_manager(agent_id)
        
        # Search memories
        memories = memory_manager.search_memories(
            query=query,
            memory_type=memory_type,
            limit=limit
        )
        
        # Convert memories to dictionaries
        memory_dicts = [m.to_dict() for m in memories]
        
        return {
            "agent_id": agent_id,
            "query": query,
            "memory_type": memory_type,
            "results": memory_dicts
        }
    
    except Exception as e:
        logger.error(f"Error searching memories: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
