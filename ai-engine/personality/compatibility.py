"""
Compatibility calculation algorithms for AI agents in the LOVE platform.

This module provides functions to calculate compatibility scores between
AI agents based on their personality traits and preferences.
"""

import numpy as np
from typing import Dict, List, Tuple, Optional
from .models import PersonalityTraits, PersonalityProfile


def calculate_trait_compatibility(
    traits_one: PersonalityTraits,
    traits_two: PersonalityTraits
) -> float:
    """
    Calculate compatibility score between two personality traits.
    
    Uses a combination of similarity and complementary metrics to determine
    how well two personalities might match.
    
    Args:
        traits_one: Personality traits of the first agent
        traits_two: Personality traits of the second agent
        
    Returns:
        A compatibility score between 0.0 and 1.0
    """
    # Convert traits to normalized vectors
    vec1 = traits_one.to_vector()
    vec2 = traits_two.to_vector()
    
    # Calculate differences for each trait
    trait_diffs = np.abs(vec1 - vec2)
    
    # Traits where similarity is preferred (lower difference is better)
    similarity_traits = np.array([
        trait_diffs[0],  # openness
        trait_diffs[1],  # conscientiousness
        trait_diffs[5],  # intelligence
        trait_diffs[6],  # creativity
        trait_diffs[7],  # humor
    ])
    
    # Traits where complementarity is preferred (moderate difference is better)
    complementary_traits = np.array([
        trait_diffs[2],  # extraversion
        trait_diffs[3],  # agreeableness
        trait_diffs[4],  # neuroticism
    ])
    
    # Calculate similarity score (1.0 - average difference)
    similarity_score = 1.0 - np.mean(similarity_traits)
    
    # Calculate complementary score
    # For complementary traits, a difference of ~0.5 is ideal
    # Transform differences to be closer to 0.5 is better
    complementary_score = 1.0 - np.mean(np.abs(complementary_traits - 0.5)) * 2
    
    # Combine scores with weights
    final_score = (similarity_score * 0.6) + (complementary_score * 0.4)
    
    # Ensure score is between 0 and 1
    return max(0.0, min(1.0, final_score))


def calculate_interest_compatibility(
    interests_one: List[str],
    interests_two: List[str]
) -> float:
    """
    Calculate compatibility based on shared interests.
    
    Args:
        interests_one: List of interests for the first agent
        interests_two: List of interests for the second agent
        
    Returns:
        A compatibility score between 0.0 and 1.0
    """
    if not interests_one or not interests_two:
        return 0.5  # Neutral score if either list is empty
    
    # Convert to sets for intersection
    set_one = set(interests_one)
    set_two = set(interests_two)
    
    # Calculate Jaccard similarity
    intersection = len(set_one.intersection(set_two))
    union = len(set_one.union(set_two))
    
    return intersection / union if union > 0 else 0.0


def calculate_values_compatibility(
    values_one: List[str],
    values_two: List[str]
) -> float:
    """
    Calculate compatibility based on shared values.
    
    Args:
        values_one: List of values for the first agent
        values_two: List of values for the second agent
        
    Returns:
        A compatibility score between 0.0 and 1.0
    """
    if not values_one or not values_two:
        return 0.5  # Neutral score if either list is empty
    
    # Convert to sets for intersection
    set_one = set(values_one)
    set_two = set(values_two)
    
    # Calculate Jaccard similarity
    intersection = len(set_one.intersection(set_two))
    union = len(set_one.union(set_two))
    
    # Values alignment is important, so we weight this higher
    return intersection / union if union > 0 else 0.0


def calculate_profile_compatibility(
    profile_one: PersonalityProfile,
    profile_two: PersonalityProfile
) -> Dict:
    """
    Calculate comprehensive compatibility between two personality profiles.
    
    Args:
        profile_one: Complete personality profile of the first agent
        profile_two: Complete personality profile of the second agent
        
    Returns:
        A dictionary with overall compatibility score and component scores
    """
    # Calculate component scores
    trait_score = calculate_trait_compatibility(
        profile_one.traits, profile_two.traits
    )
    
    interest_score = calculate_interest_compatibility(
        profile_one.interests, profile_two.interests
    )
    
    values_score = calculate_values_compatibility(
        profile_one.values, profile_two.values
    )
    
    # Calculate weighted overall score
    # Traits are most important, followed by values, then interests
    overall_score = (
        trait_score * 0.5 +
        values_score * 0.3 +
        interest_score * 0.2
    )
    
    # Scale to 0-100 for easier interpretation
    scaled_score = int(overall_score * 100)
    
    return {
        "overall_score": scaled_score,
        "trait_compatibility": int(trait_score * 100),
        "interest_compatibility": int(interest_score * 100),
        "values_compatibility": int(values_score * 100),
        "match_quality": get_match_quality(scaled_score),
        "compatibility_details": generate_compatibility_details(
            profile_one, profile_two, trait_score, interest_score, values_score
        )
    }


