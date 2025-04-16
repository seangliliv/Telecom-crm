from werkzeug.security import generate_password_hash, check_password_hash

def hash_password(password):
    """
    Hashes a plain password.
    """
    return generate_password_hash(password)

def verify_password(plain_password, hashed_password):
    """
    Verifies if the plain password matches the hashed password.
    """
    return check_password_hash(hashed_password, plain_password)