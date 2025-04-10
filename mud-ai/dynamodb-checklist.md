# DynamoDB Integration Checklist

## AWS Connection
- [x] Connect AWS SDK client to DynamoDB Users table
- [x] Verify connection with console.log

## User Authentication
- [x] Check if Google sign-in already registers users or just authenticates
- [ ] Add callbacks to NextAuth configuration to:
  - [ ] Check if user exists in DynamoDB when they sign in
  - [ ] Create new user record if they don't exist 
  - [ ] Generate unique UUID for each new user
  - [ ] Save provider ("google") and email address
- [ ] Save Google user to DynamoDB (first user: seraphim.codes@gmail.com)

## Gemini Token Management
- [ ] Create simple modal to input Gemini API token
- [ ] Add function to save token to user record, ensure token is hashed.
- [ ] Stop using env.local for Gemini token

## UI Updates
- [ ] Add token status indicator in top right corner so users can see if they need a token or not
    - [ ] display message in chat window of game directing them to retrieve the key with a simple
      guide on how to get the gemini api key, if they don't have it.
- [ ] Display token input option for signed-in users that need to add/delete/update it.
