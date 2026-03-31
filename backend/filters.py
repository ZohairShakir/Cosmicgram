# White-list of names (safe-list) that should never be flagged on their own
SAFE_NAMES = {
    "modi", "narendra", "rahul", "gandhi", "ali", "zohair", "raj", "amit", 
    "priyanka", "sonia", "kejriwal", "mumbai", "india", "delhi", "bangalore"
}

# High-priority block-list of curse words that should always trigger a flag
# regardless of sentence context (Priority Block-list)
BLOCK_WORDS = {
    "bhosda", "bhosadi", "bhosdike", "maderchod", "behenchod", "randi", 
    "chutiya", "gaand", "lund", "katwa", "jihadi", "saala", "kaminey"
}

def contains_priority_word(text: str) -> bool:
    """Checks if any word in the text is in the BLOCK_WORDS list."""
    words = text.lower().split()
    for word in words:
        # Clean word of punctuation (e.g. "bhosda!" -> "bhosda")
        clean_word = "".join(filter(str.isalnum, word))
        if clean_word in BLOCK_WORDS:
            return True
    return False

def is_only_safe_names(text: str) -> bool:
    """Checks if the text ONLY consists of safe names and neutral words."""
    words = text.lower().split()
    if not words:
        return False
        
    for word in words:
        clean_word = "".join(filter(str.isalnum, word))
        # If any word is NOT in safe names and is more than 3 chars (ignoring 'and', 'the', etc.)
        if clean_word not in SAFE_NAMES and len(clean_word) > 3:
            return False
    return True
