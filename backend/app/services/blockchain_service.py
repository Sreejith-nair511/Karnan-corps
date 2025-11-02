import hashlib
import json
from datetime import datetime

async def store_evidence_on_blockchain(evidence_hash: str) -> dict:
    """
    Store evidence hash on a mock blockchain.
    
    Args:
        evidence_hash: SHA256 hash of the evidence
        
    Returns:
        Dictionary with blockchain transaction details
    """
    # In a real implementation, this would interact with an actual blockchain
    # For now, we'll just create a mock transaction
    
    # Create a deterministic "transaction hash" based on the evidence hash
    # In reality, this would be a real transaction hash from the blockchain
    tx_data = {
        "evidence_hash": evidence_hash,
        "timestamp": datetime.now().isoformat(),
        "network": "mock"
    }
    
    # Create a mock transaction hash
    tx_string = json.dumps(tx_data, sort_keys=True)
    tx_hash = hashlib.sha256(tx_string.encode()).hexdigest()
    
    return {
        "network": "mock",
        "tx_hash": tx_hash,
        "block": None  # In a real implementation, this would be the block number
    }