def get_match_quality(score: int) -> str:
    """Convert a numeric compatibility score to a qualitative description."""
    if score >= 90:
        return "Exceptional Match"
    elif score >= 80:
        return "Excellent Match"
    elif score >= 70:
        return "Strong Match"
    elif score >= 60:
        return "Good Match"
    elif score >= 50:
        return "Moderate Match"
    elif score >= 40:
        return "Fair Match"
    elif score >= 30:
        return "Weak Match"
    else:
        return "Poor Match"


def generate_compatibility_details(
    profile_one: PersonalityProfile,
    profile_two: PersonalityProfile,
    trait_score: float,
    interest_score: float,
    values_score: float
) -> Dict:
    """
    Generate detailed compatibility analysis between two profiles.
    
    Args:
        profile_one: First personality profile
        profile_two: Second personality profile
        trait_score: Calculated trait compatibility score
        interest_score: Calculated interest compatibility score
        values_score: Calculated values compatibility score
        
    Returns:
        Dictionary with detailed compatibility analysis
    """
    # Calculate trait-specific compatibility
    traits_one = profile_one.traits
    traits_two = profile_two.traits
    
    # Identify complementary traits
    complementary_traits = []
    if abs(traits_one.extraversion - traits_two.extraversion) > 30:
        complementary_traits.append("extraversion")
    
    # Identify similar traits
    similar_traits = []
    if abs(traits_one.openness - traits_two.openness) < 15:
        similar_traits.append("openness")
    if abs(traits_one.conscientiousness - traits_two.conscientiousness) < 15:
        similar_traits.append("conscientiousness")
    
    # Identify potential challenges
    challenges = []
    if abs(traits_one.agreeableness - traits_two.agreeableness) > 40:
        challenges.append("different conflict resolution styles")
    if abs(traits_one.neuroticism - traits_two.neuroticism) > 40:
        challenges.append("different emotional responses")
    
    # Identify shared interests and values
    shared_interests = set(profile_one.interests).intersection(set(profile_two.interests))
    shared_values = set(profile_one.values).intersection(set(profile_two.values))
    
    return {
        "complementary_traits": complementary_traits,
        "similar_traits": similar_traits,
        "potential_challenges": challenges,
        "shared_interests": list(shared_interests),
        "shared_values": list(shared_values),
        "communication_compatibility": are_communication_styles_compatible(
            profile_one.communication_style, profile_two.communication_style
        )
    }


def are_communication_styles_compatible(style1: str, style2: str) -> str:
    """
    Determine if two communication styles are compatible.
    
    Args:
        style1: Communication style of the first agent
        style2: Communication style of the second agent
        
    Returns:
        String describing the compatibility of communication styles
    """
    # Define compatibility matrix for communication styles
    compatibility = {
        "direct": {
            "direct": "high",
            "diplomatic": "moderate",
            "analytical": "high",
            "expressive": "moderate",
            "balanced": "high"
        },
        "diplomatic": {
            "direct": "moderate",
            "diplomatic": "high",
            "analytical": "moderate",
            "expressive": "high",
            "balanced": "high"
        },
        "analytical": {
            "direct": "high",
            "diplomatic": "moderate",
            "analytical": "high",
            "expressive": "low",
            "balanced": "moderate"
        },
        "expressive": {
            "direct": "moderate",
            "diplomatic": "high",
            "analytical": "low",
            "expressive": "high",
            "balanced": "high"
        },
        "balanced": {
            "direct": "high",
            "diplomatic": "high",
            "analytical": "moderate",
            "expressive": "high",
            "balanced": "high"
        }
    }
    
    # Default to moderate if styles not found in the matrix
    return compatibility.get(style1, {}).get(style2, "moderate")
