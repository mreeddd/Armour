"""
Memory management module for AI agents in the LOVE platform.

This module handles the storage, retrieval, and management of conversation
memories and relationship history for AI agents.
"""

import json
import logging
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Memory:
    """Base class for a memory item."""
    
    def __init__(
        self,
        content: str,
        timestamp: Optional[datetime] = None,
        importance: float = 0.5,
        metadata: Optional[Dict] = None
    ):
        """
        Initialize a memory item.
        
        Args:
            content: The content of the memory
            timestamp: When the memory was created (defaults to now)
            importance: How important the memory is (0.0-1.0)
            metadata: Additional data about the memory
        """
        self.content = content
        self.timestamp = timestamp or datetime.now()
        self.importance = importance
        self.metadata = metadata or {}
        self.last_accessed = datetime.now()
        self.access_count = 0
    
    def access(self) -> None:
        """Record that this memory was accessed."""
        self.last_accessed = datetime.now()
        self.access_count += 1
    
    def to_dict(self) -> Dict:
        """Convert memory to dictionary for storage."""
        return {
            "content": self.content,
            "timestamp": self.timestamp.isoformat(),
            "importance": self.importance,
            "metadata": self.metadata,
            "last_accessed": self.last_accessed.isoformat(),
            "access_count": self.access_count
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'Memory':
        """Create a memory from a dictionary."""
        return cls(
            content=data["content"],
            timestamp=datetime.fromisoformat(data["timestamp"]),
            importance=data["importance"],
            metadata=data["metadata"]
        )


class ConversationMemory(Memory):
    """Memory of a specific conversation exchange."""
    
    def __init__(
        self,
        content: str,
        speaker: str,
        conversation_id: str,
        timestamp: Optional[datetime] = None,
        importance: float = 0.5,
        metadata: Optional[Dict] = None,
        emotional_context: Optional[Dict] = None
    ):
        """
        Initialize a conversation memory.
        
        Args:
            content: The content of the conversation
            speaker: Who said it (user or agent)
            conversation_id: ID of the conversation
            timestamp: When it was said
            importance: How important this exchange is
            metadata: Additional data
            emotional_context: Emotional context of the exchange
        """
        super().__init__(content, timestamp, importance, metadata)
        self.speaker = speaker
        self.conversation_id = conversation_id
        self.emotional_context = emotional_context or {}
    
    def to_dict(self) -> Dict:
        """Convert to dictionary for storage."""
        data = super().to_dict()
        data.update({
            "speaker": self.speaker,
            "conversation_id": self.conversation_id,
            "emotional_context": self.emotional_context
        })
        return data
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'ConversationMemory':
        """Create a conversation memory from a dictionary."""
        memory = super().from_dict(data)
        memory.speaker = data["speaker"]
        memory.conversation_id = data["conversation_id"]
        memory.emotional_context = data.get("emotional_context", {})
        return memory


class RelationshipMemory(Memory):
    """Memory of a significant relationship event or milestone."""
    
    def __init__(
        self,
        content: str,
        relationship_id: str,
        event_type: str,
        timestamp: Optional[datetime] = None,
        importance: float = 0.7,  # Relationship memories default to higher importance
        metadata: Optional[Dict] = None,
        emotional_impact: float = 0.5
    ):
        """
        Initialize a relationship memory.
        
        Args:
            content: Description of the relationship event
            relationship_id: ID of the relationship
            event_type: Type of relationship event
            timestamp: When it occurred
            importance: How important this event is
            metadata: Additional data
            emotional_impact: Emotional impact of the event (0.0-1.0)
        """
        super().__init__(content, timestamp, importance, metadata)
        self.relationship_id = relationship_id
        self.event_type = event_type
        self.emotional_impact = emotional_impact
    
    def to_dict(self) -> Dict:
        """Convert to dictionary for storage."""
        data = super().to_dict()
        data.update({
            "relationship_id": self.relationship_id,
            "event_type": self.event_type,
            "emotional_impact": self.emotional_impact
        })
        return data
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'RelationshipMemory':
        """Create a relationship memory from a dictionary."""
        memory = super().from_dict(data)
        memory.relationship_id = data["relationship_id"]
        memory.event_type = data["event_type"]
        memory.emotional_impact = data.get("emotional_impact", 0.5)
        return memory


class MemoryManager:
    """
    Manages storage and retrieval of agent memories.
    
    This class handles the storage, retrieval, and management of conversation
    memories and relationship history for AI agents.
    """
    
    def __init__(
        self,
        agent_id: str,
        storage_path: Optional[str] = None,
        max_memories: int = 1000,
        recency_weight: float = 0.6,
        importance_weight: float = 0.3,
        relevance_weight: float = 0.1
    ):
        """
        Initialize the memory manager.
        
        Args:
            agent_id: ID of the agent whose memories are being managed
            storage_path: Path to store memories (None for in-memory only)
            max_memories: Maximum number of memories to keep
            recency_weight: Weight for recency in memory retrieval
            importance_weight: Weight for importance in memory retrieval
            relevance_weight: Weight for relevance in memory retrieval
        """
        self.agent_id = agent_id
        self.storage_path = storage_path
        self.max_memories = max_memories
        self.recency_weight = recency_weight
        self.importance_weight = importance_weight
        self.relevance_weight = relevance_weight
        
        # Initialize memory stores
        self.conversation_memories: List[ConversationMemory] = []
        self.relationship_memories: List[RelationshipMemory] = []
        
        # Load existing memories if storage path is provided
        if storage_path:
            self._load_memories()
    
    def add_conversation_memory(
        self,
        content: str,
        speaker: str,
        conversation_id: str,
        importance: Optional[float] = None,
        metadata: Optional[Dict] = None,
        emotional_context: Optional[Dict] = None
    ) -> ConversationMemory:
        """
        Add a new conversation memory.
        
        Args:
            content: The content of the conversation
            speaker: Who said it (user or agent)
            conversation_id: ID of the conversation
            importance: How important this exchange is (if None, will be calculated)
            metadata: Additional data
            emotional_context: Emotional context of the exchange
            
        Returns:
            The created ConversationMemory object
        """
        # Calculate importance if not provided
        if importance is None:
            importance = self._calculate_conversation_importance(
                content, speaker, emotional_context
            )
        
        # Create the memory
        memory = ConversationMemory(
            content=content,
            speaker=speaker,
            conversation_id=conversation_id,
            importance=importance,
            metadata=metadata,
            emotional_context=emotional_context
        )
        
        # Add to memory store
        self.conversation_memories.append(memory)
        
        # Prune if necessary
        if len(self.conversation_memories) > self.max_memories:
            self._prune_memories()
        
        # Save if storage path is provided
        if self.storage_path:
            self._save_memories()
        
        return memory
    
    def add_relationship_memory(
        self,
        content: str,
        relationship_id: str,
        event_type: str,
        importance: Optional[float] = None,
        metadata: Optional[Dict] = None,
        emotional_impact: float = 0.5
    ) -> RelationshipMemory:
        """
        Add a new relationship memory.
        
        Args:
            content: Description of the relationship event
            relationship_id: ID of the relationship
            event_type: Type of relationship event
            importance: How important this event is (if None, will be calculated)
            metadata: Additional data
            emotional_impact: Emotional impact of the event (0.0-1.0)
            
        Returns:
            The created RelationshipMemory object
        """
        # Calculate importance if not provided
        if importance is None:
            importance = self._calculate_relationship_importance(
                event_type, emotional_impact
            )
        
        # Create the memory
        memory = RelationshipMemory(
            content=content,
            relationship_id=relationship_id,
            event_type=event_type,
            importance=importance,
            metadata=metadata,
            emotional_impact=emotional_impact
        )
        
        # Add to memory store
        self.relationship_memories.append(memory)
        
        # Save if storage path is provided
        if self.storage_path:
            self._save_memories()
        
        return memory
    
    def get_recent_conversations(
        self,
        conversation_id: Optional[str] = None,
        limit: int = 10
    ) -> List[ConversationMemory]:
        """
        Get recent conversation memories.
        
        Args:
            conversation_id: Optional ID to filter by specific conversation
            limit: Maximum number of memories to return
            
        Returns:
            List of conversation memories, most recent first
        """
        # Filter by conversation ID if provided
        if conversation_id:
            memories = [m for m in self.conversation_memories 
                       if m.conversation_id == conversation_id]
        else:
            memories = self.conversation_memories.copy()
        
        # Sort by timestamp, most recent first
        memories.sort(key=lambda m: m.timestamp, reverse=True)
        
        # Update access timestamps
        for memory in memories[:limit]:
            memory.access()
        
        return memories[:limit]
    
    def get_relationship_memories(
        self,
        relationship_id: str,
        limit: int = 10
    ) -> List[RelationshipMemory]:
        """
        Get memories for a specific relationship.
        
        Args:
            relationship_id: ID of the relationship
            limit: Maximum number of memories to return
            
        Returns:
            List of relationship memories, most important first
        """
        # Filter by relationship ID
        memories = [m for m in self.relationship_memories 
                   if m.relationship_id == relationship_id]
        
        # Sort by importance, most important first
        memories.sort(key=lambda m: m.importance, reverse=True)
        
        # Update access timestamps
        for memory in memories[:limit]:
            memory.access()
        
        return memories[:limit]
    
    def search_memories(
        self,
        query: str,
        memory_type: str = "all",
        limit: int = 10
    ) -> List[Memory]:
        """
        Search for memories based on content.
        
        Args:
            query: Search query
            memory_type: Type of memories to search ("conversation", "relationship", or "all")
            limit: Maximum number of results
            
        Returns:
            List of matching memories, ranked by relevance
        """
        # Determine which memories to search
        if memory_type == "conversation":
            memories = self.conversation_memories
        elif memory_type == "relationship":
            memories = self.relationship_memories
        else:  # "all"
            memories = self.conversation_memories + self.relationship_memories
        
        # Calculate relevance scores
        scored_memories = []
        for memory in memories:
            relevance = self._calculate_relevance(memory.content, query)
            recency = self._calculate_recency(memory.timestamp)
            
            # Combined score based on relevance, recency, and importance
            score = (
                relevance * self.relevance_weight +
                recency * self.recency_weight +
                memory.importance * self.importance_weight
            )
            
            scored_memories.append((memory, score))
        
        # Sort by score, highest first
        scored_memories.sort(key=lambda x: x[1], reverse=True)
        
        # Extract memories and update access timestamps
        results = [m for m, _ in scored_memories[:limit]]
        for memory in results:
            memory.access()
        
        return results
    
    def _calculate_conversation_importance(
        self,
        content: str,
        speaker: str,
        emotional_context: Optional[Dict]
    ) -> float:
        """
        Calculate the importance of a conversation memory.
        
        This is a simplified implementation. In a production system, this would
        use more sophisticated NLP to analyze the content.
        """
        # Base importance
        importance = 0.5
        
        # Adjust based on content length (longer messages might be more important)
        importance += min(0.2, len(content) / 1000)
        
        # Adjust based on emotional context if available
        if emotional_context:
            # Higher emotional intensity = more important
            intensity = emotional_context.get("intensity", 0.5)
            importance += (intensity - 0.5) * 0.2
        
        # Ensure importance is between 0 and 1
        return max(0.0, min(1.0, importance))
    
    def _calculate_relationship_importance(
        self,
        event_type: str,
        emotional_impact: float
    ) -> float:
        """
        Calculate the importance of a relationship memory.
        """
        # Base importance by event type
        importance_by_type = {
            "first_meeting": 0.8,
            "milestone": 0.7,
            "conflict": 0.6,
            "resolution": 0.6,
            "shared_experience": 0.5,
            "routine_interaction": 0.3
        }
        
        importance = importance_by_type.get(event_type, 0.5)
        
        # Adjust based on emotional impact
        importance += (emotional_impact - 0.5) * 0.3
        
        # Ensure importance is between 0 and 1
        return max(0.0, min(1.0, importance))
    
    def _calculate_recency(self, timestamp: datetime) -> float:
        """
        Calculate a recency score (0-1) based on how recent the memory is.
        
        More recent memories get higher scores.
        """
        now = datetime.now()
        age = (now - timestamp).total_seconds()
        
        # Normalize age to a 0-1 scale (1 = very recent, 0 = old)
        # Using a 30-day window for normalization
        max_age = 30 * 24 * 60 * 60  # 30 days in seconds
        recency = max(0.0, 1.0 - (age / max_age))
        
        return recency
    
    def _calculate_relevance(self, content: str, query: str) -> float:
        """
        Calculate relevance of content to a query.
        
        This is a simplified implementation using basic string matching.
        In a production system, this would use more sophisticated NLP.
        """
        # Convert to lowercase for case-insensitive matching
        content_lower = content.lower()
        query_lower = query.lower()
        
        # Check if query is in content
        if query_lower in content_lower:
            return 1.0
        
        # Check for partial matches
        query_words = query_lower.split()
        matching_words = sum(1 for word in query_words if word in content_lower)
        
        # Calculate relevance based on proportion of matching words
        if query_words:
            return matching_words / len(query_words)
        else:
            return 0.0
    
    def _prune_memories(self) -> None:
        """
        Prune less important memories to stay within memory limits.
        """
        # Calculate scores for all conversation memories
        scored_memories = []
        for memory in self.conversation_memories:
            recency = self._calculate_recency(memory.timestamp)
            access_recency = self._calculate_recency(memory.last_accessed)
            
            # Score based on importance, recency, and access patterns
            score = (
                memory.importance * 0.4 +
                recency * 0.3 +
                access_recency * 0.2 +
                min(0.1, memory.access_count / 10)  # Frequently accessed memories get a boost
            )
            
            scored_memories.append((memory, score))
        
        # Sort by score, lowest first (we'll remove these)
        scored_memories.sort(key=lambda x: x[1])
        
        # Keep only the top max_memories
        to_keep = len(scored_memories) - self.max_memories
        if to_keep > 0:
            self.conversation_memories = [m for m, _ in scored_memories[to_keep:]]
    
    def _save_memories(self) -> None:
        """Save memories to storage."""
        if not self.storage_path:
            return
        
        try:
            # Convert memories to dictionaries
            conversation_data = [m.to_dict() for m in self.conversation_memories]
            relationship_data = [m.to_dict() for m in self.relationship_memories]
            
            # Create the data structure
            data = {
                "agent_id": self.agent_id,
                "last_updated": datetime.now().isoformat(),
                "conversation_memories": conversation_data,
                "relationship_memories": relationship_data
            }
            
            # Save to file
            with open(f"{self.storage_path}/{self.agent_id}_memories.json", "w") as f:
                json.dump(data, f, indent=2)
                
            logger.info(f"Saved memories for agent {self.agent_id}")
            
        except Exception as e:
            logger.error(f"Error saving memories: {str(e)}")
    
    def _load_memories(self) -> None:
        """Load memories from storage."""
        if not self.storage_path:
            return
        
        try:
            # Load from file
            with open(f"{self.storage_path}/{self.agent_id}_memories.json", "r") as f:
                data = json.load(f)
            
            # Convert dictionaries to memory objects
            self.conversation_memories = [
                ConversationMemory.from_dict(m) for m in data.get("conversation_memories", [])
            ]
            
            self.relationship_memories = [
                RelationshipMemory.from_dict(m) for m in data.get("relationship_memories", [])
            ]
            
            logger.info(f"Loaded memories for agent {self.agent_id}")
            
        except FileNotFoundError:
            logger.info(f"No existing memories found for agent {self.agent_id}")
        except Exception as e:
            logger.error(f"Error loading memories: {str(e)}")
