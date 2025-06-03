def calculate_compatibility(name1, name2):
    """
    Calculate love compatibility between two names.
    
    The algorithm:
    1. Normalizes names (lowercase, no spaces)
    2. Calculates a letter score (a=1, b=2, ..., z=26)
    3. Uses exponential decay on absolute difference in scores
    4. Computes common letter ratio
    5. Returns the average of these factors, clamped to 0-100
    """
    # Normalize names
    n1 = name1.lower().replace(" ", "")
    n2 = name2.lower().replace(" ", "")
    
    # Helper function to calculate a score for each letter
    def get_score(s):
        return sum(ord(c) - 96 for c in s if 'a' <= c <= 'z')
    
    # Calculate scores
    score1 = get_score(n1)
    score2 = get_score(n2)
    
    # Calculate difference factor
    diff = abs(score1 - score2)
    import math
    diff_factor = math.floor(math.exp(-diff / 50) * 100)
    
    # Calculate common letter factor
    set1 = set(n1)
    set2 = set(n2)
    common_letters = len(set1.intersection(set2))
    total_unique_letters = len(set1.union(set2))
    
    common_factor = math.floor((common_letters / total_unique_letters) * 100) if total_unique_letters > 0 else 0
    
    # Final compatibility
    compatibility = math.floor((diff_factor + common_factor) / 2)
    compatibility = min(100, max(0, compatibility))
    
    return compatibility