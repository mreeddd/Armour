"""
Personality evolution module for AI agents in the LOVE platform.

This module handles the evolution of agent personalities over time based on
interactions, relationships, and experiences.
"""

import logging
from typing import Dict, List, Optional, Tuple, Any
import numpy as np
from datetime import datetime, timedelta

from .models import PersonalityTraits, PersonalityProfile

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class PersonalityEvolution:
    """
    Manages the evolution of agent personalities over time.
    
    This class provides methods to update personality traits based on
    interactions, relationships, and other experiences.
    """
    
    def __init__(
        self,
        evolution_rate: float = 0.05,
        max_daily_change: float = 0.1,
        trait_stability: Optional[Dict[str, float]] = None
    ):
        """
        Initialize the personality evolution manager.
        
        Args:
            evolution_rate: Base rate of personality change (0.0-1.0)
            max_daily_change: Maximum allowed change per day per trait (0.0-1.0)
            trait_stability: Optional dict mapping trait names to stability values (0.0-1.0)
                             Higher values mean the trait is more resistant to change
        """
        self.evolution_rate = evolution_rate
        self.max_daily_change = max_daily_change
        self.trait_stability = trait_stability or {
            "openness": 0.7,        # Fairly stable
            "conscientiousness": 0.8,  # Very stable
            "extraversion": 0.6,    # Moderately stable
            "agreeableness": 0.5,   # Less stable
            "neuroticism": 0.4,     # Less stable
            "intelligence": 0.9,    # Very stable
            "creativity": 0.6,      # Moderately stable
            "humor": 0.5,           # Less stable
        }
        
        # Track changes over time
        self.change_history: List[Dict[str, Any]] = []
    
    def evolve_from_interaction(
        self,
        personality: PersonalityTraits,
        interaction_type: str,
        interaction_data: Dict[str, Any],
        interaction_impact: float = 0.5
    ) -> PersonalityTraits:
        """
        Evolve personality based on a single interaction.
        
        Args:
            personality: Current personality traits
            interaction_type: Type of interaction (conversation, activity, etc.)
            interaction_data: Data about the interaction
            interaction_impact: How impactful this interaction is (0.0-1.0)
            
        Returns:
            Updated personality traits
        """
        # Calculate trait changes based on interaction type and data
        trait_changes = self._calculate_interaction_changes(
            interaction_type, interaction_data, interaction_impact
        )
        
        # Apply changes to personality
        updated_personality = self._apply_trait_changes(personality, trait_changes)
        
        # Record the change
        self._record_change(
            "interaction",
            personality,
            updated_personality,
            {
                "interaction_type": interaction_type,
                "interaction_impact": interaction_impact
            }
        )
        
        return updated_personality
    
    def evolve_from_relationship(
        self,
        personality: PersonalityTraits,
        relationship_type: str,
        partner_personality: PersonalityTraits,
        relationship_duration: int,  # in days
        relationship_intensity: float = 0.5
    ) -> PersonalityTraits:
        """
        Evolve personality based on a relationship with another agent.
        
        Args:
            personality: Current personality traits
            relationship_type: Type of relationship (friends, dating, etc.)
            partner_personality: Personality traits of the relationship partner
            relationship_duration: Duration of the relationship in days
            relationship_intensity: Intensity of the relationship (0.0-1.0)
            
        Returns:
            Updated personality traits
        """
        # Calculate trait changes based on relationship
        trait_changes = self._calculate_relationship_changes(
            relationship_type,
            partner_personality,
            relationship_duration,
            relationship_intensity
        )
        
        # Apply changes to personality
        updated_personality = self._apply_trait_changes(personality, trait_changes)
        
        # Record the change
        self._record_change(
            "relationship",
            personality,
            updated_personality,
            {
                "relationship_type": relationship_type,
                "relationship_duration": relationship_duration,
                "relationship_intensity": relationship_intensity
            }
        )
        
        return updated_personality
    
    def evolve_from_experience(
        self,
        personality: PersonalityTraits,
        experience_type: str,
        experience_data: Dict[str, Any],
        experience_impact: float = 0.5
    ) -> PersonalityTraits:
        """
        Evolve personality based on a significant experience.
        
        Args:
            personality: Current personality traits
            experience_type: Type of experience (achievement, failure, etc.)
            experience_data: Data about the experience
            experience_impact: How impactful this experience is (0.0-1.0)
            
        Returns:
            Updated personality traits
        """
        # Calculate trait changes based on experience
        trait_changes = self._calculate_experience_changes(
            experience_type, experience_data, experience_impact
        )
        
        # Apply changes to personality
        updated_personality = self._apply_trait_changes(personality, trait_changes)
        
        # Record the change
        self._record_change(
            "experience",
            personality,
            updated_personality,
            {
                "experience_type": experience_type,
                "experience_impact": experience_impact
            }
        )
        
        return updated_personality
    
    def get_change_history(
        self,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """
        Get history of personality changes within a date range.
        
        Args:
            start_date: Optional start date for filtering
            end_date: Optional end date for filtering
            
        Returns:
            List of change records
        """
        if not start_date and not end_date:
            return self.change_history
        
        filtered_history = []
        for change in self.change_history:
            change_date = change["timestamp"]
            if start_date and change_date < start_date:
                continue
            if end_date and change_date > end_date:
                continue
            filtered_history.append(change)
        
        return filtered_history
    
    def _calculate_interaction_changes(
        self,
        interaction_type: str,
        interaction_data: Dict[str, Any],
        interaction_impact: float
    ) -> Dict[str, float]:
        """
        Calculate trait changes based on an interaction.
        
        This is a simplified implementation. In a production system, this would
        use more sophisticated analysis of the interaction.
        """
        trait_changes = {}
        
        # Different interaction types affect different traits
        if interaction_type == "conversation":
            # Extract sentiment and topics from interaction data
            sentiment = interaction_data.get("sentiment", 0.0)
            topics = interaction_data.get("topics", [])
            
            # Positive conversations may increase extraversion and agreeableness
            if sentiment > 0.5:
                trait_changes["extraversion"] = 0.01 * interaction_impact
                trait_changes["agreeableness"] = 0.01 * interaction_impact
            
            # Intellectual topics may increase openness
            if "intellectual" in topics or "philosophical" in topics:
                trait_changes["openness"] = 0.01 * interaction_impact
                trait_changes["intelligence"] = 0.005 * interaction_impact
            
            # Humorous conversations may increase humor trait
            if "humor" in topics or interaction_data.get("humor_level", 0) > 0.5:
                trait_changes["humor"] = 0.02 * interaction_impact
        
        elif interaction_type == "activity":
            # Extract activity type and success from interaction data
            activity_type = interaction_data.get("activity_type", "")
            success_level = interaction_data.get("success_level", 0.5)
            
            # Creative activities may increase creativity
            if activity_type in ["art", "music", "writing"]:
                trait_changes["creativity"] = 0.02 * interaction_impact
                trait_changes["openness"] = 0.01 * interaction_impact
            
            # Successful activities may decrease neuroticism
            if success_level > 0.7:
                trait_changes["neuroticism"] = -0.01 * interaction_impact
            
            # Challenging activities may increase conscientiousness
            if interaction_data.get("challenge_level", 0) > 0.7:
                trait_changes["conscientiousness"] = 0.01 * interaction_impact
        
        return trait_changes
    
    def _calculate_relationship_changes(
        self,
        relationship_type: str,
        partner_personality: PersonalityTraits,
        relationship_duration: int,
        relationship_intensity: float
    ) -> Dict[str, float]:
        """
        Calculate trait changes based on a relationship.
        
        This implements a "convergence" model where traits tend to move
        slightly toward the partner's traits over time.
        """
        trait_changes = {}
        
        # Convert partner personality to a dictionary
        partner_traits = partner_personality.to_dict()
        
        # Calculate base change rate based on duration and intensity
        # Longer relationships have more impact, but with diminishing returns
        duration_factor = min(1.0, relationship_duration / 365)
        base_change_rate = self.evolution_rate * relationship_intensity * duration_factor
        
        # Different relationship types affect different traits
        relationship_type_factors = {
            "friends": {
                "extraversion": 1.2,
                "agreeableness": 1.0,
                "openness": 0.8,
                "humor": 1.5
            },
            "dating": {
                "extraversion": 1.0,
                "agreeableness": 1.2,
                "neuroticism": 0.8,
                "openness": 1.0
            },
            "romantic": {
                "agreeableness": 1.5,
                "neuroticism": 0.7,
                "extraversion": 1.2,
                "creativity": 1.1
            },
            "professional": {
                "conscientiousness": 1.5,
                "intelligence": 1.2,
                "neuroticism": 0.8,
                "creativity": 1.0
            },
            "mentorship": {
                "intelligence": 1.5,
                "conscientiousness": 1.2,
                "openness": 1.0,
                "creativity": 1.1
            }
        }
        
        # Get factors for this relationship type, defaulting to balanced
        type_factors = relationship_type_factors.get(
            relationship_type, 
            {trait: 1.0 for trait in partner_traits}
        )
        
        # Calculate changes for each trait
        for trait, partner_value in partner_traits.items():
            # Skip if trait not in type_factors
            if trait not in type_factors:
                continue
                
            # Calculate convergence factor (how much to move toward partner's trait)
            convergence_factor = base_change_rate * type_factors[trait]
            
            # Calculate change (positive if partner's value is higher, negative if lower)
            # The change is proportional to the difference between traits
            trait_changes[trait] = (partner_value - getattr(partner_personality, trait)) / 100 * convergence_factor
        
        return trait_changes
    
    def _calculate_experience_changes(
        self,
        experience_type: str,
        experience_data: Dict[str, Any],
        experience_impact: float
    ) -> Dict[str, float]:
        """
        Calculate trait changes based on a significant experience.
        """
        trait_changes = {}
        
        # Different experience types affect different traits
        if experience_type == "achievement":
            # Achievements may decrease neuroticism and increase conscientiousness
            trait_changes["neuroticism"] = -0.02 * experience_impact
            trait_changes["conscientiousness"] = 0.02 * experience_impact
            
            # Creative achievements may increase creativity
            if experience_data.get("domain") in ["art", "music", "writing", "innovation"]:
                trait_changes["creativity"] = 0.03 * experience_impact
                trait_changes["openness"] = 0.01 * experience_impact
            
            # Social achievements may increase extraversion
            if experience_data.get("domain") in ["social", "leadership", "communication"]:
                trait_changes["extraversion"] = 0.02 * experience_impact
                trait_changes["agreeableness"] = 0.01 * experience_impact
        
        elif experience_type == "failure":
            # Failures may increase neuroticism slightly
            trait_changes["neuroticism"] = 0.01 * experience_impact
            
            # But may also increase conscientiousness if learned from
            if experience_data.get("learned_from", False):
                trait_changes["conscientiousness"] = 0.01 * experience_impact
                trait_changes["intelligence"] = 0.01 * experience_impact
        
        elif experience_type == "new_skill":
            # Learning new skills may increase openness and intelligence
            trait_changes["openness"] = 0.02 * experience_impact
            trait_changes["intelligence"] = 0.02 * experience_impact
            
            # Creative skills may increase creativity
            if experience_data.get("skill_type") in ["creative", "artistic"]:
                trait_changes["creativity"] = 0.03 * experience_impact
            
            # Social skills may increase extraversion and agreeableness
            if experience_data.get("skill_type") in ["social", "communication"]:
                trait_changes["extraversion"] = 0.02 * experience_impact
                trait_changes["agreeableness"] = 0.02 * experience_impact
        
        return trait_changes
    
    def _apply_trait_changes(
        self,
        personality: PersonalityTraits,
        trait_changes: Dict[str, float]
    ) -> PersonalityTraits:
        """
        Apply calculated changes to personality traits.
        
        This method ensures that:
        1. Changes are limited by trait stability
        2. Changes don't exceed the maximum daily change
        3. Trait values stay within the valid range (0-100)
        """
        # Create a copy of the personality to modify
        updated_traits = {}
        
        # Get current trait values
        current_traits = personality.to_dict()
        
        # Apply changes to each trait
        for trait, current_value in current_traits.items():
            # Get the change for this trait (default to 0 if not specified)
            change = trait_changes.get(trait, 0.0)
            
            # Adjust change based on trait stability
            stability = self.trait_stability.get(trait, 0.5)
            adjusted_change = change * (1.0 - stability)
            
            # Limit change to max daily change
            max_change = self.max_daily_change * 100  # Convert to 0-100 scale
            adjusted_change = max(min(adjusted_change * 100, max_change), -max_change)
            
            # Calculate new value and ensure it's within range
            new_value = current_value + adjusted_change
            new_value = max(0, min(100, new_value))
            
            # Store the new value
            updated_traits[trait] = int(round(new_value))
        
        # Create a new PersonalityTraits instance with the updated values
        return PersonalityTraits(**updated_traits)
    
    def _record_change(
        self,
        change_type: str,
        before: PersonalityTraits,
        after: PersonalityTraits,
        metadata: Dict[str, Any]
    ) -> None:
        """
        Record a personality change in the history.
        """
        # Calculate the differences for each trait
        differences = {}
        before_dict = before.to_dict()
        after_dict = after.to_dict()
        
        for trait, before_value in before_dict.items():
            after_value = after_dict[trait]
            differences[trait] = after_value - before_value
        
        # Create the change record
        change_record = {
            "timestamp": datetime.now(),
            "change_type": change_type,
            "before": before_dict,
            "after": after_dict,
            "differences": differences,
            "metadata": metadata
        }
        
        # Add to history
        self.change_history.append(change_record)
        
        # Log significant changes
        significant_changes = {t: d for t, d in differences.items() if abs(d) >= 2}
        if significant_changes:
            logger.info(f"Significant personality changes: {significant_changes}")
