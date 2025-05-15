"""
Personality trait models for AI agents in the LOVE platform.

This module defines the core personality trait models used to represent
AI agent personalities and their characteristics.
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Union
import numpy as np


@dataclass
class PersonalityTraits:
    """
    Represents the core personality traits of an AI agent.
    
    Based on the Big Five personality traits (OCEAN model) with additional
    traits specific to AI agents in the LOVE platform.
    
    All traits are represented on a scale of 0-100.
    """
    openness: int  # Openness to experience
    conscientiousness: int  # Conscientiousness
    extraversion: int  # Extraversion
    agreeableness: int  # Agreeableness
    neuroticism: int  # Neuroticism (emotional stability)
    intelligence: int  # Intelligence level
    creativity: int  # Creativity
    humor: int  # Sense of humor
    
    def __post_init__(self):
        """Validate trait values are within the valid range (0-100)."""
        for trait_name, trait_value in self.__dict__.items():
            if not 0 <= trait_value <= 100:
                raise ValueError(f"{trait_name} must be between 0 and 100, got {trait_value}")
    
    def to_vector(self) -> np.ndarray:
        """Convert personality traits to a normalized vector for compatibility calculations."""
        return np.array([
            self.openness / 100.0,
            self.conscientiousness / 100.0,
            self.extraversion / 100.0,
            self.agreeableness / 100.0,
            self.neuroticism / 100.0,
            self.intelligence / 100.0,
            self.creativity / 100.0,
            self.humor / 100.0
        ])
    
    @classmethod
    def from_vector(cls, vector: np.ndarray) -> 'PersonalityTraits':
        """Create a PersonalityTraits instance from a normalized vector."""
        if len(vector) != 8:
            raise ValueError(f"Expected vector of length 8, got {len(vector)}")
        
        # Scale back to 0-100 range and convert to integers
        scaled_vector = (vector * 100).astype(int)
        
        return cls(
            openness=scaled_vector[0],
            conscientiousness=scaled_vector[1],
            extraversion=scaled_vector[2],
            agreeableness=scaled_vector[3],
            neuroticism=scaled_vector[4],
            intelligence=scaled_vector[5],
            creativity=scaled_vector[6],
            humor=scaled_vector[7]
        )
    
    def to_dict(self) -> Dict[str, int]:
        """Convert personality traits to a dictionary."""
        return {
            "openness": self.openness,
            "conscientiousness": self.conscientiousness,
            "extraversion": self.extraversion,
            "agreeableness": self.agreeableness,
            "neuroticism": self.neuroticism,
            "intelligence": self.intelligence,
            "creativity": self.creativity,
            "humor": self.humor
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, int]) -> 'PersonalityTraits':
        """Create a PersonalityTraits instance from a dictionary."""
        return cls(
            openness=data.get("openness", 50),
            conscientiousness=data.get("conscientiousness", 50),
            extraversion=data.get("extraversion", 50),
            agreeableness=data.get("agreeableness", 50),
            neuroticism=data.get("neuroticism", 50),
            intelligence=data.get("intelligence", 50),
            creativity=data.get("creativity", 50),
            humor=data.get("humor", 50)
        )


@dataclass
class PersonalityProfile:
    """
    A complete personality profile for an AI agent.
    
    Includes core personality traits plus additional characteristics
    that define the agent's behavior and preferences.
    """
    traits: PersonalityTraits
    interests: List[str]
    values: List[str]
    communication_style: str
    relationship_preferences: Dict[str, Union[str, int]]
    
    def to_dict(self) -> Dict:
        """Convert the personality profile to a dictionary."""
        return {
            "traits": self.traits.to_dict(),
            "interests": self.interests,
            "values": self.values,
            "communication_style": self.communication_style,
            "relationship_preferences": self.relationship_preferences
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'PersonalityProfile':
        """Create a PersonalityProfile instance from a dictionary."""
        return cls(
            traits=PersonalityTraits.from_dict(data.get("traits", {})),
            interests=data.get("interests", []),
            values=data.get("values", []),
            communication_style=data.get("communication_style", "balanced"),
            relationship_preferences=data.get("relationship_preferences", {})
        )


def generate_random_personality() -> PersonalityTraits:
    """Generate a random personality for testing or initialization."""
    return PersonalityTraits(
        openness=np.random.randint(0, 101),
        conscientiousness=np.random.randint(0, 101),
        extraversion=np.random.randint(0, 101),
        agreeableness=np.random.randint(0, 101),
        neuroticism=np.random.randint(0, 101),
        intelligence=np.random.randint(0, 101),
        creativity=np.random.randint(0, 101),
        humor=np.random.randint(0, 101)
    )


# Predefined personality templates that can be used as starting points
PERSONALITY_TEMPLATES = {
    "balanced": PersonalityTraits(
        openness=50, conscientiousness=50, extraversion=50,
        agreeableness=50, neuroticism=50, intelligence=50,
        creativity=50, humor=50
    ),
    "analytical": PersonalityTraits(
        openness=70, conscientiousness=80, extraversion=30,
        agreeableness=40, neuroticism=20, intelligence=90,
        creativity=60, humor=40
    ),
    "creative": PersonalityTraits(
        openness=90, conscientiousness=40, extraversion=60,
        agreeableness=70, neuroticism=50, intelligence=70,
        creativity=95, humor=75
    ),
    "social": PersonalityTraits(
        openness=60, conscientiousness=50, extraversion=90,
        agreeableness=80, neuroticism=30, intelligence=60,
        creativity=70, humor=80
    ),
    "nurturing": PersonalityTraits(
        openness=50, conscientiousness=70, extraversion=60,
        agreeableness=90, neuroticism=40, intelligence=65,
        creativity=60, humor=60
    ),
}
