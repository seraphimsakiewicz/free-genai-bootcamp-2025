## Business Context & Goals

1. Primary Business Goal - Lower the cost of providing interactive language learning to middle school and high school students trying to learn Spanish.
2. Stakeholders - Schools and other educational partners focused on secondary education

## Assumptions

- Schools and educators are primarily interested in a low cost, working MPV to evaluate and validate
  the solution before scaling
- Schools may already be experimenting with platforms like Khan Academi AI
- The solution should be engaging, delivering encouraging and solid feedback that is appropriate for
  middle school and high school students

## Constraints

1. Budget - solution must operate within a budget of no more than $100 for the initial MVP build
2. Timeline - project must be done within 6 weeks
3. Data Privacy - strict data privacy measure should be put in place, since this will be used by minors
4. Technical Limitations - Some technical limitations are expected, driven primarily by cost
   constraints and lack of in depth knowledge.

## Data Strategy

1. Data Collection & Preparation - Data will be processed in real time and not stored long term,
   ensuring privacy is preserved
2. Data Quality - to maintain data quality, usage of the platform by each student will ideally be
   supervised or monitored by a teacher or parent
3. Data Diversity - standard methods such as right sizing and other best practices will be employed
   to ensure diverse and representative data quality.
4. Security & Privacy:
- Data is processed as needed without permanent storage
- SSL Encryption will secure data in transit
- Complex passwords and two-factor 2FA/MFA auth will be required for access
- All measures will meet high security standards appropriate for protecting the data of minors

## Model Selection and Development

1. Model Type:
- We'll try out SaaS and Self-hosted models
- We lean towards open source models to reduce costs and better evaluate security aspects
2. Multiple Models & Modalities
- Multiple models may be deployed to address different aspects of the learning experience
- Different modalities (text-to-text, voice) may be supported with different models
3. Performance & Context considerations:
- The context window might be adjusted to suit middle school and high school students
- Fine-tuning and evaluation details are still being explored; initial plans include getting user
  feedback through surveys

## Infrastructure Design

1. Scalability & Flexibility:
- Cloud Platform: AWS will be our primary cloud provider due to existing experience with it
- Scalability Strategy: We plan to automate scaling using AWS Auto Scaling for example
2. Cost Optimization:
- leverage AWS free tier services when possible
- set strict budget limits using AWS budgets and cost alerts
- automate scaling to minimize idle resources
- regularly monitor and adjust resource allocatins to stay within $100 limit